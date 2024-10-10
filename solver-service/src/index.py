import time
from datetime import datetime, timedelta

from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import psycopg2
import os
import json
from SolverService import solver
from sourceTracker import getSourcesStats

app = Flask(__name__)
CORS(app)

load_dotenv()

# Configuration
DATABASE_HOST = os.getenv('POSTGRES_HOST')
DATABASE_NAME = os.getenv('POSTGRES_DB')
DATABASE_USER = os.getenv('POSTGRES_USER')
DATABASE_PASSWORD = os.getenv('POSTGRES_PASSWORD')
DATABASE_PORT = os.getenv('POSTGRES_PORT')

# Database connection
def get_db_connection():
    conn = psycopg2.connect(
        host=DATABASE_HOST,
        database=DATABASE_NAME,
        user=DATABASE_USER,
        password=DATABASE_PASSWORD,
        port=DATABASE_PORT
    )
    return conn

@app.route('/test-db', methods=['GET'])
def test_db():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT NOW()')
        result = cur.fetchone()
        cur.close()
        conn.close()
        return jsonify({'time': result[0]})
    except Exception as e:
        # Log the exception or handle it as needed
        return str(e), 500

@app.route('/solve', methods=['GET'])
def solve():
    # Get the problem ID from query parameters
    problem_id = request.args.get('problem_id')

    if not problem_id:
        return jsonify({"error": "Please provide a valid problem_id as a query parameter"}), 400

    try:
        # Connect to the database
        conn = get_db_connection()
        cur = conn.cursor()

        # Fetch all from the 'problems' table for the given problem_id
        cur.execute('SELECT * FROM problems WHERE id = %s', (problem_id,))
        problem = cur.fetchone()

        if problem is None:
            return jsonify({"error": f"No problem found with id {problem_id}"}), 404

        problem_id, description, status, created_at, title, user, solved_at, input_data, results = problem # Unpack the fetched result

        problem_details = { # Turn result into dictionary
            "id": problem_id,
            "description": description,
            "status": status,
            "created_at" : created_at,
            "title" : title,
            "user" : user,
            "solved_at" : solved_at,
            "input_data" : input_data,
            "results" : results, # Unpack details
        }

        details = json.loads(problem_details["input_data"])
        model = details['model'] # Model to be used
        description = details['description'] # Data for the solver

        # Start the timer to calculate time taken for solution
        start_time = time.time()

        # Call the solver function with the model and description
        solution = solver(model, description)

        # End timer
        end_time = time.time()
        time_taken = end_time - start_time

        solved_at = datetime.now() + timedelta(hours=3)
        cur.execute('UPDATE problems SET solved_at = %s WHERE id = %s', (solved_at, problem_id))
        conn.commit()

        result = {
            "metadata" : {
                "user" : user,
                "created_at" : created_at.strftime("%Y-%m-%d %H:%M:%S"),
                "solved_at" : solved_at.strftime("%Y-%m-%d %H:%M:%S"),
            },
            "data" : {
                "title" : title,
                "description" : problem_details["description"],
                "input_data" : json.loads(input_data),
            },
            "solution" : solution
        }

        # Fetch CPU usage stats
        sourceStatistics = getSourcesStats()

        # Update Database with solution
        cur.execute('UPDATE problems SET status = %s, results = %s WHERE id = %s', ('Solved', json.dumps(result), problem_id,))
        conn.commit()

        # Update database with solution statistics
        cur.execute('INSERT INTO statistics (problem_id, processing_time, created_at, cpu_usage, memory_usage) VALUES (%s, %s, %s, %s, %s) ',(problem_id, time_taken, created_at, json.dumps(sourceStatistics['cpuStats']), json.dumps(sourceStatistics['memoryStats'])))
        conn.commit()

        # Close the database connection
        cur.close()
        conn.close()

        # Return the solution as JSON
        return jsonify({"result": result, "success": True, "sourceStatistics" : sourceStatistics}), 200

    except Exception as e:
        # Log the error or handle it as needed
        return str(e), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
