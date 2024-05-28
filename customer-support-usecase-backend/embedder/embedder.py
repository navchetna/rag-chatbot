from adapter.adapter import Document
from typing import List 
from transformers import AutoTokenizer, AutoModel
import torch 
    

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

    def embed_tables_summary(self, tables:List):
        encoded_tables = self.tokenizer(tables, padding = True, truncation = True, return_tensors = "pt")
        embeddings = self._generate_embeddings(encoded_tables)
        self.verboseprint(f"Embeddings generated!")
        return embeddings

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
        encoded_query = self.tokenizer([query], padding = True, truncation = True, return_tensors = "pt", add_special_tokens=True)
        query_embeddings = self._generate_embeddings(encoded_query)
        return query_embeddings.tolist()[0]
    
    def decode_chunks(self, embedded_chunks: List) -> List[str]:
        return self.tokenizer.decode(embedded_chunks)


from sentence_transformers import SentenceTransformer

class STEmbedder:
    def __init__(self, model_name = "nomic-ai/nomic-embed-text-v1"):
        self.model = SentenceTransformer(model_name, trust_remote_code=True, token="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")

    def embed_text(self, texts: List[str]): 
        embeddings = self.model.encode(texts)
        return embeddings
