import SEO from '../../components/SEO';

export default function PricingPage() {
  return (
    <>
      <SEO title="Pricing — LeadHunter" />
      <div className="py-24 md:py-32 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-6">Simple pricing is coming soon.</h1>
        <p className="text-xl text-text-secondary mb-12">We're finalizing our subscription plans. Start exploring LeadHunter today.</p>
        <div className="bg-surface p-8 md:p-12 rounded-2xl border border-border">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Early Access</h2>
          <p className="text-text-secondary mb-8">Get access to Lead Discovery, AI Intelligence, and Personalized Outreach.</p>
          <a href="/signup" className="inline-block px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors">Start exploring LeadHunter</a>
        </div>
      </div>
    </>
  );
}
