# LeadHunter (Frontend)

Modern, high-converting B2B lead generation & outreach platform for web development agencies and freelancers. Searches Google Maps for high-opportunity businesses without websites, scores them, and generates tailored AI outreach messages.

## Tech Stack
- **Framework**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS, PostCSS, Lucide Icons
- **HTTP Client**: Axios
- **Deployment**: Vercel

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Set `VITE_API_BASE_URL` to point to your LeadHunter backend (e.g. `http://localhost:3001/api` for local or your deployed Render backend URL).

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

## Vercel Deployment
This repository is configured to deploy directly to Vercel:
1. Import this repository into Vercel.
2. Framework Preset: **Vite**
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. In **Environment Variables**, set:
   - `VITE_API_BASE_URL`: URL to your live LeadHunter backend (e.g. `https://your-backend.onrender.com/api`).
