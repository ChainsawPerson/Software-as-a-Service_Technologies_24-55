const express = require('express');
const cors = require('cors');
const paymentRoutes = require('./routes/paymentRoutes'); // Ensure this path is correct
const pool = require('./db');

const app = express();
const port = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Prefixing with '/api' if your frontend fetch URL expects it
app.use('/api', paymentRoutes);

app.listen(port, () => {
    console.log(`Payment service running on port ${port}`);
});
