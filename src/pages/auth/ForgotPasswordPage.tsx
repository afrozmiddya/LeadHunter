import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import SEO from '../../components/SEO';
import { supabase } from '../../lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      // Always show success to prevent email enumeration
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      // Still show success to prevent email enumeration
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Reset password — LeadHunter" />
      <div className="w-full">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-text-secondary hover:text-text-primary mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to login
        </Link>

        {submitted ? (
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-success/10 p-3 rounded-full">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Check your email</h2>
            <p className="text-text-secondary mb-8">
              If an account exists for that email, we have sent password reset instructions.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-text-primary">Reset your password</h2>
              <p className="text-text-secondary mt-2">Enter your email and we'll help you reset your password.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-text-primary">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-surface border border-border rounded-lg py-2.5 pl-10 pr-4 text-text-primary focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-white font-bold py-2.5 rounded-lg hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center mt-6"
              >
                {loading ? <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Send reset link"}
              </button>
            </form>
          </>
        )}
      </div>
    </>
  );
}
