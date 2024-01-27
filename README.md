
## Overview
This is a chatbot application which allows you to ask questions against your documents. 

## Design Specifications

### Entities



#### Document

- **Attributes:**
  - name : str

#### Context

- **Attributes:**
  - id : str (Primary Key)
  - title: str
  - documents: list[str] 

#### Message

- **Attributes:**
  - id: str (Primary Key)
  - role : str ("human" | "ai" )
  - content : str
  - feeback: int (0 for none, 1 for positive, -1 for negative )
  - session_id: str (The session under which the message was generated)
  - context_id: str (The context against which the message was asked)
  - sequence_number: int (To maintain the position of the message in the conversation) 

#### Session 
This entity acts as a state manager for the conversation. Under one session, an user can maintain multiple conversations, one conversation per context.
- **Attributes:**
  - id : str (Primary Key)
  - context_id: str  (To maintain the current context ID of

This entity might has less fields right now, but could be extended to include a variety of state information for the conversation. 


### Relationships

- **Session to Message:** One-to-Many relationship. One Session can have multiple messages associated with it.
- **Context to Document:** One-to-Many relationship. One context can have multiple documents associated with it.

---

## Deployment
export the following variables 
```bash
$ export GIT_USERNAME=your_user_name
$ export GIT_PAT=your_personal_access_token
$ ./deploy.sh

```
## Resources 
### Prompt Engineering for LLama2
- https://huggingface.co/blog/llama2#how-to-prompt-llama-2
