FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN useradd -m workeruser && chown -R workeruser:workeruser /app
USER workeruser
CMD ["python", "main.py"]
