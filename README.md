<h1 align="center">Simply Solved</h1>

<p align="center">
  <img src="https://github.com/ntua/saas2024-55/blob/main/frontend/src/logo.png?raw=true" alt="Logo">
</p>

 
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Python](https://img.shields.io/badge/Python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Docker](https://img.shields.io/badge/Docker-0db7ed?style=for-the-badge&logo=docker&logoColor=white)
![pgAdmin](https://img.shields.io/badge/pgAdmin4-FF6C37?style=for-the-badge&logo=pgadmin&logoColor=white)
![JMeter](https://img.shields.io/badge/Apache%20JMeter-D22128?style=for-the-badge&logo=apache-jmeter&logoColor=white)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)



## Team Members 



 

 **Takis Stamatopoulos [el20096@mail.ntua.gr](https://github.com/ntua-el20096)**  
 **Afroditi Marianthi Chlapani [el20889@mail.ntua.gr](https://github.com/aphrochl)**  
 **Kyriaki Karatzouni [el20634@mail.ntua.gr](https://github.com/ntua-el20634)**  


### Installation

#### Requirements

Ensure you have the following installed:

- PgAdmin4
- JMeter
- Node.js and npm (for JavaScript dependencies)
- Python (for OR tools and other functionalities)
- Docker


### Setup

1. **Clone the repository:**

```bash
git clone https://github.com/ntua/saas2024-55.git
```

2. **Install dependencies**:
First, install Python dependencies specified in requirements.txt.

```bash
pip install -r requirements.txt
```

3. **Connect Database:**
Connect Postgresql Database.

#### Docker

SimplySolved is Dockerized for easy deployment.

1. **Build and run Docker containers:**
   
```bash
docker-compose up --build
```
   This commmand builds the Docker images and starts the containers defined in `docker-compose.yml`.

2. **Verify container status:**
Run the following command in order to verify that all the necessary containers are running:

```bash
docker ps
```

Here are the microservices that should be running: 
# Solve My Problem - Microservices Architecture

This project is a microservices-based application designed to handle various aspects of a problem-solving platform. Each microservice is responsible for a specific task, such as user management, payment processing, problem submission, problem solving, and statistics generation. The system is orchestrated using Docker Compose.

## Microservices

### 1. **Payment Service**
- **Description**: Handles payment transactions, including credit purchasing and balance management.
- **Port**: `3002`
- **Directory**: `./payment-service`

### 2. **Problem Service**
- **Description**: Allows users to submit problems, view them, and manage problem-related data.
- **Port**: `3003`
- **Directory**: `./problem-service`

### 3. **Solver Service**
- **Description**: This service manages the actual solving of the submitted problems. It has access to the Docker socket for running SDKs.
- **Port**: `5000`
- **Directory**: `./solver-service`
- **Special Requirement**: The Docker socket (`/var/run/docker.sock`) is mounted to allow the service to run containers dynamically.

### 4. **Statistics Service**
- **Description**: Provides statistics and analytics on user submissions, problem-solving performance, and platform usage.
- **Port**: `3004`
- **Directory**: `./statistics-service`

### 5. **API Gateway**
- **Description**: Acts as a reverse proxy, routing requests to the appropriate microservices. All client requests pass through this gateway.
- **Port**: `3000`
- **Directory**: `./api-gateway`

### 6. **Frontend**
- **Description**: The user interface for the platform. This service provides the web-based frontend for users to interact with the system.
- **Port**: `3006` (mapped to `80` internally)
- **Directory**: `./frontend`

### 7. **Backend**
- **Description**: The core backend service. It interacts with the PostgreSQL database.
- **Port**: `3007`
- **Directory**: `./backend`
- **Environment Variables**:
  - `POSTGRES_USER`: `postgres`
  - `POSTGRES_HOST`: `host.docker.internal`
  - `POSTGRES_DB`: `mydatabase`
  - `POSTGRES_PASSWORD`: `123`
  - `POSTGRES_PORT`: `5432`

## Network Configuration

All services are connected via the Docker bridge network named `solveMyProblemNetwork`. This allows inter-service communication and ensures isolation from external networks.


### License

This project is licensed under the MIT License. See the LICENSE file for more details.
