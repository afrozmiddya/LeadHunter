import { Link } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, Globe, Star, ArrowRight, CheckCircle } from 'lucide-react';

export default function LeadCard({ lead }: { lead: any }) {
  const name = lead.displayName?.text || 'Unknown Business';
  const phone = lead.nationalPhoneNumber;
  const mapsUrl = lead.googleMapsUri;
  const rating = lead.rating || 'N/A';
  const reviews = lead.userRatingCount || 'N/A';
  
  const handleWhatsApp = () => {
    if (phone) {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/91${cleanPhone.replace(/^0/, '')}`, '_blank');
    }
  };

  const handleCall = () => {
    if (phone) window.open(`tel:${phone.replace(/[^0-9+]/g, '')}`, '_self');
  };

  const handleMaps = () => {
    if (mapsUrl) window.open(mapsUrl, '_blank');
  };

  const getWebsiteBadgeColor = () => {
    switch(lead.websiteVerification?.status) {
      case 'WEBSITE_FOUND': return 'text-green-600 bg-green-50 border-green-200';
      case 'NO_WEBSITE_DETECTED': return 'text-red-600 bg-red-50 border-red-200';
      case 'UNCERTAIN': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = () => {
    switch(lead.leadPriority) {
      case 'HIGH': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'MEDIUM': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-500 capitalize">{lead.primaryType?.replace(/_/g, ' ') || 'N/A'}</p>
          
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-700">
            <span className="flex items-center gap-1"><Star className="h-4 w-4 text-yellow-400 fill-current" /> {rating} ({reviews} reviews)</span>
            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getWebsiteBadgeColor()}`}>
              <Globe className="h-3 w-3" /> {lead.websiteVerification?.status?.replace(/_/g, ' ') || 'NOT VERIFIED'}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mt-3 max-w-2xl line-clamp-2">
            <span className="font-semibold text-gray-900">Why this is a lead: </span>
            {lead.leadReason}
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor()}`}>
            {lead.leadPriority || lead.lead_priority || 'UNKNOWN'} PRIORITY
          </div>
          {(lead.saved_at || lead.outreachStatus || lead.outreach_status) && (
            <div className="flex flex-col items-end gap-1">
              <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-md border border-green-200">
                <CheckCircle className="h-3 w-3" /> Saved
              </span>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200">
                {lead.outreachStatus || lead.outreach_status || 'Not Contacted'}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button 
          onClick={handleWhatsApp} 
          disabled={!phone}
          className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-md text-sm font-medium hover:bg-[#128C7E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MessageCircle className="h-4 w-4" /> {phone ? 'WhatsApp' : 'WhatsApp unavailable'}
        </button>
        
        <button 
          onClick={handleCall}
          disabled={!phone}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Phone className="h-4 w-4" /> {phone ? 'Call' : 'Call unavailable'}
        </button>

        <button 
          onClick={handleMaps}
          disabled={!mapsUrl}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MapPin className="h-4 w-4" /> {mapsUrl ? 'Google Profile' : 'Profile unavailable'}
        </button>
        
        <div className="flex-1"></div>

        <Link to={`/leads/${lead.id || lead.place_id}`} state={{ lead }} className="flex items-center gap-1 text-indigo-600 font-medium text-sm hover:text-indigo-800">
          View Lead <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
