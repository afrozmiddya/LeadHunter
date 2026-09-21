import { Router } from 'express';
import { searchPlaces } from '../services/google';
import { analyzeLead } from '../services/analysis';
import { verifyWebsiteStatus } from '../services/websiteVerificationService';
import { saveLead, getSavedLeads } from '../services/supabase';

const router = Router();

router.post('/search', async (req, res) => {
    try {
        const { location, category, minRating = 4.3, minReviews = 100, maxResults = 25, websiteFilter = 'NO_WEBSITE_DETECTED' } = req.body;
        
        if (!location || !category) {
            return res.status(400).json({ error: 'Location and category are required' });
        }

        const places = await searchPlaces(`${category} in ${location}`, maxResults * 2); // Over-fetch to allow filtering
        
        const leads = [];
        for (const place of places) {
            const rating = place.rating || 0;
            const reviews = place.userRatingCount || 0;

            if (rating >= minRating && reviews >= minReviews) {
                // Phase 1: Robust Website Verification
                const verification = await verifyWebsiteStatus(
                    place.displayName?.text || '',
                    location,
                    category,
                    place
                );

                // Filter based on requested website status
                if (websiteFilter !== 'ALL' && verification.status !== websiteFilter && websiteFilter !== 'NOT_VERIFIED') {
                    if (websiteFilter === 'NO_WEBSITE_DETECTED' && verification.status === 'WEBSITE_FOUND') {
                        continue; // Skip if we found a website and they only want NO_WEBSITE
                    }
                    if (websiteFilter === 'WEBSITE_FOUND' && verification.status !== 'WEBSITE_FOUND') {
                        continue;
                    }
                }

                // Analyze and enhance with Groq
                const analysis = await analyzeLead(place, category, verification);
                
                leads.push({
                    ...place,
                    ...analysis
                });
            }

            if (leads.length >= maxResults) break;
        }

        res.json({ results: leads, count: leads.length });
    } catch (error: any) {
        console.error('Search error:', error);
        res.status(500).json({ error: 'Failed to search places', details: error.message });
    }
});

router.get('/leads/saved', async (req, res) => {
    try {
        const leads = await getSavedLeads();
        res.json({ results: leads });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch saved leads' });
    }
});

router.post('/leads/:id/save', async (req, res) => {
    try {
        const lead = req.body;
        const saved = await saveLead(lead);
        res.json({ success: true, saved });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to save lead' });
    }
});

router.post('/leads/export', (req, res) => {
    try {
        const { leads } = req.body;
        
        if (!leads || !Array.isArray(leads)) {
            return res.status(400).json({ error: 'Leads array required' });
        }

        const columns = [
            'Business Name', 'Category', 'Rating', 'Review Count', 
            'Website Status', 'Website URL', 'Verification Confidence', 
            'Phone', 'Address', 'Latitude', 'Longitude', 
            'Google Maps URL', 'Lead Priority', 'Lead Score', 
            'Why Potential', 'Suggested Website Features'
        ];

        const escapeCSV = (str: any) => {
            if (str === null || str === undefined) return '"N/A"';
            const s = String(str).replace(/"/g, '""');
            return `"${s}"`;
        };

        const rows = leads.map(lead => {
            return [
                lead.displayName?.text,
                lead.primaryType,
                lead.rating,
                lead.userRatingCount,
                lead.websiteVerification?.status || lead.websiteStatus,
                lead.websiteVerification?.websiteUrl || '',
                lead.websiteVerification?.confidence || 0,
                lead.nationalPhoneNumber || 'N/A',
                lead.formattedAddress || 'N/A',
                lead.location?.latitude || 'N/A',
                lead.location?.longitude || 'N/A',
                lead.googleMapsUri || 'N/A',
                lead.leadPriority,
                lead.leadScore,
                lead.leadReason,
                Array.isArray(lead.websiteFeatures) ? lead.websiteFeatures.join(', ') : ''
            ].map(escapeCSV).join(',');
        });

        const csv = [columns.map(escapeCSV).join(','), ...rows].join('\n');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="leadhunter-leads.csv"');
        res.send(csv);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to export CSV' });
    }
});

import { analyzeLeadBusiness, generateWhatsAppMessage } from '../services/aiService';

router.post('/leads/:id/analyze', async (req, res) => {
    try {
        const { lead } = req.body;
        if (!lead) return res.status(400).json({ error: 'Lead data required' });
        
        const analysis = await analyzeLeadBusiness(lead);
        res.json({ analysis });
    } catch (error: any) {
        const status = error.status || 500;
        const message = error.message || 'Failed to analyze business';
        res.status(status).json({ error: message, details: error.details });
    }
});

router.post('/leads/:id/whatsapp', async (req, res) => {
    try {
        const { lead, businessAnalysis } = req.body;
        if (!lead || !businessAnalysis) return res.status(400).json({ error: 'Lead data and businessAnalysis required' });
        
        const result = await generateWhatsAppMessage(lead, businessAnalysis);
        // generateWhatsAppMessage already returns { message: "..." }
        res.json(result);
    } catch (error: any) {
        const status = error.status || 500;
        const message = error.message || 'Personalized WhatsApp generation is temporarily unavailable.';
        res.status(status).json({ error: message });
    }
});

// Assuming frontend sends the full updated lead to /save or this specific endpoint
router.put('/leads/:id/outreach-message', async (req, res) => {
    try {
        const { lead } = req.body;
        if (!lead) return res.status(400).json({ error: 'Lead data required' });
        
        const saved = await saveLead(lead); // Upserts the lead with the new fields
        res.json({ success: true, saved });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to save outreach message', details: error.message });
    }
});

export default router;
