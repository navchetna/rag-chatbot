## Steps to setup

- Start the tgi-llama-3 server on Gaudi using the following command:
```
docker run -d -p 8001:80 --name tgi-llama-3-8b --runtime=habana -e HF_TOKEN=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 -e HABANA_VISIBLE_DEVICES=7 -e OMPI_MCA_btl_vader_single_copy_mechanism=none -v <Your huggingface hug cache dir>:/data --cap-add=sys_nice --ipc=host akarx/tgi-gaudi --json-output --model-id meta-llama/Meta-Llama-3-8B-Instruct --max-input-length 128 --max-total-tokens 300 --max-batch-prefill-tokens 2048 --max-batch-total-tokens 2500 --hostname 0.0.0.0 
```
- Edit the docker-compose-prod.yaml file for the following values:
    - In the backend service, change the first volumes path to where you want your data to persist. The second volume path will be the directory with your downloaded models.
    - Change the environment variable "INFERENCE_URL" to point to the Gaudi server
    - In the frontend service, change the VITE_BACKEND_URL to point to the backend service port. Change the VITE_SSE_URL to point to the Gaudo Server
    - In the database service, change the volume mapping to point to the directory where you want your data to persist. 

- Run the deployment with:
  ```
  chmod +x ./deploy.sh
  ./deploy.sh docker-compose-prod.yaml
  ```