import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  'http://localhost:5173',
  'https://lead-hunter-sable-three.vercel.app'
];

app.use(cors({
  origin: function(origin, callback) {
    if (
      !origin ||
      allowedOrigins.indexOf(origin) !== -1 ||
      origin.endsWith('.vercel.app')
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Root endpoint for status & health
app.get('/', (req, res) => {
    res.json({
        name: 'LeadHunter Backend API',
        status: 'online',
        endpoints: {
            health: '/api/health',
            search: '/api/search',
            savedLeads: '/api/leads/saved'
        },
        demo_mode: process.env.DEMO_MODE === 'true'
    });
});

app.get(['/health', '/api/health'], (req, res) => {
    res.json({ status: 'ok', demo_mode: process.env.DEMO_MODE === 'true' });
});

// Mount routes on both /api and root / so any VITE_API_BASE_URL config works seamlessly
app.use('/api', apiRoutes);
app.use('/', apiRoutes);


app.listen(PORT, () => {
    console.log(`LeadHunter Backend running on port ${PORT}`);
    if (process.env.DEMO_MODE === 'true') {
        console.log('DEMO_MODE is ENABLED. Using mock data.');
    }
    
    const groqKey1 = !!process.env.GROQ_API_KEY_1;
    const groqKey2 = !!process.env.GROQ_API_KEY_2;
    console.log(`Groq Analysis API key configured: ${groqKey1}`);
    console.log(`Groq WhatsApp API key configured: ${groqKey2}`);
    
    if (!groqKey1 || !groqKey2) {
        console.error("STARTUP ERROR: Both GROQ_API_KEY_1 and GROQ_API_KEY_2 must be configured in .env");
    }
});

export default app;
