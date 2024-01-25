#!/bin/bash


# Deploying Customer support use case Backend

sudo docker container stop customer_support_usecase_backend
sudo docker container rm customer_support_usecase_backend
sudo docker image rm customer_support_usecase_backend

echo "Building the backend docker image.."
cd customer-support-usecase-backend/
git pull https://$GIT_USERNAME:$PAT@github.com/Alok-Joshi/customer-support-usecase-backend.git
sudo docker build -t customer_support_usecase_backend --build-arg HTTP_PROXY=$http_proxy --build-arg HTTPS_PROXY=$http_proxy --build-arg NO_PROXY="$no_proxy" --build-arg http_proxy=$http_proxy --build-arg https_proxy=$http_proxy --build-arg no_proxy="$no_proxy" .
sudo docker run  -d -v vector_db:/vector_db --name customer_support_usecase_backend  -p 8050:8000 customer_support_usecase_backend
