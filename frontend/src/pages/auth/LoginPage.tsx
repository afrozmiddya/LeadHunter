import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';

import SEO from '../../components/SEO';
import { supabase } from '../../lib/supabase';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirect = params.get('redirect') || '/app';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        throw signInError;
      }

      // Success, route guards will handle redirect automatically if we don't, 
      // but we explicitly navigate here for immediate feedback
      navigate(redirect, { replace: true });
    } catch (err: any) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEO title="Log in — LeadHunter" />
      <div className="w-full">
        <div className="text-center md:text-left mb-8">
          <h2 className="text-2xl font-bold text-text-primary">Welcome back</h2>
          <p className="text-text-secondary mt-2">Enter your details to access your workspace.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
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

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-text-primary">Password</label>
              <Link to="/forgot-password" className="text-xs font-medium text-primary hover:text-primary-hover">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-tertiary" />
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-surface border border-border rounded-lg py-2.5 pl-10 pr-10 text-text-primary focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="••••••••"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white font-bold py-2.5 rounded-lg hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-70 flex justify-center items-center mt-6"
          >
            {loading ? <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Log in"}
          </button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-8">
          Don't have an account?{' '}
          <Link to="/signup" className="font-bold text-primary hover:text-primary-hover">
            Create account
          </Link>
        </p>
      </div>
    </>
  );
}
