def get_context_string(contexts):
    context_string = ""
    for context in contexts:
        context_string += context
        context_string += "\n"

    return context_string


def construct_conversation_summary_prompt(messages: list[dict]):
    SUMMARY_PROMPT = "Given below is a conversation between two people. summarise the conversation. \n {conversation} \n Summary: "
    conversation = ""
    for message in messages:
        conversation += f"{message['role']}: {message['content']} "

    prompt = SUMMARY_PROMPT.format(conversation=conversation)
    return prompt


def add_context_to_prompt(LLAMA2_CHATBOT_PROMPT, contexts, query_str):

    """
    dynamically adds as many contexts as possible to the prompt for better responses.
    """
    
    # Input sequence length for Llama-2-7b-Chat
    MAX_INPUT_LENGTH = 4096

    LLAMA2_CHATBOT_PROMPT = f"<s>[INST] <<SYS>>\n You are a helpful, respectful and honest assistant. Always answer as helpfully as possible. \n If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.\n <</SYS>>\n\n <s>[INST] Context information is below. \n --------------------- \n\n --------------------- \n Given the context information, previous conversation and no prior knowledge, answer the query. Do not repeat the entire query. Do not thank me for providing the context. Keep your answers concise. If the query asked cannot be answered by the context, Simply refuse to answer the question.  \n Query: {query_str} \n [/INST]"
    
    context_str = ""

    for context in contexts:

        if len(LLAMA2_CHATBOT_PROMPT) + len(context_str) + len(context) <= MAX_INPUT_LENGTH:
            context_str += context
            context_str += "\n"
    
    LLAMA2_CHATBOT_FINAL_PROMPT = f"<s>[INST] <<SYS>>\n You are a helpful, respectful and honest assistant. Always answer as helpfully as possible. \n If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.\n <</SYS>>\n\n <s>[INST] Context information is below. \n --------------------- \n {context_str} \n --------------------- \n Given the context information, previous conversation and no prior knowledge, answer the query. Do not repeat the entire query. Do not thank me for providing the context. Keep your answers concise. If the query asked cannot be answered by the context, Simply refuse to answer the question.  \n Query: {query_str} \n [/INST]"

    return LLAMA2_CHATBOT_FINAL_PROMPT
        

def construct_chatbot_prompt(messages: list[dict], contexts: list[str], query: str):
    """Constructs the chatbot prompt from the given messages and and question"""

    context_str = get_context_string(contexts)
    LLAMA2_CHATBOT_PROMPT = f"<s>[INST] <<SYS>>\n You are a helpful, respectful and honest assistant. Always answer as helpfully as possible. \n If a question does not make any sense, or is not factually coherent, explain why instead of answering something not correct. If you don't know the answer to a question, please don't share false information.\n <</SYS>>\n\n"

    conversation_human_message = "<s>[INST] {message} [/INST]"
    conversation_ai_message = "{message} </s>"
    first_message = "{message} [/INST]"
    if len(messages) > 0:
        LLAMA2_CHATBOT_PROMPT += first_message.format(message=messages[0]["content"])
    last_k_value = min(len(messages), 4)
    for i in range(len(messages) - last_k_value, len(messages)):
        message = messages[i]
        if message["role"] == "ai":
            LLAMA2_CHATBOT_PROMPT += conversation_ai_message.format(
                message=message["content"]
            )
        elif message["role"] == "human":
            LLAMA2_CHATBOT_PROMPT += conversation_human_message.format(
                message=message["content"]
            )

    # QA_MESSAGE_PROMPT = "<s>[INST] Context information is below. \n --------------------- \n {context_str} \n --------------------- \n Given the context information, previous conversation and no prior knowledge, answer the query. Do not repeat the entire query. Do not thank me for providing the context. Keep your answers concise. If the query asked cannot be answered by the context, Simply refuse to answer the question.  \n Query: {query_str} \n [/INST]"
    # LLAMA2_CHATBOT_PROMPT += QA_MESSAGE_PROMPT.format(
    #     context_str=context_str, query_str=query
    # )

    LLAMA2_CHATBOT_FINAL_PROMPT = add_context_to_prompt(LLAMA2_CHATBOT_PROMPT, contexts, query_str)

    print("New dynamic prompt: ", LLAMA2_CHATBOT_FINAL_PROMPT)
    token_count = (4 * len(LLAMA2_CHATBOT_FINAL_PROMPT.split(" "))) / 3
    print(f"Token count : {token_count}")
    print(f"Number of messages: {last_k_value}")
    return LLAMA2_CHATBOT_FINAL_PROMPT
