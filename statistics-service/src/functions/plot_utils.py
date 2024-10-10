# plot_utils.py
import matplotlib.pyplot as plt
import numpy as np
import seaborn as sns
from math import pi
from io import BytesIO

def plot_line(linearSolverTime, linearSolverCPU, linearSolverMem,
              knapsackSolverTime, knapsackSolverCPU, knapsackSolverMem,
              multipleKnapsackSolverTime, multipleKnapsackSolverCPU, multipleKnapsackSolverMem):
    plt.figure(figsize=(12, 12))

    # Time taken for each solver
    plt.subplot(3, 1, 1)
    plt.plot(['Linear', 'Knapsack', 'Multiple Knapsack'],
             [np.mean(linearSolverTime), np.mean(knapsackSolverTime), np.mean(multipleKnapsackSolverTime)],
             marker='o', color='blue')
    plt.title('Average Time Taken by Solver')
    plt.ylabel('Time (seconds)')
    plt.grid()

    # CPU usage for each solver
    plt.subplot(3, 1, 2)
    plt.plot(['Linear', 'Knapsack', 'Multiple Knapsack'],
             [np.mean(linearSolverCPU), np.mean(knapsackSolverCPU), np.mean(multipleKnapsackSolverCPU)],
             marker='o', color='green')
    plt.title('Average CPU Usage by Solver')
    plt.ylabel('CPU Usage (%)')
    plt.grid()

    # Memory usage for each solver
    plt.subplot(3, 1, 3)
    plt.plot(['Linear', 'Knapsack', 'Multiple Knapsack'],
             [np.mean(linearSolverMem), np.mean(knapsackSolverMem), np.mean(multipleKnapsackSolverMem)],
             marker='o', color='orange')
    plt.title('Average Memory Usage by Solver')
    plt.ylabel('Memory Usage (%)')
    plt.xlabel('Solvers')
    plt.grid()

    plt.tight_layout()

    # Save the plot to a BytesIO object and return it
    img = BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()  # Close the plot to free memory
    return img

def plot_bar(linearSolverTime, linearSolverCPU, linearSolverMem,
             knapsackSolverTime, knapsackSolverCPU, knapsackSolverMem,
             multipleKnapsackSolverTime, multipleKnapsackSolverCPU, multipleKnapsackSolverMem):
    average_time = [np.mean(linearSolverTime), np.mean(knapsackSolverTime), np.mean(multipleKnapsackSolverTime)]
    average_cpu = [np.mean(linearSolverCPU), np.mean(knapsackSolverCPU), np.mean(multipleKnapsackSolverCPU)]
    average_mem = [np.mean(linearSolverMem), np.mean(knapsackSolverMem), np.mean(multipleKnapsackSolverMem)]

    bar_width = 0.25
    x = np.arange(len(['Linear', 'Knapsack', 'Multiple Knapsack']))

    plt.figure(figsize=(12, 6))
    plt.bar(x - bar_width, average_time, width=bar_width, label='Average Time Taken (s)', color='blue')
    plt.bar(x, average_cpu, width=bar_width, label='Average CPU Usage (%)', color='green')
    plt.bar(x + bar_width, average_mem, width=bar_width, label='Average Memory Usage (%)', color='orange')

    plt.xlabel('Solvers')
    plt.title('Performance Metrics by Solver')
    plt.xticks(x, ['Linear', 'Knapsack', 'Multiple Knapsack'])
    plt.legend()
    plt.grid(axis='y')

    # Save the plot to a BytesIO object and return it
    img = BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()  # Close the plot to free memory
    return img

def plot_box(linearSolverTime, linearSolverCPU, linearSolverMem,
             knapsackSolverTime, knapsackSolverCPU, knapsackSolverMem,
             multipleKnapsackSolverTime, multipleKnapsackSolverCPU, multipleKnapsackSolverMem):
    data = {
        'Solver': ['Linear'] * len(linearSolverTime) +
                  ['Knapsack'] * len(knapsackSolverTime) +
                  ['Multiple Knapsack'] * len(multipleKnapsackSolverTime),
        'Time Taken': linearSolverTime + knapsackSolverTime + multipleKnapsackSolverTime,
        'CPU Usage': linearSolverCPU + knapsackSolverCPU + multipleKnapsackSolverCPU,
        'Memory Usage': linearSolverMem + knapsackSolverMem + multipleKnapsackSolverMem
    }

    import pandas as pd
    df = pd.DataFrame(data)

    plt.figure(figsize=(12, 18))

    # Box plot for time taken
    plt.subplot(3, 1, 1)
    sns.boxplot(x='Solver', y='Time Taken', data=df)
    plt.title('Box Plot of Time Taken by Solver')
    plt.grid()

    # Box plot for CPU usage
    plt.subplot(3, 1, 2)
    sns.boxplot(x='Solver', y='CPU Usage', data=df)
    plt.title('Box Plot of CPU Usage by Solver')
    plt.grid()

    # Box plot for memory usage
    plt.subplot(3, 1, 3)
    sns.boxplot(x='Solver', y='Memory Usage', data=df)
    plt.title('Box Plot of Memory Usage by Solver')
    plt.grid()

    plt.tight_layout()

    # Save the plot to a BytesIO object and return it
    img = BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()  # Close the plot to free memory
    return img

def plot_radar(linearSolverTime, linearSolverCPU, linearSolverMem,
               knapsackSolverTime, knapsackSolverCPU, knapsackSolverMem,
               multipleKnapsackSolverTime, multipleKnapsackSolverCPU, multipleKnapsackSolverMem):
    average_values = [
        [np.mean(linearSolverTime), np.mean(linearSolverCPU), np.mean(linearSolverMem)],
        [np.mean(knapsackSolverTime), np.mean(knapsackSolverCPU), np.mean(knapsackSolverMem)],
        [np.mean(multipleKnapsackSolverTime), np.mean(multipleKnapsackSolverCPU), np.mean(multipleKnapsackSolverMem)]
    ]

    categories = ['Time Taken', 'CPU Usage', 'Memory Usage']
    N = len(categories)

    angles = [n / float(N) * 2 * pi for n in range(N)]
    average_values = [avg + [avg[0]] for avg in average_values]  # close the circle
    angles += angles[:1]  # close the circle

    plt.figure(figsize=(8, 8), dpi=120)
    ax = plt.subplot(111, polar=True)

    for i, avg in enumerate(average_values):
        ax.plot(angles, avg, linewidth=1, linestyle='solid', label=f'Solver {i + 1}')
        ax.fill(angles, avg, alpha=0.4)

    plt.xticks(angles[:-1], categories)
    plt.title('Radar Chart of Solver Performance')
    plt.legend(['Linear', 'Knapsack', 'Multiple Knapsack'], loc='upper right', bbox_to_anchor=(0.1, 0.1))

    # Save the plot to a BytesIO object and return it
    img = BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()  # Close the plot to free memory
    return img
