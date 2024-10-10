import { useState } from 'react';

const BuyCreditsForm = () => {
    const [amount, setAmount] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            // Assuming backend container is accessible via 'http://payment-service:3002'
            const response = await fetch('http://localhost:3002/api/purchase-credits', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount }), // Just send amount
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Network response was not ok.');
            }

            const data = await response.json();
            setSuccessMessage(
                <>
                    Credits purchased successfully. New Balance: ${data.newBalance}.<br />
                    <span style={{ display: 'block', textAlign: 'center' }}>Credits expire in 1 hour.</span>
                </>
            );
            setAmount('');

        } catch (error) {
            setErrorMessage(error.message || 'There was a problem with the purchase operation.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
                <label>
                    Amount of Credits:
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Buy Credits</button>
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            </form>
        </div>
    );
};

export default BuyCreditsForm;
