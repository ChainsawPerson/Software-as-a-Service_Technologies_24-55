import React from 'react'; // Import necessary React utilities
import { useNavigate } from 'react-router-dom'; // For navigation
import './LandingPage.css'; // Import CSS
import logo from '../logo.png'; // Import the logo image
import Footer from './Footer'; // Import Footer component
import Header from './Header'; // Import Header component

// Define the LandingPage component
const LandingPage = () => {
    const navigate = useNavigate(); // Use useNavigate to handle navigation

    return (
        <div className="landing-page">
            <header className="landing-header">
                <Header/>
                {/* Buttons for Administrator and User */}
                <div className="user-buttons">
                    <button className="admin-button" onClick={() => navigate('/admin')}>
                        Manage Problems
                    </button>
                    <button className="guest-button" onClick={() => navigate('/user')}>
                        Buy Credits and Submit Problem
                    </button>
                </div>
            </header>

            <div className="logo">
                <img src={logo} alt="solveME Logo" style={{width: '70%'}}/> {/* Display the logo image */}
            </div>
            <nav className="landing-nav">
                <button>About</button>
                <button>Instructions</button>
            </nav>

            <footer className="landing-footer">
                <Footer/>
            </footer>
        </div>
    );
};

export default LandingPage;
