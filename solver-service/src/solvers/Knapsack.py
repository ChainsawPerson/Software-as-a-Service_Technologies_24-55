from ortools.algorithms.python import knapsack_solver

def knapsackSolver(description): # Description as JSON
    # Create the solver.
    solver = knapsack_solver.KnapsackSolver( # Call the solver for the Knapsack Problem
        knapsack_solver.SolverType.KNAPSACK_MULTIDIMENSION_BRANCH_AND_BOUND_SOLVER,
        "KnapsackSolver",
    )

    # Import from the JSON
    values = description["values"] # Array
    weights = description["weights"] # Array
    capacities = description["capacities"] # Integer

    solver.init(values, weights, capacities)
    computed_value = solver.solve()

    SolutionLog = "" # The log of the process

    packed_items = []
    packed_weights = []
    total_weight = 0
    SolutionLog += f"Total value = {computed_value}\n"
    for i in range(len(values)):
        if solver.best_solution_contains(i):
            packed_items.append(i)
            packed_weights.append(weights[0][i])
            total_weight += weights[0][i]
    SolutionLog += f"Total weight: {total_weight}\n"
    SolutionLog += f"Packed items: {packed_items}\n"
    SolutionLog += f"Packed_weights: {packed_weights}\n"

    SolutionData = {
        "Total Value": computed_value,
        "Total Weight": total_weight,
        "Packed Items": packed_items,
        "Packed Weights": packed_weights,
    }

    return {
        "SolutionLog": SolutionLog,
        "SolutionData": SolutionData,
    }