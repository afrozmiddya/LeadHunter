import SEO from '../../components/SEO';
import { Search, Brain, MapPin, Zap, MessageSquare, Bookmark } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    { title: 'Lead Discovery', desc: 'Search local businesses using location and category.', icon: Search },
    { title: 'Smart Qualification', desc: 'Filter prospects based on available business signals.', icon: Zap },
    { title: 'Website Detection', desc: 'Identify website presence and relevant website status.', icon: MapPin },
    { title: 'AI Business Analysis', desc: 'Generate structured analysis of the business and its digital presence.', icon: Brain },
    { title: 'Personalized Outreach', desc: 'Generate tailored outreach messages.', icon: MessageSquare },
    { title: 'Lead Management', desc: 'Save and organize prospects.', icon: Bookmark },
  ];

  return (
    <>
      <SEO title="Features — LeadHunter" description="Explore the features of LeadHunter: Lead Discovery, Smart Qualification, AI Analysis, and Personalized Outreach." />
      <div className="py-24 max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-6">Everything you need to find prospects.</h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">LeadHunter provides the tools to discover, analyze, and contact local businesses effectively.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(f => (
            <div key={f.title} className="bg-surface p-6 rounded-xl border border-border">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <f.icon className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">{f.title}</h3>
              <p className="text-text-secondary leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
