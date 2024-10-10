import base64
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from dotenv import load_dotenv
import psycopg2
import os
import json
from statisticsCalculator import statsAnalyzer

app = Flask(__name__)
CORS(app)

load_dotenv()

#Configuration
DATABASE_HOST = os.getenv('POSTGRES_HOST')
DATABASE_USER = os.getenv('POSTGRES_USER')
DATABASE_PASSWORD = os.getenv('POSTGRES_PASSWORD')
DATABASE_NAME = os.getenv('POSTGRES_DB')
DATABASE_PORT = os.getenv('POSTGRES_PORT')

# Database connection
def get_db_connection():
    conn = psycopg2.connect(
        host=DATABASE_HOST,
        user=DATABASE_USER,
        database=DATABASE_NAME,
        port=DATABASE_PORT,
        password=DATABASE_PASSWORD
    )
    return conn

@app.route('/test-db', methods=['GET'])
def test_db():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('SELECT * FROM problems;')
        result = cur.fetchone()
        cur.close()
        conn.close()
        return jsonify({'result': result[0]})
    except Exception as e:
        return str(e), 500

# Return statistics for a single problem
@app.route('/problemstats',methods=['GET'])
def problemstats():
    # Get the problem ID from query parameters
    problem_id = request.args.get('problem_id')

    if not problem_id:
        return jsonify({'error': 'Please provide a valid problem_id as a query parameter'}), 400

    try:
        # Connect to the database
        conn = get_db_connection()
        cur = conn.cursor()

        # Fetch the statistics of the problem
        cur.execute('SELECT processing_time, cpu_usage, memory_usage, created_at FROM statistics WHERE problem_id = %s', (problem_id,))
        result = cur.fetchone()

        if result == None:
            return jsonify({'error': f'No statistics found for problem with id {problem_id}'}), 404

        processing_time, cpu_usage, memory_usage, created_at = result # Unpack the results

        problem_statistics = {
            'processing_time': processing_time,
            'cpu_usage': json.loads(cpu_usage)['cpu_percent'],
            'memory_usage': json.loads(memory_usage)['memory_percent'],
            'created_at': created_at
        }

        cur.close()
        conn.close()

        return jsonify(problem_statistics) # Return the statistics
    except Exception as e:
        return str(e), 500

@app.route('/statistics',methods=['GET'])
def statistics():
    # Calculate statistics for all problems

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Execute the query
        cur.execute("""
        SELECT s.processing_time, s.cpu_usage, s.memory_usage, p.input_data
        FROM statistics s
        JOIN problems p
        ON s.problem_id = p.id;
        """)
        result = cur.fetchall()
        cur.close()
        conn.close()

        # Call statsAnalyzer and get the plots
        line_plot, bar_plot, box_plot, radar_plot = statsAnalyzer(result)

        # Encode the plots as base64 strings
        def img_to_base64(img):
            return base64.b64encode(img.getvalue()).decode('utf-8')

        return jsonify({
            'statistics': {
                'line_plot': img_to_base64(line_plot),
                'bar_plot': img_to_base64(bar_plot),
                'box_plot': img_to_base64(box_plot),
                'radar_plot': img_to_base64(radar_plot)
            }
        })
    except Exception as e:
        return str(e), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3004, debug=True)
