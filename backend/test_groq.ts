import { analyzeLeadBusiness, generateWhatsAppMessage } from './src/services/aiService';

async function testGroq() {
    const mockLead = {
        name: "Test Dental Clinic",
        category: "Dentist",
        rating: 4.8,
        review_count: 120,
        address: "Kolkata, WB",
        website_status: "NO_WEBSITE_DETECTED"
    };

    console.log("Analyzing business...");
    const analysis = await analyzeLeadBusiness(mockLead);
    console.log("Analysis:", JSON.stringify(analysis, null, 2));

    console.log("\nGenerating message...");
    const message = await generateWhatsAppMessage(mockLead, analysis);
    console.log("Message:\n", message);
}

testGroq().catch(console.error);
