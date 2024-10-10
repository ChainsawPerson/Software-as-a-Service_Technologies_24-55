const { Pool } = require('pg');
const pool = new Pool({
    user: 'postgres',
    host: 'host.docker.internal',
    database: 'mydatabase',
    password: '2372002',
    port: 5433,
});
const submitProblem = async (req, res) => {
    // Destructure the required fields from the request body
    const { description, title, user, input_data } = req.body;

    try {
        // Insert the new problem into the database
        const result = await pool.query(
            'INSERT INTO problems (description, title, status, created_at, "user", input_data) VALUES ($1, $2, $3, NOW(), $4, $5) RETURNING *',
            [description, title, 'Pending', user, input_data]
        );

        // Respond with the newly created problem
        res.json({ success: true, problem: result.rows[0] });
    } catch (error) {
        console.error('Error inserting problem into database:', error);
        res.status(500).json({ success: false, message: 'Failed to submit problem' });
    }
};


const deleteProblem = async (req, res) => {
    const id = parseInt(req.params.id, 10); // Ensure id is an integer
    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid problem ID' });
    }

    try {
        // Start a transaction
        await pool.query('BEGIN');

        // Delete related statistics first
        await pool.query('DELETE FROM statistics WHERE problem_id = $1', [id]);

        // Delete the problem
        const result = await pool.query('DELETE FROM problems WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            // Rollback if no problem is found
            await pool.query('ROLLBACK');
            return res.status(404).json({ success: false, message: 'Problem not found' });
        } else {
            // Commit the transaction if everything is successful
            await pool.query('COMMIT');
            return res.json({ success: true, message: 'Problem deleted successfully', problem: result.rows[0] });
        }
    } catch (error) {
        // Rollback in case of error
        await pool.query('ROLLBACK');
        console.error('Error deleting problem from database:', error);
        res.status(500).json({ success: false, message: 'Failed to delete problem' });
    }
};

const getView = async (req, res) => {
    const id = parseInt(req.params.id, 10); // Ensure id is an integer
    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid problem ID' });
    }

    try {
        // Format both created_at and solved_at using PostgreSQL's to_char function
        const result = await pool.query(
            'SELECT input_data, to_char(created_at, \'YYYY-MM-DD HH24:MI:SS\') AS created_at, to_char(solved_at, \'YYYY-MM-DD HH24:MI:SS\') AS solved_at, "user" FROM problems WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Problem not found' });
        }

        const { input_data, created_at, solved_at, user } = result.rows[0];

        // Create the metadata object
        const metadata = {
            created_at,
            solved_at,
            user
        };

        // Respond with the separated metadata and input_data
        res.json({ success: true, metadata, input_data });
    } catch (error) {
        console.error('Error fetching results from database:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve results' });
    }
};



const getResults = async (req, res) => {
    const id = parseInt(req.params.id, 10); // Ensure id is an integer
    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid problem ID' });
    }

    try {
        // Query to fetch the results for the specific problem ID
        const result = await pool.query(
            'SELECT results FROM problems WHERE id = $1',
            [id]
        );

        // Check if the problem exists
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Problem not found' });
        }

        // Parse the results field from text to JSON
        const results = JSON.parse(result.rows[0].results);

        // Separate the metadata and solution
        const metadata = results.metadata;
        const solution = results.solution;

        // Respond with the separated metadata and solution
        res.json({ success: true, metadata, solution });
    } catch (error) {
        console.error('Error fetching and parsing results from database:', error);
        res.status(500).json({ success: false, message: 'Failed to retrieve results' });
    }
};

const updateInputData = async (req, res) => {
    const id = parseInt(req.params.id, 10); // Ensure id is an integer
    const { input_data } = req.body; // Get input_data from the request body

    if (isNaN(id)) {
        return res.status(400).json({ success: false, message: 'Invalid problem ID' });
    }

    try {
        // Update the input_data for the specific problem ID
        const result = await pool.query(
            'UPDATE problems SET input_data = $1 WHERE id = $2 RETURNING *',
            [JSON.stringify(input_data), id] // Convert input_data to string if necessary
        );

        // Check if the problem exists
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, message: 'Problem not found' });
        }

        // Respond with the updated problem
        res.json({ success: true, problem: result.rows[0] });
    } catch (error) {
        console.error('Error updating input data in database:', error);
        res.status(500).json({ success: false, message: 'Failed to update input data' });
    }
};


module.exports = {
    submitProblem,
    deleteProblem,
    getView,
    getResults,
    updateInputData
};
