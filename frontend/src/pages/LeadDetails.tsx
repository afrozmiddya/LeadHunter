import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, MessageCircle, MapPin, Star, Copy, CheckCircle, Sparkles, RefreshCw, Edit2, Save, X, AlertCircle } from 'lucide-react';
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
  const [selectedTone, setSelectedTone] = useState('Friendly + Professional');

  // Explicit Save Lead State
  const isInitiallySaved = !!lead?.saved_at || !!lead?.business_id;
  const [isSaved, setIsSaved] = useState(isInitiallySaved);
  const [outreachStatus, setOutreachStatus] = useState<string>(lead?.outreachStatus || lead?.outreach_status || 'Not Contacted');
  const [showContactPrompt, setShowContactPrompt] = useState<'whatsapp' | 'call' | null>(null);

  // We should update the local lead object, but ONLY persist to backend if explicitly saved
  const updateSavedLead = async (updatedFields: any, forceSave = false) => {
      const updatedLead = { ...lead, ...updatedFields };
      setLead(updatedLead);
      
      if (updatedFields.outreachStatus) {
         setOutreachStatus(updatedFields.outreachStatus);
      }
      
      if (!isSaved && !forceSave) return;

      try {
          const response = await api.put(`/leads/${lead.id || 'temp'}/outreach-message`, { lead: updatedLead });
          if (response.data && response.data.saved) {
              setLead(response.data.saved);
          }
      } catch(e) {
          console.error("Failed to update saved lead", e);
      }
  };

  const handleSaveLead = async () => {
      try {
          setIsSaving(true);
          const currentLeadData = {
              ...lead,
              businessAnalysis,
              whatsappMessage,
              outreachStatus
          };
          const response = await api.post(`/leads/${lead.id || 'temp'}/save`, currentLeadData);
          if (response.data && response.data.saved) {
              setLead(response.data.saved);
              setIsSaved(true);
          }
      } catch(e) {
          console.error("Failed to save lead", e);
          setErrorMsg("Failed to save lead.");
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

  const executeWhatsApp = async (forceSave = false) => {
      let cleanPhone = phone.replace(/[^0-9]/g, '');
      if (cleanPhone.startsWith('0')) cleanPhone = cleanPhone.substring(1);
      if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone;

      if (whatsappMessage) {
        const encodedMessage = encodeURIComponent(whatsappMessage);
        window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
      } else {
        window.open(`https://wa.me/${cleanPhone}`, '_blank');
      }
      
      setShowContactPrompt(null);
      await updateSavedLead({ outreachStatus: 'WhatsApp Opened' }, forceSave);
  };

  const handleWhatsAppClick = () => {
      if (!phone) return;
      if (!isSaved) {
          setShowContactPrompt('whatsapp');
      } else {
          executeWhatsApp();
      }
  };

  const executeCall = async (forceSave = false) => {
      window.open(`tel:${phone.replace(/[^0-9+]/g, '')}`, '_self');
      setShowContactPrompt(null);
      await updateSavedLead({ outreachStatus: 'Called' }, forceSave);
  };

  const handleCallClick = () => {
      if (!phone) return;
      if (!isSaved) {
          setShowContactPrompt('call');
      } else {
          executeCall();
      }
  };
  
  const handleConfirmPrompt = async () => {
      await handleSaveLead();
      if (showContactPrompt === 'whatsapp') executeWhatsApp(true);
      if (showContactPrompt === 'call') executeCall(true);
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

  const generateMessage = async () => {
    if (!businessAnalysis) return;
    try {
      setIsGenerating(true);
      setErrorMsg('');
      const response = await api.post(`/leads/${lead.id || 'temp'}/whatsapp`, { lead, businessAnalysis, tone: selectedTone });
      const data = response.data;
      setWhatsappMessage(data.message);
      
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
    <div className="space-y-6 max-w-4xl mx-auto pb-12 relative">
      
      {showContactPrompt && (
         <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full border border-gray-100">
               <h3 className="text-lg font-bold text-gray-900 mb-2">Save this lead before contacting?</h3>
               <p className="text-gray-600 text-sm mb-6">
                  It's recommended to save the lead first so you don't lose the business context and AI analysis after following up.
               </p>
               <div className="flex justify-end gap-3">
                  <button onClick={() => setShowContactPrompt(null)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                     Cancel
                  </button>
                  <button onClick={handleConfirmPrompt} disabled={isSaving} className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 rounded-lg flex items-center gap-2">
                     {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                     Save & Continue
                  </button>
               </div>
            </div>
         </div>
      )}

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
            
            {isSaved && (
               <div className="flex items-center gap-2 mt-4">
                  <span className="text-sm font-medium text-gray-700">Outreach Status:</span>
                  <select 
                     value={outreachStatus}
                     onChange={(e) => {
                        const newStatus = e.target.value;
                        setOutreachStatus(newStatus);
                        updateSavedLead({ outreachStatus: newStatus });
                     }}
                     className="text-sm border border-gray-300 rounded-md p-1 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                     <option value="Not Contacted">Not Contacted</option>
                     <option value="Saved">Saved</option>
                     <option value="WhatsApp Opened">WhatsApp Opened</option>
                     <option value="Called">Called</option>
                     <option value="Contacted">Contacted</option>
                     <option value="Follow-up Required">Follow-up Required</option>
                     <option value="Responded">Responded</option>
                     <option value="Not Interested">Not Interested</option>
                     <option value="Converted">Converted</option>
                  </select>
               </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-3">
             <button 
                onClick={handleSaveLead}
                disabled={isSaved || isSaving}
                className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors border ${
                   isSaved ? 'bg-green-50 text-green-700 border-green-200 cursor-default' : 'bg-indigo-600 text-white border-transparent hover:bg-indigo-700 shadow-sm'
                }`}
             >
                {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : 
                 isSaved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save Lead'}
             </button>
             
            <div className="text-right">
              <span className="inline-block bg-indigo-50 text-indigo-700 px-4 py-1 rounded-full text-xs font-bold border border-indigo-100">
                {businessAnalysis?.priority || lead.leadPriority || lead.lead_priority || 'N/A'} PRIORITY
              </span>
              <p className="text-xs text-gray-500 mt-1 font-medium">Score: {businessAnalysis?.leadScore || lead.leadScore || lead.lead_score || 'N/A'}/100</p>
            </div>
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
                
                {businessAnalysis.primaryScenario && (
                  <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-4">
                     <h3 className="text-sm font-bold text-indigo-900 mb-1 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" /> Primary Scenario: {businessAnalysis.primaryScenario.type?.replace(/_/g, ' ')}
                     </h3>
                     <p className="text-indigo-800 text-sm mb-2">{businessAnalysis.primaryScenario.reason}</p>
                     
                     {businessAnalysis.evidence?.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-indigo-200">
                           <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">Verified Evidence</h4>
                           <ul className="space-y-1">
                              {businessAnalysis.evidence.map((ev: string, i: number) => (
                                 <li key={i} className="text-xs text-indigo-800 flex items-start gap-1.5">
                                    <CheckCircle className="h-3 w-3 mt-0.5 flex-shrink-0" /> {ev}
                                 </li>
                              ))}
                           </ul>
                        </div>
                     )}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Business Summary</h3>
                    <p className="text-gray-700 text-sm">{businessAnalysis.businessSummary}</p>
                    <p className="text-gray-500 text-xs mt-2"><strong>Type:</strong> {businessAnalysis.businessType}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-2">Digital Presence</h3>
                    <p className="text-gray-700 text-sm mb-1"><strong>Website:</strong> {businessAnalysis.onlinePresence?.website?.status || (businessAnalysis.onlinePresence?.website ? 'Yes' : 'No')}</p>
                    <p className="text-gray-700 text-sm mb-1"><strong>Social:</strong> {businessAnalysis.onlinePresence?.socialMedia?.status || (businessAnalysis.onlinePresence?.socialMedia ? 'Yes' : 'No')}</p>
                    <p className="text-gray-700 text-sm"><strong>Google:</strong> {businessAnalysis.onlinePresence?.googlePresence?.status || 'UNKNOWN'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                   <div>
                     <h3 className="text-sm font-bold text-gray-900 mb-2">Digital Weaknesses</h3>
                     <ul className="space-y-1">
                        {(businessAnalysis.digitalWeaknesses || businessAnalysis.opportunities || [])?.map((opt: string, i: number) => (
                           <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" /> {opt}
                           </li>
                        ))}
                     </ul>
                   </div>
                   <div>
                     <h3 className="text-sm font-bold text-gray-900 mb-2">Recommended Services</h3>
                     <ul className="space-y-1">
                        {(businessAnalysis.recommendedServices || businessAnalysis.growthOpportunities || [])?.map((srv: string, i: number) => (
                           <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" /> {srv}
                           </li>
                        ))}
                     </ul>
                   </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                   <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-2">Outreach Strategy</h3>
                      <p className="text-gray-700 text-sm">{businessAnalysis.outreachStrategy || 'Not generated'}</p>
                   </div>
                   <div>
                      <h3 className="text-sm font-bold text-gray-900 mb-2">CTA Strategy</h3>
                      <p className="text-gray-700 text-sm">{businessAnalysis.ctaStrategy || 'Not generated'}</p>
                   </div>
                </div>
              </div>

              {/* WhatsApp Message Section */}
              <div>
                 <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Personalised WhatsApp Message</h3>
                    
                    <div className="flex items-center gap-3">
                       <select 
                          value={selectedTone} 
                          onChange={(e) => setSelectedTone(e.target.value)}
                          className="border border-gray-300 rounded-md text-sm p-1.5 focus:ring-indigo-500 focus:border-indigo-500"
                          disabled={isGenerating}
                       >
                          <option value="Friendly + Professional">Friendly + Professional</option>
                          <option value="Direct + Professional">Direct + Professional</option>
                          <option value="Casual">Casual</option>
                          <option value="Consultative">Consultative</option>
                          <option value="Premium">Premium</option>
                       </select>

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
          {!isSaved && (
             <button onClick={handleSaveLead} disabled={isSaving} className="flex-1 flex justify-center items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm shadow-indigo-600/20">
               {isSaving ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />} Save Lead
             </button>
          )}

          <button onClick={handleWhatsAppClick} disabled={!phone} className="flex-1 flex justify-center items-center gap-2 px-6 py-4 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#128C7E] transition-colors disabled:opacity-50 shadow-sm shadow-[#25D366]/20">
            <MessageCircle className="h-5 w-5" /> Open in WhatsApp
          </button>
          
          <button onClick={handleCallClick} disabled={!phone} className="flex-1 flex justify-center items-center gap-2 px-6 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50">
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
