import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', demo_mode: process.env.DEMO_MODE === 'true' });
});

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
