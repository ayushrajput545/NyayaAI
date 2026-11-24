
FROM python:3.13-slim

WORKDIR /app

# Install system dependencies -> Optional but make some imp packages to install in docker container
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Python environment settings(optional)
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV HF_HOME=/root/.cache/huggingface
ENV TOKENIZERS_PARALLELISM=false

# Install Python dependencies
COPY requirements.txt .

# Install CPU-only dependecies PyTorch: This can significantly reduce your Docker image size and installation time.
RUN pip install --no-cache-dir \
    --index-url https://download.pytorch.org/whl/cpu \
    torch

RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Backend port ; use 10000 cuz render default webserivce port is 10000
EXPOSE 10000 

# Run database migrations and start FastAPI
CMD ["sh", "-c", "alembic upgrade head && exec python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000}"]
