import os
import requests
from fastapi import FastAPI, HTTPException, UploadFile
from pymongo import MongoClient
from starlette.middleware.cors import CORSMiddleware
from pydantic import BaseModel
# from dotenv import load_dotenv
from bson import ObjectId
from vector_database.vector_database import VectorDB
from adapter.adapter import Adapter
from embedder.embedder import Embedder
from reader.reader import Reader
from flows import ingestion_flow, storing_data
from prompts import construct_chatbot_prompt, construct_chatbot_prompt_mistral, construct_conversation_summary_prompt, construct_summary_prompt_mistral, construct_chatbot_prompt_llama3
from extras.database import session
import time
from utils import count_llama_tokens

app = FastAPI()

origins = ["http://localhost:4001", "http://localhost:4002", "http://10.138.187.90:5001", "*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)

# load_dotenv()

INFERENCE_URL = os.getenv("INFERENCE_URL")
MONGO_URL = os.getenv("MONGO_URL")
VECTOR_DB_LOCATION = os.getenv("VECTOR_DB_LOCATION")
DATABASE_NAME = "use_case_customer_support_" + os.getenv("DATABASE_TYPE")

CHUNK_SIZE = int(os.getenv("CHUNK_SIZE"))
CHUNK_COUNT = int(os.getenv("CHUNK_COUNT"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP"))

client = MongoClient(MONGO_URL)
db = client[DATABASE_NAME]
session_collection = db["sessions"]
message_collection = db["messages"]
context_collection = db["contexts"]

# initialising components
vector_database_obj = VectorDB()
# embedder_obj = Embedder()
# adapter_obj = Adapter(
#     chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP, separator="\n\n"
# )
# reader_obj = Reader()


class SummaryResponse(BaseModel):
    summary: str


class Document(BaseModel):
    name: str
    vector_database_ids: list[str]


class Context(BaseModel):
    id: str
    title: str
    documents: list[Document]


class SessionPostResponse(BaseModel):
    session_id: str


class ContextPostResponse(BaseModel):
    context_id: str


class NewMessage(BaseModel):
    role: str
    content: str
    feedback: int
    session_id: str
    context_id: str


class Message(BaseModel):
    id: str
    role: str
    content: str
    feedback: int
    session_id: str
    context_id: str


class Session(BaseModel):
    context_id: str


class Summary(BaseModel):
    generated_text: str


class GetSession(Session):
    id: str
    messages: dict[str, list[Message]]


def get_sequence_number(session_id: str, context_id: str, message_collection):
    latest_message = list(
        message_collection.find({"session_id": session_id, "context_id": context_id})
        .sort("sequence_number", -1)
        .limit(1)
    )
    if len(latest_message) > 0:
        current_highest_sequence_number = latest_message[0]["sequence_number"]
        new_sequence_number = current_highest_sequence_number + 1
        return new_sequence_number
    else:
        return 0


def get_chat_string(database_messages: dict):
    chat_string = ""
    for database_message in database_messages:
        chat_string += f"{database_message['role']}: {database_message['content']} \n"
    return chat_string


def demo_database_populator(session_collection, context_collection):
    """Checks if the database is populated, and if not, populates.

    Once the frontend is advance enough to create its own session,  this function
    will be depreciated

    """
    if session_collection.count_documents({}) == 0:
        session_collection.insert_one(session)
        print(f"Session Collection created Successfully. Document: {str(session)}")
    else:
        print("Session collection already present")


@app.on_event("startup")
async def startup():
    print("Populating Database..")
    demo_database_populator(session_collection, context_collection)


@app.get("/contexts", response_model=list[Context])
def read_contexts():
    try:
        contexts = list(context_collection.find())
        for context in contexts:
            context["id"] = str(context["_id"])
        return contexts

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/contexts", response_model=ContextPostResponse)
def write_context(title: str):
    try:
        new_context_id = context_collection.insert_one(
            {"title": title, "documents": []}
        )
        return {"context_id": str(new_context_id.inserted_id)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.delete("/contexts/{context_id}")
async def delete_context(context_id: str):
    context_document = context_collection.find_one({"_id": ObjectId(context_id)})
    if context_document:
        documents = context_document["documents"]
        for document in documents:
            (
                vector_database_deletion_result,
                error,
            ) = vector_database_obj.delete_document(document["vector_database_ids"])
            if error:
                raise HTTPException(status_code=500, detail=error)

        context_collection.delete_one({"_id": context_document["_id"]})

    else:
        raise HTTPException(status_code=404, detail="context not found")


@app.delete("/contexts/{context_id}/{document_name}")
async def delete_document(context_id: str, document_name: str):
    context_document = context_collection.find_one({"_id": ObjectId(context_id)})
    if context_document:
        document_names = [doc["name"] for doc in context_document["documents"]]
        if document_name in document_names:
            filtered_documents = [
                doc
                for doc in context_document["documents"]
                if doc["name"] != document_name
            ]
            filter_criteria = {"_id": ObjectId(context_id)}
            update_data = {"$set": {"documents": filtered_documents}}

            to_be_deleted_document = [
                doc
                for doc in context_document["documents"]
                if doc["name"] == document_name
            ][0]

            (
                vector_database_deletion_result,
                error,
            ) = vector_database_obj.delete_document(
                to_be_deleted_document["vector_database_ids"]
            )
            vector_database_obj.save_database_to_disk()
            if error:
                raise HTTPException(status_code=500, detail=error)

            context_collection.update_one(filter_criteria, update_data)
        else:
            raise HTTPException(status_code=404, detail="document not found")
    else:
        raise HTTPException(status_code=404, detail="context not found")


@app.put("/contexts/{context_id}")
async def update_context(document: UploadFile, context_id: str):
    context_document = context_collection.find_one({"_id": ObjectId(context_id)})
    if context_document:
        document_name = document.filename
        contents = await document.read()

        with open("/tmp/temp.pdf", "wb") as temp_file:
            temp_file.write(contents)

        metadata = {"context_id": context_id, "document_name": document_name}
        # document_ids, err = ingestion_flow(
        #     "/tmp/temp.pdf",
        #     metadata,
        #     reader_obj,
        #     adapter_obj,
        #     embedder_obj,
        #     vector_database_obj,
        # )
        texts, toc, table_titles, table_data = ingestion_flow("/tmp/temp.pdf", context_id)
        summary_of_tables = []
        for title, table in zip(table_titles,table_data):
            complete_summary_prompt = construct_summary_prompt_mistral(toc,title+'\n'+table)

            r = requests.post(
                    f"{INFERENCE_URL}/generate",
                    json={
                        "inputs": complete_summary_prompt,
                        "parameters": {
                            "best_of": 1,
                            "max_new_tokens": 1024,
                            "repetition_penalty": None,
                            "temperature": 0.5,
                            "top_k": None,
                            "top_p": None,
                        },
                    },
                )
            inference_endpoint_response = r.json()
  
            summary = inference_endpoint_response["generated_text"]
            print(summary)
            summary_of_tables.append(summary)

        table_data = [f'{title}\n{table}' for title, table in zip(table_titles, table_data)]

        err = storing_data(texts, summary_of_tables, context_id, table_data)

        document_ids = []
        if not err:
            # Updating the mongodb Record for contexts
            context_document["documents"].append(
                {
                    "name": document_name, 
                    "vector_database_ids": document_ids
                }
            )
            all_documents = context_document["documents"]
            filter = {"_id": ObjectId(context_id)}
            update_data = {"$set": {"documents": all_documents}}
            context_collection.update_one(filter, update_data)
            # vector_database_obj.save_database_to_disk()
        else:
            raise HTTPException(status_code=500, detail=err)
    else:
        raise HTTPException(status_code=404, detail="context not found")


@app.get("/contexts/{context_id}", response_model=Context)
def read_context(context_id: str):
    context = context_collection.find_one({"_id": ObjectId(context_id)})
    if context:
        try:
            context["id"] = str(context["_id"])
            return context

        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/sessions", response_model=list[GetSession])
def read_sessions():
    try:
        sessions = list(session_collection.find())
        contexts = list(context_collection.find())
        context_ids = [str(context["_id"]) for context in contexts]
        all_messages = {}
        for session in sessions:
            session_id = str(session["_id"])
            session["id"] = str(session["_id"])
            for context_id in context_ids:
                messages = list(
                    message_collection.find(
                        {"context_id": context_id, "session_id": session_id}
                    ).sort("sequence_number", 1)
                )
                for message in messages:
                    message["id"] = str(message["_id"])
                all_messages[context_id] = messages

            session["messages"] = all_messages
        return sessions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/sessions", response_model=SessionPostResponse)
def write_session(payload: Session):
    try:
        new_session_data = payload.model_dump(mode="json")
        new_session_id = session_collection.insert_one(
            {
                "context_id": new_session_data["context_id"],
            }
        )
        return {"session_id": str(new_session_id.inserted_id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/sessions/{session_id}", response_model=GetSession)
def read_session(session_id: str):
    session = session_collection.find_one({"_id": ObjectId(session_id)})
    if session:
        try:
            session_id = str(session["_id"])
            session["id"] = str(session["_id"])

            contexts = list(context_collection.find())
            context_ids = [str(context["_id"]) for context in contexts]
            all_messages = {}
            for context_id in context_ids:
                messages = list(
                    message_collection.find(
                        {"context_id": context_id, "session_id": session_id}
                    ).sort("sequence_number", 1)
                )
                for message in messages:
                    message["id"] = str(message["_id"])
                all_messages[context_id] = messages

            session["messages"] = all_messages
            return session
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    else:
        raise HTTPException(status_code=404, detail="session not found")


@app.post("/sessions/{session_id}")
def update_session(payload: Session, session_id: str):
    session_document = session_collection.find_one({"_id": ObjectId(session_id)})
    if session_document:
        try:
            new_context_id = payload.context_id
            filter_criteria = {"_id": ObjectId(session_id)}
            update_data = {
                "$set": {"context_id": new_context_id},
            }
            session_collection.update_one(filter_criteria, update_data)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    else:
        raise HTTPException(status_code=404, detail="session not found")


@app.get("/sessions/{session_id}/{context_id}/summary", response_model=SummaryResponse)
def get_summary(session_id: str, context_id: str):
    try:
        session = session_collection.find_one({"_id": ObjectId(session_id)})
        if session:
            context = context_collection.find_one({"_id": ObjectId(context_id)})
            if context:
                text = ""
                messages = list(
                    message_collection.find(
                        {"context_id": context_id, "session_id": session_id}
                    ).sort("sequence_number", 1)
                )
                prompt = construct_conversation_summary_prompt(messages)
                for message in messages:
                    text += f"{message['role']}:{message['content']} "

                r = requests.post(
                    f"{INFERENCE_URL}/generate",
                    json={
                        "inputs": prompt,
                        "parameters": {
                            "best_of": 1,
                            "max_new_tokens": 500,
                            "repetition_penalty": 1.03,
                            "temperature": 0.3,
                            "top_k": 5,
                            "top_n_tokens": 5,
                            "top_p": 0.95,
                            "typical_p": 0.95,
                        },
                    },
                )
                inference_endpoint_response = r.json()
                response_obj = {
                    "summary": inference_endpoint_response["generated_text"]
                }
                return response_obj

            raise HTTPException(status_code=404, detail="context not found")

        raise HTTPException(status_code=404, detail="session not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/messages/{message_id}", response_model=Message)
def get_message(message_id: str):
    message = message_collection.find_one({"_id": ObjectId(message_id)})
    if message:
        message["id"] = str(message["_id"])
        return message
    else:
        return HTTPException(status_code=404, detail="message not found")


@app.post("/messages/")
def insert_messages(payload: list[NewMessage]):
    try:
        new_message_datas = [message.model_dump(mode="json") for message in payload]
        session_id = new_message_datas[0]["session_id"]
        context_id = new_message_datas[0]["context_id"]
        message_ids = []
        for message_data in new_message_datas:
            message_data["sequence_number"] = get_sequence_number(
                session_id, context_id, message_collection
            )
            message_id = message_collection.insert_one(message_data)
            message_ids.append(str(message_id.inserted_id))
        return {"message_ids": [message_id for message_id in message_ids]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.put("/messages/{message_id}")
def update_message(message_id: str, feedback: int):
    message = message_collection.find_one({"_id": ObjectId(message_id)})
    if message:
        filter_criteria = {"_id": ObjectId(message_id)}
        update_data = {"$set": {"feedback": feedback}}
        message_collection.update_one(filter_criteria, update_data)
    else:
        raise HTTPException(status_code=404, detail="message not found")


@app.get("/prompts/chatbot")
def get_chatbot_prompt(context_id: str, session_id: str, query: str):
    # query_embedding_vector = embedder_obj.embed_query(query)
    # contexts: list[str] = vector_database_obj.search_query(
    #     query_embedding_vector, CHUNK_COUNT, {"context_id": context_id}
    # )
    from vector_database.vector_database import VectorDB 
    # from embedder.embedder import Embedder
    from embedder.embedder import STEmbedder

    vector_db = VectorDB(path = os.getenv("VECTOR_DB_LOCATION"), collection_name = context_id)
    embedder = STEmbedder()
    
    start_time = time.time()
    query_embedding = embedder.embed_text(query)
    top_k = vector_db.query_embeddings(query_embedding)
    top_k_chunks = [point.payload['table'] if point.payload['type']=='table' else point.payload['text'] for point in top_k]
    top_k_string = "\n------\n".join(top_k_chunks)
    print(f"Top chunks are: {top_k_string}")

    session_document = session_collection.find_one({"_id": ObjectId(session_id)})
    if session_document:
        messages = list(
            message_collection.find(
                {"context_id": context_id, "session_id": session_id}
            ).sort("sequence_number", 1)
        )
        
        # prompt_str = construct_chatbot_prompt_mistral(top_k_string, query)
        prompt_str = construct_chatbot_prompt_llama3(top_k_string, query)
        end_time = time.time()
        RAG_time = end_time-start_time
        Number_of_tokens = count_llama_tokens(prompt_str)
        response = {"prompt": prompt_str, "RAG_TIME" : RAG_time, "num_tokens": Number_of_tokens}
        return response
    else:
        raise HTTPException(status_code=404, detail="session not found")
