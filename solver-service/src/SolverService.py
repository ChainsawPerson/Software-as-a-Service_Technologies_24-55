from solvers import LinearOptimization as ls
from solvers import Knapsack as ks
from solvers import MultipleKnapsacks as mks

def solver(model, description):
    if model == "LinearSolver":
        print("LinearSolver")
        return ls.linearSolver(description)
    elif model == "KnapsackSolver":
        print("KnapsackSolver")
        return ks.knapsackSolver(description)
    elif model == "MultipleKnapsackSolver":
        print("MultipleKnapsackSolver")
        return mks.multipleKnapsackSolver(description)
    return {
        "SolutionLog" : "null",
        "SolutionData" : "null",
    }
