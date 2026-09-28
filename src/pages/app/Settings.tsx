import SEO from '../../components/SEO';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <SEO title="Settings — LeadHunter" />
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/10 p-2 rounded-lg">
          <SettingsIcon className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
      </div>
      
      <div className="bg-surface border border-border p-8 rounded-xl text-center">
        <p className="text-text-secondary">Settings management will appear here.</p>
      </div>
    </div>
  );
}
