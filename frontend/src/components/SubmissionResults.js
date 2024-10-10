import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './SubmissionResults.css';
import Footer from './Footer';
import Header from './Header';

const SubmissionResults = () => {
    const [metadata, setMetadata] = useState({ created_at: '', solved_at: '', user: '' });
    const [results, setResults] = useState('');
    const [charts, setCharts] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(`http://localhost:3003/problems/${id}/results`);
                const data = await response.json();

                if (data.success) {
                    setMetadata(data.metadata);
                    setResults(data.solution);
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error fetching results:', error);
            }
        };

        const fetchCharts = async () => {
            try {
                const response = await fetch(`http://localhost:3004/statistics`);
                const data = await response.json();
                setCharts(data.statistics);
            } catch (error) {
                console.error('Error fetching statistics charts:', error);
            }
        };

        fetchResults();
        fetchCharts();
    }, [id]);

    const handleDownload = () => {
        const dataStr = JSON.stringify(results, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `results_${id}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="submission-results">
            <Header />

            {/* Metadata Section */}
            <div className="metadata-section">
                <h2><strong>Metadata</strong></h2>
                <table className="metadata-table">
                    <thead>
                        <tr>
                            <th>Created at</th>
                            <th>Solved at</th>
                            <th>User</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>{metadata.created_at || 'N/A'}</td>
                            <td>{metadata.solved_at || 'N/A'}</td>
                            <td>{metadata.user || 'N/A'}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Results Section */}
            <div className="input-data-section">
                <div className="input-row">
                    <div className="dataset-details">
                        <p><strong>Results:</strong></p>
                        {/* Display the results data with proper formatting and container styles */}
                        <pre className="json-display">{JSON.stringify(results, null, 2) || 'No results available'}</pre>
                    </div>
                    <div className="action-buttons">
                        <button onClick={handleDownload}>Download Results</button>
                    </div>
                </div>
            </div>

            {/* Results Statistics Charts Section */}
            <div className="statistics-charts-section">
                <h2><strong>Results Statistics Charts</strong></h2>
                {charts && (
                    <div className="charts-container">
                        <div className="chart">
                            <h3>Line Plot</h3>
                            {charts.line_plot && <img src={`data:image/png;base64,${charts.line_plot}`} alt="Line Plot" />}
                        </div>
                        <div className="chart">
                            <h3>Bar Plot</h3>
                            {charts.bar_plot && <img src={`data:image/png;base64,${charts.bar_plot}`} alt="Bar Plot" />}
                        </div>
                        <div className="chart">
                            <h3>Box Plot</h3>
                            {charts.box_plot && <img src={`data:image/png;base64,${charts.box_plot}`} alt="Box Plot" />}
                        </div>
                        <div className="chart">
                            <h3>Radar Plot</h3>
                            {charts.radar_plot && <img src={`data:image/png;base64,${charts.radar_plot}`} alt="Radar Plot" />}
                        </div>
                    </div>
                )}
            </div>

            {/* Done Button */}
            <div className="done-button-section">
                <button className="done-button" onClick={() => navigate(-1)}>Done</button>
            </div>

            <Footer />
        </div>
    );
};

export default SubmissionResults;
