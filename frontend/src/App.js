// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AdminPage from './components/AdminPage';
import SubmissionResults from './components/SubmissionResults';
import UserSubmissions from './components/UserSubmissions';
import BuyCreditsPage from './components/BuyCreditsPage';
import SubmitProblemPage from './components/SubmitProblemPage';
import SubmitProblemForm from './components/SubmitProblemForm';
import ManageSolutions from './components/ManageSolutions';
import ProblemsList from './components/ProblemsList';
import Statistics from './components/Statistics';
import ViewPage from './components/ViewPage';

const App = () => {
    return (
        <Router>
            <div className="app">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/results/:id" element={<SubmissionResults />} /> {/* Update this line */}
                    <Route path="/user" element={<UserSubmissions />} />
                    <Route path="/buy-credits" element={<BuyCreditsPage />} />
                    <Route path="/submit-problem" element={<SubmitProblemPage />} />
                    <Route path="/application" element={<Application />} />
                    <Route path="/edit/:id" element={<ViewPage />} />
                </Routes>
            </div>
        </Router>
    );
};

// Component for the application after the LandingPage
const Application = () => {
    return (
        <div>
            <h1>Problem Solving Application</h1>
            <SubmitProblemForm />
            <ManageSolutions />
            <ProblemsList />
            <Statistics />
        </div>
    );
};

export default App;
