import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import FirebaseAuthProvider from './contexts/FirebaseAuthContext';

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
const FirebaseAdminAuthenticationPortal = lazy(() => import('./pages/firebase-admin-authentication-portal'));
const FirebaseAdminDashboardControlCenter = lazy(() => import('./pages/firebase-admin-dashboard-control-center'));

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
              <Route path="*" element={<NotFound />} />

              <Route
                path="/firebase-admin-authentication-portal"
                element={<FirebaseAdminAuthenticationPortal />}
              />
              <Route
                path="/firebase-admin-dashboard-control-center"
                element={<FirebaseAdminDashboardControlCenter />}
              />
            </RouterRoutes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </FirebaseAuthProvider>
  );
}

export default Routes;
