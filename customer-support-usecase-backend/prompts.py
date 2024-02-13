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


def add_context_to_prompt(LLAMA2_CHATBOT_PROMPT: str, contexts, query_str: str):

    """
    dynamically adds as many contexts as possible to the prompt for better responses.
    """
    
    # max input tokens for Llama-2-7b-Chat is 4096 but as a buffer we take 4000
    MAX_INPUT_TOKENS = 4000
    
    context_str = ""

    for context in contexts:

        if (4 * (len(LLAMA2_CHATBOT_PROMPT.split(" ")) + len(context_str.split(" ")) + len(context.split(" "))) / 3) <= MAX_INPUT_TOKENS:
            context_str += context
            context_str += "\n"
        else:
            break
    
    LLAMA2_CHATBOT_FINAL_PROMPT = LLAMA2_CHATBOT_PROMPT +  f"<s>[INST] Context information is below. \n --------------------- \n {context_str} \n --------------------- \n Given the context information, previous conversation and no prior knowledge, answer the query. Do not repeat the entire query. Do not thank me for providing the context. Keep your answers concise. If the query asked cannot be answered by the context, Simply refuse to answer the question.  \n Query: {query_str} \n [/INST]"

    return LLAMA2_CHATBOT_FINAL_PROMPT
        

def construct_chatbot_prompt(messages: list[dict], contexts: list[str], query: str):
    """Constructs the chatbot prompt from the given messages and and question"""

    # context_str = get_context_string(contexts)
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

    LLAMA2_CHATBOT_FINAL_PROMPT = add_context_to_prompt(LLAMA2_CHATBOT_PROMPT, contexts, query)

    print("New dynamic prompt: ", LLAMA2_CHATBOT_FINAL_PROMPT)
    token_count = (4 * len(LLAMA2_CHATBOT_FINAL_PROMPT.split(" "))) / 3
    print(f"Token count : {token_count}")
    print(f"Number of messages: {last_k_value}")
    return LLAMA2_CHATBOT_FINAL_PROMPT



def construct_chatbot_prompt_mistral(contexts: str, query: str):
    """Constructs the chatbot prompt from the given messages and and question"""

    # context_str = get_context_string(contexts)
    MISTRAL_CHATBOT_FINAL_PROMPT = f"""<s>[INST] <<SYS>>\n You are a helpful and respectiful assistant. Your task is to answer to the user query based on the context provided to you. <</SYS> 
        [INST] Given a question from a product technical guide. Understand the question and provide its answer from the given context. The context contains both tables and text. Each context is seperated by five hyphen (-----). Tables are provided to you in markdown format. Based on the query generate the most suitable answer for the given query. 
        Take a deep breadth and think step by step before answering the question.

        Question - {query} 

        Context - 
        {contexts} [/INST]""" 
    return MISTRAL_CHATBOT_FINAL_PROMPT


def construct_summary_prompt_mistral(title_of_document: str, input_table: str):
    """Constructs the chatbot prompt from the given messages and and question"""

    # context_str = get_context_string(contexts)
    SUMMARY_FINAL_PROMPT = f"""<s>[INST] <<SYS>>\n You are a helpful, respectful and honest assistant. <</SYS>> 
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
    return SUMMARY_FINAL_PROMPT


