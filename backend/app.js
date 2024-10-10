const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = 3007;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
});


app.post('/submit-problem', async (req, res) => {
    const { description } = req.body; // Αφαίρεση του userId

    try {
        const result = await pool.query(
            'INSERT INTO problems (description, status, created_at) VALUES ($1, $2, NOW()) RETURNING *',
            [description, 'new'] // Αφαίρεση του userId
        );

        res.json({ success: true, problem: result.rows[0] });
    } catch (error) {
        console.error('Error inserting problem into database:', error);
        res.status(500).json({ success: false, message: 'Failed to submit problem' });
    }
});


app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

app.get('/problems', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM problems');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching problems:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch problems' });
    }
});

app.get('/statistics', async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) AS totalProblems FROM problems');
        const totalProblems = parseInt(result.rows[0].totalproblems, 10);
        const solvedResult = await pool.query('SELECT COUNT(*) AS solvedProblems FROM problems WHERE status = $1', ['solved']);
        const solvedProblems = parseInt(solvedResult.rows[0].solvedproblems, 10);

        res.json({ totalProblems, solvedProblems });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch statistics' });
    }
});

app.post('/solve/:id', async (req, res) => {
    const problemId = req.params.id;

    try {
        const result = await pool.query(
            'UPDATE problems SET status = $1 WHERE id = $2 RETURNING *',
            ['solved', problemId]
        );

        await pool.query(
            'INSERT INTO statistics (problem_id, processing_time, created_at) VALUES ($1, $2, NOW()) RETURNING *',
            [problemId, Math.random() * 10]
        );

        res.json({ success: true, problem: result.rows[0] });
    } catch (error) {
        console.error('Error solving problem:', error);
        res.status(500).json({ success: false, message: 'Failed to solve problem' });
    }
});

app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
});
