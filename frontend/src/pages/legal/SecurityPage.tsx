import SEO from '../../components/SEO';

export default function SecurityPage() {
  return (
    <>
      <SEO title="Security — LeadHunter" />
      <div className="py-24 max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-text-primary mb-12">Security</h1>
        <div className="prose prose-invert max-w-none text-text-secondary">
          <p>[PLACEHOLDER]</p>
          <p>We build LeadHunter with security in mind.</p>
          <h2>Data Protection</h2>
          <p>We use HTTPS for all communications. Passwords and sensitive data are protected.</p>
          <h2>Authentication</h2>
          <p>We implement standard authentication flows to protect your account access.</p>
        </div>
      </div>
    </>
  );
}
