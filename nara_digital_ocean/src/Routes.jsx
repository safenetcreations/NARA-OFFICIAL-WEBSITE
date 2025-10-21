import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, useLocation, Navigate } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import { ProtectedRoute } from './components/library';
import GovFooter from './components/compliance/GovFooter';
import ThemeNavbar from './components/ui/ThemeNavbar';
import SkipLink from './components/compliance/SkipLink';
import FirebaseAuthProvider from './contexts/FirebaseAuthContext';
import { LibraryUserProvider } from './contexts/LibraryUserContext';
import { CartProvider } from './contexts/CartContext';

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
const AudiencePage = lazy(() => import('./pages/audiences'));

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

// Analytics Admin - Phase 5
const AnalyticsAdmin = lazy(() => import('./pages/admin/AnalyticsAdmin'));
const PredictionsAdmin = lazy(() => import('./pages/admin/PredictionsAdmin'));
const SimulationsEconomicAdmin = lazy(() => import('./pages/admin/SimulationsEconomicAdmin'));

// Fish Advisory System
const FishAdvisorySystem = lazy(() => import('./pages/fish-advisory-system'));
const FishAdvisoryAdmin = lazy(() => import('./pages/admin/FishAdvisoryAdmin'));

// Lab Results Portal
const LabResultsPortal = lazy(() => import('./pages/lab-results'));
const LabResultsAdmin = lazy(() => import('./pages/admin/LabResultsAdmin'));

// Research Vessel Booking
const ResearchVesselBooking = lazy(() => import('./pages/research-vessel-booking'));
const ResearchVesselAdmin = lazy(() => import('./pages/admin/ResearchVesselAdmin'));

// Scientific Evidence Repository
const ScientificEvidenceRepository = lazy(() => import('./pages/scientific-evidence-repository'));

// Export Market Intelligence
const ExportMarketIntelligence = lazy(() => import('./pages/export-market-intelligence'));

// Media Press Kit
const MediaPressKit = lazy(() => import('./pages/media-press-kit'));

// Open Data Portal
const OpenDataPortal = lazy(() => import('./pages/open-data-portal'));

// Marine Incident Portal
const MarineIncidentPortal = lazy(() => import('./pages/marine-incident-portal'));
const MarineIncidentAdmin = lazy(() => import('./pages/admin/MarineIncidentAdmin'));

// Project Pipeline Tracker
const ProjectPipelineTracker = lazy(() => import('./pages/project-pipeline-tracker'));
const ProjectPipelineAdmin = lazy(() => import('./pages/admin/ProjectPipelineAdmin'));

// Recruitment ATS
const RecruitmentATSAdmin = lazy(() => import('./pages/admin/RecruitmentATSAdmin'));

// Bathymetry Data Admin
const BathymetryAdmin = lazy(() => import('./pages/admin/BathymetryAdmin'));

// Marine Spatial Planning Viewer
const MarineSpatialPlanningViewer = lazy(() => import('./pages/marine-spatial-planning-viewer'));

// Data Center Integration Hub Admin
const DataCenterIntegrationAdmin = lazy(() => import('./pages/admin/DataCenterIntegrationAdmin'));

// Water Quality Monitoring Admin
const WaterQualityMonitoringAdmin = lazy(() => import('./pages/admin/WaterQualityMonitoringAdmin'));

// Public Consultation Portal
const PublicConsultationPortal = lazy(() => import('./pages/public-consultation-portal'));
const PublicConsultationAdmin = lazy(() => import('./pages/admin/PublicConsultationAdmin'));
const Phase4DataSeeder = lazy(() => import('./pages/admin/Phase4DataSeeder'));

// Analytics Hub - Phase 5
const AnalyticsHub = lazy(() => import('./pages/analytics-hub'));
const PredictiveAnalyticsDashboard = lazy(() => import('./pages/analytics-hub/PredictiveAnalyticsDashboard'));
const ImpactAssessmentPortal = lazy(() => import('./pages/analytics-hub/ImpactAssessmentPortal'));
const EconomicValuationDashboard = lazy(() => import('./pages/analytics-hub/EconomicValuationDashboard'));
const PolicySimulatorInterface = lazy(() => import('./pages/analytics-hub/PolicySimulatorInterface'));

// LDA Auth Pages
const LDARegister = lazy(() => import('./pages/lda-register'));
const LDALogin = lazy(() => import('./pages/lda-login'));

