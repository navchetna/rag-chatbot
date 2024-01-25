#!/bin/bash


# Deploying Customer support use case Frontend

sudo docker container stop customer_support_usecase_frontend
sudo docker container rm customer_support_usecase_frontend
sudo docker image rm customer_support_usecase_frontend
echo "Building the frontend docker image.."
git pull https://$GIT_USERNAME:$PAT@github.com/Alok-Joshi/customer-support-usecase-frontend.git
sudo docker build -t customer_support_usecase_frontend --build-arg HTTP_PROXY=$http_proxy --build-arg HTTPS_PROXY=$http_proxy --build-arg NO_PROXY="$no_proxy" --build-arg http_proxy=$http_proxy --build-arg https_proxy=$http_proxy --build-arg no_proxy="$no_proxy" .
sudo docker run --name customer_support_usecase_frontend -d -p 3001:5173 customer_support_usecase_frontend
