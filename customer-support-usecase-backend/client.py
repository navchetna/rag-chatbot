# Testing Adapter 
import numpy as np 
import requests
from adapter.adapter import Adapter

adapter_instance = Adapter(chunk_size = 100, chunk_overlap=20)
doc_list = ["""Intel Corporation is an American multinational corporation and technology company headquartered in Santa Clara, California. It is one of the world's largest semiconductor chip manufacturers by revenue.[3][4] Intel supplies microprocessors for most manufacturers of computer systems, and is one of the developers of the x86 series of instruction sets found in most personal computers (PCs). Intel also manufactures chipsets, network interface controllers, flash memory, graphics processing units (GPUs), field-programmable gate arrays (FPGAs), and other devices related to communications and computing.
Intel ranked No. 45 in the 2020 Fortune 500 list of the largest United States corporations by total revenue for nearly a decade, from 2007 to 2016 fiscal years.[5]
Intel (Integrated electronics) was founded on July 18, 1968, by semiconductor pioneers Gordon Moore (of Moore's law), Robert Noyce and Arthur Rock, and is associated with the executive leadership and vision of Andrew Grove.[6] Intel was a key component of the rise of Silicon Valley as a high-tech center, as well as being an early developer of SRAM and DRAM memory chips, which represented the majority of its business until 1981. Although Intel created the world's first commercial microprocessor chip in 1971, it was not until the success of the PC in the early 1990s that this became its primary business.""", """Some smaller competitors, such as VIA Technologies, produce low-power x86 processors for small factor computers and portable equipment. However, the advent of such mobile computing devices, in particular, smartphones, has in recent years led to a decline in PC sales.[25] Since over 95% of the world's smartphones currently use processors cores designed by Arm, using the Arm instruction set, Arm has become a major competitor for Intel's processor market. Arm is also planning to make attempts at setting foot into the PC and server market, with Ampere and IBM each individually designing CPUs for servers and supercomputers.[26] The only other major competitor in processor instruction sets is RISC-V, which is an open source CPU instruction set. The major Chinese phone and telecommunications manufacturer Huawei has released chips based on the RISC-V instruction set due to US sanctions.[27]"""]
docs, texts = adapter_instance.get_chunks(doc_list)


# Testing summary generation
prompt = "Hello world" 
r = requests.post("http://tgi:80/generate", json = {"inputs": prompt, "inser":{
                        "inputs": prompt,
                        "parameters": {
                            "best_of": 1,
                            "max_new_tokens": 500,
                            "repetition_penalty": 1.03,
                            "temperature": 0.3,
                            "top_k": 5,
                            "top_n_tokens": 5,
                            "top_p": 0.95,
                            "typical_p": 0.95,
                        },
                    },
                    } )
print(r)

# Tested the overlapping is happending and breaking down into chunks. 

# Testing the embedder 
from embedder.embedder import Embedder

embedder = Embedder()
embedded_docs = embedder.embed_documents(docs)
query_embedding = embedder.encode_query("What is the main job of intel?")
# print(f"The query embeddings are \n {query_embedding}")
print(embedded_docs)

# Testing the Qdrant Database 
from vector_database.vector_database import VectorDB 
vector_db = VectorDB(path = 'vector_database/data', collection_name = "Test")
vector_db.insert_docs_embeddings(embedded_docs, texts)
top_k = vector_db.query_embeddings(query_embedding)
print([point.payload['text'] for point in top_k])




