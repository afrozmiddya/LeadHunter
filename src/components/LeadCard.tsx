import { Link } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, Globe, Star, ArrowRight, CheckCircle } from 'lucide-react';
import { cn } from './Layout';

export default function LeadCard({ lead }: { lead: any }) {
  const name = lead.displayName?.text || 'Unknown Business';
  const phone = lead.nationalPhoneNumber;
  const mapsUrl = lead.googleMapsUri;
  const rating = lead.rating || 'N/A';
  const reviews = lead.userRatingCount || 'N/A';
  
  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (phone) {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/91${cleanPhone.replace(/^0/, '')}`, '_blank');
    }
  };

  const handleCall = (e: React.MouseEvent) => {
    e.preventDefault();
    if (phone) window.open(`tel:${phone.replace(/[^0-9+]/g, '')}`, '_self');
  };

  const handleMaps = (e: React.MouseEvent) => {
    e.preventDefault();
    if (mapsUrl) window.open(mapsUrl, '_blank');
  };

  const getWebsiteBadgeColor = () => {
    switch(lead.websiteVerification?.status) {
      case 'WEBSITE_FOUND': return 'text-success bg-success/10 border-success/20';
      case 'NO_WEBSITE_DETECTED': return 'text-danger bg-danger/10 border-danger/20';
      case 'UNCERTAIN': return 'text-warning bg-warning/10 border-warning/20';
      default: return 'text-text-secondary bg-elevated border-border';
    }
  };

  const getPriorityColor = () => {
    const p = lead.leadPriority || lead.lead_priority;
    switch(p) {
      case 'HIGH': return 'bg-warning/10 text-warning border-warning/20';
      case 'MEDIUM': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-elevated text-text-secondary border-border';
    }
  };

  return (
    <div className="bg-surface rounded-xl border border-border shadow-sm hover:border-primary/50 transition-colors flex flex-col group">
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{name}</h3>
            <p className="text-sm text-text-secondary capitalize">{lead.primaryType?.replace(/_/g, ' ') || 'N/A'}</p>
          </div>
          
          <div className="flex flex-col items-end gap-2 shrink-0 ml-4">
            <div className={cn("px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold border", getPriorityColor())}>
              {lead.leadPriority || lead.lead_priority || 'UNKNOWN'} PRIORITY
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 text-sm font-medium text-text-secondary bg-elevated px-2.5 py-1 rounded-md border border-border">
            <Star className="h-3.5 w-3.5 text-warning fill-current" />
            <span className="text-text-primary">{rating}</span>
            <span className="text-text-tertiary font-normal">({reviews})</span>
          </div>
          
          <div className={cn("flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border", getWebsiteBadgeColor())}>
            <Globe className="h-3.5 w-3.5" /> 
            {lead.websiteVerification?.status?.replace(/_/g, ' ') || 'NOT VERIFIED'}
          </div>

          {(lead.saved_at || lead.outreachStatus || lead.outreach_status) && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border border-success/20 bg-success/10 text-success">
              <CheckCircle className="h-3.5 w-3.5" /> Saved
            </div>
          )}
        </div>

        <div className="bg-elevated/50 rounded-lg p-3 border border-border/50 text-sm mb-2">
          <p className="text-text-secondary line-clamp-2">
            <span className="font-semibold text-text-primary">Opportunity: </span>
            {lead.leadReason || 'High potential local business based on rating and web presence analysis.'}
          </p>
        </div>
      </div>

      <div className="px-5 py-4 border-t border-border flex flex-wrap items-center justify-between gap-3 bg-elevated/30">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleWhatsApp} 
            disabled={!phone}
            title="WhatsApp"
            className="flex items-center justify-center w-9 h-9 bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 border border-[#25D366]/20 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <MessageCircle className="h-4 w-4" />
          </button>
          
          <button 
            onClick={handleCall}
            disabled={!phone}
            title="Call"
            className="flex items-center justify-center w-9 h-9 bg-surface text-text-primary hover:bg-elevated border border-border rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Phone className="h-4 w-4" />
          </button>

          <button 
            onClick={handleMaps}
            disabled={!mapsUrl}
            title="Google Profile"
            className="flex items-center justify-center w-9 h-9 bg-surface text-text-secondary hover:text-text-primary hover:bg-elevated border border-border rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <MapPin className="h-4 w-4" />
          </button>
        </div>
        
        <Link 
          to={`/leads/${lead.id || lead.place_id}`} 
          state={{ lead }} 
          className="flex items-center gap-1.5 text-sm font-medium text-text-primary hover:text-primary transition-colors"
        >
          View details <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
