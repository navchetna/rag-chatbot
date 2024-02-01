import tabula
import PyPDF2 
from tabulate import tabulate 
import fitz 
import io 
from typing import List 
from pdf2docx import Converter 



class Reader:
    def __init__(self, file_path: str, end_page: int = None, start_page: int = 1,  verbose: bool = True): 
        self.verboseprint = print if verbose else lambda *a: None 
        self.filepath = file_path 
        self.start_page = start_page 
        self.texts = []
        self.tables = []

        self.parsed_pdf = PyPDF2.PdfReader(self.filepath)
        self.end_page = len(self.parsed_pdf.pages)


    def extract_text(self) -> List[str]:
        for page_number in range(self.start_page -1 , min(self.end_page, len(self.parsed_pdf.pages))):
            pageObj = self.parsed_pdf.pages[page_number] 
            text = pageObj.extract_text() 
            self.texts.append(text)
        return self.texts 
    
    def extract_tables(self) -> List[str]: 
        dfs = tabula.io.read_pdf(self.filepath, pages = "all")
        tables_html = [df.to_html() for df in dfs]
        return dfs, tables_html 
