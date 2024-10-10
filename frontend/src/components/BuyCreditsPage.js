import React, { useState, useEffect } from 'react';
import BuyCreditsForm from './BuyCreditsForm';
import './BuyCreditsPage.css';
import Footer from './Footer';
import Header from './Header';

const BuyCreditsPage = () => {
    const [balance, setBalance] = useState(0);  // Initial balance
    const [availableCredits, setAvailableCredits] = useState(0); // Available credits
    const [newBalance, setNewBalance] = useState(0); // Updated balance after purchasing credits

    // Fetch current balance and available credits from backend on component mount
    useEffect(() => {
        const fetchAvailableCredits = async () => {
            try {
                const response = await fetch('http://localhost:3002/api/available-credits');  // Fetch from the backend
                const data = await response.json();

                if (data.success) {
                    setBalance(data.currentBalance);  // Set the balance from backend
                    setAvailableCredits(data.totalAvailableCredits);  // Set the available credits from backend
                    setNewBalance(data.currentBalance);  // Initialize new balance as the current balance
                } else {
                    console.error('Failed to fetch available credits');
                }
            } catch (error) {
                console.error('Error fetching available credits:', error);
            }
        };

        fetchAvailableCredits();
    }, []);

    return (
        <div className="buy-credits-page">
            <Header />
            <h1>Buy Credits</h1>

            <div className="info-box">
                <div className="balance-info">
                    <label>Balance:</label>
                    <div className="balance-box">{balance}</div>
                </div>

                <div className="credits-info">
                    <label>Available Credits:</label>
                    <div className="credits-box">{availableCredits}</div>
                </div>
            </div>

            <BuyCreditsForm setNewBalance={setNewBalance} />

            {/*<div className="new-balance-info">*/}
            {/*    <label>New Balance:</label>*/}
            {/*    <div className="new-balance-box">{newBalance}</div>*/}
            {/*</div>*/}

            <Footer />
        </div>
    );
};

export default BuyCreditsPage;
