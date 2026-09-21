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

    // Safely extract verification data if available
    const verificationConfidence = lead.websiteVerification?.confidence || 'N/A';
    const verificationReason = lead.websiteVerification?.reason || 'N/A';
    const originalWebsiteStatus = lead.websiteStatus || lead.website_status || 'NOT_VERIFIED';

    const prompt = `
You are a highly analytical business consultant specializing in digital presence and web development.
Analyze the following local business data to deeply understand their operations, digital footprint, and identify concrete opportunities.

CRITICAL INSTRUCTION: EVIDENCE-BASED ANALYSIS
- You MUST distinguish between VERIFIED FACT, INFERENCE, and UNKNOWN.
- Do NOT turn unknown information into facts. 
- If social media information is not explicitly provided, state it as UNKNOWN. Do not guess or hallucinate it.
- If you know a website exists but have no data on its UX, do not claim it has "poor conversion" or "bad mobile optimization". Use UNKNOWN for those aspects.
- Never claim revenue loss, lost customers, or poor performance without supplied evidence.

Business Data:
Name: ${lead.name || lead.displayName?.text || 'Unknown'}
Category: ${lead.category || lead.primaryType || 'Unknown'}
Rating: ${lead.rating || 'N/A'}
Review Count: ${lead.review_count || lead.userRatingCount || 'N/A'}
Phone: ${lead.phone || lead.nationalPhoneNumber || 'N/A'}
Address: ${lead.address || lead.formattedAddress || 'N/A'}
Website URL: ${lead.websiteUri || lead.website_url || 'N/A'}
Website Status: ${originalWebsiteStatus}
Verification Confidence: ${verificationConfidence}%
Verification Reason: ${verificationReason}

Return a strictly formatted JSON object matching this schema exactly:
{
  "businessSummary": "A 1-2 sentence description of what this business likely does.",
  "businessType": "Short category label",
  "evidence": ["String array of verified facts based ONLY on the supplied data above"],
  "onlinePresence": {
    "website": {
      "status": "FOUND | NOT_FOUND | NOT_VERIFIED",
      "quality": "GOOD | NEEDS_IMPROVEMENT | UNKNOWN",
      "evidence": ["Evidence supporting website status/quality"]
    },
    "socialMedia": {
      "status": "PRESENT | NOT_FOUND | UNKNOWN",
      "evidence": ["Evidence supporting social media status. If none provided, put UNKNOWN."]
    },
    "googlePresence": {
      "status": "STRONG | MODERATE | WEAK | UNKNOWN",
      "evidence": ["Evidence from rating/reviews"]
    }
  },
  "scenarios": [
    {
      "type": "e.g., NO_WEBSITE, WEBSITE_NEEDS_REDESIGN, NO_ONLINE_BOOKING, WHATSAPP_CONVERSION_OPPORTUNITY",
      "confidence": 0.0,
      "evidence": ["Evidence supporting this scenario"]
    }
  ],
  "primaryScenario": {
    "type": "The single most relevant/actionable scenario",
    "confidence": 0.0,
    "reason": "Why this scenario was chosen"
  },
  "digitalWeaknesses": ["String array of weaknesses (or state 'Unknown' if none verified)"],
  "growthOpportunities": ["String array of growth opportunities"],
  "recommendedServices": ["String array of services to pitch that specifically address the primary scenario"],
  "customerBenefits": ["String array of direct benefits the customer gets from those services"],
  "keySellingPoints": ["String array of selling points customized to this specific business"],
  "outreachStrategy": "1-2 sentences on how to approach them, based on the primary scenario",
  "ctaStrategy": "Description of the CTA (e.g., 'Offer a free homepage concept' or 'Offer a booking flow demo')",
  "unsupportedClaimsToAvoid": ["String array of claims you MUST NOT make in outreach because they lack evidence (e.g., 'Do not claim website has poor UX')"],
  "leadScore": 78,
  "priority": "HIGH | MEDIUM | LOW"
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
        if (error.status && error.message && !error.response) throw error; 
        return handleGroqError(error, 'analysis');
    }
}

export async function generateWhatsAppMessage(lead: any, businessAnalysis: any, tone: string = 'Friendly + Professional') {
    if (!groq2 || process.env.DEMO_MODE === 'true') {
        throw { status: 400, message: "Invalid or unauthorized Groq API key." };
    }

    console.log(`[AI Message Generation Started] Model: ${MODEL_NAME}, Business: ${lead.name || lead.displayName?.text || 'Unknown'}`);

    const prompt = `
You are an expert sales consultant writing a highly personalized, one-to-one WhatsApp outreach message to a potential web development client.

Business Details:
Name: ${lead.name || lead.displayName?.text || 'Unknown'}
Category: ${lead.category || lead.primaryType || 'Unknown'}
Location: ${lead.address || lead.formattedAddress || 'N/A'}
Rating: ${lead.rating || 'N/A'} (${lead.review_count || lead.userRatingCount || 0} reviews)

Analysis Context:
Primary Scenario: ${businessAnalysis?.primaryScenario?.type || 'UNKNOWN'} (Confidence: ${businessAnalysis?.primaryScenario?.confidence})
Scenario Reason: ${businessAnalysis?.primaryScenario?.reason}
Evidence: ${businessAnalysis?.evidence?.join(', ') || 'None'}
Digital Weaknesses: ${businessAnalysis?.digitalWeaknesses?.join(', ')}
Recommended Services: ${businessAnalysis?.recommendedServices?.join(', ')}
Customer Benefits: ${businessAnalysis?.customerBenefits?.join(', ')}
Outreach Strategy: ${businessAnalysis?.outreachStrategy}
CTA Strategy: ${businessAnalysis?.ctaStrategy}

Unsupported Claims to AVOID:
${businessAnalysis?.unsupportedClaimsToAvoid?.join('\n- ') || 'None'}

Requested Tone: ${tone}

CRITICAL RULES:
1. Do NOT make every message a generic "I build modern websites" pitch. Tailor the service completely to the Primary Scenario (e.g. if it's NO_ONLINE_BOOKING, focus ONLY on booking integration; if it's LOCAL_SEARCH_OPPORTUNITY, focus on local SEO).
2. Select ONE primary opportunity based on the context. Do NOT dump every weakness/service into the message.
3. Natural greeting and specific observation showing you actually researched them (e.g. mention their strong review count or specific gap).
4. Explain concrete customer/business benefit of the proposed solution.
5. Provide a low-friction CTA aligned with the CTA Strategy (e.g., "Would you like to see a quick booking flow demo?"). Do not always default to "quick concept".
6. Target Length: 50-100 words. Maximum: 120 words. Be concise.
7. Tone must strictly match the Requested Tone (${tone}).
8. Do NOT use fake compliments, exaggerated claims, or say they are losing customers/revenue without evidence.
9. Respect ALL "Unsupported Claims to AVOID" listed above.
10. Return ONLY the raw text of the WhatsApp message. Do not use JSON. Do not include placeholders like [Your Name].
`;

    try {
        const completion = await groq2.chat.completions.create({
            messages: [{ role: "system", content: prompt }],
            model: MODEL_NAME,
        });
        
        console.log(`[AI Message Generation Completed] Business: ${lead.name || lead.displayName?.text || 'Unknown'}`);
        const msg = completion.choices[0]?.message?.content?.trim() || "";
        
        return { message: msg };
    } catch (error: any) {
        console.error(`[AI Message Generation Failed] Business: ${lead.name || lead.displayName?.text || 'Unknown'}`);
        if (error.status && error.message && !error.response) throw error; 
        return handleGroqError(error, 'whatsapp');
    }
}

