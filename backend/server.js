const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

console.log('🚀 Iniciando LinkIQ.tech Backend...');
console.log('📍 PORT:', PORT);
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'LinkIQ.tech API v1.0',
        status: 'online',
        port: PORT,
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok',
        port: PORT,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Backend funcionando! 🚀',
        port: PORT,
        environment: process.env.NODE_ENV
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'NOT_FOUND',
        path: req.path
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔═══════════════════════════════════════╗
║   🚀 LinkIQ.tech Backend ONLINE!     ║
╠═══════════════════════════════════════╣
║   Port: ${PORT}                      
║   Host: 0.0.0.0                      
║   Env: ${process.env.NODE_ENV || 'development'}
╚═══════════════════════════════════════╝
    `);
});
