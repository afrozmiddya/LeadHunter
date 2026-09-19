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
            place_id: leadData.id,
            name: leadData.displayName?.text,
            category: leadData.primaryType,
            rating: leadData.rating,
            review_count: leadData.userRatingCount,
            phone: leadData.nationalPhoneNumber,
            website_url: leadData.websiteUri,
            website_status: leadData.websiteStatus,
            address: leadData.formattedAddress,
            google_maps_url: leadData.googleMapsUri,
            lead_score: leadData.leadScore,
            lead_priority: leadData.leadPriority,
            lead_reason: leadData.leadReason,
            website_features: leadData.websiteFeatures
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
        saved_at: item.created_at,
        notes: item.notes
    }));
}

export async function getLeadById(id: string) {}
export async function exportLeads() {}
