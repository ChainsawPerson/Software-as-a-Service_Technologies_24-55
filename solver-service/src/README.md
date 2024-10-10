# Base Idea:

Problems will be based on these categories:
- [Linear optimization](solvers/LinearOptimization.py)
- Packing

Each Category will be accessed by a *seperate* Python script.

The main script will be the [index.py](index.py) which will:
- Get the data from the database (preferably a JSON in string format)
- Format string into JSON
- Depending on the type of problem call on the appropriate script and execute it
- Return the results

# Description Format (Suggestion)

{
    "model" : "poblemModel",
    "description" : {
        "data" : {}
    }
}

The "model" will determine which model will be used.
The "description" are the problem variables for each problem.

## Linear Optimization

Data format should be something like [this](../../testing/input/linearData.json)

The Solver will return a __log__ of the process with the result in __string format__.