import React, { useState } from 'react';

const SubmitProblemForm = () => {
    const [description, setDescription] = useState('');
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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amountToUse: 1 }), // Consume one credit
            });

            if (!consumeResponse.ok) {
                const errorData = await consumeResponse.json();
                throw new Error(errorData.message || 'Failed to consume credits.');
            }

            // Step 2: Submit the problem if credit consumption was successful
            const response = await fetch('http://localhost:3003/problems/submit-problem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ description }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }

            setSuccessMessage('Problem submitted successfully.');
            setDescription('');
        } catch (error) {
            console.error('There was a problem:', error);
            setErrorMessage(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Problem Description:
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
            </label>
            <button type="submit">Submit Problem</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        </form>
    );
};

export default SubmitProblemForm;
