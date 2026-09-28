import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute, PublicOnlyRoute } from './components/RouteGuards';

// Layouts
import AppLayout from './layouts/AppLayout';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import FeaturesPage from './pages/public/FeaturesPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import PricingPage from './pages/public/PricingPage';
import UseCasesPage from './pages/public/UseCasesPage';
import FAQPage from './pages/public/FAQPage';
import ContactPage from './pages/public/ContactPage';
import AboutPage from './pages/public/AboutPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';

// Legal Pages
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import CookiePolicy from './pages/legal/CookiePolicy';
import AcceptableUse from './pages/legal/AcceptableUse';
import RefundPolicy from './pages/legal/RefundPolicy';
import SecurityPage from './pages/legal/SecurityPage';

// App Pages
import Dashboard from './pages/Dashboard';
import SearchLeads from './pages/SearchLeads';
import SavedLeads from './pages/SavedLeads';
import LeadDetails from './pages/LeadDetails';
import Settings from './pages/app/Settings';
import Billing from './pages/app/Billing';

// Shared
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes with Header/Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/use-cases" element={<UseCasesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Legal Pages */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/cookies" element={<CookiePolicy />} />
            <Route path="/acceptable-use" element={<AcceptableUse />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route path="/security" element={<SecurityPage />} />
          </Route>

          {/* Auth Routes - Only accessible when NOT logged in */}
          <Route element={<PublicOnlyRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
            </Route>
          </Route>

          {/* Authenticated App Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/app" element={<Dashboard />} />
              <Route path="/app/discover" element={<SearchLeads />} />
              <Route path="/app/leads" element={<SavedLeads />} />
              <Route path="/app/leads/:id" element={<LeadDetails />} />
              <Route path="/app/settings" element={<Settings />} />
              <Route path="/app/billing" element={<Billing />} />
            </Route>
          </Route>

          {/* Legacy route redirects */}
          <Route path="/search" element={<Navigate to="/app/discover" replace />} />
          <Route path="/saved" element={<Navigate to="/app/leads" replace />} />
          <Route path="/leads/:id" element={<LeadRedirect />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function LeadRedirect() {
  const { id } = useParams();
  return <Navigate to={`/app/leads/${id}`} replace />;
}

export default App;
