import tabula 
import PyPDF2  
import fitz 
from typing import List  
import pandas as pd 
import pdfplumber 
import regex as re 


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



class TOC:
    def __init__(self, file_path): 
        self.doc = fitz.open(file_path)
        self.metadata = self.doc.metadata


    def _get_toc(self): 
        toc = self.doc.get_toc()
        return toc 

    def extract_toc(self):
        toc = self._get_toc()
        formatted_toc = self.format_toc(toc)
        return formatted_toc

    def format_toc(self, table_of_content): 
        markdown_document = ""

        current_main_topic = None

        for entry in table_of_content:
            parent_id, title, _ = entry

            if parent_id == 1:
                # Start a new main topic
                if current_main_topic:
                    markdown_document += "\n"  # Add newline between topics
                markdown_document += f"## {title}\n"
                current_main_topic = title
            else:
                # Subtopic under the current main topic
                markdown_document += f"  - {title}\n"

        return markdown_document
    
class PDFReader:
    def __init__(self, file_path): 
      self.tables_markdown = []
      self.table_title = []
      self.filepath = file_path 
    
    def extract_tables(self): 
        with pdfplumber.open(self.filepath) as pdf:
            for page in pdf.pages:
                tables = page.find_tables(table_settings={"vertical_strategy": "lines",
            "horizontal_strategy": "lines_strict",
            "snap_tolerance":  5,
            "join_tolerance":  5,
            "text_tolerance":  4,
            "intersection_tolerance": 2,})
                text = page.extract_text(keep_blank_chars=True)
                table_titles = self._extract_table_title(text) 
                self.table_title.extend(table_titles)

                

 
            # Extract the table contents using its bounding box
                extracted_table = page.extract_tables(table_settings={"vertical_strategy": "lines_strict"})

                array_detail = []
                for tab in extracted_table:
                    for row in tab:
                        array_detail.append(row)
                    


                    try:
                        df = (pd.DataFrame(array_detail[1:], columns=array_detail[0]))
                        if df.to_markdown() not in self.tables_markdown:
                            self.tables_markdown.append(df.to_markdown())

                    except: 
                        print(f"Error parsing the PDF")
                    array_detail = []
        return self.table_title, self.tables_markdown
    

    def _extract_table_title(self, text): 
        pattern = r"\bTable \d+\..*?(?=\n)"
        matches = re.findall(pattern, text)
        table_titles = []
        for table_title in matches:
            table_titles.append(table_title)
        return table_titles 

           

