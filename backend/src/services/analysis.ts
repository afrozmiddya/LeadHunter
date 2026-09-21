export async function analyzeLead(place: any, category: string, websiteVerification: any) {
    const reviews = place.userRatingCount || 0;
    const rating = place.rating || 0;
    
    // Priority Scoring (0-100 internally)
    let score = 0;
    
    score += Math.min(30, (rating - 4.0) * 10 + (reviews / 100)); // Reputation
    score += Math.min(20, (reviews / 50)); // Reviews volume
    
    if (websiteVerification.status === 'NO_WEBSITE_DETECTED') {
        score += 25; // Web Gap
    } else if (websiteVerification.status === 'NOT_VERIFIED') {
        score += 15;
    }
    
    score += 20; // Opportunity default

    let priority = 'LOW';
    if (score >= 80) priority = 'HIGH';
    else if (score >= 60) priority = 'MEDIUM';

    // Website Features (Deterministic)
    let features = ['Contact Form', 'Location & Hours', 'Mobile Optimized'];
    const lowerCat = category.toLowerCase();
    
    if (lowerCat.includes('restaurant') || lowerCat.includes('cafe')) {
        features = ['Digital Menu', 'Table Reservations', 'Gallery', 'WhatsApp Enquiry'];
    } else if (lowerCat.includes('dental') || lowerCat.includes('clinic')) {
        features = ['Doctor Profiles', 'Appointment Booking', 'Treatments', 'WhatsApp Enquiry'];
    } else if (lowerCat.includes('gym')) {
        features = ['Membership Plans', 'Trainer Profiles', 'Class Schedule', 'Free Trial Booking'];
    } else if (lowerCat.includes('salon')) {
        features = ['Services & Pricing', 'Appointment Booking', 'Gallery', 'WhatsApp Enquiry'];
    }

    const why = `Strong local reputation with ${reviews}+ reviews and a ${rating} rating, but ${websiteVerification.status === 'NO_WEBSITE_DETECTED' ? 'no official website was detected' : 'website presence is unverified'}. A dedicated website could provide: ${features.join(', ')}.`;

    return {
        leadScore: Math.round(score),
        leadPriority: priority,
        leadReason: why,
        websiteFeatures: features,
        websiteStatus: websiteVerification.status,
        websiteVerification: websiteVerification
    };
}
