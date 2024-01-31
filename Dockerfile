# Dockerfile
FROM python:3.9.17-bookworm

ENV PYTHONUNBUFFERED True
ENV APP_HOME /back-end
WORKDIR $APP_HOME 
COPY . ./

RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y
RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get install latexmk -y
RUN apt-get install -y texlive-latex-extra

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 app:app