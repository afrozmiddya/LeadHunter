# LeadHunter

LeadHunter is a comprehensive local-business lead generation tool built for web-development freelancers and agencies. It searches Google Maps for highly-rated businesses that do not have an official website, scores them based on reputation and opportunity, and provides immediate actionable outreach links (WhatsApp, Call, Google Profile).

## Architecture
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **Database**: Supabase PostgreSQL
- **Integrations**: Google Places API (New), Gemini API (for lead analysis)

## Prerequisites
1. **Google Cloud Project**: Enable the "Places API (New)". Get an API key.
2. **Supabase**: Create a new project and get your URL and Anon/Service keys.
3. **Gemini API**: Get a Gemini API key for AI-driven lead analysis.
4. **Node.js**: v18+ recommended.

## Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env` in the root folder (or backend folder) and fill in the values:
```bash
cp .env.example .env
```

### 2. Supabase Database
Execute the SQL in `supabase/schema.sql` in your Supabase project's SQL Editor to create the necessary tables.

### 3. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend will run on `http://localhost:3001`.

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:5173`.

## Demo Mode
If you want to test the UI without setting up APIs, set `DEMO_MODE=true` in your `.env` file. The backend will serve realistic mock data.

## Deployment
- **Frontend**: Deploy the `frontend/` directory to Vercel.
- **Backend**: Deploy the `backend/` directory to Render or Railway. Make sure to set all `.env` variables in your hosting provider.
- **Database**: Hosted on Supabase.

## API Cost Considerations
The Google Places API charges per request and by the fields requested. LeadHunter uses Field Masks (`X-Goog-FieldMask`) to request only the absolute necessary fields (id, displayName, rating, userRatingCount, websiteUri, etc.) to keep costs low. We deduplicate leads using `place_id`.

## Security Considerations
Never expose your `GOOGLE_API_KEY`, `GEMINI_API_KEY`, or `SUPABASE_SERVICE_ROLE_KEY` in the frontend codebase. All external API calls are securely routed through the backend.
