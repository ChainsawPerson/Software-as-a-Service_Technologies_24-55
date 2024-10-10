const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const port = 2999;

// Configure CORS
app.use(cors({
    origin: 'http://localhost:3006', // Αντικατάστησε με το URL του frontend αν χρειάζεται
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Proxy middleware setup
app.use('/users', createProxyMiddleware({ target: 'http://user-service:3001', changeOrigin: true }));
app.use('/payments', createProxyMiddleware({ target: 'http://payment-service:3002', changeOrigin: true }));
app.use('/problems', createProxyMiddleware({ target: 'http://problem-service:3003', changeOrigin: true }));
app.use('/solve', createProxyMiddleware({ target: 'http://solver-service:5000', changeOrigin: true }));
app.use('/statistics', createProxyMiddleware({ target: 'http://statistics-service:3004', changeOrigin: true }));

app.listen(port, () => {
    console.log(`API Gateway running on port ${port}`);
});
