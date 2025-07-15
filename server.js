import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import csrf from 'csurf';

import authRoutes from './app/routes/authRoutes.js';
import { authenticateJWT } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Middleware order is very important

app.use(cookieParser());  // Must be before csrf
app.use(express.json());

const allowedOrigins = [
    'http://localhost:3000',
    'https://eteccenter-system.vercel.app', // Replace with actual domain
];
  
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        } else {
        callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // ⚠️ IMPORTANT
}));


// 3. CSRF protection middleware using cookies
const csrfProtection = csrf({ cookie: true });

// 4. Auth routes (login, register, etc)
app.use('/api/auth', authRoutes);

// 5. CSRF token endpoint - PROTECTED by authenticateJWT!
// Only logged-in users can get CSRF token tied to their cookie-session
app.get('/api/csrf-token', authenticateJWT, csrfProtection, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());  // optional for frontend frameworks
    res.json({ csrfToken: req.csrfToken() });
});

// 6. Example unprotected test route
app.get('/api/test', (req, res) => {
    console.log('Cookies:', req.cookies);
    res.send('OK');
});

// 7. Protected GET route (no CSRF needed for GET)
app.get('/api/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'You got in!', user: req.user });
});

// 8. Protected POST route with CSRF and JWT auth
app.post('/api/protected-action', authenticateJWT, csrfProtection, (req, res) => {
    console.log('Cookies:', req.cookies);
    console.log('CSRF header:', req.headers['csrf-token']);
    res.json({ message: 'POST success and CSRF token valid.', user: req.user });
});

// 9. Start server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
    