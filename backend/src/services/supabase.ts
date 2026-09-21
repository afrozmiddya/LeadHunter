import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

// Mock db for DEMO_MODE
let mockSavedLeads: any[] = [];

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export async function saveLead(leadData: any) {
    if (process.env.DEMO_MODE === 'true' || !supabase) {
        mockSavedLeads.push({ ...leadData, savedAt: new Date() });
        return { id: 'mock-id' };
    }

    // Upsert business
    const { data: business, error: bizError } = await supabase
        .from('businesses')
        .upsert({
            place_id: leadData.id || leadData.place_id || 'unknown',
            name: leadData.displayName?.text || leadData.name,
            category: leadData.primaryType || leadData.category,
            rating: leadData.rating,
            review_count: leadData.userRatingCount || leadData.review_count,
            phone: leadData.nationalPhoneNumber || leadData.phone,
            website_url: leadData.websiteUri || leadData.website_url,
            website_status: leadData.websiteStatus || leadData.website_status,
            address: leadData.formattedAddress || leadData.address,
            google_maps_url: leadData.googleMapsUri || leadData.google_maps_url,
            lead_score: leadData.leadScore || leadData.lead_score,
            lead_priority: leadData.leadPriority || leadData.lead_priority,
            lead_reason: leadData.leadReason || leadData.lead_reason,
            website_features: leadData.websiteFeatures || leadData.website_features,
            business_analysis: leadData.businessAnalysis || leadData.business_analysis,
            opportunities: leadData.opportunities,
            recommended_services: leadData.recommendedServices || leadData.recommended_services,
            whatsapp_message: leadData.whatsappMessage || leadData.whatsapp_message,
            message_generated_at: leadData.messageGeneratedAt || leadData.message_generated_at,
            message_edited_at: leadData.messageEditedAt || leadData.message_edited_at,
            outreach_status: leadData.outreachStatus || leadData.outreach_status || 'Not Contacted'
        }, { onConflict: 'place_id' })
        .select()
        .single();

    if (bizError) throw bizError;

    // Save to saved_leads
    const { error: saveError } = await supabase
        .from('saved_leads')
        .upsert({
            business_id: business.id
        }, { onConflict: 'business_id' });

    if (saveError) throw saveError;

    return business;
}

export async function getSavedLeads() {
    if (process.env.DEMO_MODE === 'true' || !supabase) {
        return mockSavedLeads;
    }

    const { data, error } = await supabase
        .from('saved_leads')
        .select('*, businesses(*)');
        
    if (error) throw error;
    
    return data.map(item => ({
        ...item.businesses,
        id: item.businesses.place_id,
        displayName: { text: item.businesses.name },
        primaryType: item.businesses.category,
        rating: item.businesses.rating,
        userRatingCount: item.businesses.review_count,
        nationalPhoneNumber: item.businesses.phone,
        websiteUri: item.businesses.website_url,
        websiteStatus: item.businesses.website_status,
        formattedAddress: item.businesses.address,
        googleMapsUri: item.businesses.google_maps_url,
        leadScore: item.businesses.lead_score,
        leadPriority: item.businesses.lead_priority,
        leadReason: item.businesses.lead_reason,
        websiteFeatures: item.businesses.website_features,
        businessAnalysis: item.businesses.business_analysis,
        opportunities: item.businesses.opportunities,
        recommendedServices: item.businesses.recommended_services,
        whatsappMessage: item.businesses.whatsapp_message,
        messageGeneratedAt: item.businesses.message_generated_at,
        messageEditedAt: item.businesses.message_edited_at,
        outreachStatus: item.businesses.outreach_status,
        saved_at: item.created_at,
        notes: item.notes
    }));
}

export async function getLeadById(id: string) {}
export async function exportLeads() {}
