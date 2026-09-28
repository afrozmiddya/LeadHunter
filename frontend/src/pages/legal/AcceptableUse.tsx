import SEO from '../../components/SEO';

export default function AcceptableUse() {
  return (
    <>
      <SEO title="Acceptable Use — LeadHunter" />
      <div className="py-24 max-w-3xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-text-primary mb-12">Acceptable Use Policy</h1>
        <div className="prose prose-invert max-w-none text-text-secondary">
          <p>[PLACEHOLDER]</p>
          <h2>Prohibited Activities</h2>
          <ul>
            <li>Unlawful activity or fraud</li>
            <li>Abuse, harassment, or spamming of businesses</li>
            <li>Scraping systems in ways prohibited by third-party providers</li>
            <li>Automated abuse of the LeadHunter platform</li>
            <li>Credential abuse or sharing accounts</li>
          </ul>
        </div>
      </div>
    </>
  );
}
