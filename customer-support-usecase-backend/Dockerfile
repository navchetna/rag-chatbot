FROM python:3.9.13


WORKDIR /app

COPY requirements.txt /app/

COPY extras/docker/build.sh /app

COPY extras/docker/run.sh /app


RUN bash build.sh

COPY ./ /app/

EXPOSE 8000

CMD ["bash","run.sh"]
