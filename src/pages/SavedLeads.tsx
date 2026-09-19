import { useState, useEffect } from 'react';
import { getSavedLeads } from '../lib/api';
import LeadCard from '../components/LeadCard';
import { Loader2 } from 'lucide-react';

export default function SavedLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSavedLeads().then(data => {
      setLeads(data || []);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Saved Leads</h1>
        <p className="mt-2 text-gray-600">Manage and revisit your highest potential prospects.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>
      ) : leads.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-xl border border-gray-200">
          <p className="text-gray-500">You haven't saved any leads yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {leads.map((lead: any) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}
