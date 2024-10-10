import psutil
import os

# Function to measure memory usage of the Python process (optional)
def get_python_process_memory_usage():
    process = psutil.Process(os.getpid())
    memory_info = process.memory_info()
    return {
        "rss": memory_info.rss,  # Resident Set Size
        "vms": memory_info.vms,  # Virtual Memory Size
        "memory_percent": process.memory_percent()  # Percentage of memory used by the process
    }