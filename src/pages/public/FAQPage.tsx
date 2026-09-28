import SEO from '../../components/SEO';
import { ChevronDown } from 'lucide-react';

export default function FAQPage() {
  const faqs = [
    { q: 'What is LeadHunter?', a: 'LeadHunter is a tool to discover local businesses, identify digital opportunities, and generate personalized outreach.' },
    { q: 'How does LeadHunter find businesses?', a: 'LeadHunter uses map and local business data to find businesses based on location and category.' },
    { q: 'Can I save leads?', a: 'Yes, you can save leads and track your outreach status.' },
    { q: 'Does LeadHunter send messages automatically?', a: 'No, LeadHunter helps you generate personalized messages and opens them in WhatsApp or your phone app, but you are in control of sending.' },
    { q: 'Is LeadHunter a CRM?', a: 'It provides basic lead tracking and status management for your outreach, but it focuses heavily on discovery and intelligence.' },
    { q: 'Does LeadHunter guarantee clients?', a: 'No. LeadHunter helps you find opportunities and craft better outreach, but closing deals depends on your sales process.' }
  ];

  return (
    <>
      <SEO title="FAQ — LeadHunter" />
      <div className="py-24 max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-text-primary text-center mb-16">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <details key={i} className="group bg-surface border border-border rounded-lg p-6 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 text-lg font-medium text-text-primary">
                {f.q}
                <ChevronDown className="h-5 w-5 shrink-0 transition duration-300 group-open:-rotate-180" />
              </summary>
              <p className="mt-4 leading-relaxed text-text-secondary">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </>
  );
}
