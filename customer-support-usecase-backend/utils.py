from transformers import AutoTokenizer

def count_llama_tokens(prompt: str):
    tokenizer = AutoTokenizer.from_pretrained("meta-llama/Meta-Llama-3-8B")
    tokens = tokenizer.tokenize(prompt)
    return len(tokens)
    