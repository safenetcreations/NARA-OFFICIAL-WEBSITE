import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import FirebaseAuthProvider from './contexts/FirebaseAuthContext';
import { CartProvider } from './contexts/CartContext';
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
const MediaGallery = lazy(() => import('./pages/media-gallery'));

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

// Research Data Admin
const ResearchAdminLogin = lazy(() => import('./pages/admin/ResearchAdminLogin'));
const ResearchDataAdmin = lazy(() => import('./pages/admin/ResearchDataAdmin'));

// Media Admin
const MediaAdmin = lazy(() => import('./pages/admin/MediaAdmin'));

// LDA Admin
const LDAAdmin = lazy(() => import('./pages/admin/lda/LDAAdmin'));

// Government Services Admin
const GovernmentServicesAdmin = lazy(() => import('./pages/admin/GovernmentServicesAdmin'));

// Maritime Admin
const MaritimeAdmin = lazy(() => import('./pages/admin/MaritimeAdmin'));

// Fish Advisory System
const FishAdvisorySystem = lazy(() => import('./pages/fish-advisory-system'));
const FishAdvisoryAdmin = lazy(() => import('./pages/admin/FishAdvisoryAdmin'));

// LDA Auth Pages
const LDARegister = lazy(() => import('./pages/lda-register'));
const LDALogin = lazy(() => import('./pages/lda-login'));

// Divisions Pages
const DivisionsHub = lazy(() => import('./pages/nara-divisions-hub'));
const DivisionPage = lazy(() => import('./pages/division-page'));

// Checkout & Payment
const CheckoutPage = lazy(() => import('./pages/checkout'));
const PaymentReturn = lazy(() => import('./pages/payment-return'));

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
    '/admin/research-login',
    '/admin/research-data',
    '/admin/media',
    '/admin/lda',
    '/admin/government-services',
    '/admin/maritime',
    '/admin/fish-advisory',
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
      <CartProvider>
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
              <Route path="/lda-register" element={<LDARegister />} />
              <Route path="/lda-login" element={<LDALogin />} />
              <Route path="/regional-impact-network" element={<RegionalImpactNetwork />} />
              <Route path="/maritime-services-hub" element={<MaritimeServicesHub />} />
              <Route path="/knowledge-discovery-center" element={<KnowledgeDiscoveryCenter />} />
              <Route path="/partnership-innovation-gateway" element={<PartnershipInnovationGateway />} />
              <Route path="/digital-product-library" element={<DigitalProductLibrary />} />
              <Route path="/payment-gateway-hub" element={<PaymentGatewayHub />} />
              <Route path="/nara-digital-marketplace" element={<NARADigitalMarketplace />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment/return" element={<PaymentReturn />} />
              <Route path="/payment/cancel" element={<PaymentReturn />} />
              <Route path="/research-collaboration-platform" element={<ResearchCollaborationPlatform />} />
              <Route path="/government-services-portal" element={<GovernmentServicesPortal />} />
              <Route path="/integration-systems-platform" element={<IntegrationSystemsPlatform />} />
              <Route path="/about-nara-our-story" element={<AboutNARAStoryPage />} />
              <Route path="/media-gallery" element={<MediaGallery />} />
              <Route path="/nara-news-updates-center" element={<NARANewsUpdatesCenter />} />
              <Route path="/procurement-recruitment-portal" element={<ProcurementRecruitmentPortal />} />
              <Route path="/contact-us" element={<ContactUs />} />

              {/* Divisions Routes */}
              <Route path="/divisions" element={<DivisionsHub />} />
              <Route path="/divisions/:slug" element={<DivisionPage />} />

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

              {/* Research Data Admin Routes */}
              <Route path="/admin/research-login" element={<ResearchAdminLogin />} />
              <Route path="/admin/research-data" element={<ResearchDataAdmin />} />

              {/* Media Admin Route */}
              <Route path="/admin/media" element={<MediaAdmin />} />

              {/* LDA Admin Route */}
              <Route path="/admin/lda" element={<LDAAdmin />} />

              {/* Government Services Admin Route */}
              <Route path="/admin/government-services" element={<GovernmentServicesAdmin />} />

              {/* Maritime Admin Route */}
              <Route path="/admin/maritime" element={<MaritimeAdmin />} />

              {/* Fish Advisory System Routes */}
              <Route path="/fish-advisory-system" element={<FishAdvisorySystem />} />
              <Route path="/admin/fish-advisory" element={<FishAdvisoryAdmin />} />
            </RouterRoutes>
            </Layout>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
      </CartProvider>
    </FirebaseAuthProvider>
  );
}

export default Routes;
