import docker
import os

docker_client = docker.from_env()

# Function to get CPU usage stats
def get_container_cpu_usage():
    try:
        # Get the current container (assuming you're running this inside the container)
        container_id = os.getenv('HOSTNAME')  # In Docker, the hostname is typically set to the container ID
        container = docker_client.containers.get(container_id)

        # Get stats from the container
        stats = container.stats(stream=False)  # Get one-time stats (no streaming)

        # Extract CPU usage details
        cpu_usage = stats['cpu_stats']['cpu_usage']['total_usage']
        system_cpu_usage = stats['cpu_stats']['system_cpu_usage']
        online_cpus = stats['cpu_stats'].get('online_cpus', 1)

        # Calculate the CPU percentage (adjust as per Docker's calculation method)
        cpu_delta = cpu_usage - stats['precpu_stats']['cpu_usage']['total_usage']
        system_delta = system_cpu_usage - stats['precpu_stats']['system_cpu_usage']

        if system_delta > 0.0 and cpu_delta > 0.0:
            cpu_percent = (cpu_delta / system_delta) * online_cpus * 100.0
        else:
            cpu_percent = 0.0

        return {
            "cpu_percent": cpu_percent,
            "cpu_usage": cpu_usage,
            "system_cpu_usage": system_cpu_usage
        }

    except Exception as e:
        # Handle or log the exception
        return str(e)