import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeLeadWithGemini(place: any, category: string, deterministicAnalysis: any) {
    if (!API_KEY || process.env.DEMO_MODE === 'true') {
        return deterministicAnalysis; // Fallback
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });

    const prompt = `
You are a Lead Generation AI for a web development agency.
Analyze the following local business data to generate outreach insights.
DO NOT invent facts about this business. Use ONLY the supplied business data.

Business Name: ${place.displayName?.text || 'Unknown'}
Category: ${category}
Rating: ${place.rating || 'N/A'}
Review Count: ${place.userRatingCount || 'N/A'}
Location: ${place.formattedAddress || 'N/A'}
Website Status: No official website detected

Output a JSON object with the following exact keys:
- "whyPotential": A factual 2-sentence explanation of why this business is a good lead for web development based on their strong reviews but lack of a website.
- "websiteFeatures": An array of 4-5 string suggestions for website features tailored to this specific category.
- "outreachAngle": A short, professional 2-sentence outreach message targeting this business, highlighting their strong Google presence and proposing a website.
`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        
        // Extract JSON safely
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            return {
                leadReason: data.whyPotential || deterministicAnalysis.leadReason,
                websiteFeatures: data.websiteFeatures || deterministicAnalysis.websiteFeatures,
                outreachAngle: data.outreachAngle || deterministicAnalysis.outreachAngle
            };
        }
    } catch (error) {
        console.error("Gemini API Error:", error);
    }
    
    return deterministicAnalysis; // Fallback on failure
}
