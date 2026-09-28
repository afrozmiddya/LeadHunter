import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function NotFound() {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-primary/10 p-4 rounded-full mb-6">
        <Activity className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-4">
        Page not found
      </h1>
      <p className="text-lg text-text-secondary mb-8 max-w-md">
        Looks like this lead got away. The page you're looking for doesn't exist or has been moved.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        {isAuthenticated ? (
          <Link to="/app" className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors shadow-sm">
            Return to Dashboard
          </Link>
        ) : (
          <Link to="/" className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors shadow-sm">
            Back to LeadHunter
          </Link>
        )}
      </div>
    </div>
  );
}
