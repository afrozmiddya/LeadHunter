import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  Bookmark, 
  Activity, 
  Menu,
  X,
  MessageSquare,
  Kanban,
  Clock,
  Settings
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const mainNav = [
    { name: 'Overview', path: '/', icon: LayoutDashboard },
    { name: 'Discover Leads', path: '/search', icon: Search },
    { name: 'Leads', path: '/saved', icon: Bookmark },
    { name: 'Outreach', path: '#outreach', icon: MessageSquare, disabled: true },
  ];

  const secondaryNav = [
    { name: 'Pipeline', path: '#pipeline', icon: Kanban, disabled: true },
    { name: 'Follow-ups', path: '#followups', icon: Clock, disabled: true },
    { name: 'Settings', path: '#settings', icon: Settings, disabled: true },
  ];

  return (
    <div className="flex h-screen bg-background text-text-primary overflow-hidden">
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-sidebar border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight">LeadHunter</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-text-secondary hover:text-text-primary rounded-md"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile) */}
      <aside className={cn(
        "fixed md:static inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-border flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0",
        mobileMenuOpen ? "translate-x-0 mt-16 md:mt-0" : "-translate-x-full mt-16 md:mt-0"
      )}>
        <div className="hidden md:flex h-16 items-center gap-2 px-6 border-b border-border/50">
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <Activity className="h-6 w-6 text-primary" />
          </div>
          <span className="font-bold text-lg tracking-tight">LeadHunter</span>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
          <div>
            <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Workspace
            </div>
            <nav className="space-y-1">
              {mainNav.map((item) => {
                const active = isActive(item.path) && !item.disabled;
                return (
                  <Link
                    key={item.name}
                    to={item.disabled ? '#' : item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      active 
                        ? "bg-primary/10 text-primary" 
                        : "text-text-secondary hover:bg-surface hover:text-text-primary",
                      item.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent hover:text-text-secondary"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", active ? "text-primary" : "text-text-tertiary")} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div>
            <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-text-tertiary">
              Management
            </div>
            <nav className="space-y-1">
              {secondaryNav.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={(e) => {
                    if (item.disabled) e.preventDefault();
                  }}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-text-secondary",
                    item.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-surface hover:text-text-primary"
                  )}
                >
                  <item.icon className="h-4 w-4 text-text-tertiary" />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        
        {/* User profile area at bottom */}
        <div className="p-4 border-t border-border/50">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 rounded-full bg-surface border border-border flex items-center justify-center text-sm font-medium text-text-secondary">
              AM
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-text-primary">Afroz</span>
              <span className="text-xs text-text-tertiary">Workspace Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-background pt-16 md:pt-0">
        <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
