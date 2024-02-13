# from vector_database.vector_database import vector_database
# from adapter.adapter import adapter
# from embedder.embedder import embedder
# from reader.reader import reader


# def ingestion_flow(
#     file_path: str,
#     metadata,
#     reader_obj: reader,
#     adapter_obj: adapter,
#     embedder_obj: embedder,
#     vector_db_obj: vector_database,
# ):
#     file_content, document_name, document_type = reader_obj.load_document(file_path)
#     chunk_list = adapter_obj.get_chunks(file_content)
#     embedding_list = embedder_obj.embed_chunks(chunk_list)
#     document_ids, err = vector_db_obj.insert_embeddings(
#         embedding_list, chunk_list, metadata
#     )
#     return document_ids, err

# from reader.reader import Reader 
# from llm.serve_llm import LLM 
# from adapter.adapter import Adapter
# from embedder.embedder import Embedder
# from vector_database.vector_database import VectorDB 
import os

VECTOR_DB_LOCATION = os.getenv("VECTOR_DB_LOCATION")

# def ingestion_flow(file_path: str, context_id: str):
#     pdf_reader = Reader(file_path)
#     texts = pdf_reader.extract_text()
#     tables, tables_html = pdf_reader.extract_tables()
#     print(f"Number of tables generated : {len(tables)}")

#     llm = LLM()
#     summary_of_tables = [llm.generate_summary(table) for table in tables]

#     adapter_instance = Adapter(chunk_size = 1200, chunk_overlap=200)
#     text_docs, texts = adapter_instance.get_chunks(texts)
#     tables_docs, tables_summaries = adapter_instance.get_chunks(summary_of_tables)

#     embedder = Embedder()
#     embedded_docs_texts = embedder.embed_documents(text_docs)
#     embedded_docs_table = embedder.embed_documents(tables_docs)

#     vector_db = VectorDB(path = VECTOR_DB_LOCATION, collection_name = context_id)
#     vector_db.insert_docs_embeddings(embedded_docs_texts, texts)
#     vector_db.insert_docs_embeddings(embedded_docs_table, tables_summaries)

import json 

from reader.reader import Reader, TOC 
from reader.reader import PDFReader
from llm.serve_llm import LLM
import numpy as np 
from adapter.adapter import Adapter
from embedder.embedder import STEmbedder
from vector_database.vector_database import VectorDB 



def ingestion_flow(file_path: str, context_id: str):
    pdf_reader = Reader(file_path)
    texts = pdf_reader.extract_text()

    toc = TOC("pdfs/dell/poweredge-r860-technical-guide.pdf")._get_toc()

    pdf_reader = PDFReader("pdfs/dell/poweredge-r860-technical-guide.pdf")

    table_titles, tables_markdown = pdf_reader.extract_tables()

    table_data = [title + "\n" + table for title, table in zip(table_titles, tables_markdown)]



    llm = LLM() 

    summary_of_tables = [llm.generate_summary_v3(toc[0][1], title+'\n'+table) for title, table in zip(table_titles, tables_markdown)]


    # Intializing and chunking the texts 
    adapter_instance = Adapter(chunk_size = 4000, chunk_overlap=800)
    text_docs, texts = adapter_instance.get_chunks(texts)

    embedder = STEmbedder()
    embedded_docs_texts = embedder.embed_text(texts)
    embedded_docs_table = embedder.embed_text(summary_of_tables)

    vector_db = VectorDB(path = VECTOR_DB_LOCATION, collection_name = context_id, embedding_size = 768)
    vector_db.insert_docs_embeddings(embedded_docs_texts, texts)
    metadata = [[table, summary_of_table] for table, summary_of_table in zip(table_data, summary_of_tables)]
    vector_db.insert_table_embeddings(embedded_docs_table, metadata)
