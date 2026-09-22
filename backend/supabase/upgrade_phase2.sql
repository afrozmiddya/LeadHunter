-- Run this in your Supabase SQL Editor to upgrade the schema for Phase 2

ALTER TABLE businesses
ADD COLUMN IF NOT EXISTS business_analysis JSONB,
ADD COLUMN IF NOT EXISTS opportunities JSONB,
ADD COLUMN IF NOT EXISTS recommended_services JSONB,
ADD COLUMN IF NOT EXISTS whatsapp_message TEXT,
ADD COLUMN IF NOT EXISTS message_generated_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS message_edited_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS outreach_status TEXT DEFAULT 'Not Contacted';

-- Optional: Create an index for outreach_status
CREATE INDEX IF NOT EXISTS idx_businesses_outreach_status ON businesses(outreach_status);
