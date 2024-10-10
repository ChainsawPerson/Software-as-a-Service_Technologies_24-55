import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ViewPage.css';
import Header from './Header';
import Footer from './Footer';

const ViewPage = () => {
    const [metadata, setMetadata] = useState({ created_at: '', solved_at: '', user: '' }); // State for metadata
    const [inputData, setInputData] = useState(''); // State for input data
    const navigate = useNavigate();
    const { id } = useParams(); // Get the problem ID from the URL

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const response = await fetch(`http://localhost:3003/problems/${id}/view`); // Adjust URL as needed
                const data = await response.json();

                if (data.success) {
                    setMetadata(data.metadata); // Update state with metadata
                    setInputData(data.input_data); // Update state with input data
                } else {
                    alert(data.message); // Handle errors appropriately
                }
            } catch (error) {
                console.error('Error fetching metadata:', error);
            }
        };

        fetchMetadata(); // Call the function to fetch metadata
    }, [id]); // Dependency array includes id

    // Function to handle the download of input data
    const handleDownload = () => {
        // Convert inputData to JSON string
        const dataStr = JSON.stringify(inputData, null, 2);

        // Create a Blob object with the inputData string
        const blob = new Blob([dataStr], { type: 'application/json' });

        // Create a temporary anchor element to trigger the download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `input_data_${id}.json`; // Set a filename for the download

        // Append the anchor element to the body, trigger the click, and remove it
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Revoke the object URL after the download
        URL.revokeObjectURL(url);
    };

    // Function to handle file upload
    const handleFileUpload = (event) => {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();

            // Read the file content as text
            reader.onload = (e) => {
                try {
                    const uploadedData = JSON.parse(e.target.result);
                    setInputData(uploadedData); // Update inputData state with uploaded data
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                    alert('Failed to upload. Please ensure the file is a valid JSON.');
                }
            };

            reader.readAsText(file);
        }
    };

    // Function to trigger file input click
    const triggerFileInput = () => {
        document.getElementById('file-input').click();
    };

    // Function to save the uploaded input data
    const handleSave = async () => {
        try {
            // Send a PUT request to the backend to update input data
            const response = await fetch(`http://localhost:3003/problems/${id}/save`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ input_data: inputData }), // Send the new inputData
            });

            const data = await response.json();

            if (data.success) {
                alert('Input data saved successfully!');
            } else {
                alert(`Failed to save input data: ${data.message}`);
            }
        } catch (error) {
            console.error('Error saving input data:', error);
            alert('Failed to save input data. Please try again.');
        }
    };

    return (
        <div className="view-page">
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
                            <td>{metadata.created_at}</td>
                            <td>{metadata.solved_at}</td>
                            <td>{metadata.user}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="input-data-section">
                <div className="input-row">
                    <div className="dataset-details">
                        <p><strong>Input Data:</strong></p>
                        {/* Display the input data with proper formatting and container styles */}
                        <pre className="json-display">{JSON.stringify(inputData, null, 2)}</pre>
                    </div>
                    <div className="action-buttons">
                        <button onClick={triggerFileInput}>Upload</button>
                        <button onClick={handleDownload}>Download</button>
                        <button className="save-button" onClick={handleSave}>Save</button> {/* Save button with functionality */}
                        <input
                            type="file"
                            id="file-input"
                            style={{ display: 'none' }}
                            accept=".json"
                            onChange={handleFileUpload}
                        />
                    </div>
                </div>
            </div>

            {/* Done Button */}
            <div className="done-button-section">
                <button className="done-button" onClick={() => navigate(-1)}>Done</button>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ViewPage;
