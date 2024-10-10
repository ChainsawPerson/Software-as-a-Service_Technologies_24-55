import React, { useEffect, useState } from 'react';

const ManageSolutions = () => {
    const [problems, setProblems] = useState([]);

    useEffect(() => {
        const fetchProblems = async () => {
            const response = await fetch('http://localhost:3007/problems');
            const data = await response.json();
            setProblems(data);
        };
        fetchProblems();
    }, []);

    const handleSolve = async (problemId) => {
        await fetch(`http://localhost:3007/solve/${problemId}`, {
            method: 'POST',
        });

        const response = await fetch('http://localhost:3007/problems');
        const data = await response.json();
        setProblems(data);
    };

    return (
        <div>
            <h2>Manage Problems</h2>
            <ul>
                {problems.map((problem) => (
                    <li key={problem.id}>
                        {problem.description}
                        <button onClick={() => handleSolve(problem.id)}>Solve</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ManageSolutions;