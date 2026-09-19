import axios from 'axios';

export interface VerificationResult {
    status: 'WEBSITE_FOUND' | 'NO_WEBSITE_DETECTED' | 'UNCERTAIN' | 'NOT_VERIFIED';
    websiteUrl: string | null;
    confidence: number;
    source: string;
    reason: string;
}

const IGNORED_DOMAINS = [
    'instagram.com', 'facebook.com', 'justdial.com', 'zomato.com', 
    'swiggy.com', 'indiamart.com', 'yelp.com', 'tripadvisor.com', 
    'google.com', 'business.site', 'twitter.com', 'linkedin.com', 'dineout.co.in'
];

export async function verifyWebsiteStatus(businessName: string, location: string, category: string, placeData: any): Promise<VerificationResult> {
    // If Google Places already provided a website, verify if it's not a social media link
    if (placeData.websiteUri) {
        const url = placeData.websiteUri.toLowerCase();
        const isIgnored = IGNORED_DOMAINS.some(domain => url.includes(domain));
        
        if (isIgnored) {
            return {
                status: 'NO_WEBSITE_DETECTED',
                websiteUrl: null,
                confidence: 90,
                source: 'Google Places (Filtered)',
                reason: 'Google Places returned a third-party directory/social link which is not an official website.'
            };
        }
        
        return {
            status: 'WEBSITE_FOUND',
            websiteUrl: placeData.websiteUri,
            confidence: 100,
            source: 'Google Places',
            reason: 'Official website URI provided by Google Places data.'
        };
    }

    // Step 2: Fallback external search verification using SerpApi
    const serpApiKey = process.env.SERPAPI_KEY;
    if (!serpApiKey || process.env.DEMO_MODE === 'true') {
        return {
            status: 'NOT_VERIFIED',
            websiteUrl: null,
            confidence: 50,
            source: 'Internal Heuristic',
            reason: 'No websiteUri in Google Places. Secondary web search is disabled or in Demo Mode.'
        };
    }

    try {
        const query = `${businessName} ${location} ${category} official website`;
        const response = await axios.get('https://serpapi.com/search.json', {
            params: {
                engine: 'google',
                q: query,
                api_key: serpApiKey,
                num: 5 // Only check the top 5 results
            }
        });

        const organicResults = response.data.organic_results || [];
        
        // Find the first result that is NOT an ignored domain
        const candidate = organicResults.find((result: any) => {
            const url = result.link ? result.link.toLowerCase() : '';
            return !IGNORED_DOMAINS.some(domain => url.includes(domain));
        });

        if (candidate) {
            return {
                status: 'WEBSITE_FOUND',
                websiteUrl: candidate.link,
                confidence: 85,
                source: 'External Web Search (SerpApi)',
                reason: `Found a potential official domain in top search results: ${candidate.link}`
            };
        }

        return {
            status: 'NO_WEBSITE_DETECTED',
            websiteUrl: null,
            confidence: 90,
            source: 'External Web Search (SerpApi)',
            reason: 'Searched Google directly, but only found third-party directories and social media profiles.'
        };
    } catch (e: any) {
        console.error('SerpApi Error:', e.message);
        return {
            status: 'UNCERTAIN',
            websiteUrl: null,
            confidence: 30,
            source: 'External Web Search (SerpApi)',
            reason: 'Secondary web search failed to execute properly.'
        };
    }
}
