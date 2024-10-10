import json
from functions import plot_utils as pu

def statsAnalyzer(data):
    # Create a dictionary for each model used

    linearSolverTime = []
    linearSolverCPU = []
    linearSolverMem = []

    knapsackSolverTime = []
    knapsackSolverCPU = []
    knapsackSolverMem = []

    multipleKnapsackSolverTime = []
    multipleKnapsackSolverCPU = []
    multipleKnapsackSolverMem = []

    # Unpack the data into the dictionary
    for row in data:
        input_data = json.loads(row[3])
        model = input_data["model"]
        if model == "LinearSolver":
            linearSolverTime.append(row[0])
            linearSolverCPU.append(json.loads(row[1])['cpu_percent'])
            linearSolverMem.append(json.loads(row[2])['memory_percent'])
        elif model == "KnapsackSolver":
            knapsackSolverTime.append(row[0])
            knapsackSolverCPU.append(json.loads(row[1])['cpu_percent'])
            knapsackSolverMem.append(json.loads(row[2])['memory_percent'])
        elif model == "MultipleKnapsackSolver":
            multipleKnapsackSolverTime.append(row[0])
            multipleKnapsackSolverCPU.append(json.loads(row[1])['cpu_percent'])
            multipleKnapsackSolverMem.append(json.loads(row[2])['memory_percent'])

    # Generate plots
    line_plot = pu.plot_line(linearSolverTime, linearSolverCPU, linearSolverMem,
                            knapsackSolverTime, knapsackSolverCPU, knapsackSolverMem,
                            multipleKnapsackSolverTime, multipleKnapsackSolverCPU, multipleKnapsackSolverMem)

    bar_plot = pu.plot_bar(linearSolverTime, linearSolverCPU, linearSolverMem,
                        knapsackSolverTime, knapsackSolverCPU, knapsackSolverMem,
                        multipleKnapsackSolverTime, multipleKnapsackSolverCPU, multipleKnapsackSolverMem)

    box_plot = pu.plot_box(linearSolverTime, linearSolverCPU, linearSolverMem,
                        knapsackSolverTime, knapsackSolverCPU, knapsackSolverMem,
                        multipleKnapsackSolverTime, multipleKnapsackSolverCPU, multipleKnapsackSolverMem)

    radar_plot = pu.plot_radar(linearSolverTime, linearSolverCPU, linearSolverMem,
                            knapsackSolverTime, knapsackSolverCPU, knapsackSolverMem,
                            multipleKnapsackSolverTime, multipleKnapsackSolverCPU, multipleKnapsackSolverMem)

    return line_plot, bar_plot, box_plot, radar_plot