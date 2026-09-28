import { Link } from 'react-router-dom';
import { Target, ArrowRight, Zap } from 'lucide-react';
import SEO from '../../components/SEO';
import { useAuth } from '../../contexts/AuthContext';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  
  return (
    <>
      <SEO 
        title="LeadHunter — Find Local Business Leads" 
        description="Discover local businesses, identify digital opportunities, and generate personalized outreach with LeadHunter." 
      />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Zap className="h-4 w-4" /> The all-in-one local prospecting tool
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-text-primary tracking-tight mb-8 leading-tight">
              Find businesses that need your services.
            </h1>
            
            <p className="text-xl md:text-2xl text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed">
              Discover qualified local businesses, understand their digital opportunities, and start personalized conversations — from one workspace.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link to="/app" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors shadow-lg flex items-center justify-center gap-2">
                  Open LeadHunter <ArrowRight className="h-5 w-5" />
                </Link>
              ) : (
                <>
                  <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors shadow-lg flex items-center justify-center gap-2">
                    Start Finding Leads <ArrowRight className="h-5 w-5" />
                  </Link>
                  <Link to="/how-it-works" className="w-full sm:w-auto px-8 py-4 bg-surface border border-border text-text-primary font-bold rounded-lg hover:bg-elevated transition-colors flex items-center justify-center">
                    See How It Works
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 bg-surface/50 border-y border-border">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-8 tracking-tight">
            Finding prospects shouldn't mean wasting hours searching.
          </h2>
          <p className="text-lg text-text-secondary mb-12 leading-relaxed">
            Stop manually scrolling through Google Maps, checking websites one by one, and copying data into spreadsheets. LeadHunter automates discovery, identifies businesses with digital gaps, and generates targeted outreach.
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 tracking-tight">
              One workflow from discovery to outreach.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-surface p-8 rounded-2xl border border-border flex flex-col gap-4">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary font-bold text-xl">01</div>
              <h3 className="text-xl font-bold text-text-primary">Discover</h3>
              <p className="text-text-secondary leading-relaxed">Find local businesses based on location and category in seconds.</p>
            </div>
            
            <div className="bg-surface p-8 rounded-2xl border border-border flex flex-col gap-4">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary font-bold text-xl">02</div>
              <h3 className="text-xl font-bold text-text-primary">Qualify</h3>
              <p className="text-text-secondary leading-relaxed">Identify businesses with missing websites, low ratings, or missing Google profiles.</p>
            </div>
            
            <div className="bg-surface p-8 rounded-2xl border border-border flex flex-col gap-4">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary font-bold text-xl">03</div>
              <h3 className="text-xl font-bold text-text-primary">Analyze</h3>
              <p className="text-text-secondary leading-relaxed">Use AI to analyze their online presence and identify specific service opportunities.</p>
            </div>
            
            <div className="bg-surface p-8 rounded-2xl border border-border flex flex-col gap-4">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary font-bold text-xl">04</div>
              <h3 className="text-xl font-bold text-text-primary">Personalize</h3>
              <p className="text-text-secondary leading-relaxed">Generate tailored outreach messages highlighting their specific needs.</p>
            </div>
            
            <div className="bg-surface p-8 rounded-2xl border border-border flex flex-col gap-4">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary font-bold text-xl">05</div>
              <h3 className="text-xl font-bold text-text-primary">Contact</h3>
              <p className="text-text-secondary leading-relaxed">Open WhatsApp or call the business directly from the platform.</p>
            </div>
            
            <div className="bg-surface p-8 rounded-2xl border border-border flex flex-col gap-4">
              <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center text-primary font-bold text-xl">06</div>
              <h3 className="text-xl font-bold text-text-primary">Track</h3>
              <p className="text-text-secondary leading-relaxed">Save leads and manage your outreach pipeline status.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-surface/30 border-y border-border text-center">
        <div className="max-w-3xl mx-auto px-4 md:px-8">
          <Target className="h-12 w-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-text-primary mb-4 tracking-tight">
            Built for security and efficiency.
          </h2>
          <p className="text-lg text-text-secondary mb-8 leading-relaxed">
            Your data is stored securely. Built with responsible data handling in mind.
          </p>
          <Link to="/security" className="text-primary font-medium hover:text-primary-hover">
            Learn about our security practices &rarr;
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5" />
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary mb-8 tracking-tight">
            Ready to find your next prospect?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover transition-colors shadow-lg">
              Start Finding Leads
            </Link>
            <Link to="/features" className="w-full sm:w-auto px-8 py-4 bg-surface border border-border text-text-primary font-bold rounded-lg hover:bg-elevated transition-colors">
              Explore LeadHunter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
