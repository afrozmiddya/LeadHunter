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

                // Analyze and enhance with Gemini
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

export default router;
