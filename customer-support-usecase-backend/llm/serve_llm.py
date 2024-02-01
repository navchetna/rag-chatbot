import torch 
import time 
import transformers 
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline



class LLM: 
    def __init__(self, model_name: str = "meta-llama/Llama-2-7b-chat-hf", verbose: bool = True): 
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = AutoModelForCausalLM.from_pretrained(model_name)
        self.pipeline = pipeline(task="text-generation", model = self.model, tokenizer = self.tokenizer)
        self.verboseprint = print if verbose else lambda *a: None 

    def _summary_prompt(self, input_table: str): 
        prompt = f"""<s>[INST] <<SYS>>\n You are a helpful, respectful and honest assistant. Your task is to generate summary of the provided text tabular data.  <</SYS>> 
        [INST] Your job is to create a textual summary of a table passed to you in text format. Only create the summary on the basis of the table passed to you. Do not add any additional information.
            Take and rows and columns and return a textual linked rows and values that defines the tables in text format. Return the summary in sentences only.
            Take a deep breadth and think step by step.
        Table:
        {input_table}[/INST] 
        """
        return prompt 
    
    def generate_summary(self, input_table: str):
        PROMPT = self._summary_prompt(input_table)
        start_time = time.time()
        response = self.pipeline(PROMPT) 
        end_time = time.time()
        self.verboseprint(f"Summary generated successfully in {end_time - start_time}.")
        final_response = self._extract_generated_response(response[0]['generated_text'])
        print(final_response)
        return final_response[0]
    
    def _extract_generated_response(self, text: str):
        inst_position = text.find('/[INST]')
        # Extract the part of the response after the [INST] token
        extracted_response = text[inst_position + len('/[INST]'):].lstrip()
        return extracted_response


