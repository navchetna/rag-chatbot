from transformers import AutoTokenizer
import os 

HF_TOKEN = os.getenv("HUGGING_FACE_HUB_TOKEN")

def count_llama_tokens(prompt: str):
    tokenizer = AutoTokenizer.from_pretrained("meta-llama/Meta-Llama-3-8B", token=HF_TOKEN)
    tokens = tokenizer.tokenize(prompt)
    return len(tokens)
    