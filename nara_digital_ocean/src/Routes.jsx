import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import FirebaseAuthProvider from './contexts/FirebaseAuthContext';
import GovFooter from './components/compliance/GovFooter';
import ThemeNavbar from './components/ui/ThemeNavbar';

const OceanIntelligenceDashboardHomepage = lazy(() => import("./pages/ocean-intelligence-dashboard-homepage"));
const ResearchExcellencePortal = lazy(() => import("./pages/research-excellence-portal"));
const EmergencyResponseNetwork = lazy(() => import("./pages/emergency-response-network"));
const LearningDevelopmentAcademy = lazy(() => import("./pages/learning-development-academy"));
const RegionalImpactNetwork = lazy(() => import("./pages/regional-impact-network"));
const MaritimeServicesHub = lazy(() => import("./pages/maritime-services-hub"));
const KnowledgeDiscoveryCenter = lazy(() => import("./pages/knowledge-discovery-center"));
const PartnershipInnovationGateway = lazy(() => import("./pages/partnership-innovation-gateway"));
const DigitalProductLibrary = lazy(() => import("./pages/digital-product-library"));
const PaymentGatewayHub = lazy(() => import("./pages/payment-gateway-hub"));
const NARADigitalMarketplace = lazy(() => import("./pages/nara-digital-marketplace"));
const ResearchCollaborationPlatform = lazy(() => import("./pages/research-collaboration-platform"));
const GovernmentServicesPortal = lazy(() => import("./pages/government-services-portal"));
const IntegrationSystemsPlatform = lazy(() => import("./pages/integration-systems-platform"));
const AboutNARAStoryPage = lazy(() => import("./pages/about-nara-our-story"));
const NARANewsUpdatesCenter = lazy(() => import("./pages/nara-news-updates-center"));
const ProcurementRecruitmentPortal = lazy(() => import("./pages/procurement-recruitment-portal"));
const ContactUs = lazy(() => import("./pages/contact-us"));
const FirebaseAdminAuthenticationPortal = lazy(() => import('./pages/firebase-admin-authentication-portal'));
const FirebaseAdminDashboardControlCenter = lazy(() => import('./pages/firebase-admin-dashboard-control-center'));

// Legal & Compliance Pages
const PrivacyPolicy = lazy(() => import('./pages/legal/PrivacyPolicy'));
const DataSubjectRights = lazy(() => import('./pages/legal/DataSubjectRights'));
const TermsOfUse = lazy(() => import('./pages/legal/TermsOfUse'));
const CookiePolicy = lazy(() => import('./pages/legal/CookiePolicy'));
const AccessibilityStatement = lazy(() => import('./pages/legal/AccessibilityStatement'));
const RTIDisclosure = lazy(() => import('./pages/legal/RTIDisclosure'));
const SecurityPolicy = lazy(() => import('./pages/legal/SecurityPolicy'));

// New Admin Panel
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ContentManager = lazy(() => import('./pages/admin/ContentManager'));

// Layout component with header and footer
function Layout({ children }) {
  const location = useLocation();
  
  // Pages where header/footer should be hidden (admin pages)
  const hideLayoutPaths = [
    '/firebase-admin-authentication-portal',
    '/firebase-admin-dashboard-control-center',
    '/admin/login',
    '/admin/dashboard',
    '/admin/content',
    '/admin'
  ];
  
  const shouldShowLayout = !hideLayoutPaths.some(path => location.pathname.startsWith(path));
  
  return (
    <>
      {shouldShowLayout && <ThemeNavbar />}
      <div style={shouldShowLayout ? { paddingTop: '88px' } : {}}>
        {children}
      </div>
      {shouldShowLayout && <GovFooter />}
    </>
  );
}

function Routes() {
  return (
    <FirebaseAuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <ScrollToTop />
          <Suspense
            fallback={
              <div className="min-h-screen flex items-center justify-center bg-black text-white">
                Loading experience...
              </div>
            }
          >
            <Layout>
              <RouterRoutes>
              <Route path="/" element={<OceanIntelligenceDashboardHomepage />} />
              <Route path="/research-excellence-portal" element={<ResearchExcellencePortal />} />
              <Route path="/emergency-response-network" element={<EmergencyResponseNetwork />} />
              <Route path="/learning-development-academy" element={<LearningDevelopmentAcademy />} />
              <Route path="/regional-impact-network" element={<RegionalImpactNetwork />} />
              <Route path="/maritime-services-hub" element={<MaritimeServicesHub />} />
              <Route path="/knowledge-discovery-center" element={<KnowledgeDiscoveryCenter />} />
              <Route path="/partnership-innovation-gateway" element={<PartnershipInnovationGateway />} />
              <Route path="/digital-product-library" element={<DigitalProductLibrary />} />
              <Route path="/payment-gateway-hub" element={<PaymentGatewayHub />} />
              <Route path="/nara-digital-marketplace" element={<NARADigitalMarketplace />} />
              <Route path="/research-collaboration-platform" element={<ResearchCollaborationPlatform />} />
              <Route path="/government-services-portal" element={<GovernmentServicesPortal />} />
              <Route path="/integration-systems-platform" element={<IntegrationSystemsPlatform />} />
              <Route path="/about-nara-our-story" element={<AboutNARAStoryPage />} />
              <Route path="/nara-news-updates-center" element={<NARANewsUpdatesCenter />} />
              <Route path="/procurement-recruitment-portal" element={<ProcurementRecruitmentPortal />} />
              <Route path="/contact-us" element={<ContactUs />} />
              
              {/* Legal & Compliance Routes */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/data-subject-rights" element={<DataSubjectRights />} />
              <Route path="/terms-of-use" element={<TermsOfUse />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />
              <Route path="/accessibility-statement" element={<AccessibilityStatement />} />
              <Route path="/rti-disclosure" element={<RTIDisclosure />} />
              <Route path="/security-policy" element={<SecurityPolicy />} />
              
              <Route path="*" element={<NotFound />} />

              <Route
                path="/firebase-admin-authentication-portal"
                element={<FirebaseAdminAuthenticationPortal />}
              />
              <Route
                path="/firebase-admin-dashboard-control-center"
                element={<FirebaseAdminDashboardControlCenter />}
              />

              {/* New Admin Panel Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="content" element={<ContentManager />} />
              </Route>
            </RouterRoutes>
            </Layout>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </FirebaseAuthProvider>
  );
}

export default Routes;
