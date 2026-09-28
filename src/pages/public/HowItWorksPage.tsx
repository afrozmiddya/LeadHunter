import SEO from '../../components/SEO';
import { ArrowDown } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    { title: 'Search', desc: 'Enter a location and category to find local businesses.' },
    { title: 'Filter & Review', desc: 'Find businesses that meet your criteria.' },
    { title: 'Analyze', desc: 'Use AI to understand their digital presence.' },
    { title: 'Personalize', desc: 'Generate a targeted outreach message.' },
    { title: 'Contact & Track', desc: 'Reach out via WhatsApp or phone and track status.' }
  ];

  return (
    <>
      <SEO title="How It Works — LeadHunter" />
      <div className="py-24 max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary text-center mb-16">How LeadHunter Works</h1>
        <div className="space-y-8">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="bg-surface border border-border p-8 rounded-2xl text-center w-full max-w-lg">
                <h3 className="text-xl font-bold text-text-primary mb-2">{s.title}</h3>
                <p className="text-text-secondary">{s.desc}</p>
              </div>
              {i < steps.length - 1 && <ArrowDown className="text-border h-8 w-8 my-4" />}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
