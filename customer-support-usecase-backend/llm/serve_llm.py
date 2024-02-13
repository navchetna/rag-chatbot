import torch 
import time 
from typing import List 
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline



class LLM: 
    def __init__(self, model_name: str = "mistralai/Mixtral-8x7B-Instruct-v0.1", verbose: bool = True): 
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(model_name)
        self.pipeline = pipeline(task="text-generation", model = self.model, tokenizer = self.tokenizer)
        self.verboseprint = print if verbose else lambda *a: None 

    def _summary_prompt_v1(self, input_table: str): 
        prompt = f"""<s>[INST] <<SYS>>\n You are a helpful, respectful and honest assistant. Your task is to generate summary of the provided text tabular data.  <</SYS>> 
        [INST] Your job is to create a  DETAILED DESCRIPTIVE textual description of a table passed to you in HTML format. Only create the description on the basis of the table passed to you. Do not add any additional information. Do not give abstract summary.
            Link all the columns and corresponding values in the rows within the table using sentences. Keep the description very specific and include all the terminologies or terms from the given table. Do not return the table. Only return the description in paragraphs. 
        Take a deep breadth and think step by step.
        Table:
        {input_table} [/INST] 
        """
        return prompt 
    
    def _intermediate_response(self, input_table: str): 
        prompt = f"""<s>[INST] <<SYS>>\n You are a helpful, respectful and honest assistant. <</SYS>> 
        [INST] You have been provided provided a table in HTML format deliminated by triple backticks. Your task is to generate a detailed abstract description of a table using ALL the critical values and ranges. 
        First - Extract all the critical values and ranges from the table using the table headers in <td> tags. 
        Second - Using the critical values and ranges, generate an abstract summary focussing on what are the critical values and ranges mentioned in the table and their significance. 
        Return the summary in only 400 words. Ensure that the summary contains all the information till the last value mentioned in the table. Refrain from return tables as output. 

        Table: 
        ```{input_table}``` [/INST] 
        """
        return prompt 


    def _summary_prompt(self, title_of_document,  input_table: str): 
        prompt = f"""<s>[INST] <<SYS>>\n You are a helpful, respectful and honest assistant. <</SYS>> 
        [INST] You have been provided provided a table in Markdown format deliminated by triple backticks with the title of the table. Your task is to generate an abstract description of a table using all the critical values and ranges. Take hints and describe more about the table using the document title. 
        First - Extract all the critical values and ranges from the table using the table headers in <td> tags. 
        Second - Using the critical values, ranges and table of content; generate an abstract summary focussing on what are the critical values and ranges mentioned in the table and the significance of the table. 
        Ensure that the summary contains all the information till the last value mentioned in the table along with additional information like what is the table all about. 
        Generate the ENTIRE SUMMARY IN 400 WORDS ONLY WITHOUT ANY LOSS OF INFORMATION AND MINIMUM REPETITION. Refrain from return tables as output. 

        Title of the document:
        {title_of_document}

        Table: 
        ```{input_table}``` [/INST] 
        """
        return prompt 
    

    def _RAG_prompt(self, query: str, input_chunks:List[str]):
        chunks_string = "\n\n".join(input_chunks)
        prompt = f"""<s>[INST] <<SYS>>\n You are a helpful, respectful and honest assistant. Your task is to give the best answer from the content context to the given query. <</SYS>>
        [INST] Given a query : {query}. Give the answer from the given contexts below. If the answer is not in the context, simply return: ```Sorry, the query couldn't be answered from the given information.```.
        Do not generate answer on your own. 

        Context: 
        {chunks_string} [/INST]"""
        return prompt 
    

    def _table_RAG_prompt(self, query: str, input_table: str): 
        prompt = f"""<s>[INST] <<SYS>>\n You are a helpful and respectiful assistant. Your task is to answer to the user query from the parsed HTML table. <</SYS> 
        [INST] Given a question from a table. Understand the question and its answer from the table, return the most suitable answer from the table. Take a deep breadth and think step by step before answering the question.

        Question - {query} 

        Context - 
        {input_table} [/INST]""" 
        return prompt 


    def _RAG_combined(self, query: str, contexts: str): 
        prompt = f"""<s>[INST] <<SYS>>\n You are a helpful and respectiful assistant. Your task is to answer to the user query based on the context provided to you. <</SYS> 
        [INST] Given a question from a product technical guide. Understand the question and provide its answer from the given context. The context contains both tables and text. Each context is seperated by five hyphen (-----). Tables are provided to you in markdown format. Based on the query generate the most suitable answer for the given query. 
        Take a deep breadth and think step by step before answering the question.

        Question - {query} 

        Context - 
        {contexts} [/INST]""" 
        return prompt 

    def generate_summary(self, input_table: str):
        PROMPT = self._summary_prompt(input_table)
        start_time = time.time()
        response = self.pipeline(PROMPT, max_length=4096, temperature = 0.6) 
        end_time = time.time()
        self.verboseprint(f"Summary generated successfully in {end_time - start_time}.")
        final_response = self._extract_generated_response(response[0]['generated_text'])
        return final_response
    
    def generate_summary_v2(self, input_table: str):
        start = time.time()
        INTERMEDIATE_PROMPT = self._intermediate_response(input_table)
        intermediate_response = self.pipeline(INTERMEDIATE_PROMPT, max_length=8000, temperature = 0.6)
        formatted_intermediate_response = self._extract_generated_response(intermediate_response[0]['generated_text'])
        stop = time.time() 
        print("Summary generated in ", stop - start)
        print(formatted_intermediate_response)
        print("-"*30)
        return formatted_intermediate_response 

    # Currently being used!
    def generate_summary_v3(self, table_of_contents: str, input_table: str):
        start = time.time()
        SUMMARY = self._summary_prompt(table_of_contents, input_table)
        intermediate_response = self.pipeline(SUMMARY, max_new_tokens=1024, temperature = 0.5, do_sample=True)
        print(f"Tokens count {self.count_tokens(SUMMARY)}")
        print(f"Generated Tokens {self.count_tokens(intermediate_response[0]['generated_text'])}")
        # print(intermediate_response[0]['generated_text'])
        formatted_summary_response = self._extract_generated_response(intermediate_response[0]['generated_text'])
        stop = time.time() 
        print("Summary generated in ", stop - start)
        print(formatted_summary_response)
        print("-"*30)
        time.sleep(5)
        return formatted_summary_response 


    def generate_answer(self, query: str, contexts: List[str]): 
        PROMPT = self._RAG_prompt(query, contexts)
        # start_time = time.time() 
        response = self.pipeline(PROMPT, max_new_tokens=512)
        # end_time = time.time() 
        formatted_answer = self._extract_generated_response(response[0]['generated_text'])
        return formatted_answer
    

    def generate_answer_from_table(self, query: str, table: str): 
        PROMPT = self._table_RAG_prompt(query, table) 
        # start_time = time.time() 
        response = self.pipeline(PROMPT, max_new_tokens = 512)
        formatted_answer = self._extract_generated_response(response[0]['generated_text'])
        return formatted_answer 
    
    # Currently being used!
    def generate_answer_combined(self, query, contexts): 
        PROMPT = self._RAG_combined(query, contexts) 
        response = self.pipeline(PROMPT, max_new_tokens = 256)
        formatted_answer = self._extract_generated_response(response[0]['generated_text'])
        return formatted_answer 


    
    def _extract_generated_response(self, text: str):
        extracted_answer = text.split('[/INST]')
        if len(extracted_answer) > 1:
            return extracted_answer[1]
    
    def count_tokens(self, prompt): 
        encoded_text = self.tokenizer.encode(prompt)

        # Count the number of tokens
        number_of_tokens = len(encoded_text)
        return number_of_tokens


