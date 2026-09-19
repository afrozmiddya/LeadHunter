import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle, MapPin, Star, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export default function LeadDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const lead = location.state?.lead;
  
  const [copied, setCopied] = useState(false);

  if (!lead) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-gray-500">No lead data found. Please return to search.</p>
        <button onClick={() => navigate('/search')} className="text-indigo-600 font-medium">Go to Search</button>
      </div>
    );
  }

  const name = lead.displayName?.text || 'Unknown Business';
  const phone = lead.nationalPhoneNumber;
  const mapsUrl = lead.googleMapsUri;
  const rating = lead.rating || 'N/A';
  const reviews = lead.userRatingCount || 'N/A';
  const address = lead.formattedAddress || 'N/A';

  const handleWhatsApp = () => {
    if (phone) {
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      window.open(`https://wa.me/91${cleanPhone.replace(/^0/, '')}`, '_blank');
    }
  };

  const handleCopyOutreach = () => {
    navigator.clipboard.writeText(lead.outreachAngle);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <Link to="/search" className="text-sm font-medium text-gray-500 flex items-center gap-2 hover:text-gray-900 w-fit">
        <ArrowLeft className="h-4 w-4" /> Back to Leads
      </Link>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
            <p className="text-md text-gray-500 capitalize mt-1">{lead.primaryType?.replace(/_/g, ' ') || 'N/A'}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-700">
              <span className="flex items-center gap-1"><Star className="h-5 w-5 text-yellow-400 fill-current" /> <span className="font-bold text-lg">{rating}</span> ({reviews} Reviews)</span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold border border-indigo-100">
              {lead.leadPriority} PRIORITY
            </span>
            <p className="text-sm text-gray-500 mt-2 font-medium">Score: {lead.leadScore}/100</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-b">
          <div className="space-y-4">
            <h2 className="text-xs font-bold tracking-wider text-gray-500 uppercase">Contact Information</h2>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{phone || 'N/A'}</p>
                <p className="text-sm text-gray-500">Phone</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">{address}</p>
                <p className="text-sm text-gray-500">Address</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xs font-bold tracking-wider text-gray-500 uppercase">Web Presence</h2>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Status: <strong className="text-gray-900">{lead.websiteVerification?.status?.replace(/_/g, ' ') || 'NOT VERIFIED'}</strong></p>
              <p className="text-sm text-gray-600 mb-1">Confidence: <strong className="text-gray-900">{lead.websiteVerification?.confidence || 0}%</strong></p>
              <p className="text-sm text-gray-600 mb-1">Source: <strong className="text-gray-900">{lead.websiteVerification?.source || 'N/A'}</strong></p>
              <p className="text-sm text-gray-600 mt-3 italic">{lead.websiteVerification?.reason || 'No verification data.'}</p>
            </div>
          </div>
        </div>

        <div className="py-8 border-b">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Why This Is a Potential Lead</h2>
          <p className="text-gray-700 leading-relaxed">{lead.leadReason}</p>
        </div>

        <div className="py-8 border-b grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Website Opportunity</h2>
            <ul className="space-y-2">
              {lead.websiteFeatures?.map((f: string, i: number) => (
                <li key={i} className="flex items-center gap-2 text-gray-700">
                  <CheckCircle className="h-4 w-4 text-green-500" /> {f}
                </li>
              ))}
            </ul>
          </div>
          <div>
             <h2 className="text-xl font-bold text-gray-900 mb-4">Outreach Angle</h2>
             <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 relative group">
                <p className="text-indigo-900 text-sm italic">"{lead.outreachAngle}"</p>
                <button 
                  onClick={handleCopyOutreach}
                  className="absolute top-2 right-2 p-2 bg-white rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs font-medium text-gray-700 hover:text-indigo-600"
                >
                  {copied ? <CheckCircle className="h-3 w-3 text-green-600"/> : <Copy className="h-3 w-3"/>}
                  {copied ? 'Copied' : 'Copy'}
                </button>
             </div>
          </div>
        </div>

        <div className="pt-8 flex flex-wrap items-center gap-4">
          <button onClick={handleWhatsApp} disabled={!phone} className="flex-1 flex justify-center items-center gap-2 px-6 py-3 bg-[#25D366] text-white rounded-lg font-medium hover:bg-[#128C7E] transition-colors disabled:opacity-50">
            <MessageCircle className="h-5 w-5" /> WhatsApp
          </button>
          
          <button onClick={() => { if(phone) window.open(`tel:${phone.replace(/[^0-9+]/g, '')}`, '_self'); }} disabled={!phone} className="flex-1 flex justify-center items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
            <Phone className="h-5 w-5" /> Call Business
          </button>

          <button onClick={() => { if(mapsUrl) window.open(mapsUrl, '_blank'); }} disabled={!mapsUrl} className="flex-1 flex justify-center items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50">
            <MapPin className="h-5 w-5" /> Google Profile
          </button>
        </div>

      </div>
    </div>
  );
}
