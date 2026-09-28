import SEO from '../../components/SEO';

export default function UseCasesPage() {
  const cases = [
    { title: 'Freelancers', desc: 'Find businesses that may need websites, SEO, automation, or digital services.' },
    { title: 'Web Development Agencies', desc: 'Discover local businesses that may have website opportunities.' },
    { title: 'Marketing Agencies', desc: 'Identify businesses with potential digital marketing needs.' },
    { title: 'Sales Teams', desc: 'Build local prospect lists.' },
    { title: 'Consultants', desc: 'Research businesses before outreach.' },
  ];

  return (
    <>
      <SEO title="Use Cases — LeadHunter" />
      <div className="py-24 max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-text-primary text-center mb-16">Who uses LeadHunter?</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cases.map(c => (
            <div key={c.title} className="bg-surface p-8 rounded-xl border border-border">
              <h3 className="text-xl font-bold text-text-primary mb-3">{c.title}</h3>
              <p className="text-text-secondary leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
