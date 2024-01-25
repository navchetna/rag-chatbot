model="meta-llama/Llama-2-7b-hf"
volume=$PWD/data
token=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

sudo docker run  -d --shm-size 1g -e HUGGING_FACE_HUB_TOKEN=$token -e http_proxy=$http_proxy -e https_proxy=$http_proxy -e HTTPS_PROXY=$http_proxy -e HTTP_PROXY=$http_proxy -p 8090:80 -v $volume:/data ghcr.io/huggingface/text-generation-inference:1.2 --model-id $model
