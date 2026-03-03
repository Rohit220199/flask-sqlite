# -------- Stage 1: Builder --------
FROM python:3.10-slim AS builder

# Set working directory
WORKDIR /app

# Install system dependencies (if needed for building wheels)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install dependencies into a separate folder
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --prefix=/install -r requirements.txt


# -------- Stage 2: Runtime --------
FROM python:3.10-slim

# Create non-root user
RUN useradd -m appuser

WORKDIR /app

# Copy installed dependencies from builder
COPY --from=builder /install /usr/local

# Copy application code
COPY . .

# Change ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose app port (change if needed)
EXPOSE 5000

# Run the app
CMD ["python", "app.py"]