-- Supabase Schema for LeadHunter

-- Businesses Table (Cache and Analysis)
CREATE TABLE businesses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    place_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    category TEXT,
    rating NUMERIC,
    review_count INTEGER,
    phone TEXT,
    website_url TEXT,
    website_status TEXT DEFAULT 'NOT_VERIFIED', -- VERIFIED_NO_WEBSITE, WEBSITE_FOUND, UNCERTAIN, NOT_VERIFIED
    address TEXT,
    latitude NUMERIC,
    longitude NUMERIC,
    google_maps_url TEXT,
    lead_score INTEGER,
    lead_priority TEXT, -- HIGH, MEDIUM, LOW
    lead_reason TEXT,
    website_features JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved Leads Table
CREATE TABLE saved_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(business_id)
);

-- Search History Table
CREATE TABLE searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    min_rating NUMERIC,
    min_reviews INTEGER,
    max_results INTEGER,
    result_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_businesses_place_id ON businesses(place_id);
CREATE INDEX idx_saved_leads_business_id ON saved_leads(business_id);
