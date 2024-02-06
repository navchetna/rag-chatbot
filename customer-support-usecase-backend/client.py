# Reading or parsing a PDF 

from reader.reader import Reader 

pdf_reader = Reader("pdfs/dell/dellemc-poweredge-xr11-xr12-technical-guide.pdf")
texts = pdf_reader.extract_text()
tables, tables_html = pdf_reader.extract_tables()
print(f"Number of tables generated : {len(tables)}")


from llm.serve_llm import LLM 

llm = LLM()
summary_of_tables = [llm.generate_summary(table) for table in tables[:5]]


# Testing Adapter 
import numpy as np 
import requests
from adapter.adapter import Adapter

adapter_instance = Adapter(chunk_size = 1200, chunk_overlap=200)

# Tested the overlapping is happending and breaking down into chunks. 
text_docs, texts = adapter_instance.get_chunks(texts)
tables_docs, tables_summaries = adapter_instance.get_chunks(summary_of_tables)

# Testing the embedder 
from embedder.embedder import Embedder

embedder = Embedder()
embedded_docs_texts = embedder.embed_documents(text_docs)
embedded_docs_table = embedder.embed_documents(tables_docs)

# Testing the Qdrant Database 
from vector_database.vector_database import VectorDB 
vector_db = VectorDB(path = 'vector_database/data', collection_name = "Dell")
vector_db.insert_docs_embeddings(embedded_docs_texts, texts)
vector_db.insert_docs_embeddings(embedded_docs_table, tables_summaries)






