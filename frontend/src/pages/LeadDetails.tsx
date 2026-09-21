import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle, MapPin, Star, Copy, CheckCircle, Sparkles, RefreshCw, Edit2, Save, X } from 'lucide-react';
import { useState } from 'react';
import { api } from '../lib/api';

export default function LeadDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialLead = location.state?.lead;
  
  const [lead, setLead] = useState(initialLead);
  const [copied, setCopied] = useState(false);
  
  // Phase 2 AI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [businessAnalysis, setBusinessAnalysis] = useState<any>(lead?.businessAnalysis || null);
  const [whatsappMessage, setWhatsappMessage] = useState<string>(lead?.whatsappMessage || '');
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [editMessageContent, setEditMessageContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // We should update the local lead object if we successfully save
  const updateSavedLead = async (updatedFields: any) => {
      try {
          setIsSaving(true);
          const updatedLead = { ...lead, ...updatedFields };
          const response = await api.put(`/leads/${lead.id || 'temp'}/outreach-message`, { lead: updatedLead });
          if (response.data && response.data.saved) {
              setLead(response.data.saved);
          }
      } catch(e) {
          console.error("Failed to save updated lead", e);
      } finally {
          setIsSaving(false);
      }
  };

  if (!lead) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-gray-500">No lead data found. Please return to search.</p>
        <button onClick={() => navigate('/search')} className="text-indigo-600 font-medium">Go to Search</button>
      </div>
    );
  }

  const name = lead.displayName?.text || lead.name || 'Unknown Business';
  const phone = lead.nationalPhoneNumber || lead.phone;
  const mapsUrl = lead.googleMapsUri || lead.google_maps_url;
  const rating = lead.rating || 'N/A';
  const reviews = lead.userRatingCount || lead.review_count || 'N/A';
  const address = lead.formattedAddress || lead.address || 'N/A';
  const websiteStatus = lead.websiteVerification?.status || lead.websiteStatus || lead.website_status;

  const handleWhatsApp = () => {
    if (phone) {
      let cleanPhone = phone.replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
      if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

      if (whatsappMessage) {
        const encodedMessage = encodeURIComponent(whatsappMessage);
        window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
        updateSavedLead({ outreachStatus: 'Ready to Send' });
      } else {
        window.open(`https://wa.me/${cleanPhone}`, '_blank');
      }
    }
  };

  const handleCopyOutreach = () => {
    navigator.clipboard.writeText(whatsappMessage || lead.outreachAngle || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const analyzeBusiness = async () => {
    try {
      setIsAnalyzing(true);
      setErrorMsg('');
      const response = await api.post(`/leads/${lead.id || 'temp'}/analyze`, { lead });
      const data = response.data;
      setBusinessAnalysis(data.analysis);
      
      // Update backend record
      await updateSavedLead({ 
        businessAnalysis: data.analysis,
        opportunities: data.analysis.opportunities,
        recommendedServices: data.analysis.recommendedServices
      });
    } catch (e: any) {
      const apiError = e.response?.data?.error || e.message;
      setErrorMsg(apiError || "Unable to generate the analysis right now. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateMessage = async (tone = 'Friendly + Professional') => {
    if (!businessAnalysis) return;
    try {
      setIsGenerating(true);
      setErrorMsg('');
        const response = await api.post(`/leads/${lead.id || 'temp'}/whatsapp`, { lead, businessAnalysis, tone });
      const data = response.data;
      setWhatsappMessage(data.message);
      
      // Update backend record
      await updateSavedLead({ 
        whatsappMessage: data.message,
        messageGeneratedAt: new Date().toISOString(),
        outreachStatus: 'Message Generated'
      });
    } catch (e: any) {
      const apiError = e.response?.data?.error || e.message;
      setErrorMsg(apiError || "Unable to generate the message right now. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveEditedMessage = async () => {
      setWhatsappMessage(editMessageContent);
      setIsEditingMessage(false);
      await updateSavedLead({ 
        whatsappMessage: editMessageContent,
        messageEditedAt: new Date().toISOString(),
        outreachStatus: 'Message Generated (Edited)'
      });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <Link to="/search" className="text-sm font-medium text-gray-500 flex items-center gap-2 hover:text-gray-900 w-fit">
        <ArrowLeft className="h-4 w-4" /> Back to Leads
      </Link>
      
      {errorMsg && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
            {errorMsg}
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
            <p className="text-md text-gray-500 capitalize mt-1">{lead.primaryType?.replace(/_/g, ' ') || lead.category || 'N/A'}</p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-700">
              <span className="flex items-center gap-1"><Star className="h-5 w-5 text-yellow-400 fill-current" /> <span className="font-bold text-lg">{rating}</span> ({reviews} Reviews)</span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold border border-indigo-100">
              {businessAnalysis?.priority || lead.leadPriority || lead.lead_priority || 'N/A'} PRIORITY
            </span>
            <p className="text-sm text-gray-500 mt-2 font-medium">Score: {businessAnalysis?.leadScore || lead.leadScore || lead.lead_score || 'N/A'}/100</p>
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
              <p className="text-sm text-gray-600 mb-1">Status: <strong className="text-gray-900">{websiteStatus?.replace(/_/g, ' ') || 'NOT VERIFIED'}</strong></p>
              {lead.websiteVerification?.confidence && <p className="text-sm text-gray-600 mb-1">Confidence: <strong className="text-gray-900">{lead.websiteVerification.confidence}%</strong></p>}
              {lead.websiteVerification?.reason && <p className="text-sm text-gray-600 mt-3 italic">{lead.websiteVerification.reason}</p>}
            </div>
          </div>
        </div>

        {/* Phase 2: AI OUTREACH SECTION */}
        <div className="py-8 border-b">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500" /> AI Outreach & Analysis
            </h2>
            {!businessAnalysis && (
              <button 
                onClick={analyzeBusiness} 
                disabled={isAnalyzing}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2"
              >
                {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {isAnalyzing ? 'Analyzing...' : 'Analyze Business'}
              </button>
            )}
          </div>

          {businessAnalysis && (
            <div className="space-y-8">
              {/* Business Analysis Grid */}
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Business Summary</h3>
                    <p className="text-gray-700 text-sm">{businessAnalysis.businessSummary}</p>
                    <p className="text-gray-500 text-xs mt-2"><strong>Type:</strong> {businessAnalysis.businessType}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Digital Presence</h3>
                    <p className="text-gray-700 text-sm mb-1"><strong>Website:</strong> {businessAnalysis.websiteAssessment || (businessAnalysis.onlinePresence?.website ? 'Yes' : 'No')}</p>
                    <p className="text-gray-700 text-sm mb-1"><strong>Social:</strong> {businessAnalysis.socialMediaAssessment || (businessAnalysis.onlinePresence?.socialMedia ? 'Yes' : 'No')}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                   <div>
                     <h3 className="text-sm font-bold text-gray-900 mb-2">Digital Weaknesses</h3>
                     <ul className="space-y-1">
                        {(businessAnalysis.digitalWeaknesses || businessAnalysis.opportunities || [])?.map((opt: string, i: number) => (
                           <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" /> {opt}
                           </li>
                        ))}
                     </ul>
                   </div>
                   <div>
                     <h3 className="text-sm font-bold text-gray-900 mb-2">Growth Opportunities</h3>
                     <ul className="space-y-1">
                        {(businessAnalysis.growthOpportunities || businessAnalysis.recommendedServices || [])?.map((srv: string, i: number) => (
                           <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> {srv}
                           </li>
                        ))}
                     </ul>
                   </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                   <h3 className="text-sm font-bold text-gray-900 mb-2">Outreach Strategy</h3>
                   <p className="text-gray-700 text-sm">{businessAnalysis.outreachStrategy || 'Not generated'}</p>
                </div>
              </div>

              {/* WhatsApp Message Section */}
              <div>
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Personalised WhatsApp Message</h3>
                    {!whatsappMessage && (
                       <button 
                          onClick={() => generateMessage()} 
                          disabled={isGenerating}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                        >
                          {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                          {isGenerating ? 'Generating...' : 'Generate Message'}
                        </button>
                    )}
                 </div>

                 {whatsappMessage && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 relative">
                       {isEditingMessage ? (
                          <div className="space-y-3">
                             <textarea 
                                value={editMessageContent}
                                onChange={(e) => setEditMessageContent(e.target.value)}
                                className="w-full h-40 p-3 text-gray-800 rounded-lg border-2 border-indigo-300 focus:outline-none focus:border-indigo-500 text-sm"
                             />
                             <div className="flex justify-end gap-2">
                                <button onClick={() => setIsEditingMessage(false)} className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg flex items-center gap-1">
                                   <X className="h-4 w-4" /> Cancel
                                </button>
                                <button onClick={saveEditedMessage} disabled={isSaving} className="px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 rounded-lg flex items-center gap-1">
                                   {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save
                                </button>
                             </div>
                          </div>
                       ) : (
                          <>
                            <div className="whitespace-pre-wrap text-indigo-950 text-[15px] leading-relaxed pr-12">
                               {whatsappMessage}
                            </div>
                            <div className="absolute top-4 right-4 flex flex-col gap-2">
                               <button onClick={handleCopyOutreach} title="Copy Message" className="p-2 bg-white text-gray-600 hover:text-indigo-600 rounded-md shadow-sm border border-gray-200">
                                  {copied ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                               </button>
                               <button onClick={() => { setEditMessageContent(whatsappMessage); setIsEditingMessage(true); }} title="Edit Message" className="p-2 bg-white text-gray-600 hover:text-indigo-600 rounded-md shadow-sm border border-gray-200">
                                  <Edit2 className="h-4 w-4" />
                               </button>
                               <button onClick={() => generateMessage()} disabled={isGenerating} title="Regenerate" className="p-2 bg-white text-gray-600 hover:text-indigo-600 rounded-md shadow-sm border border-gray-200 disabled:opacity-50">
                                  <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                               </button>
                            </div>
                            <div className="mt-4 pt-4 border-t border-indigo-200/50 flex justify-between items-center text-xs text-indigo-400">
                               <span>{whatsappMessage.length} characters • {whatsappMessage.split(' ').length} words</span>
                               <span>{lead.outreachStatus || lead.outreach_status || 'Generated'}</span>
                            </div>
                          </>
                       )}
                    </div>
                 )}
              </div>
            </div>
          )}
        </div>

        <div className="pt-8 flex flex-wrap items-center gap-4">
          <button onClick={handleWhatsApp} disabled={!phone} className="flex-1 flex justify-center items-center gap-2 px-6 py-4 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#128C7E] transition-colors disabled:opacity-50 shadow-sm shadow-[#25D366]/20">
            <MessageCircle className="h-5 w-5" /> Open in WhatsApp
          </button>
          
          <button onClick={() => { if(phone) window.open(`tel:${phone.replace(/[^0-9+]/g, '')}`, '_self'); }} disabled={!phone} className="flex-1 flex justify-center items-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50">
            <Phone className="h-5 w-5" /> Call Business
          </button>

          <button onClick={() => { if(mapsUrl) window.open(mapsUrl, '_blank'); }} disabled={!mapsUrl} className="flex-1 flex justify-center items-center gap-2 px-6 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors disabled:opacity-50">
            <MapPin className="h-5 w-5" /> Google Profile
          </button>
        </div>

      </div>
    </div>
  );
}
