const express = require('express');
const cors = require('cors');

const app = express();
require('dotenv').config();

console.log('Starting server...');

// Add error handlers to catch what's stopping the server
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err.message);
    console.error(err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('📝 SIGTERM received - server shutting down gracefully');
});

process.on('SIGINT', () => {
    console.log('📝 SIGINT received (Ctrl+C) - server shutting down');
    process.exit(0);
});

app.use(cors());
app.use(express.json());

// Simple test route
app.get('/', (req, res) => {
    console.log('Root route accessed');
    res.json({
        message: 'Server is running!',
        timestamp: new Date().toISOString()
    });
});

// Test if routes are the problem
console.log('Attempting to load routes...');

try {
    // Comment/uncomment these lines one by one to test
    const routes = require('./routes');
    console.log('✅ Routes loaded successfully');

    app.use('/api/v1', routes);
    console.log('✅ Routes registered successfully');

} catch (error) {
    console.error('❌ Route error:', error.message);
    console.error(error.stack);
    // Don't exit - let server run without routes for testing
}

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌐 Visit: http://localhost:${PORT}`);
    console.log('📊 Server is holding and waiting for requests...');
});

// Handle server errors
server.on('error', (err) => {
    console.error('❌ Server error:', err.message);
});

// Keep alive check
setInterval(() => {
    console.log(`💓 Server heartbeat - ${new Date().toLocaleTimeString()}`);
}, 30000); // Every 30 seconds

module.exports = app;