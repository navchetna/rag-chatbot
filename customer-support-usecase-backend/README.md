# customer-support-usecase-backend

## Overview
Customer Support Chat application's backend.

## Design Specifications

### Entities



#### Document

- **Attributes:**
  - name : str
  - vector_database_ids: list[str]

#### Context

- **Attributes:**
  - id : str (Primary Key)
  - title: str
  - documents: list[Document] (will contain a sequence of document ids)

#### Message

- **Attributes:**
  - id: str (Primary Key)
  - role : str ("human" | "ai" )
  - content : str
  - feeback: int (0 for none, 1 for positive, -1 for negative )


#### Session

- **Attributes:**
  - id : str (Primary Key)
  - context_id: str
  - message_ids: list[str] (will contain a sequence of message ids)




### Relationships

- **Session to Message:** One-to-Many relationship. One Session can have multiple messages associated with it.
- **Context to Document:** One-to-Many relationship. One context can have multiple documents associated with it.

---

## Setup

### Installing the dependencies
Clone the repository and install the dependencies in a virtual environment.
```bash
$ git clone https://github.com/navchetna/customer-support-usecase-backend.git
$ python3 -m venv venv_name
$ source venv_name/bin/activate
$ cd customer-support-usecase-backend
$ pip install -r requirements.txt

```


### Running the Server
Before running the server, Create a .env file. Refer the example.env file for help.
```bash
$ python3 -m uvicorn server:app

```

## Deployment

After cloning the repository, Create an .env file. in the root of the project. Refer to example.env.
### With HTTP Proxy
If you are inside a VPN and require a proxy for internet communication, follow these steps
```bash
$ cd customer-support-usecase-backend/
$ export http_proxy=proxy_name
$ sudo docker build -t customer_support_usecase_backend --build-arg HTTP_PROXY=$http_proxy --build-arg HTTPS_PROXY=$http_proxy --build-arg NO_PROXY="$no_proxy" --build-arg http_proxy=$http_proxy --build-arg https_proxy=$http_proxy --build-arg no_proxy="$no_proxy" .
$ sudo docker run  -e no_proxy="localhost" -d -v vector_db:/vector_db --name customer_support_usecase_backend  -p 8050:8000 customer_support_usecase_backend
```
Server will run at port 8050

### Without HTTP Proxy
```bash
$ cd customer-support-usecase-backend/
$ sudo docker build -t customer_support_usecase_backend .
$ sudo docker run  -e no_proxy="localhost" -d -v vector_db:/vector_db --name customer_support_usecase_backend  -p 8050:8000 customer_support_usecase_backend
```

Server will run at port 8050
## Resources

### Prompt Engineering for LLama2
- https://huggingface.co/blog/llama2#how-to-prompt-llama-2
