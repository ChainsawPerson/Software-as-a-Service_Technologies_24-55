# Use the official PostgreSQL image from the Docker Hub
FROM postgres:13

# Set environment variables
ENV POSTGRES_DB=mydatabase
ENV POSTGRES_USER=myuser
ENV POSTGRES_PASSWORD=mypassword

# Copy initialization scripts to Docker entrypoint
COPY ./init /docker-entrypoint-initdb.d/
