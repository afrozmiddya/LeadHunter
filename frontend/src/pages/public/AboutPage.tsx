import SEO from '../../components/SEO';

export default function AboutPage() {
  return (
    <>
      <SEO title="About — LeadHunter" />
      <div className="py-24 max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-text-primary text-center mb-12">About LeadHunter</h1>
        <div className="space-y-8 text-text-secondary leading-relaxed text-lg">
          <p>
            LeadHunter was created to solve a simple problem: finding local business prospects shouldn't take hours of manual research.
          </p>
          <p>
            For freelancers, agencies, and sales teams, identifying the right businesses to contact is often the most time-consuming part of outreach. Checking maps, visiting websites, and trying to figure out if a business actually needs your services is tedious and scales poorly.
          </p>
          <p>
            We built LeadHunter to automate the discovery and qualification process. By combining local search data with intelligent analysis, LeadHunter helps you uncover businesses with missing websites, poor reviews, or missing digital presence — the exact signals that indicate a potential service opportunity.
          </p>
          <p>
            Our philosophy is honest, targeted outreach. We don't believe in mass-spamming every email address you can find. We believe in understanding a business's needs first, and crafting a personalized message that offers real value.
          </p>
        </div>
      </div>
    </>
  );
}
