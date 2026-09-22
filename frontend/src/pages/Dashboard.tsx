import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Users, Activity, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { getSavedLeads } from '../lib/api';
import { cn } from '../components/Layout';

export default function Dashboard() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSavedLeads().then(data => {
      setLeads(data || []);
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const highPriority = leads.filter(l => l.leadPriority === 'HIGH' || l.lead_priority === 'HIGH');
  const needsAction = leads.filter(l => !l.outreachStatus && !l.outreach_status);
  
  const stats = [
    { label: 'Total Saved Leads', value: leads.length, icon: Users, color: 'text-primary' },
    { label: 'High Priority', value: highPriority.length, icon: Activity, color: 'text-warning' },
    { label: 'Action Required', value: needsAction.length, icon: Clock, color: 'text-danger' },
  ];

  const recentLeads = leads.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-text-primary">Overview</h1>
          <p className="text-text-secondary mt-1">Here's what needs your attention today.</p>
        </div>
        <Link 
          to="/search" 
          className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 w-fit shadow-[0_0_15px_rgba(79,70,229,0.3)]"
        >
          <Search className="h-4 w-4" />
          Discover Leads
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-surface p-6 rounded-xl border border-border flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-text-secondary uppercase tracking-wider">{s.label}</p>
              <div className={cn("p-2 rounded-md bg-elevated border border-border", s.color)}>
                <s.icon className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-4xl font-bold text-text-primary">
                {loading ? '-' : s.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="h-40 flex items-center justify-center bg-surface border border-border rounded-xl">
          <Activity className="h-6 w-6 text-text-tertiary animate-pulse" />
        </div>
      ) : leads.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface rounded-xl border border-border overflow-hidden flex flex-col">
            <div className="p-5 border-b border-border flex justify-between items-center bg-elevated/30">
              <h2 className="font-semibold text-text-primary flex items-center gap-2">
                <Clock className="h-4 w-4 text-warning" />
                Action Required
              </h2>
            </div>
            <div className="flex-1 overflow-auto">
              {needsAction.length > 0 ? (
                <div className="divide-y divide-border">
                  {needsAction.slice(0, 4).map(lead => (
                    <Link key={lead.id} to={`/leads/${lead.id}`} state={{ lead }} className="p-4 flex justify-between items-center hover:bg-elevated transition-colors group">
                      <div>
                        <h3 className="font-medium text-text-primary group-hover:text-primary transition-colors">{lead.displayName?.text || 'Unknown Business'}</h3>
                        <p className="text-sm text-text-secondary capitalize">{lead.primaryType?.replace(/_/g, ' ') || 'Local Business'}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs px-2 py-1 bg-warning/10 text-warning border border-warning/20 rounded-full font-medium">Needs Outreach</span>
                        <ChevronRight className="h-4 w-4 text-text-tertiary group-hover:text-primary" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center flex flex-col items-center justify-center h-full text-text-secondary">
                  <CheckCircle2 className="h-8 w-8 text-success mb-3 opacity-50" />
                  <p>You're all caught up!</p>
                </div>
              )}
            </div>
            {needsAction.length > 4 && (
              <Link to="/saved" className="p-3 text-center text-sm font-medium text-primary bg-elevated/30 hover:bg-elevated border-t border-border transition-colors">
                View all {needsAction.length} leads
              </Link>
            )}
          </div>

          <div className="bg-surface rounded-xl border border-border overflow-hidden flex flex-col">
            <div className="p-5 border-b border-border flex justify-between items-center bg-elevated/30">
              <h2 className="font-semibold text-text-primary">Recent Leads</h2>
            </div>
            <div className="flex-1 overflow-auto">
              <div className="divide-y divide-border">
                {recentLeads.map(lead => (
                  <Link key={lead.id} to={`/leads/${lead.id}`} state={{ lead }} className="p-4 flex justify-between items-center hover:bg-elevated transition-colors group">
                    <div>
                      <h3 className="font-medium text-text-primary group-hover:text-primary transition-colors">{lead.displayName?.text || 'Unknown Business'}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm border",
                          lead.leadPriority === 'HIGH' || lead.lead_priority === 'HIGH' ? "border-warning/30 text-warning bg-warning/5" : "border-border text-text-tertiary"
                        )}>
                          {lead.leadPriority || lead.lead_priority || 'MEDIUM'}
                        </span>
                        <span className="text-xs text-text-secondary capitalize">{lead.primaryType?.replace(/_/g, ' ') || 'Local Business'}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-text-tertiary group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/saved" className="p-3 text-center text-sm font-medium text-text-secondary hover:text-text-primary bg-elevated/30 hover:bg-elevated border-t border-border transition-colors">
              View all leads
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-border p-12 text-center flex flex-col items-center">
          <div className="h-16 w-16 bg-elevated rounded-full flex items-center justify-center mb-4">
            <Search className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-text-primary mb-2">No leads found</h2>
          <p className="text-text-secondary mb-6 max-w-md">Start discovering local businesses that need your services by searching Google Maps.</p>
          <Link to="/search" className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2">
            <Search className="h-4 w-4" />
            Discover Leads
          </Link>
        </div>
      )}
    </div>
  );
}
