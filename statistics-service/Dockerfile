# Use the official Python image from the Docker Hub
FROM python:3.9-slim

# Set the working directory
WORKDIR /usr/src/app

# Copy the requirements file
COPY requirements.txt ./

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Set the PYTHONPATH environment variable to ensure src/ is included
ENV PYTHONPATH=/usr/src/app/src

# Expose the port the app runs on
EXPOSE 3004

# Set the Flask environment variables
ENV FLASK_APP=src.index:app
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=3004

# Command to run the Flask application
CMD ["flask", "run"]