// Divisions Pages
const DivisionsHub = lazy(() => import('./pages/nara-divisions-hub'));
const DivisionPage = lazy(() => import('./pages/division-page'));

// Library System Pages
const LibraryCatalogue = lazy(() => import('./pages/library-catalogue'));
const ItemDetail = lazy(() => import('./pages/library-catalogue/ItemDetail'));
const PatronPortal = lazy(() => import('./pages/library-catalogue/PatronPortal'));
const LibraryRegister = lazy(() => import('./pages/library-register'));
const LibraryLogin = lazy(() => import('./pages/library-login'));
const UnifiedRegistration = lazy(() => import('./pages/unified-registration'));
const UserProfile = lazy(() => import('./pages/user-profile'));
const LibraryDashboard = lazy(() => import('./pages/library-dashboard'));
const LibraryResearchSubmit = lazy(() => import('./pages/library-research-submit'));
const LibraryAdminDashboard = lazy(() => import('./pages/library-admin/LibraryAdminDashboard'));
const ResearchReviewDashboard = lazy(() => import('./pages/library-admin/ResearchReviewDashboard'));
const CataloguingManager = lazy(() => import('./pages/library-admin/CataloguingManager'));
const EnhancedCataloguingManager = lazy(() => import('./pages/library-admin/EnhancedCataloguingManager'));
const CirculationManager = lazy(() => import('./pages/library-admin/CirculationManager'));
const PatronManager = lazy(() => import('./pages/library-admin/PatronManager'));
const AcquisitionsManager = lazy(() => import('./pages/library-admin/AcquisitionsManager'));

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
    '/admin/lab-results',
    '/admin/research-vessel',
    '/admin/marine-incident',
    '/admin/project-pipeline',
    '/admin/recruitment-ats',
    '/admin/bathymetry',
    '/admin/data-center-integration',
    '/admin/water-quality-monitoring',
    '/admin/public-consultation',
    '/admin/phase4-seeder',
    '/admin/analytics',
    '/admin/library',
    '/admin'
  ];
  
  const shouldShowLayout = !hideLayoutPaths.some(path => location.pathname.startsWith(path));
  
  // Homepage has its own custom footer, so we exclude GovFooter from it
  const hideFooterPaths = ['/'];
  const shouldShowFooter = shouldShowLayout && !hideFooterPaths.includes(location.pathname);
  
  return (
    <>
      {shouldShowLayout && <SkipLink />}
      {shouldShowLayout && <ThemeNavbar />}
      <main 
        id="main-content" 
        tabIndex={-1}
        role="main"
        aria-label="Main content"
        style={shouldShowLayout ? { paddingTop: '88px' } : {}}
      >
        {children}
      </main>
      {shouldShowFooter && <GovFooter />}
    </>
  );
}

