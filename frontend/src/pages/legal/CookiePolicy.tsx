import SEO from '../../components/SEO';

export default function CookiePolicy() {
  return (
    <>
      <SEO title="Cookie Policy — LeadHunter" />
      <div className="py-24 max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-text-primary mb-12">Cookie Policy</h1>
        <div className="prose prose-invert max-w-none text-text-secondary">
          <p>[PLACEHOLDER]</p>
          <h2>Essential Cookies</h2>
          <p>We use essential cookies to maintain your session and authentication state.</p>
          <h2>Analytics Cookies</h2>
          <p>We may use analytics cookies to understand how our application is used, helping us improve the service.</p>
          <h2>Controlling Cookies</h2>
          <p>You can control or delete cookies through your browser settings.</p>
        </div>
      </div>
    </>
  );
}
