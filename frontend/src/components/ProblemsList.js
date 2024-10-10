// src/components/ProblemsList.js

import React, { useEffect, useState } from 'react';

const ProblemsList = () => {
    const [problems, setProblems] = useState([]);

    useEffect(() => {
        const fetchProblems = async () => {
            const response = await fetch('http://localhost:3007/problems');
            const data = await response.json();
            setProblems(data);
        };
        fetchProblems();
    }, []);

    return (
        <div>
            <h2>Problems List</h2>
            <ul>
                {problems.map((problem) => (
                    <li key={problem.id}>
                        {problem.description} - Status: {problem.status}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProblemsList;
