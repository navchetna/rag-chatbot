# from langchain.embeddings import HuggingFaceEmbeddings
# import json
# import sys

from adapter.adapter import Document
from typing import List 
from transformers import AutoTokenizer, AutoModel
import torch 


# Deprecated 
# class embedder:
#     def __init__(self, embedding_model: str = "all-MiniLM-l6-v2", verbose: bool = True):
#         self.model_name = embedding_model
#         self.embedding_model = HuggingFaceEmbeddings(model_name=embedding_model)
#         self.verboseprint = print if verbose else lambda *a: None

#         self.verboseprint(
#             f"EMBEDDER: Embedder initialised successfully with  configuration: embedding_model = {self.model_name}"
#         )

#     def embed_chunks(self, chunk_list: list):
#         """Generates the embedding for every corresponding chunk"""

#         embedding_list = list()

#         for chunk in chunk_list:
#             chunk_embedding = self.embedding_model.embed_documents([chunk])[0]
#             embedding_list.append(chunk_embedding)

#         self.verboseprint(
#             f"EMBEDDER: Embeddings generated successfully. Number of output = {len(embedding_list)}"
#         )

#         return embedding_list

#     def embed_query(self, query: str) -> str:
#         """Generates the embedding for the given query"""

#         embedding_vector = list(self.embedding_model.embed_query(query))
#         return embedding_vector
    

class Embedder:
    def __init__(self, embedding_model: str = "BAAI/bge-large-en-v1.5", verbose: bool = True): 
        self.model_name = embedding_model 
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModel.from_pretrained(self.model_name)
        self.model.eval()
        self.verboseprint = print if verbose else lambda *a: None 

        self.verboseprint(
            f"EMBEDDER: {self.model_name} initialized successfully!"
        )

    def embed_tables_summary(self, tables):
        return None 

    def embed_documents(self, documents: List[Document]): 
        "Generates the embedding from the list of Documents"
        encoded_inputs = self.tokenizer([doc.page_content for doc in documents], padding = True, truncation = True, return_tensors = "pt")
        embeddings = self._generate_embeddings(encoded_inputs)
        self.verboseprint(f"Embeddings generated!")
        return embeddings

    def _generate_embeddings(self, tokens):
        with torch.no_grad(): 
            model_output = self.model(**tokens)
            # Performing CLS pooling. 
            sentence_embeddings = model_output[0][:, 0] 

        return sentence_embeddings

    def encode_query(self, query: str):
        encoded_query = self.tokenizer([query], padding = True, truncation = True, return_tensors = "pt")
        query_embeddings = self._generate_embeddings(encoded_query)
        return query_embeddings.tolist()[0]
    
    def decode_chunks(self, embedded_chunks: List) -> List[str]:
        return self.tokenizer.decode(embedded_chunks)


