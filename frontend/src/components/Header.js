import React, { useEffect, useState } from 'react';
import './Header.css';
import logo from '../minilogo.png'; // Import the logo (adjust the path as needed)

const Header = () => {
    const [dateTime, setDateTime] = useState(new Date());
    const [systemHealth] = useState('Healthy'); // Simulate system health

    useEffect(() => {
        const interval = setInterval(() => setDateTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="header">
            <img src={logo} alt="Logo" className="logo" />
            <div className="system-info">
                <span>System info: {dateTime.toLocaleString() }</span>
                <span> System Health: {systemHealth}</span>
            </div>
        </header>
    );
};

export default Header;
