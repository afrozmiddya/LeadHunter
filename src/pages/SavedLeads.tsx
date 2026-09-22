import { useState, useEffect } from 'react';
import { getSavedLeads } from '../lib/api';
import LeadCard from '../components/LeadCard';
import { Loader2, Search, Inbox } from 'lucide-react';
import { cn } from '../components/Layout';

const TABS = [
  { id: 'all', label: 'All Leads' },
  { id: 'new', label: 'New / Not Contacted' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'follow-up', label: 'Follow-up' },
  { id: 'interested', label: 'Interested / Responded' },
];

export default function SavedLeads() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getSavedLeads().then(data => {
      setLeads(data || []);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getFilteredLeads = () => {
    let filtered = leads;

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(l => 
        l.displayName?.text?.toLowerCase().includes(q) || 
        l.primaryType?.toLowerCase().includes(q)
      );
    }

    // Tab filter
    switch (activeTab) {
      case 'new':
        filtered = filtered.filter(l => {
          const status = l.outreachStatus || l.outreach_status;
          return !status || status === 'Not Contacted' || status === 'Saved';
        });
        break;
      case 'contacted':
        filtered = filtered.filter(l => {
          const status = l.outreachStatus || l.outreach_status;
          return status === 'Contacted' || status === 'WhatsApp Opened' || status === 'Called' || status === 'Message Generated' || status === 'Message Generated (Edited)';
        });
        break;
      case 'follow-up':
        filtered = filtered.filter(l => {
          const status = l.outreachStatus || l.outreach_status;
          return status === 'Follow-up Required';
        });
        break;
      case 'interested':
        filtered = filtered.filter(l => {
          const status = l.outreachStatus || l.outreach_status;
          return status === 'Interested' || status === 'Responded' || status === 'Converted';
        });
        break;
    }

    return filtered;
  };

  const filteredLeads = getFilteredLeads();

  return (
    <div className="space-y-6 animate-in fade-in duration-500 flex flex-col h-full">
      <div className="shrink-0 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Your Leads</h1>
          <p className="mt-1 text-text-secondary">Manage prospects and keep track of your outreach.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative w-full md:w-64">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
             <input 
               type="text" 
               placeholder="Search leads..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-surface border-border text-text-primary rounded-lg border pl-9 p-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none" 
             />
           </div>
        </div>
      </div>

      <div className="shrink-0 border-b border-border">
        <nav className="flex space-x-6 overflow-x-auto custom-scrollbar" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-text-secondary hover:text-text-primary hover:border-border"
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                 <span className="ml-2 py-0.5 px-2 rounded-full bg-primary/10 text-primary text-xs">
                    {filteredLeads.length}
                 </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar pr-2 pb-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-text-secondary">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Loading your leads...</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="bg-surface p-12 flex flex-col items-center justify-center text-center rounded-xl border border-border">
            <div className="h-16 w-16 bg-elevated rounded-full flex items-center justify-center mb-4">
              <Inbox className="h-8 w-8 text-text-tertiary" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-1">No leads found</h3>
            <p className="text-text-secondary">
              {searchQuery 
                ? "We couldn't find any leads matching your search." 
                : activeTab !== 'all' 
                  ? `You don't have any leads in the "${TABS.find(t => t.id === activeTab)?.label}" status.`
                  : "Save businesses you want to contact later from the Discover page."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLeads.map((lead: any) => (
              <LeadCard key={lead.id} lead={lead} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
