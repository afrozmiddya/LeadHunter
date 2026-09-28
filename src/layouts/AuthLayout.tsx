import { Link, Outlet } from 'react-router-dom';
import { Activity } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Brand Side - Hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 bg-surface border-r border-border flex-col justify-between p-12 lg:p-16 relative overflow-hidden">
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="bg-primary p-2 rounded-lg">
              <Activity className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-text-primary">LeadHunter</span>
          </Link>
          
          <h1 className="text-4xl lg:text-5xl font-bold text-text-primary tracking-tight mb-6">
            Find businesses that need your services.
          </h1>
          <p className="text-lg text-text-secondary max-w-md">
            Discover qualified local businesses, understand their digital opportunities, and start personalized conversations — from one workspace.
          </p>
        </div>
        
        {/* Abstract background element */}
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
        <div className="absolute top-1/4 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="md:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-text-primary">LeadHunter</span>
            </Link>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
