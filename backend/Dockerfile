# Use Python 3.10 or higher
FROM python:3.10-slim

# Set working directory to /app
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# FastAPI runs on port 8080 by default in Cloud Run
EXPOSE 8080

# Command to run the server
# Note: main:app refers to backend/app/main.py
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]