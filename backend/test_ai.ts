import * as dotenv from 'dotenv';
import { analyzeLeadBusiness, generateWhatsAppMessage } from './src/services/aiService';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const testLead = {
  name: "Dr. Smith's Dental Clinic",
  category: "Dentist",
  rating: 4.8,
  review_count: 312,
  formattedAddress: "123 Main St, Kolkata",
  websiteUri: "http://smithdental.com",
  websiteStatus: "WEBSITE_FOUND",
  websiteVerification: {
     confidence: 100,
     reason: "Website found in Google Places"
  }
};

async function run() {
  try {
    console.log("Analyzing...");
    const analysis = await analyzeLeadBusiness(testLead);
    console.log(JSON.stringify(analysis, null, 2));

    console.log("\nGenerating Message...");
    const msg: any = await generateWhatsAppMessage(testLead, analysis, "Friendly + Professional");
    console.log(msg.message);
  } catch (e) {
    console.error(e);
  }
}

run();
