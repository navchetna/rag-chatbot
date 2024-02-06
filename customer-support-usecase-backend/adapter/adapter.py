from typing import List, Optional

class Document:
    def __init__(self, page_content, metadata): 
        self.page_content = page_content 
        self.metadata = metadata 

class RecursiveCharacterTextSplitter: 
    def __init__(self, chunk_size, chunk_overlap):
        self._chunk_size = chunk_size 
        self._chunk_overlap = chunk_overlap 

    def split_documents(self, documents: List[Document]) -> List[Document]:
        result = [] 
        for doc in documents: 
            content = doc.page_content 
            chunks = [content[i:i+self._chunk_size] for i in range(0, len(content), self._chunk_size - self._chunk_overlap)]
            result.extend([Document(page_content = chunk, metadata = doc.metadata) for chunk in chunks])
        return result 

class Adapter: 
    def __init__(
            self, 
            chunk_size:int = 512, 
            chunk_overlap: int = 20, 
            separator: str = "\n\n", 
            verbose: bool = True, 
    ) -> str: 
        self._chunk_size = chunk_size 
        self._chunk_overlap = chunk_overlap 
        self._separator = separator 
        self.verboseprint = print if verbose else lambda *a : None 

        self.verboseprint(
            f" ADAPTER: Adapter initialised successfully with the following configuration: chunk_size = {self._chunk_size} and Chunk Overlap = {self._chunk_overlap}"
        )

        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=self._chunk_size, chunk_overlap=self._chunk_overlap)

    def _convert_to_document(self, text:str, metadata: str = None) -> Document: 
        return Document(page_content = text, metadata = metadata)
    
    def get_chunks(self, docs: list[str]):
        documents = [self._convert_to_document(text = doc) for doc in docs]
        chunked_documents = self.text_splitter.split_documents(documents)

        self.verboseprint(
            f"ADAPTER: Document chunking successful.\n Number of Chunks = {len(chunked_documents)}"
        )
        chunked_texts = [doc.page_content for doc in chunked_documents]
        return chunked_documents, chunked_texts




