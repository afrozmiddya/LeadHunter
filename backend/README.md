# LeadHunter Backend API

REST API server for LeadHunter powering local business searches, website status verification, AI-driven opportunity analysis, and personalized outreach generation.

## Tech Stack
- **Runtime**: Node.js, Express, TypeScript
- **AI Engine**: Groq SDK (`openai/gpt-oss-120b` with dual-key rotation)
- **Database**: Supabase PostgreSQL
- **Integrations**: Google Places API (New), SerpApi (Verification)

## Prerequisites
- Node.js 18+
- Google Cloud Places API (New) Key
- Supabase Project & URL / Service Keys
- Groq API Key(s)
- SerpApi Key (for website verification)

## Setup & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and fill in your API credentials:
```bash
cp .env.example .env
```

### 3. Database Migration
Run the SQL scripts in `supabase/schema.sql` and `supabase/upgrade_phase2.sql` in your Supabase SQL Editor.

### 4. Run Development Server
```bash
npm run dev
```
The server will run on `http://localhost:3001`.

### 5. Build for Production
```bash
npm run build
npm start
```

## Deployment (Render / Railway)
- **Root Directory**: `.` (or `backend/` if deploying from monorepo)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- Add all required environment variables from `.env.example` into your host's dashboard.
