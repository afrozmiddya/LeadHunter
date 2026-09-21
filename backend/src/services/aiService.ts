import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY_1 = process.env.GROQ_API_KEY_1 || '';
const API_KEY_2 = process.env.GROQ_API_KEY_2 || '';

const groq1 = API_KEY_1 ? new Groq({ apiKey: API_KEY_1 }) : null;
const groq2 = API_KEY_2 ? new Groq({ apiKey: API_KEY_2 }) : null;
const MODEL_NAME = 'openai/gpt-oss-120b'; 

function handleGroqError(error: any, endpointContext: 'analysis' | 'whatsapp') {
    const status = error.status || (error.response && error.response.status) || 500;
    const errorMessage = error.message?.toLowerCase() || '';
    const errorDetails = error.error?.error?.message?.toLowerCase() || '';
    
    console.error(`Groq API Error [${status}] on ${endpointContext}:`, error.message || "Unknown error");

    const contextMessage = endpointContext === 'analysis' 
        ? "AI business analysis is temporarily unavailable." 
        : "Personalized WhatsApp generation is temporarily unavailable.";

    if (status === 400) {
        throw { status: 400, message: "Invalid AI request." };
    }
    if (status === 401 || status === 403 || errorMessage.includes('api key') || errorDetails.includes('api key')) {
        throw { status: 401, message: "Invalid or unauthorized Groq API key." };
    }
    if (status === 429 || errorMessage.includes('rate limit') || errorDetails.includes('rate limit')) {
        throw { status: 429, message: "Groq rate limit reached." };
    }
    if (status >= 500) {
        throw { status: status, message: contextMessage };
    }

    throw { status: 500, message: contextMessage };
}

export async function analyzeLeadBusiness(lead: any) {
    if (!groq1 || process.env.DEMO_MODE === 'true') {
        throw { status: 400, message: "Invalid or unauthorized Groq API key." };
    }

    console.log(`[AI Analysis Started] Model: ${MODEL_NAME}, Business: ${lead.name || lead.displayName?.text || 'Unknown'}`);

    const prompt = `
You are a highly analytical business consultant specializing in digital presence and web development.
Analyze the following local business data to deeply understand their operations, digital footprint, and identify concrete opportunities where web development/digital services could help them grow.
DO NOT invent facts about this business. If information is missing, state it as an assumption or hypothesis.

Business Data:
Name: ${lead.name || lead.displayName?.text || 'Unknown'}
Category: ${lead.category || lead.primaryType || 'Unknown'}
Rating: ${lead.rating || 'N/A'}
Review Count: ${lead.review_count || lead.userRatingCount || 'N/A'}
Phone: ${lead.phone || lead.nationalPhoneNumber || 'N/A'}
Address: ${lead.address || lead.formattedAddress || 'N/A'}
Website: ${lead.websiteUri || lead.website_url || 'N/A'}
Website Status: ${lead.website_status || 'NOT_VERIFIED'}

Return a strictly formatted JSON object matching this schema exactly:
{
  "businessSummary": "A 1-2 sentence description of what this business likely does.",
  "businessType": "Short category label",
  "onlinePresence": {
    "website": true or false,
    "websiteQuality": "Assessment of website based on available data",
    "socialMedia": true or false,
    "googlePresence": true or false
  },
  "websiteAssessment": "Detailed evaluation of website potential",
  "socialMediaAssessment": "Evaluation of social footprint",
  "digitalWeaknesses": ["String array of 3-5 specific digital weaknesses"],
  "growthOpportunities": ["String array of 3-5 specific growth opportunities"],
  "recommendedServices": ["String array of 3-5 services to pitch"],
  "leadScore": 78 (Number 0-100 indicating quality of lead based on rating/reviews/website gap),
  "priority": "HIGH or MEDIUM or LOW",
  "outreachStrategy": "1-2 sentences on how to approach them",
  "keySellingPoints": ["String array of 2-3 main selling points for this specific business"]
}
`;

    try {
        const completion = await groq1.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: MODEL_NAME,
            response_format: { type: "json_object" }
        });
        
        console.log(`[AI Analysis Completed] Business: ${lead.name || lead.displayName?.text || 'Unknown'}`);
        
        const text = completion.choices[0]?.message?.content || "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        
        return JSON.parse(text);
    } catch (error: any) {
        console.error(`[AI Analysis Failed] Business: ${lead.name || lead.displayName?.text || 'Unknown'}`);
        if (error.status && error.message && !error.response) throw error; // Already parsed
        return handleGroqError(error, 'analysis');
    }
}

export async function generateWhatsAppMessage(lead: any, businessAnalysis: any) {
    if (!groq2 || process.env.DEMO_MODE === 'true') {
        throw { status: 400, message: "Invalid or unauthorized Groq API key." };
    }

    console.log(`[AI Message Generation Started] Model: ${MODEL_NAME}, Business: ${lead.name || lead.displayName?.text || 'Unknown'}`);

    const prompt = `
You are an expert sales consultant writing a highly personalized WhatsApp outreach message to a potential web development client.
The goal is to get a positive response by being insightful, human, and concise (70-150 words).

Business Details:
Name: ${lead.name || lead.displayName?.text || 'Unknown'}
Category: ${lead.category || lead.primaryType || 'Unknown'}
Location: ${lead.address || lead.formattedAddress || 'N/A'}

Analysis Context:
Digital Weaknesses: ${businessAnalysis?.digitalWeaknesses?.join(', ')}
Growth Opportunities: ${businessAnalysis?.growthOpportunities?.join(', ')}
Recommended Services: ${businessAnalysis?.recommendedServices?.join(', ')}
Key Selling Points: ${businessAnalysis?.keySellingPoints?.join(', ')}
Outreach Strategy: ${businessAnalysis?.outreachStrategy}

RULES:
- Mention the business naturally (e.g. "Hi [Business Name] team").
- Clearly show that the business was researched based on the context.
- Identify a specific relevant opportunity/problem from the Digital Weaknesses.
- Explain how our service can help based on Recommended Services.
- Avoid generic spam language.
- Avoid unsupported claims.
- Sound like a genuine one-to-one business outreach message.
- Provide a clear but non-pushy CTA (e.g. "Open to seeing a quick concept?").
- Do NOT include placeholders like [Your Name]. Just write the message body directly.
- Return ONLY the raw text of the WhatsApp message. Do not use JSON.
`;

    try {
        const completion = await groq2.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: MODEL_NAME,
        });
        
        console.log(`[AI Message Generation Completed] Business: ${lead.name || lead.displayName?.text || 'Unknown'}`);
        const msg = completion.choices[0]?.message?.content?.trim() || "";
        
        // Return exactly as requested in endpoint
        return { message: msg };
    } catch (error: any) {
        console.error(`[AI Message Generation Failed] Business: ${lead.name || lead.displayName?.text || 'Unknown'}`);
        if (error.status && error.message && !error.response) throw error; // Already parsed
        return handleGroqError(error, 'whatsapp');
    }
}
