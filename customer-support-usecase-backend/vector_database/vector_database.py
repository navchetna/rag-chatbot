from langchain.vectorstores import FAISS
import sys
import json
import random
import os
import uuid


class dummy_embedder:  # Langchain's vector db and embedder are tightly coupled. Giving an embedder is mandatory everywhere. Hence we give a dummy embedder class, and use search_by_vector
    def __init__(self):
        pass

    def embed_documents(self):
        return []

    def embed_query(self):
        return []


de = dummy_embedder()


class vector_database:
    def __init__(
        self, name: str = "faiss", db_location="faiss_database", verbose: bool = True
    ):
        self.verboseprint = print if verbose else lambda *a: None
        self.name = name
        self.verboseprint(
            f"VECTOR DATABASE: Vector Database initialised successfully with  configuration: name = {self.name}"
        )
        self.db_location = db_location
        if os.path.exists(self.db_location):
            self.db_client = FAISS.load_local(self.db_location, de)
        else:
            self.db_client = None

    def insert_embeddings(
        self, embedding_list: list, chunk_list: list, metadata: dict
    ) -> bool:
        """Inserts the embeddings into the DB. returns a bool"""
        try:
            if self.db_client:
                text_embedding_pairs = zip(chunk_list, embedding_list)
                metadatas = [metadata for i in range(len(chunk_list))]
                document_ids = self.db_client.add_embeddings(
                    text_embedding_pairs,
                    metadatas,
                )
                return document_ids, False
            else:
                text_embedding_pairs = list(zip(chunk_list, embedding_list))
                metadatas = [metadata for i in range(len(chunk_list))]
                document_ids = [str(uuid.uuid4()) for _ in range(len(chunk_list))]
                self.db_client = FAISS.from_embeddings(
                    text_embedding_pairs, de, metadatas, document_ids
                )

            self.verboseprint(
                f"VECTOR DATABASE: Embeddings inserted successfully. Number of embeddings = {len(embedding_list)} "
            )
            # self.db_client.save_local(self.db_location)
            return document_ids, False
        except Exception as e:
            self.verboseprint(
                f"VECTOR DATABASE: Embeddings insertion failed. Error: {e}"
            )
            return "", str(e)

    def search_query(
        self, embedding_vector: list, chunk_count: int, search_filter: dict = None
    ):
        """Searches the DB and returns the list of k most relevant chunks."""
        try:
            if self.db_client == None:
                self.verboseprint(
                    f"VECTOR DATABASE: Query search failed. Error: Empty Database"
                )
                return []
            else:
                results = self.db_client.similarity_search_with_score_by_vector(
                    embedding=embedding_vector, k=chunk_count, filter=search_filter
                )
                for res in results:
                    print(res)

                chunks = [doc[0].page_content for doc in results]
                self.verboseprint(f"VECTOR DATABASE: Search Successful. ")
                return chunks
        except Exception as e:
            self.verboseprint(f"VECTOR DATABASE: Query search failed. Error: {e}")
            return []

    def delete_document(self, document_ids: list[str]):
        try:
            self.db_client.delete(document_ids)
            return True, None
        except Exception as e:
            return False, str(e)

    def save_database_to_disk(self):
        self.db_client.save_local(self.db_location)
