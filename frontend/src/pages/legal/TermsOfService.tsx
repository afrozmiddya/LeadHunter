import SEO from '../../components/SEO';

const LegalLayout = ({ title, lastUpdated, children }: any) => (
  <>
    <SEO title={`${title} — LeadHunter`} />
    <div className="py-24 max-w-3xl mx-auto px-4">
      <h1 className="text-4xl font-bold text-text-primary mb-4">{title}</h1>
      <p className="text-text-secondary mb-12">Last updated: {lastUpdated}</p>
      <div className="prose prose-invert prose-p:text-text-secondary prose-h2:text-text-primary prose-h3:text-text-primary max-w-none">
        {children}
      </div>
    </div>
  </>
);

export default function TermsOfService() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="Placeholder Date">
      <p>[PLACEHOLDER - This is a product template and not legal advice.]</p>
      <h2>Service Description</h2>
      <p>LeadHunter provides tools for local business lead discovery and outreach preparation.</p>
      <h2>Account Responsibilities</h2>
      <p>You are responsible for maintaining the security of your account and credentials.</p>
      <h2>Acceptable Use</h2>
      <p>You agree not to misuse the service, including automated abuse or violation of third-party terms.</p>
      <h2>Limitation of Liability</h2>
      <p>LeadHunter is provided "as is" without warranties of any kind.</p>
    </LegalLayout>
  );
}
