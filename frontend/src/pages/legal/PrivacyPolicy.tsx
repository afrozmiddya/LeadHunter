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

export default function PrivacyPolicy() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="Placeholder Date">
      <p>[PLACEHOLDER - This is a product template and not legal advice.]</p>
      <h2>Information We Collect</h2>
      <p>We collect account information, usage information, and business data used during lead generation.</p>
      <h2>How We Use Information</h2>
      <p>We use information to provide the LeadHunter service, including AI processing and local business discovery.</p>
      <h2>Third-Party Services</h2>
      <p>We may use third-party APIs (like Google Maps/Places) to provide location and business data.</p>
      <h2>Data Retention & Security</h2>
      <p>We retain data as necessary to provide our services and implement security measures to protect it.</p>
      <h2>Contact Us</h2>
      <p>For privacy inquiries, contact us at [Placeholder Email].</p>
    </LegalLayout>
  );
}
