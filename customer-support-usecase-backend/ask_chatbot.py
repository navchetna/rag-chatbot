from vector_database.vector_database import VectorDB 
from embedder.embedder import Embedder
from llm.serve_llm import LLM 

llm = LLM()

embedder = Embedder()


while True: 

    # QUERY = "What are the power supplies requirement of XR11 and XR12?"
    QUERY = input("Ask question to the bot! -  ")
    query_embedding = embedder.encode_query(QUERY)

    vector_db = VectorDB(path = 'vector_database/data', collection_name = "Dell")
    top_k = vector_db.query_embeddings(query_embedding)
    top_chunks_list = [point.payload['text'] for point in top_k]
    print(f"Top chunks are \n\n {top_chunks_list}")

    answer_to_query = llm.generate_answer(QUERY, top_chunks_list)
    print(answer_to_query)
