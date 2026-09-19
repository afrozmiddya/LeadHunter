import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GOOGLE_API_KEY;
const PLACES_API_URL = 'https://places.googleapis.com/v1/places:searchText';

export async function searchPlaces(query: string, maxResults: number) {
    if (process.env.DEMO_MODE === 'true') {
        return getMockData();
    }

    if (!API_KEY) {
        throw new Error("GOOGLE_API_KEY is not configured.");
    }

    const headers = {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': API_KEY,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.rating,places.userRatingCount,places.websiteUri,places.formattedAddress,places.nationalPhoneNumber,places.googleMapsUri,places.primaryType,places.location,nextPageToken'
    };

    let allPlaces: any[] = [];
    let pageToken = '';

    while (allPlaces.length < maxResults) {
        const data: any = {
            textQuery: query,
            languageCode: "en",
            pageSize: Math.min(20, maxResults - allPlaces.length) // Fetch up to 20 per request
        };

        if (pageToken) {
            data.pageToken = pageToken;
        }

        try {
            const response = await axios.post(PLACES_API_URL, data, { headers });
            const places = response.data.places || [];
            allPlaces = allPlaces.concat(places);

            pageToken = response.data.nextPageToken;
            if (!pageToken) {
                break; // No more results available
            }
        } catch (error: any) {
            console.error("Google API Error:", error.response?.data || error.message);
            throw error;
        }
    }

    // Deduplicate by id
    const uniqueMap = new Map();
    for (const p of allPlaces) {
        if (!uniqueMap.has(p.id)) {
            uniqueMap.set(p.id, p);
        }
    }
    
    return Array.from(uniqueMap.values()).slice(0, maxResults);
}

function getMockData() {
    return [
        {
            id: "ChIJxe_lYAV3AjoRPzxqGSY1Emw",
            displayName: { text: "Mocambo Restaurant and Bar" },
            rating: 4.8,
            userRatingCount: 2150,
            formattedAddress: "Park Street area, Kolkata, West Bengal 700016, India",
            nationalPhoneNumber: "094480 40531",
            googleMapsUri: "https://maps.google.com/?cid=123",
            primaryType: "coffee_shop",
            location: { latitude: 22.553, longitude: 88.352 }
        },
        {
            id: "ChIJPzyt0mV7AjoRFFk8eX5NluI",
            displayName: { text: "Motherland Cafe" },
            rating: 4.7,
            userRatingCount: 2219,
            formattedAddress: "Taltala, Kolkata, West Bengal 700016, India",
            nationalPhoneNumber: "097480 77790",
            googleMapsUri: "https://maps.google.com/?cid=456",
            primaryType: "cafe",
            location: { latitude: 22.555, longitude: 88.355 }
        },
        {
            id: "ChIJPzyt0mV7AjoRFFk8eX5NluZZ",
            displayName: { text: "Art Cafe" },
            rating: 4.6,
            userRatingCount: 1986,
            formattedAddress: "Lake Market, Kolkata, West Bengal 700029, India",
            nationalPhoneNumber: "098303 02247",
            googleMapsUri: "https://maps.google.com/?cid=789",
            primaryType: "cafe",
            location: { latitude: 22.512, longitude: 88.349 }
        }
    ];
}
