# Import the linear solver wrapper
from ortools.linear_solver import pywraplp

# This is the function that solves the linear optimization problem
def linearSolver(description): # Description as JSON

    # Instantiate a Glop solver, naming it LinearExample.
    solver = pywraplp.Solver.CreateSolver("GLOP")
    if not solver:
        return

    # x lower bound
    xlb = description["xlb"]
    if xlb == "infinity":
        xlb = -solver.infinity()

    # x upper bound
    xub = description["xub"]
    if xub == "infinity":
        xub = solver.infinity()
    
    # y lower bound
    ylb = description["ylb"]
    if ylb == "infinity":
        ylb = -solver.infinity()

    # y upper bound
    yub = description["yub"]
    if yub == "infinity":
        yub = solver.infinity()
    
    
    # Create the two variables
    x = solver.NumVar(xlb, xub, "x")
    y = solver.NumVar(ylb, yub, "y")

    # The problem solution will be returned as a string
    SolutionLog = ""
    SolutionLog += f"Number of variables = {solver.NumVariables()}\n"

    # Constraint 0:
    C0 = description["constraints"]["C0"] # This is a dictionary of Constraint 0
    xcoeff = C0["x"]
    ycoeff = C0["y"]
    val = C0["val"]

    if C0["ineq"] == "lessorequal":
        solver.Add(x*xcoeff + y * ycoeff <= val)
    elif C0["ineq"] == "less":
        solver.Add(x*xcoeff + y * ycoeff < val)
    elif C0["ineq"] == "greater":
        solver.Add(x*xcoeff + y * ycoeff > val)
    elif C0["ineq"] == "greaterorequal":
        solver.Add(x*xcoeff + y * ycoeff >= val)
    else: 
        return "Error, incorrect comparison."
        
    
    # Constraint 1:
    C1 = description["constraints"]["C1"] # This is a dictionary of Constraint 1
    xcoeff = C1["x"]
    ycoeff = C1["y"]
    val = C1["val"]

    if C1["ineq"] == "lessorequal":
        solver.Add(x*xcoeff + y * ycoeff <= val)
    elif C1["ineq"] == "less":
        solver.Add(x*xcoeff + y * ycoeff < val)
    elif C1["ineq"] == "greater":
        solver.Add(x*xcoeff + y * ycoeff > val)
    elif C1["ineq"] == "greaterorequal":
        solver.Add(x*xcoeff + y * ycoeff >= val)
    else: 
        return "Error, incorrect comparison."
    
    # Constraint 2:
    C2 = description["constraints"]["C2"] # This is a dictionary of Constraint 2
    xcoeff = C2["x"]
    ycoeff = C2["y"]
    val = C2["val"]

    if C2["ineq"] == "lessorequal":
        solver.Add(x*xcoeff + y * ycoeff <= val)
    elif C2["ineq"] == "less":
        solver.Add(x*xcoeff + y * ycoeff < val)
    elif C2["ineq"] == "greater":
        solver.Add(x*xcoeff + y * ycoeff > val)
    elif C2["ineq"] == "greaterorequal":
        solver.Add(x*xcoeff + y * ycoeff >= val)
    else: 
        return "Error, incorrect comparison."

    SolutionLog += f"Number of constraints = {solver.NumConstraints()}\n"

    # Objective function:
    objXCoeff = description["objective"]["x"]
    objYCoeff = description["objective"]["y"]
    if description["objective"]["minmax"] == "min":
        solver.Minimize(x * objXCoeff + y * objYCoeff)
    elif description["objective"]["minmax"] == "max":
        solver.Maximize(x * objXCoeff + y * objYCoeff)
    else:
        return "Error, objective must be 'Minimized' or 'Maximized'."

    # Solve the system.
    SolutionLog += f"Solving with {solver.SolverVersion()}\n"
    status = solver.Solve()

    if status == pywraplp.Solver.OPTIMAL:
        SolutionLog += "Solution:\n"
        SolutionLog += f"Objective value = {solver.Objective().Value():0.1f}\n"
        SolutionLog += f"x = {x.solution_value():0.1f}\n"
        SolutionLog += f"y = {y.solution_value():0.1f}\n"
    else:
        SolutionLog += "The problem does not have an optimal solution.\n"

    SolutionLog += "\nAdvanced usage:\n"
    SolutionLog += f"Problem solved in {solver.wall_time():d} milliseconds\n"
    SolutionLog += f"Problem solved in {solver.iterations():d} iterations\n"

    SolutionData = {
        "Solver" : solver.SolverVersion(),
        "ObjectiveValue" : solver.Objective().Value(),
        "XValue" : x.solution_value(),
        "YValue" : y.solution_value(),
        "Time" : solver.wall_time(),
        "Iterations" : solver.Iterations(),
    }

    return {
        "SolutionLog" : SolutionLog,
        "SolutionData" : SolutionData
    }
