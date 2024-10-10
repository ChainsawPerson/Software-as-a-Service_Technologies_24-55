// src/components/SubmitProblemPage.js
import React, { useState } from 'react';
import './SubmitProblemPage.css';
import Footer from './Footer';
import Header from './Header';

const SubmitProblemPage = () => {
    const [description, setDescription] = useState('');
    const [title, setTitle] = useState('');
    const [user, setUser] = useState('');
    const [input, setInput] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        // Step 1: Consume a credit
        try {
            const consumeResponse = await fetch('http://localhost:3002/api/consume-credits', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amountToUse: 1 }), // Consume one credit
            });

            if (!consumeResponse.ok) {
                const errorData = await consumeResponse.json();
                throw new Error(errorData.message || 'Failed to consume credits.');
            }

            // Step 2: Submit the problem if credit consumption was successful
            const response = await fetch('http://localhost:3003/problems/submit-problem', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ description, title, user, input_data: input })
            });

            if (!response.ok) throw new Error('Problem submission failed');

            setSuccessMessage('Problem submitted successfully.');
            // Clear the form fields
            setDescription('');
            setTitle('');
            setUser('');
            setInput('');
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage(error.message);
        }
    };

    return (
        <div className="submit-problem-page">
            <header className="header">
                <Header />
            </header>

            <main className="main-content">
                <div className="solver-model-dropdown">
                    <label>Solver Model</label>
                    <select>
                        {/* Populate with options as needed */}
                        <option>Linear Optimization</option>
                        <option>Knapsack</option>
                        <option>Multiple Knapsacks</option>
                    </select>
                </div>

                <div className="model-table">
                    <table>
                        <thead>
                            <tr>
                                <th>Model ID</th>
                                <th>Title</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                        {/* Replace with dynamic content as needed */}
                        <tr>
                            <td>1</td>
                            <td>Linear optimization</td>
                            <td>Linear optimization (or linear programming) is the name given to computing the best solution to a problem modeled as a set of linear relationships. </td>
                        </tr>
                        <tr>
                            <td>2</td>
                            <td>Knapsack</td>
                            <td>In the knapsack problem, you need to pack a set of items, with given values and sizes (such as weights or volumes), into a container with a maximum capacity. If the total size of the items exceeds the capacity, you can't pack them all. </td>
                        </tr>
                        <tr>
                            <td>3</td>
                            <td>Multiple Knapsacks</td>
                            <td>In the multiple knapsacks problem, you need to pack a set of items, with given values and sizes (such as weights or volumes), into a container with a maximum capacity.  If the total size of the items exceeds the capacity, you can't pack them all. </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div className="new-submission-section">

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                placeholder="Title"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                                placeholder="Description"
                            />
                        </div>
                        <div className="form-group">
                            <input
                                type="text"
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                                required
                                placeholder="User"
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                required
                                placeholder="Input Data"
                            />
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="create-button">Submit</button>
                            <button type="button" className="cancel-button" onClick={() => {
                                setTitle('');
                                setDescription('');
                                setUser('');
                                setInput('');
                            }}>Cancel</button>
                        </div>
                    </form>
                </div>

                <div className="message-area">
                    {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                    {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
                </div>
            </main>

            <footer className="footer">
                <Footer />
            </footer>
        </div>
    );
};

export default SubmitProblemPage;
