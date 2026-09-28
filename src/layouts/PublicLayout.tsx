import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Activity, Menu, X, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { cn } from '../layouts/AppLayout';

export default function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { name: 'Features', path: '/features' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Use Cases', path: '/use-cases' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'FAQ', path: '/faq' },
  ];

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans">
      <header className="fixed top-0 left-0 right-0 h-16 md:h-20 bg-background/80 backdrop-blur-md border-b border-border z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 z-50">
            <div className="bg-primary p-1.5 rounded-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">LeadHunter</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={cn(
                  "text-sm font-medium transition-colors hover:text-text-primary",
                  location.pathname === link.path ? "text-text-primary" : "text-text-secondary"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <Link to="/app" className="text-sm font-bold text-primary hover:text-primary-hover flex items-center gap-1">
                Open LeadHunter <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-sm font-bold text-text-primary hover:text-text-secondary transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-hover transition-colors shadow-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden z-50 p-2 text-text-secondary hover:text-text-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Drawer */}
        <div className={cn(
          "fixed inset-0 bg-background z-40 transition-transform duration-300 md:hidden pt-24 px-6 flex flex-col",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <nav className="flex flex-col gap-6 text-lg font-bold">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                onClick={() => setMobileMenuOpen(false)}
                className="text-text-secondary hover:text-text-primary transition-colors border-b border-border/50 pb-4"
              >
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="mt-8 flex flex-col gap-4">
            {isAuthenticated ? (
              <Link to="/app" className="w-full text-center px-4 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover">
                Open LeadHunter
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full text-center px-4 py-3 bg-surface border border-border text-text-primary font-bold rounded-lg hover:bg-elevated">
                  Log in
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full text-center px-4 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover shadow-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 mt-16 md:mt-20">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="bg-surface border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
            <div className="col-span-2 lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="bg-primary p-1.5 rounded-lg">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold text-lg tracking-tight">LeadHunter</span>
              </Link>
              <p className="text-text-secondary text-sm max-w-sm">
                Discover local businesses, identify digital opportunities, and start personalized conversations — from one workspace.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-text-primary mb-4 text-sm uppercase tracking-wider">Product</h4>
              <ul className="space-y-3">
                <li><Link to="/features" className="text-text-secondary hover:text-primary text-sm transition-colors">Features</Link></li>
                <li><Link to="/how-it-works" className="text-text-secondary hover:text-primary text-sm transition-colors">How It Works</Link></li>
                <li><Link to="/use-cases" className="text-text-secondary hover:text-primary text-sm transition-colors">Use Cases</Link></li>
                <li><Link to="/pricing" className="text-text-secondary hover:text-primary text-sm transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-text-primary mb-4 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-3">
                <li><Link to="/faq" className="text-text-secondary hover:text-primary text-sm transition-colors">FAQ</Link></li>
                <li><Link to="/contact" className="text-text-secondary hover:text-primary text-sm transition-colors">Contact</Link></li>
                <li><Link to="/about" className="text-text-secondary hover:text-primary text-sm transition-colors">About</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-text-primary mb-4 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3">
                <li><Link to="/privacy" className="text-text-secondary hover:text-primary text-sm transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-text-secondary hover:text-primary text-sm transition-colors">Terms of Service</Link></li>
                <li><Link to="/cookies" className="text-text-secondary hover:text-primary text-sm transition-colors">Cookie Policy</Link></li>
                <li><Link to="/acceptable-use" className="text-text-secondary hover:text-primary text-sm transition-colors">Acceptable Use</Link></li>
                <li><Link to="/refund-policy" className="text-text-secondary hover:text-primary text-sm transition-colors">Refund Policy</Link></li>
                <li><Link to="/security" className="text-text-secondary hover:text-primary text-sm transition-colors">Security</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-tertiary">
            <p>© {new Date().getFullYear()} LeadHunter. All rights reserved.</p>
            <div className="flex items-center gap-4">
               {isAuthenticated ? (
                  <Link to="/app" className="hover:text-text-primary transition-colors">Open App</Link>
               ) : (
                  <>
                     <Link to="/login" className="hover:text-text-primary transition-colors">Login</Link>
                     <Link to="/signup" className="hover:text-text-primary transition-colors">Sign Up</Link>
                  </>
               )}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
