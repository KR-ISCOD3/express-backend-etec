import express from 'express'    // Import Express framework
import dotenv from 'dotenv'      // Import dotenv to load environment variables
import authRoutes from './app/routes/authRoutes.js'
import { authenticateJWT } from './middleware/auth.js';

dotenv.config();                 // Load variables from .env file into process.env

const app = express();           // Create Express app instance
app.use(express.json());         // Middleware: parse incoming JSON requests
const PORT = process.env.PORT || 5000;   // Use PORT from env or default to 5000


app.use('/api/auth',authRoutes);

app.get('/api/protected', authenticateJWT, (req, res) => {
    res.json({ message: 'You got in!', user: req.user });
});

// Start server and listen on specified port
app.listen(PORT, () => {
    // Log confirmation message once server is running
    console.log(`✅ Server is running on http://localhost:${PORT}`);
});
