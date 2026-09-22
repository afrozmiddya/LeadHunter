import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Phone, MessageCircle, MapPin, Star, Copy, CheckCircle, Sparkles, RefreshCw, Edit2, Save, X, AlertCircle, Globe, Activity, LayoutDashboard, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { api } from '../lib/api';
import { cn } from '../components/Layout';

export default function LeadDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialLead = location.state?.lead;
  
  const [lead, setLead] = useState(initialLead);
  const [copied, setCopied] = useState(false);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [businessAnalysis, setBusinessAnalysis] = useState<any>(lead?.businessAnalysis || null);
  const [whatsappMessage, setWhatsappMessage] = useState<string>(lead?.whatsappMessage || '');
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [editMessageContent, setEditMessageContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedTone, setSelectedTone] = useState('Friendly + Professional');

  const isInitiallySaved = !!lead?.saved_at || !!lead?.business_id;
  const [isSaved, setIsSaved] = useState(isInitiallySaved);
  const [outreachStatus, setOutreachStatus] = useState<string>(lead?.outreachStatus || lead?.outreach_status || 'Not Contacted');
  const [showContactPrompt, setShowContactPrompt] = useState<'whatsapp' | 'call' | null>(null);

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
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <Activity className="h-12 w-12 text-text-tertiary mb-2" />
        <h2 className="text-xl font-bold text-text-primary">No lead data found</h2>
        <p className="text-text-secondary">Please return to search to find leads.</p>
        <button onClick={() => navigate('/search')} className="mt-4 px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover">Go to Search</button>
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

  const getPriorityColor = () => {
    const p = businessAnalysis?.priority || lead.leadPriority || lead.lead_priority;
    switch(p) {
      case 'HIGH': return 'bg-warning/10 text-warning border-warning/20';
      case 'MEDIUM': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-elevated text-text-secondary border-border';
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 relative animate-in fade-in duration-500">
      
      {showContactPrompt && (
         <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-surface p-6 rounded-xl shadow-2xl max-w-md w-full border border-border">
               <h3 className="text-lg font-bold text-text-primary mb-2">Save this lead before contacting?</h3>
               <p className="text-text-secondary text-sm mb-6">
                  It's recommended to save the lead first so you don't lose the business context and AI analysis after following up.
               </p>
               <div className="flex justify-end gap-3">
                  <button onClick={() => setShowContactPrompt(null)} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-elevated rounded-lg transition-colors">
                     Cancel
                  </button>
                  <button onClick={handleConfirmPrompt} disabled={isSaving} className="px-4 py-2 bg-primary text-white text-sm font-medium hover:bg-primary-hover rounded-lg flex items-center gap-2 transition-colors">
                     {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                     Save & Continue
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm font-medium text-text-tertiary">
        <Link to="/saved" className="hover:text-text-primary transition-colors flex items-center gap-1"><LayoutDashboard className="h-4 w-4"/> Leads</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-text-primary truncate">{name}</span>
      </div>
      
      {errorMsg && (
        <div className="bg-danger/10 text-danger p-4 rounded-lg border border-danger/20 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium">{errorMsg}</span>
        </div>
      )}

      {/* Hero Section */}
      <div className="bg-surface rounded-xl shadow-sm border border-border p-6 md:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">{name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <p className="text-sm font-medium text-text-secondary capitalize">{lead.primaryType?.replace(/_/g, ' ') || lead.category || 'Local Business'}</p>
            <span className="h-1 w-1 rounded-full bg-border"></span>
            <div className="flex items-center gap-1.5 text-sm font-medium text-text-secondary">
              <Star className="h-4 w-4 text-warning fill-current" />
              <span className="text-text-primary">{rating}</span>
              <span className="text-text-tertiary">({reviews} reviews)</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
             <button 
                onClick={handleSaveLead}
                disabled={isSaved || isSaving}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all border shadow-sm",
                  isSaved 
                    ? "bg-success/10 text-success border-success/20 cursor-default" 
                    : "bg-surface text-text-primary hover:bg-elevated border-border"
                )}
             >
                {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : 
                 isSaved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4 text-text-secondary" />}
                {isSaving ? 'Saving...' : isSaved ? 'Lead Saved' : 'Save Lead'}
             </button>

             <button onClick={() => { if(mapsUrl) window.open(mapsUrl, '_blank'); }} disabled={!mapsUrl} className="px-4 py-2 bg-surface border border-border text-text-primary rounded-lg text-sm font-bold hover:bg-elevated transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm">
                <MapPin className="h-4 w-4 text-text-secondary" /> Google Profile
             </button>
          </div>
        </div>
        
        <div className="flex flex-col md:items-end gap-3 min-w-[200px]">
          <div className="bg-elevated border border-border rounded-lg p-4 w-full">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Opportunity Score</span>
              <span className="font-bold text-lg text-text-primary">{businessAnalysis?.leadScore || lead.leadScore || lead.lead_score || 'N/A'}<span className="text-xs text-text-tertiary">/100</span></span>
            </div>
            <div className="w-full bg-surface rounded-full h-1.5 mt-2 overflow-hidden">
               <div className="bg-primary h-1.5 rounded-full" style={{ width: `${businessAnalysis?.leadScore || lead.leadScore || lead.lead_score || 0}%` }}></div>
            </div>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Priority</span>
              <span className={cn("px-2 py-0.5 rounded-md text-[10px] font-bold border tracking-wider", getPriorityColor())}>
                {businessAnalysis?.priority || lead.leadPriority || lead.lead_priority || 'N/A'}
              </span>
            </div>
          </div>

          {isSaved && (
             <div className="w-full">
                <select 
                   value={outreachStatus}
                   onChange={(e) => {
                      const newStatus = e.target.value;
                      setOutreachStatus(newStatus);
                      updateSavedLead({ outreachStatus: newStatus });
                   }}
                   className="w-full text-sm font-medium bg-elevated border border-border text-text-primary rounded-lg p-2.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
                >
                   <option value="Not Contacted">Status: Not Contacted</option>
                   <option value="Saved">Status: Saved</option>
                   <option value="WhatsApp Opened">Status: WhatsApp Opened</option>
                   <option value="Called">Status: Called</option>
                   <option value="Contacted">Status: Contacted</option>
                   <option value="Follow-up Required">Status: Follow-up Required</option>
                   <option value="Responded">Status: Responded</option>
                   <option value="Not Interested">Status: Not Interested</option>
                   <option value="Converted">Status: Converted</option>
                </select>
             </div>
          )}
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface p-6 rounded-xl border border-border">
          <h2 className="text-sm font-bold tracking-wider text-text-tertiary uppercase mb-4 flex items-center gap-2">
            <Phone className="h-4 w-4" /> Business Information
          </h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-text-tertiary mb-1">Phone Number</span>
              <span className="font-medium text-text-primary bg-elevated px-3 py-2 rounded-md border border-border">{phone || 'Not available'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-text-tertiary mb-1">Address</span>
              <span className="font-medium text-text-primary bg-elevated px-3 py-2 rounded-md border border-border leading-relaxed">{address}</span>
            </div>
          </div>
        </div>

        <div className="bg-surface p-6 rounded-xl border border-border">
          <h2 className="text-sm font-bold tracking-wider text-text-tertiary uppercase mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4" /> Web Presence
          </h2>
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="text-xs font-medium text-text-tertiary mb-1">Status</span>
              <span className="font-bold text-text-primary capitalize bg-elevated px-3 py-2 rounded-md border border-border">
                {websiteStatus?.replace(/_/g, ' ') || 'NOT VERIFIED'}
              </span>
            </div>
            {lead.websiteVerification?.confidence && (
              <div className="flex flex-col">
                <span className="text-xs font-medium text-text-tertiary mb-1">Confidence</span>
                <span className="font-medium text-text-primary">{lead.websiteVerification.confidence}%</span>
              </div>
            )}
            {lead.websiteVerification?.reason && (
              <div className="flex flex-col">
                <span className="text-xs font-medium text-text-tertiary mb-1">Details</span>
                <span className="text-sm text-text-secondary leading-relaxed">{lead.websiteVerification.reason}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Lead Intelligence */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-elevated/30">
          <div>
            <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> AI Lead Intelligence
            </h2>
            <p className="text-sm text-text-secondary mt-1">Deep analysis and strategic insights for this business.</p>
          </div>
          {!businessAnalysis && (
            <button 
              onClick={analyzeBusiness} 
              disabled={isAnalyzing}
              className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2 shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-colors"
            >
              {isAnalyzing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {isAnalyzing ? 'Analyzing Business...' : 'Analyze Business'}
            </button>
          )}
        </div>

        {businessAnalysis && (
          <div className="p-6 space-y-6">
            {businessAnalysis.primaryScenario && (
              <div className="bg-primary/5 p-5 rounded-lg border border-primary/20">
                  <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-2 uppercase tracking-wider">
                    Primary Opportunity
                  </h3>
                  <p className="text-text-primary font-medium mb-3">{businessAnalysis.primaryScenario.type?.replace(/_/g, ' ')}</p>
                  <p className="text-text-secondary text-sm leading-relaxed mb-4">{businessAnalysis.primaryScenario.reason}</p>
                  
                  {businessAnalysis.evidence?.length > 0 && (
                    <div className="pt-4 border-t border-primary/10">
                        <h4 className="text-xs font-bold text-primary/70 uppercase tracking-wider mb-3">Verified Evidence</h4>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {businessAnalysis.evidence.map((ev: string, i: number) => (
                              <li key={i} className="text-sm text-text-primary flex items-start gap-2 bg-elevated px-3 py-2 rounded-md border border-border">
                                <CheckCircle className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" /> {ev}
                              </li>
                          ))}
                        </ul>
                    </div>
                  )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-elevated p-5 rounded-lg border border-border">
                <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-3">Business Summary</h3>
                <p className="text-text-primary text-sm leading-relaxed mb-3">{businessAnalysis.businessSummary}</p>
                <div className="inline-block bg-surface px-2.5 py-1 rounded-md border border-border text-xs text-text-secondary">
                  <strong>Type:</strong> {businessAnalysis.businessType}
                </div>
              </div>
              <div className="bg-elevated p-5 rounded-lg border border-border">
                <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-3">Digital Presence</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-sm text-text-secondary">Website</span>
                    <span className="text-sm font-medium text-text-primary">{businessAnalysis.onlinePresence?.website?.status || (businessAnalysis.onlinePresence?.website ? 'Yes' : 'No')}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-sm text-text-secondary">Social Media</span>
                    <span className="text-sm font-medium text-text-primary">{businessAnalysis.onlinePresence?.socialMedia?.status || (businessAnalysis.onlinePresence?.socialMedia ? 'Yes' : 'No')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text-secondary">Google Profile</span>
                    <span className="text-sm font-medium text-text-primary">{businessAnalysis.onlinePresence?.googlePresence?.status || 'UNKNOWN'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-elevated p-5 rounded-lg border border-border">
                  <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-3">Digital Weaknesses</h3>
                  <ul className="space-y-2">
                    {(businessAnalysis.digitalWeaknesses || businessAnalysis.opportunities || [])?.map((opt: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                          <AlertCircle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" /> {opt}
                        </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-elevated p-5 rounded-lg border border-border">
                  <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-3">Recommended Services</h3>
                  <ul className="space-y-2">
                    {(businessAnalysis.recommendedServices || businessAnalysis.growthOpportunities || [])?.map((srv: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text-primary">
                          <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" /> {srv}
                        </li>
                    ))}
                  </ul>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-elevated p-5 rounded-lg border border-border">
                  <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-3">Outreach Strategy</h3>
                  <p className="text-text-primary text-sm leading-relaxed">{businessAnalysis.outreachStrategy || 'Not generated'}</p>
                </div>
                <div className="bg-elevated p-5 rounded-lg border border-border">
                  <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-wider mb-3">CTA Strategy</h3>
                  <p className="text-text-primary text-sm leading-relaxed">{businessAnalysis.ctaStrategy || 'Not generated'}</p>
                </div>
            </div>
          </div>
        )}
      </div>

      {/* Personalized Outreach */}
      {businessAnalysis && (
        <div className="bg-surface rounded-xl border border-border overflow-hidden">
          <div className="p-6 border-b border-border bg-elevated/30 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
             <div>
               <h2 className="text-lg font-bold text-text-primary">Personalized Outreach</h2>
               <p className="text-sm text-text-secondary mt-1">Generate and refine your initial message.</p>
             </div>
             
             <div className="flex items-center gap-3">
                <select 
                   value={selectedTone} 
                   onChange={(e) => setSelectedTone(e.target.value)}
                   className="bg-surface border border-border text-text-primary rounded-lg text-sm p-2.5 focus:ring-1 focus:ring-primary focus:border-primary outline-none"
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
                      className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover disabled:opacity-50 flex items-center gap-2 transition-colors shadow-sm"
                    >
                      {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin" /> : <MessageCircle className="h-4 w-4" />}
                      {isGenerating ? 'Generating...' : 'Generate Message'}
                    </button>
                )}
             </div>
          </div>

          {whatsappMessage && (
             <div className="p-6">
                <div className="bg-elevated border border-border rounded-xl p-6 relative">
                   {isEditingMessage ? (
                      <div className="space-y-4">
                         <textarea 
                            value={editMessageContent}
                            onChange={(e) => setEditMessageContent(e.target.value)}
                            className="w-full h-48 p-4 bg-surface text-text-primary rounded-lg border border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm custom-scrollbar leading-relaxed"
                         />
                         <div className="flex justify-end gap-3">
                            <button onClick={() => setIsEditingMessage(false)} className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-surface rounded-lg flex items-center gap-2 transition-colors">
                               <X className="h-4 w-4" /> Cancel
                            </button>
                            <button onClick={saveEditedMessage} disabled={isSaving} className="px-4 py-2 bg-primary text-white text-sm font-medium hover:bg-primary-hover rounded-lg flex items-center gap-2 transition-colors shadow-sm">
                               {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Changes
                            </button>
                         </div>
                      </div>
                   ) : (
                      <>
                        <div className="whitespace-pre-wrap text-text-primary text-[15px] leading-relaxed pr-12">
                           {whatsappMessage}
                        </div>
                        <div className="absolute top-6 right-6 flex flex-col gap-2">
                           <button onClick={handleCopyOutreach} title="Copy Message" className="p-2 bg-surface text-text-secondary hover:text-primary rounded-md shadow-sm border border-border transition-colors">
                              {copied ? <CheckCircle className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                           </button>
                           <button onClick={() => { setEditMessageContent(whatsappMessage); setIsEditingMessage(true); }} title="Edit Message" className="p-2 bg-surface text-text-secondary hover:text-primary rounded-md shadow-sm border border-border transition-colors">
                              <Edit2 className="h-4 w-4" />
                           </button>
                           <button onClick={() => generateMessage()} disabled={isGenerating} title="Regenerate" className="p-2 bg-surface text-text-secondary hover:text-primary rounded-md shadow-sm border border-border transition-colors disabled:opacity-50">
                              <RefreshCw className={cn("h-4 w-4", isGenerating && "animate-spin")} />
                           </button>
                        </div>
                        <div className="mt-6 pt-4 border-t border-border flex justify-between items-center text-xs font-medium text-text-tertiary">
                           <span>{whatsappMessage.length} characters • {whatsappMessage.split(' ').length} words</span>
                           <span className="uppercase tracking-wider px-2 py-1 bg-surface rounded border border-border">{lead.outreachStatus || lead.outreach_status || 'Generated'}</span>
                        </div>
                      </>
                   )}
                </div>
             </div>
          )}
        </div>
      )}

      {/* Contact Actions */}
      <div className="bg-surface rounded-xl border border-border p-6 flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-auto md:flex-1 shrink-0 mb-2 md:mb-0">
          <h2 className="text-lg font-bold text-text-primary">Contact Actions</h2>
          <p className="text-sm text-text-secondary">Ready to reach out? Pick your channel.</p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-stretch gap-3">
          <button 
            onClick={handleCallClick} 
            disabled={!phone} 
            className="flex justify-center items-center gap-2 px-6 py-3.5 bg-surface text-text-primary border border-border rounded-lg font-bold hover:bg-elevated transition-colors disabled:opacity-50"
          >
            <Phone className="h-5 w-5" /> Call Business
          </button>
          <button 
            onClick={handleWhatsAppClick} 
            disabled={!phone} 
            className="flex justify-center items-center gap-2 px-6 py-3.5 bg-[#25D366] text-[#000000] rounded-lg font-bold hover:bg-[#20b858] transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(37,211,102,0.2)]"
          >
            <MessageCircle className="h-5 w-5" /> Open in WhatsApp
          </button>
        </div>
      </div>

    </div>
  );
}
