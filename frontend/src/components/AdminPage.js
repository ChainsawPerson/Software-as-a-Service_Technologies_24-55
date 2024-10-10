import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';
import Footer from './Footer';
import Header from './Header';

const AdminPage = () => {
    const [problems, setProblems] = useState([]);  // Add useState for problems
    const navigate = useNavigate();  // Initialize navigate

    // Fetch problems on component mount
    useEffect(() => {
        const fetchProblems = async () => {
            try {
                const response = await fetch('http://localhost:3007/problems'); // Ensure this port is correct
                const data = await response.json();
                setProblems(data);  // Update problems state
            } catch (error) {
                console.error('Error fetching problems:', error);
            }
        };

        fetchProblems();
    }, []);

    // Handle problem deletion
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this problem?')){
            try {
                const response = await fetch(`http://localhost:3003/problems/delete-problem/${id}`, { // Ensure this port is correct
                    method: 'DELETE',
                });
                const data = await response.json();
                if (data.success) {
                    setProblems(problems.filter(problem => problem.id !== id));  // Filter out deleted problem
                    alert('Problem deleted successfully');
                } else {
                    throw new Error(data.message);
                }
            } catch (error) {
                console.error('Error deleting problem:', error);
                alert('Failed to delete problem');
            }
        }
    };

    // Handle solver
    const handleSolver = async (id) => {
        try {
                const response = await fetch(`http://localhost:5000/solve?problem_id=${id}`, { // Ensure this port is correct
                    method: 'GET',
                    headers: {
                'Content-Type': 'application/json' // Set content type to JSON
            }
                });
                if(!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }

                // Parse the JSON response
        const data = await response.json();

        // Handle the result
        console.log('Problem solved:', data);
        return data;  // Return the data if needed for further processing
            } catch (error) {
                console.error('Error solving problem:', error);
                alert('Failed to solve problem');
            }
    };

    return (
        <div className="admin-page">
            <Header/>
            <button className="back-button" onClick={() => navigate(-1)}>Back</button>

            <main className="admin-main">
                <h2>Manage Problems</h2>
                <div className="activity-table">
                    {problems.map((problem) => (
                        <div className="activity-row" key={problem.id}>
                            <span>{problem.title || 'No Title'}</span>
                            <span>{problem.user || 'Creator'}</span>
                            <span>{problem.description || 'No Description'}</span>
                            <span>Created on {new Date(problem.created_at).toLocaleDateString()}</span>
                            <span>{problem.status || 'Status Unknown'}</span>
                            <button onClick={() => navigate(`/edit/${problem.id}`)}>View/Edit</button>
                            <button onClick={() => handleSolver(problem.id)}>Run</button>
                            <button onClick={() => navigate(`/results/${problem.id}`)}>View Results</button>
                            <button onClick={() => handleDelete(problem.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </main>
            <Footer/>
        </div>
    );
};

export default AdminPage;
