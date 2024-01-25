from langchain.embeddings import HuggingFaceEmbeddings
import json
import sys


class embedder:
    def __init__(self, embedding_model: str = "all-MiniLM-l6-v2", verbose: bool = True):
        self.model_name = embedding_model
        self.embedding_model = HuggingFaceEmbeddings(model_name=embedding_model)
        self.verboseprint = print if verbose else lambda *a: None

        self.verboseprint(
            f"EMBEDDER: Embedder initialised successfully with  configuration: embedding_model = {self.model_name}"
        )

    def embed_chunks(self, chunk_list: list):
        """Generates the embedding for every corresponding chunk"""

        embedding_list = list()

        for chunk in chunk_list:
            chunk_embedding = self.embedding_model.embed_documents([chunk])[0]
            embedding_list.append(chunk_embedding)

        self.verboseprint(
            f"EMBEDDER: Embeddings generated successfully. Number of output = {len(embedding_list)}"
        )

        return embedding_list

    def embed_query(self, query: str) -> str:
        """Generates the embedding for the given query"""

        embedding_vector = list(self.embedding_model.embed_query(query))
        return embedding_vector
