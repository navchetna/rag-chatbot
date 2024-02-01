import os
import json
import pandas as pd
from docx import Document
import fitz  # PyMuPDF
from unstructured.partition.pdf import partition_pdf
from unstructured.staging.base import elements_to_json

# Import other necessary libraries for different document types

# class Reader:
#     def __init__(self, document_type: str = "text", verbose: bool = True):
#         self.verboseprint = print if verbose else lambda *a: None

#         self.document_type = document_type
#         self.current_directory = os.getcwd()

#         self.LOADER_MAPPING = {
#             ".csv": (pd.read_csv, {}),
#             ".doc": (Document, {}),
#             ".docx": (Document, {}),
#             ".pdf": (fitz.open, {}),
#             ".txt": (open, {"encoding": "utf-8"}),
#             # Add more mappings for other file extensions and loaders as needed
#         }
#         self.verboseprint("READER: Reader initialized successfully")

#     def load_document(self, document_location: str) -> dict:
#         ext = "." + document_location.rsplit(".", 1)[-1]
#         if ext in self.LOADER_MAPPING:
#             loader_class, loader_args = self.LOADER_MAPPING[ext]
#             loader = loader_class(document_location, **loader_args)

#             if ext == ".pdf":
#                 documents = []
#                 for page_num in range(loader.page_count):
#                     page = loader[page_num]
#                     text = page.get_text("text")
#                     documents.append({"page_content": text})
#             else:
#                 # Handle other document types accordingly
#                 # You may need to modify this part based on the library used
#                 documents = [{"page_content": loader.read()}]

#             self.verboseprint(f"READER: {document_location} Loaded successfully.")

#             doc = []
#             document_name = ""
#             document_type = ext

#             for document in documents:
#                 doc.append(document["page_content"])
#                 # Update metadata extraction based on the used library
#                 document_name = "SomeName"  # Update with the correct metadata extraction

#             return_obj = (doc, document_name, document_type)
#             return return_obj

#         else:
#             raise ValueError(f"Unsupported file extension '{ext}'")


# class ReaderUnstructured:
#     def __init__(self, document_type: str = "pdf", verbose: bool = True):
#         verboseprint = print if verbose else lambda *a: None 
#         self.document_type = document_type 
#         self.current_directory = os.getcwd()
#         self.DOCUMENT_LOADER = {
#             "pdf": {'strategy': 'hi_res', 'model_name': 'yolox'}
#         }

    
#     def read_document(self, document_path: str):
#         if self.document_type == 'pdf':
#             elements = partition_pdf(
#                 filename = document_path, 
#                 strategy = self.DOCUMENT_LOADER[self.document_type]['strategy'],
#                 infer_table_structure = True, 
#                 model_name = self.DOCUMENT_LOADER[self.document_type]['model_name']
#             )

#             json_elements = elements_to_json(elements, filename=f"{document_path.split('.')[0]}.json")

#             return elements, json_elements
    
    


        

import tabula 
import PyPDF2 
from tabulate import tabulate 
import fitz 
import io 
from typing import List 
from pdf2docx import Converter 



class Reader:
    def __ini__(self, file_path: str, start_page: int, end_page: int, verbose: bool = True): 
        self.verboseprint = print if verbose else lambda *a: None 
        self.filepath = file_path 
        self.start_page = start_page 
        self.end_page = end_page
        self.texts = []
        self.tables = []

        self.parsed_pdf = PyPDF2.PdfReader(self.filepath)


    def extract_text(self) -> List[str]:
        for page_number in range(self.start_page -1 , min(self.end_page, len(self.parsed_pdf.pages))):
            pageObj = self.parsed_pdf.pages[page_number] 
            text = pageObj.extract_text() 
            self.texts.append([text])
        return self.texts 
    
    def extract_tables(self) -> List[str]: 
        dfs = tabula.read_pdf(self.filepath, pages = "all")
        print(dfs[0].to_html())



        

