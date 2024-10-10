from trackers import cpuTracker, memoryTracker

def getSourcesStats():
    cpuStats = cpuTracker.get_container_cpu_usage()
    memoryStats = memoryTracker.get_python_process_memory_usage()

    return {
        "cpuStats": cpuStats,
        "memoryStats": memoryStats
    }