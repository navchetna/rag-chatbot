FROM python:3.9-slim
COPY --from=openjdk:8-jre-slim /usr/local/openjdk-8 /usr/local/openjdk-8

ENV JAVA_HOME /usr/local/openjdk-8

RUN update-alternatives --install /usr/bin/java java /usr/local/openjdk-8/bin/java 1

WORKDIR /app

COPY requirements.txt /app/

RUN pip install -r requirements.txt

RUN pip install huggingface_hub

RUN python -c "from huggingface_hub.hf_api import HfFolder; HfFolder.save_token('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')"

COPY ./ /app/

EXPOSE 8000

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
