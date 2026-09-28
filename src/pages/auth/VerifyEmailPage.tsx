import { Link } from 'react-router-dom';
import { MailCheck } from 'lucide-react';
import SEO from '../../components/SEO';

export default function VerifyEmailPage() {
  return (
    <>
      <SEO title="Verify your email — LeadHunter" />
      <div className="w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 p-4 rounded-full">
            <MailCheck className="h-10 w-10 text-primary" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-text-primary mb-2">Check your email</h2>
        <p className="text-text-secondary mb-8">
          We've sent a verification link to your email address. Please click the link to verify your account.
        </p>

        <div className="space-y-4">
          <button className="w-full bg-surface border border-border text-text-primary font-bold py-2.5 rounded-lg hover:bg-elevated transition-colors shadow-sm">
            Resend verification email
          </button>
          
          <p className="text-sm text-text-secondary">
            <Link to="/login" className="font-bold text-primary hover:text-primary-hover">
              Return to login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
