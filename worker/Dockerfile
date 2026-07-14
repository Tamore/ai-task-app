# Stage 1: Builder
FROM python:3.9-slim AS builder
WORKDIR /app
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Stage 2: Production Runner
FROM python:3.9-slim AS runner
WORKDIR /app
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY . .
RUN useradd -m workeruser && chown -R workeruser:workeruser /app
USER workeruser
CMD ["python", "main.py"]
