const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// CRITICAL: Railway precisa que a porta seja lida do ambiente
const PORT = process.env.PORT || 3000;

console.log('🚀 Iniciando LinkIQ.tech Backend...');
console.log('📍 PORT configurada:', PORT);
console.log('🌍 NODE_ENV:', process.env.NODE_ENV);

// Security
app.use(helmet());

// CORS
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: 'Muitas requisições. Tente novamente.' }
});
app.use('/api/', limiter);

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'LinkIQ.tech API v1.0',
        status: 'online',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        port: PORT,
        env: process.env.NODE_ENV
    });
});

app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: 'Backend LinkIQ.tech funcionando! 🚀',
        environment: process.env.NODE_ENV,
        port: PORT,
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'NOT_FOUND',
        message: 'Endpoint não encontrado',
        path: req.path
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    res.status(err.status || 500).json({ 
        error: 'INTERNAL_SERVER_ERROR',
        message: process.env.NODE_ENV === 'production' 
            ? 'Erro interno do servidor' 
            : err.message
    });
});

// Start server - CRITICAL: Escutar em 0.0.0.0 para Railway
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔═══════════════════════════════════════╗
║   🚀 LinkIQ.tech Backend Online!     ║
╠═══════════════════════════════════════╣
║   Port: ${PORT}                      
║   Host: 0.0.0.0
║   Env: ${process.env.NODE_ENV}       
║   Time: ${new Date().toISOString()}
╚═══════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received, shutting down gracefully...');
    process.exit(0);
});
