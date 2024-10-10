import React, { useEffect, useState } from 'react';

const Statistics = () => {
    const [statistics, setStatistics] = useState({});

    useEffect(() => {
        const fetchStatistics = async () => {
            const response = await fetch('http://localhost:3007/statistics');
            const data = await response.json();
            setStatistics(data);
        };
        fetchStatistics();
    }, []);

    return (
        <div>
            <h2>Statistics</h2>
            <p>User Count: {statistics.userCount}</p>
            <p>Payment Count: {statistics.paymentCount}</p>
        </div>
    );
};

export default Statistics;