function Routes() {
  return (
    <BrowserRouter>
      <FirebaseAuthProvider>
        <CartProvider>
          <LibraryUserProvider>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="text-slate-600 font-medium">Loading NARA Digital Ocean...</p>
                </div>
              </div>
            }>
              <ErrorBoundary>
                <ScrollToTop />
                <Layout>
                  <RouterRoutes>
              <Route path="/" element={<OceanIntelligenceDashboardHomepage />} />
              <Route path="/research-excellence-portal/*" element={<ResearchExcellencePortal />} />
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
              <Route path="/audiences" element={<Navigate to="/audiences/general-public" replace />} />
              <Route path="/audiences/:slug" element={<AudiencePage />} />

              {/* Divisions Routes */}
              <Route path="/divisions" element={<DivisionsHub />} />
              <Route path="/divisions/:slug" element={<DivisionPage />} />

              {/* Library System Routes */}
              <Route path="/library" element={<LibraryCatalogue />} />
              <Route path="/library/item/:id" element={<ItemDetail />} />
              <Route path="/library/patron-portal" element={<PatronPortal />} />
              <Route path="/register" element={<UnifiedRegistration />} />
              <Route path="/library-register" element={<LibraryRegister />} />
              <Route path="/library-login" element={<LibraryLogin />} />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/library-dashboard" 
                element={
                  <ProtectedRoute>
                    <LibraryDashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/library-research-submit" 
                element={
                  <ProtectedRoute requiredRole="researcher">
                    <LibraryResearchSubmit />
                  </ProtectedRoute>
                } 
              />

              {/* Library Admin Routes */}
              <Route path="/admin/library" element={<LibraryAdminDashboard />} />
              <Route path="/admin/library/research-review" element={<ResearchReviewDashboard />} />
              <Route path="/admin/library/cataloguing" element={<EnhancedCataloguingManager />} />
              <Route path="/admin/library/cataloguing/basic" element={<CataloguingManager />} />
              <Route path="/admin/library/circulation" element={<CirculationManager />} />
              <Route path="/admin/library/patrons" element={<PatronManager />} />
              <Route path="/admin/library/acquisitions" element={<AcquisitionsManager />} />

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

              {/* Analytics Admin Routes - Phase 5 */}
              <Route path="/admin/analytics" element={<AnalyticsAdmin />} />
              <Route path="/admin/analytics/predictions" element={<PredictionsAdmin />} />
              <Route path="/admin/analytics/simulations" element={<SimulationsEconomicAdmin />} />
              <Route path="/admin/analytics/assessments" element={<SimulationsEconomicAdmin />} />
              <Route path="/admin/analytics/economic" element={<SimulationsEconomicAdmin />} />

              {/* Fish Advisory System Routes */}
              <Route path="/fish-advisory-system" element={<FishAdvisorySystem />} />
              <Route path="/admin/fish-advisory" element={<FishAdvisoryAdmin />} />

              {/* Lab Results Portal Routes */}
              <Route path="/lab-results" element={<LabResultsPortal />} />
              <Route path="/admin/lab-results" element={<LabResultsAdmin />} />

              {/* Research Vessel Booking Routes */}
              <Route path="/research-vessel-booking" element={<ResearchVesselBooking />} />
              <Route path="/admin/research-vessel" element={<ResearchVesselAdmin />} />

              {/* Scientific Evidence Repository Route */}
              <Route path="/scientific-evidence-repository" element={<ScientificEvidenceRepository />} />

              {/* Export Market Intelligence Route */}
              <Route path="/export-market-intelligence" element={<ExportMarketIntelligence />} />

              {/* Media Press Kit Route */}
              <Route path="/media-press-kit" element={<MediaPressKit />} />

              {/* Open Data Portal Route */}
              <Route path="/open-data-portal" element={<OpenDataPortal />} />

              {/* Marine Incident Portal Routes */}
              <Route path="/marine-incident-portal" element={<MarineIncidentPortal />} />
              <Route path="/admin/marine-incident" element={<MarineIncidentAdmin />} />

              {/* Project Pipeline Tracker Routes */}
              <Route path="/project-pipeline-tracker" element={<ProjectPipelineTracker />} />
              <Route path="/admin/project-pipeline" element={<ProjectPipelineAdmin />} />

              {/* Recruitment ATS Admin Route */}
              <Route path="/admin/recruitment-ats" element={<RecruitmentATSAdmin />} />

              {/* Bathymetry Data Admin Route */}
              <Route path="/admin/bathymetry" element={<BathymetryAdmin />} />

              {/* Marine Spatial Planning Viewer Route */}
              <Route path="/marine-spatial-planning-viewer" element={<MarineSpatialPlanningViewer />} />

              {/* Data Center Integration Hub Admin Route */}
              <Route path="/admin/data-center-integration" element={<DataCenterIntegrationAdmin />} />

              {/* Water Quality Monitoring Admin Route */}
              <Route path="/admin/water-quality-monitoring" element={<WaterQualityMonitoringAdmin />} />

              {/* Public Consultation Portal Routes */}
              <Route path="/public-consultation-portal" element={<PublicConsultationPortal />} />
              <Route path="/admin/public-consultation" element={<PublicConsultationAdmin />} />

              {/* Phase 4 Data Seeder */}
              <Route path="/admin/phase4-seeder" element={<Phase4DataSeeder />} />

              {/* Analytics Hub - Phase 5 */}
              <Route path="/analytics" element={<AnalyticsHub />} />
              <Route path="/analytics/predictive" element={<PredictiveAnalyticsDashboard />} />
              <Route path="/analytics/impact-assessment" element={<ImpactAssessmentPortal />} />
              <Route path="/analytics/economic-valuation" element={<EconomicValuationDashboard />} />
              <Route path="/analytics/policy-simulator" element={<PolicySimulatorInterface />} />
                  </RouterRoutes>
                </Layout>
              </ErrorBoundary>
            </Suspense>
          </LibraryUserProvider>
        </CartProvider>
      </FirebaseAuthProvider>
    </BrowserRouter>
  );
}

export default Routes;
