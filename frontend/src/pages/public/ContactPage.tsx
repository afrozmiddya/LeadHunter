import SEO from '../../components/SEO';

export default function ContactPage() {
  return (
    <>
      <SEO title="Contact — LeadHunter" />
      <div className="py-24 max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold text-text-primary mb-6">Contact Us</h1>
        <p className="text-text-secondary mb-12">Have questions about LeadHunter? We'd love to hear from you.</p>
        <div className="bg-surface border border-border p-8 rounded-xl text-left">
          <form className="space-y-4" onSubmit={e => e.preventDefault()}>
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">Name</label>
              <input type="text" className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-text-primary outline-none focus:border-primary" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">Email</label>
              <input type="email" className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-text-primary outline-none focus:border-primary" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-text-primary">Message</label>
              <textarea rows={4} className="w-full bg-background border border-border rounded-lg py-2.5 px-4 text-text-primary outline-none focus:border-primary"></textarea>
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-lg mt-4 hover:bg-primary-hover transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
