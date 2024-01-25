from vector_database.vector_database import vector_database
from adapter.adapter import adapter
from embedder.embedder import embedder
from reader.reader import reader


def ingestion_flow(
    file_path: str,
    metadata,
    reader_obj: reader,
    adapter_obj: adapter,
    embedder_obj: embedder,
    vector_db_obj: vector_database,
):
    file_content, document_name, document_type = reader_obj.load_document(file_path)
    chunk_list = adapter_obj.get_chunks(file_content)
    embedding_list = embedder_obj.embed_chunks(chunk_list)
    document_ids, err = vector_db_obj.insert_embeddings(
        embedding_list, chunk_list, metadata
    )
    return document_ids, err
