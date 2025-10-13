import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Users,
  Upload,
  Calendar,
  Briefcase,
  Building,
  Clock,
  CheckCircle,
  Eye,
  User,
  Phone,
  Award,
  Settings,
  Bell,
  Send,
  AlertTriangle,
  Loader,
  X,
  RefreshCw,
  Sparkles,
  BarChart3,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  Shield,
  Globe2,
  MapPin
} from 'lucide-react';
import { ProcurementAuthProvider, useProcurementAuth } from '../../contexts/ProcurementAuthContext';
import { useTranslation } from 'react-i18next';
import {
  procurementService,
  recruitmentService,
  fileUploadService,
  dashboardService,
  handleApiError
} from '../../services/procurementRecruitmentService';

const ProcurementRecruitmentPortal = () => (
  <ProcurementAuthProvider>
    <PortalExperience />
  </ProcurementAuthProvider>
);

const PortalExperience = () => {
  const { t } = useTranslation('procurement');
  const translate = useCallback(
    (key, defaultValue, options = {}) => t(key, { defaultValue, ...options }),
    [t]
  );

  const {
    user,
    isAuthenticated,
    loading: authLoading,
    error: authError,
    login,
    register,
    logout
  } = useProcurementAuth();

  const [activeTab, setActiveTab] = useState('procurement');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);

  const [procurementNotices, setProcurementNotices] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registrationForm, setRegistrationForm] = useState({
    email: '',
    password: '',
    user_type: 'vendor',
    first_name: '',
    last_name: '',
    phone_number: '',
    nic_number: '',
    organization: ''
  });

  const [uploadedFiles, setUploadedFiles] = useState({});

  const [procurementCategory, setProcurementCategory] = useState('all');
  const [procurementSort, setProcurementSort] = useState('deadline');
  const [jobCategory, setJobCategory] = useState('all');
  const [jobSort, setJobSort] = useState('deadline');
  const [expandedNoticeId, setExpandedNoticeId] = useState(null);
  const [expandedJobId, setExpandedJobId] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, [activeTab]);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'dashboard') {
      loadDashboardData();
    }
  }, [isAuthenticated, activeTab]);

  useEffect(() => {
    setExpandedNoticeId(null);
    setExpandedJobId(null);

    if (activeTab === 'procurement') {
      setProcurementCategory('all');
      setProcurementSort('deadline');
    }

    if (activeTab === 'recruitment') {
      setJobCategory('all');
      setJobSort('deadline');
    }
  }, [activeTab]);

  useEffect(() => {
    if (!isAuthenticated && activeTab === 'dashboard') {
      setActiveTab('procurement');
    }
  }, [isAuthenticated, activeTab]);

  const toDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const daysUntil = (value) => {
    const date = toDate(value);
    if (!date) return null;
    const now = new Date();
    const diff = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const parseNumericValue = (value) => {
    if (value === null || value === undefined) return null;
    if (typeof value === 'number') return value;
    const numeric = parseFloat(String(value).replace(/[^0-9.]/g, ''));
    return Number.isFinite(numeric) ? numeric : null;
  };

  const procurementCategoryOptions = useMemo(() => {
    const categories = new Set();
    procurementNotices?.forEach((notice) => {
      const label = notice?.category || notice?.notice_type;
      if (label) categories.add(label);
    });
    return ['all', ...Array.from(categories)];
  }, [procurementNotices]);

  const recruitmentCategoryOptions = useMemo(() => {
    const categories = new Set();
    jobPostings?.forEach((job) => {
      if (job?.category) categories.add(job?.category);
      else if (job?.department) categories.add(job?.department);
    });
    return ['all', ...Array.from(categories)];
  }, [jobPostings]);

  const filteredProcurementNotices = useMemo(() => {
    const items = [...(procurementNotices || [])];
    let filtered = items.filter(Boolean);

    if (procurementCategory !== 'all') {
      filtered = filtered.filter((notice) => {
        const label = notice?.category || notice?.notice_type;
        return label === procurementCategory;
      });
    }

    if (procurementSort === 'deadline') {
      filtered.sort((a, b) => {
        const aDays = daysUntil(a?.submission_deadline);
        const bDays = daysUntil(b?.submission_deadline);
        return (aDays ?? Infinity) - (bDays ?? Infinity);
      });
    }

    if (procurementSort === 'value') {
      filtered.sort((a, b) => {
        const aValue = parseNumericValue(a?.estimated_value) ?? 0;
        const bValue = parseNumericValue(b?.estimated_value) ?? 0;
        return bValue - aValue;
      });
    }

    if (procurementSort === 'recent') {
      filtered.sort((a, b) => {
        const aDate = toDate(a?.published_date) || toDate(a?.created_at);
        const bDate = toDate(b?.published_date) || toDate(b?.created_at);
        return (bDate?.getTime?.() ?? 0) - (aDate?.getTime?.() ?? 0);
      });
    }

    return filtered;
  }, [procurementNotices, procurementCategory, procurementSort]);

  const filteredJobPostings = useMemo(() => {
    const items = [...(jobPostings || [])];
    let filtered = items.filter(Boolean);

    if (jobCategory !== 'all') {
      filtered = filtered.filter((job) => job?.category === jobCategory || job?.department === jobCategory);
    }

    if (jobSort === 'deadline') {
      filtered.sort((a, b) => {
        const aDays = daysUntil(a?.application_deadline);
        const bDays = daysUntil(b?.application_deadline);
        return (aDays ?? Infinity) - (bDays ?? Infinity);
      });
    }

    if (jobSort === 'salary') {
      filtered.sort((a, b) => {
        const aValue = parseNumericValue(a?.salary_range_max) ?? parseNumericValue(a?.salary_range_min) ?? 0;
        const bValue = parseNumericValue(b?.salary_range_max) ?? parseNumericValue(b?.salary_range_min) ?? 0;
        return bValue - aValue;
      });
    }

    if (jobSort === 'recent') {
      filtered.sort((a, b) => {
        const aDate = toDate(a?.published_date) || toDate(a?.created_at);
        const bDate = toDate(b?.published_date) || toDate(b?.created_at);
        return (bDate?.getTime?.() ?? 0) - (aDate?.getTime?.() ?? 0);
      });
    }

    return filtered;
  }, [jobPostings, jobCategory, jobSort]);

  const procurementClosingSoonCount = useMemo(() => (
    (procurementNotices || []).filter((notice) => {
      const days = daysUntil(notice?.submission_deadline);
      return days !== null && days <= 7 && days >= 0;
    }).length
  ), [procurementNotices]);

  const recruitmentClosingSoonCount = useMemo(() => (
    (jobPostings || []).filter((job) => {
      const days = daysUntil(job?.application_deadline);
      return days !== null && days <= 7 && days >= 0;
    }).length
  ), [jobPostings]);

  const heroMetrics = useMemo(() => ([
    {
      icon: FileText,
      label: translate('hero.metrics.procurement.label', 'Open procurement RFPs'),
      value: procurementNotices?.length || 0,
      hint: procurementClosingSoonCount
        ? translate('hero.metrics.procurement.hint', '{{count}} closing within 7 days', {
            count: procurementClosingSoonCount
          })
        : translate('hero.metrics.procurement.hintFallback', 'Fresh tenders added daily')
    },
    {
      icon: Users,
      label: translate('hero.metrics.recruitment.label', 'Active career roles'),
      value: jobPostings?.length || 0,
      hint: recruitmentClosingSoonCount
        ? translate('hero.metrics.recruitment.hint', '{{count}} closing soon', {
            count: recruitmentClosingSoonCount
          })
        : translate('hero.metrics.recruitment.hintFallback', 'Multidisciplinary teams')
    },
    {
      icon: BarChart3,
      label: translate('hero.metrics.review.label', 'Average review time'),
      value:
        dashboardData?.statistics?.average_review_time ||
        translate('hero.metrics.review.valueFallback', '12 days'),
      hint: translate('hero.metrics.review.hint', 'Streamlined evaluation workflow')
    },
    {
      icon: Shield,
      label: translate('hero.metrics.partners.label', 'Registered partners'),
      value:
        dashboardData?.statistics?.registered_vendors ||
        translate('hero.metrics.partners.valueFallback', '1.2K+'),
      hint: translate('hero.metrics.partners.hint', 'Pre-qualified national vendors')
    }
  ]), [
    procurementNotices,
    jobPostings,
    dashboardData,
    procurementClosingSoonCount,
    recruitmentClosingSoonCount,
    translate
  ]);

  const navigationTabs = useMemo(() => {
    const base = [
      {
        key: 'procurement',
        label: translate('navigation.procurement.label', 'Procurement Exchange'),
        description: translate(
          'navigation.procurement.description',
          'Submit proposals, download briefs, and track tender milestones.'
        ),
        icon: FileText
      },
      {
        key: 'recruitment',
        label: translate('navigation.recruitment.label', 'Talent Hub'),
        description: translate(
          'navigation.recruitment.description',
          'Explore technical and scientific career opportunities at NARA.'
        ),
        icon: Users
      }
    ];

    if (isAuthenticated) {
      base.push({
        key: 'dashboard',
        label: translate('navigation.dashboard.label', 'My Workspace'),
        description: translate(
          'navigation.dashboard.description',
          'View application progress, notifications, and secure documents.'
        ),
        icon: Settings
      });
    }

    return base;
  }, [isAuthenticated, translate]);

  const activeTabMeta = navigationTabs.find((tab) => tab.key === activeTab) || navigationTabs[0];

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (activeTab === 'procurement') {
        const data = await procurementService?.getAllNotices({ status: 'active', page: 1, limit: 12 });
        setProcurementNotices(data?.notices || []);
      } else if (activeTab === 'recruitment') {
        const data = await recruitmentService?.getAllJobs({ status: 'active', page: 1, limit: 12 });
        setJobPostings(data?.jobs || []);
      }
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError?.message);
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService?.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event) => {
    event?.preventDefault();
    setSubmitting(true);
    setFormErrors({});

    const result = await login(loginForm);

    if (result?.success) {
      setShowLoginModal(false);
      setLoginForm({ email: '', password: '' });
      setError(null);
    } else {
      setFormErrors({ login: result?.error });
    }

    setSubmitting(false);
  };

  const handleRegistration = async (event) => {
    event?.preventDefault();
    setSubmitting(true);
    setFormErrors({});

    const result = await register(registrationForm);

    if (result?.success) {
      setShowRegistrationModal(false);
      setRegistrationForm({
        email: '',
        password: '',
        user_type: 'vendor',
        first_name: '',
        last_name: '',
        phone_number: '',
        nic_number: '',
        organization: ''
      });
      setError(null);
    } else {
      setFormErrors({ registration: result?.error });
    }

    setSubmitting(false);
  };

  const handleApplicationSubmit = async (event, applicationData) => {
    event?.preventDefault();
    setSubmitting(true);
    setFormErrors({});

    try {
      let result;

      if (activeTab === 'procurement') {
        result = await procurementService?.submitApplication(selectedNotice?.notice_id, applicationData);
      } else {
        result = await recruitmentService?.submitApplication(selectedNotice?.job_id, applicationData);
      }

      const fileInputs = event?.target?.querySelectorAll('input[type="file"]');
      const filesToUpload = [];
      const documentTypes = [];

      fileInputs?.forEach((input) => {
        if (input?.files?.length) {
          Array.from(input.files).forEach((file) => {
            filesToUpload.push(file);
            documentTypes.push(input?.dataset?.documentType || 'Supporting Document');
          });
        }
      });

      if (filesToUpload?.length) {
        setUploading(true);
        await fileUploadService?.uploadDocuments(filesToUpload, {
          application_id: result?.application_id,
          application_type: activeTab === 'procurement' ? 'procurement' : 'job',
          document_types: documentTypes
        });
      }

      setShowApplicationModal(false);
      setSelectedNotice(null);
      setError(null);
      alert('Application submitted successfully!');
    } catch (err) {
      const apiError = handleApiError(err);
      setFormErrors({ application: apiError?.message });
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const handleFileUpload = (event, documentType) => {
    const files = Array.from(event?.target?.files || []);
    setUploadedFiles((prev) => ({
      ...prev,
      [documentType]: files
    }));
  };

  const handleManualRefresh = () => {
    loadInitialData();
  };

  const handleOpenApplication = (item) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setSelectedNotice(item);
    setShowApplicationModal(true);
  };

  const renderProcurementSection = () => (
    <motion.section
      key="procurement"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-3">
            Procurement Exchange
          </h2>
          <p className="text-slate-300">
            Access live tenders, download technical briefs, and submit proposals that advance Sri Lanka’s
            blue-economy infrastructure.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-slate-400">Filter by scope</span>
            <select
              value={procurementCategory}
              onChange={(event) => setProcurementCategory(event.target.value)}
              className="mt-1 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
            >
              {procurementCategoryOptions.map((option) => (
                <option key={option} value={option} className="bg-slate-900">
                  {option === 'all' ? 'All notices' : option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-slate-400">Sort</span>
            <select
              value={procurementSort}
              onChange={(event) => setProcurementSort(event.target.value)}
              className="mt-1 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
            >
              <option value="deadline">Closing soon</option>
              <option value="value">Highest value</option>
              <option value="recent">Recently published</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
        <aside className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <div className="flex items-center gap-3 text-cyan-300">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm uppercase tracking-[0.2em]">Opportunity Pulse</span>
            </div>
            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Closing within 7 days</span>
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-cyan-300">
                  {procurementClosingSoonCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Average tender value</span>
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-cyan-300">
                  {(() => {
                    const values = (procurementNotices || [])
                      .map((item) => parseNumericValue(item?.estimated_value))
                      .filter((value) => value);
                    if (!values.length) return '—';
                    const avg = values.reduce((sum, value) => sum + value, 0) / values.length;
                    return `LKR ${(avg / 1_000_000).toFixed(1)}M`;
                  })()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Registered vendors</span>
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-cyan-300">
                  {dashboardData?.statistics?.registered_vendors || '1.2K+'}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold text-white">Procurement Support</h3>
            <p className="mt-3 text-sm text-slate-400">
              Dedicated procurement officers are available for clarifications on documentation, site
              visits, and compliance requirements.
            </p>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-cyan-300" />
                <span>+94 11 234 5675</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-300" />
                <span>Procurement Unit, NARA HQ</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-cyan-300" />
                <span>procurement@nara.gov.lk</span>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          {filteredProcurementNotices?.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-300">
              <FileText className="mx-auto mb-4 h-10 w-10 text-slate-500" />
              No active procurement notices match your filters right now.
            </div>
          ) : (
            filteredProcurementNotices.map((notice) => {
              const daysLeft = daysUntil(notice?.submission_deadline);
              const isExpanded = expandedNoticeId === notice?.notice_id;

              return (
                <motion.div
                  key={notice?.notice_id || notice?.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />

                  <div className="relative space-y-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-cyan-500/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-cyan-300">
                            {notice?.category || notice?.notice_type || 'Procurement'}
                          </span>
                          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-wider text-slate-300">
                            {notice?.status || 'Active'}
                          </span>
                        </div>
                        <h3 className="mt-3 text-2xl font-semibold text-white">
                          {notice?.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-300">
                          {notice?.description}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-700 bg-slate-950/80 px-5 py-4 text-right">
                        <span className="block text-xs uppercase tracking-wider text-slate-400">Deadline</span>
                        <span className="text-lg font-semibold text-white">
                          {notice?.submission_deadline || 'TBC'}
                        </span>
                        {daysLeft !== null && (
                          <span className={`mt-1 block text-xs font-medium ${
                            daysLeft <= 3
                              ? 'text-red-300'
                              : daysLeft <= 7
                                ? 'text-amber-300'
                                : 'text-cyan-300'
                          }`}>
                            {daysLeft < 0 ? 'Closed' : `${daysLeft} days remaining`}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 text-sm sm:grid-cols-3">
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                        <Briefcase className="h-4 w-4 text-cyan-300" />
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-400">Department</p>
                          <p className="text-slate-200">{notice?.department || 'NARA Procurement'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                        <Building className="h-4 w-4 text-cyan-300" />
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-400">Estimated Value</p>
                          <p className="text-slate-200">{notice?.estimated_value || 'Contact procurement'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                        <Clock className="h-4 w-4 text-cyan-300" />
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-400">Bid Opening</p>
                          <p className="text-slate-200">{notice?.bid_opening_date || 'Refer notice'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setExpandedNoticeId(isExpanded ? null : notice?.notice_id)}
                        className="flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300"
                      >
                        <Eye className="h-4 w-4" />
                        View requirements
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                      </button>
                      <button
                        onClick={() => handleOpenApplication(notice)}
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01]"
                      >
                        <Send className="h-4 w-4" />
                        Submit proposal
                      </button>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60 p-6"
                        >
                          <div className="grid gap-6 md:grid-cols-2">
                            <div>
                              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                                Submission checklist
                              </h4>
                              {(() => {
                                const docs = Array.isArray(notice?.documents_required)
                                  ? notice.documents_required
                                  : [];

                                if (!docs.length) {
                                  return (
                                    <ul className="mt-3 space-y-2 text-sm text-slate-400">
                                      <li>Refer to RFP for the full documentation list.</li>
                                    </ul>
                                  );
                                }

                                return (
                                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                                    {docs.map((doc, index) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <CheckCircle className="mt-0.5 h-4 w-4 text-cyan-300" />
                                        <span>{doc}</span>
                                      </li>
                                    ))}
                                  </ul>
                                );
                              })()}
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                                Key milestones
                              </h4>
                              <div className="mt-3 space-y-3 text-sm text-slate-300">
                                <div className="flex items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
                                  <Calendar className="h-4 w-4 text-cyan-300" />
                                  <div>
                                    <p className="font-medium text-slate-200">Clarifications window</p>
                                    <p className="text-xs text-slate-400">
                                      {notice?.clarification_deadline || 'Refer published notice'}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
                                  <Building className="h-4 w-4 text-cyan-300" />
                                  <div>
                                    <p className="font-medium text-slate-200">Bid opening venue</p>
                                    <p className="text-xs text-slate-400">
                                      {notice?.submission_venue || 'NARA Procurement Division'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </motion.section>
  );

  const renderRecruitmentSection = () => (
    <motion.section
      key="recruitment"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-3">
            Talent Hub
          </h2>
          <p className="text-slate-300">
            Join multidisciplinary teams advancing ocean science, climate resilience, and digital
            innovation across Sri Lanka’s maritime economy.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-slate-400">Focus area</span>
            <select
              value={jobCategory}
              onChange={(event) => setJobCategory(event.target.value)}
              className="mt-1 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
            >
              {recruitmentCategoryOptions.map((option) => (
                <option key={option} value={option} className="bg-slate-900">
                  {option === 'all' ? 'All roles' : option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-wider text-slate-400">Sort</span>
            <select
              value={jobSort}
              onChange={(event) => setJobSort(event.target.value)}
              className="mt-1 rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
            >
              <option value="deadline">Closing soon</option>
              <option value="salary">Highest salary</option>
              <option value="recent">Recently posted</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
        <aside className="space-y-6">
          <div className="rounded-3xl border border-emerald-500/20 bg-slate-900/60 p-6">
            <div className="flex items-center gap-3 text-emerald-300">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm uppercase tracking-[0.2em]">Career Insights</span>
            </div>
            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <div className="flex items-center justify-between">
                <span>Roles closing soon</span>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-300">
                  {recruitmentClosingSoonCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Hybrid / remote options</span>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-300">
                  {(jobPostings || []).filter((job) => job?.work_mode?.toLowerCase?.() === 'hybrid').length || '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Scholarship-linked positions</span>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-emerald-300">
                  {(jobPostings || []).filter((job) => job?.benefits?.toLowerCase?.().includes?.('scholarship')).length || '—'}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
            <h3 className="text-lg font-semibold text-white">Talent Concierge</h3>
            <p className="mt-3 text-sm text-slate-400">
              Our HR team guides shortlisted candidates through assessments, interviews, and relocation
              logistics.
            </p>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-400" />
                <span>+94 11 234 5680</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400" />
                <span>People & Culture Division</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe2 className="h-4 w-4 text-emerald-400" />
                <span>careers@nara.gov.lk</span>
              </div>
            </div>
          </div>
        </aside>

        <div className="space-y-6">
          {filteredJobPostings?.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-300">
              <Users className="mx-auto mb-4 h-10 w-10 text-slate-500" />
              No active roles match your filters right now.
            </div>
          ) : (
            filteredJobPostings.map((job) => {
              const daysLeft = daysUntil(job?.application_deadline);
              const isExpanded = expandedJobId === job?.job_id;

              return (
                <motion.div
                  key={job?.job_id || job?.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="relative overflow-hidden rounded-3xl border border-emerald-500/10 bg-slate-900/60 p-6"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />

                  <div className="relative space-y-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-medium uppercase tracking-wider text-emerald-300">
                            {job?.category || 'Career role'}
                          </span>
                          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-wider text-slate-300">
                            {job?.status || 'Open'}
                          </span>
                        </div>
                        <h3 className="mt-3 text-2xl font-semibold text-white">
                          {job?.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-300">
                          {job?.description}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-slate-700 bg-slate-950/80 px-5 py-4 text-right">
                        <span className="block text-xs uppercase tracking-wider text-slate-400">Apply by</span>
                        <span className="text-lg font-semibold text-white">
                          {job?.application_deadline || 'TBC'}
                        </span>
                        {daysLeft !== null && (
                          <span className={`mt-1 block text-xs font-medium ${
                            daysLeft <= 3
                              ? 'text-red-300'
                              : daysLeft <= 7
                                ? 'text-amber-300'
                                : 'text-emerald-300'
                          }`}>
                            {daysLeft < 0 ? 'Closed' : `${daysLeft} days remaining`}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid gap-4 text-sm sm:grid-cols-3">
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                        <Building className="h-4 w-4 text-emerald-300" />
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-400">Department</p>
                          <p className="text-slate-200">{job?.department || 'NARA'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                        <Award className="h-4 w-4 text-emerald-300" />
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-400">Qualifications</p>
                          <p className="text-slate-200">{job?.qualifications_required || 'See full brief'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3">
                        <Briefcase className="h-4 w-4 text-emerald-300" />
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-400">Salary Band</p>
                          <p className="text-slate-200">
                            {job?.salary_range_min && job?.salary_range_max
                              ? `LKR ${job.salary_range_min} - ${job.salary_range_max}`
                              : job?.salary_range || 'Aligned with NARA scales'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setExpandedJobId(isExpanded ? null : job?.job_id)}
                        className="flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-emerald-400 hover:text-emerald-300"
                      >
                        <Eye className="h-4 w-4" />
                        Role overview
                        <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleOpenApplication(job)}
                        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01]"
                      >
                        <Send className="h-4 w-4" />
                        Submit application
                      </button>
                    </div>

                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden rounded-2xl border border-emerald-500/10 bg-slate-950/60 p-6"
                        >
                          <div className="grid gap-6 md:grid-cols-2">
                            <div>
                              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                                Responsibilities
                              </h4>
                              {(() => {
                                const responsibilities = Array.isArray(job?.responsibilities)
                                  ? job.responsibilities
                                  : [];

                                if (!responsibilities.length) {
                                  return (
                                    <ul className="mt-3 space-y-2 text-sm text-slate-400">
                                      <li>Refer to the job description for detailed responsibilities.</li>
                                    </ul>
                                  );
                                }

                                return (
                                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                                    {responsibilities.map((item, index) => (
                                      <li key={index} className="flex items-start gap-2">
                                        <ChevronRight className="mt-0.5 h-4 w-4 text-emerald-300" />
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                );
                              })()}
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                                Candidate profile
                              </h4>
                              <div className="mt-3 space-y-3 text-sm text-slate-300">
                                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
                                  <span className="block text-xs uppercase tracking-wider text-slate-400">Experience</span>
                                  <span>{job?.experience_required || 'Graduate to senior levels considered'}</span>
                                </div>
                                <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 px-4 py-3">
                                  <span className="block text-xs uppercase tracking-wider text-slate-400">Contract type</span>
                                  <span>{job?.employment_type || 'Full-time'}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </motion.section>
  );

  const renderDashboardSection = () => (
    <motion.section
      key="dashboard"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="space-y-10"
    >
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-3">
            My Workspace
          </h2>
          <p className="text-slate-300">
            Track every procurement proposal and career application with live status updates,
            notifications, and secure document management.
          </p>
        </div>
      </div>

      {dashboardData ? (
        <div className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <DashboardMetric
              icon={FileText}
              label="Submitted applications"
              primary={dashboardData?.statistics?.submitted_applications || 0}
              accent="from-cyan-500 to-blue-600"
            />
            <DashboardMetric
              icon={CheckCircle}
              label="Under review"
              primary={dashboardData?.statistics?.under_review_applications || 0}
              accent="from-emerald-500 to-teal-500"
            />
            <DashboardMetric
              icon={Clock}
              label="Awaiting documents"
              primary={dashboardData?.statistics?.pending_documents || 0}
              accent="from-amber-500 to-orange-500"
            />
            <DashboardMetric
              icon={Bell}
              label="Unread notifications"
              primary={dashboardData?.notifications?.length || 0}
              accent="from-purple-500 to-pink-500"
            />
          </div>

          <div className="grid gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Recent submissions</h3>
                  <span className="text-xs uppercase tracking-wider text-slate-400">Last 10 records</span>
                </div>
                <div className="mt-4 space-y-3">
                  {dashboardData?.recent_applications?.length ? (
                    dashboardData?.recent_applications?.map((application, index) => (
                      <div
                        key={index}
                        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-200">{application?.title}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span>{application?.submitted_on || application?.submission_date}</span>
                            <span>•</span>
                            <span>
                              {application?.application_type === 'procurement' ? 'Procurement' : 'Career'}
                            </span>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                            application?.status === 'under_review'
                              ? 'bg-amber-500/10 text-amber-300'
                              : application?.status === 'submitted'
                                ? 'bg-cyan-500/10 text-cyan-300'
                                : 'bg-emerald-500/10 text-emerald-300'
                          }`}
                        >
                          {(application?.status || 'submitted').replace('_', ' ')}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-6 text-center text-slate-400">
                      No submissions yet. Start by applying to a tender or role.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
                <h3 className="text-xl font-semibold text-white">Notifications</h3>
                <div className="mt-4 space-y-3">
                  {dashboardData?.notifications?.length ? (
                    dashboardData?.notifications?.map((notification, index) => (
                      <div key={index} className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4">
                        <p className="text-sm font-medium text-slate-200">{notification?.title}</p>
                        <p className="mt-1 text-xs text-slate-400">{notification?.message}</p>
                        <span className="mt-2 block text-xs text-slate-500">{notification?.sent_date}</span>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-6 text-center text-slate-400">
                      You are all caught up!
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-6">
                <h3 className="text-xl font-semibold text-white">Need assistance?</h3>
                <p className="mt-3 text-sm text-slate-300">
                  Our digital support desk can help with account access, submission troubleshooting, and
                  document uploads.
                </p>
                <button className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-300">
                  <Phone className="h-4 w-4" />
                  Contact support
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-12 text-center text-slate-300">
          <Settings className="mx-auto mb-4 h-10 w-10 text-slate-500" />
          {loading ? 'Loading your workspace...' : 'Dashboard data will appear after submitting applications.'}
        </div>
      )}
    </motion.section>
  );

  const LoginModal = () => (
    <AnimatePresence>
      {showLoginModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 px-4 backdrop-blur"
          onClick={() => setShowLoginModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-slate-100 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-cyan-300">
              <User className="h-5 w-5" />
              <span className="text-sm uppercase tracking-[0.3em]">Secure login</span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-white">Access your NARA workspace</h3>
            <p className="mt-2 text-sm text-slate-400">
              Sign in to continue submitting tenders and tracking applications.
            </p>

            {formErrors?.login && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                <AlertTriangle className="h-4 w-4" />
                {formErrors?.login}
              </div>
            )}

            <form onSubmit={handleLogin} className="mt-6 space-y-5">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-400">Email address</label>
                <input
                  type="email"
                  required
                  value={loginForm?.email}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                  placeholder="name@company.lk"
                  disabled={submitting}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-400">Password</label>
                <input
                  type="password"
                  required
                  value={loginForm?.password}
                  onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                  placeholder="••••••••"
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? <Loader className="h-4 w-4 animate-spin" /> : null}
                {submitting ? 'Authenticating…' : 'Login'}
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3 text-sm text-slate-300">
              <span className="text-slate-400">New to the portal?</span>{' '}
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setShowRegistrationModal(true);
                }}
                className="font-medium text-cyan-300 hover:text-cyan-200"
                disabled={submitting}
              >
                Create a vendor or talent account
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const RegistrationModal = () => (
    <AnimatePresence>
      {showRegistrationModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 px-4 backdrop-blur"
          onClick={() => setShowRegistrationModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900/90 p-8 text-slate-100 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-cyan-300">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm uppercase tracking-[0.3em]">Create account</span>
            </div>
            <h3 className="mt-4 text-2xl font-semibold text-white">Join the NARA Partner Network</h3>
            <p className="mt-2 text-sm text-slate-400">
              Register once to access both procurement notices and recruitment opportunities.
            </p>

            {formErrors?.registration && (
              <div className="mt-4 flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                <AlertTriangle className="h-4 w-4" />
                {formErrors?.registration}
              </div>
            )}

            <form onSubmit={handleRegistration} className="mt-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400">First name</label>
                  <input
                    type="text"
                    required
                    value={registrationForm?.first_name}
                    onChange={(event) => setRegistrationForm((prev) => ({ ...prev, first_name: event.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400">Last name</label>
                  <input
                    type="text"
                    required
                    value={registrationForm?.last_name}
                    onChange={(event) => setRegistrationForm((prev) => ({ ...prev, last_name: event.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400">Email address</label>
                  <input
                    type="email"
                    required
                    value={registrationForm?.email}
                    onChange={(event) => setRegistrationForm((prev) => ({ ...prev, email: event.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400">Phone number</label>
                  <input
                    type="tel"
                    required
                    value={registrationForm?.phone_number}
                    onChange={(event) => setRegistrationForm((prev) => ({ ...prev, phone_number: event.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400">Organization</label>
                  <input
                    type="text"
                    value={registrationForm?.organization}
                    onChange={(event) => setRegistrationForm((prev) => ({ ...prev, organization: event.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                    disabled={submitting}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-400">NIC / Registration</label>
                  <input
                    type="text"
                    value={registrationForm?.nic_number}
                    onChange={(event) => setRegistrationForm((prev) => ({ ...prev, nic_number: event.target.value }))}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                    disabled={submitting}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-400">Account type</label>
                <select
                  value={registrationForm?.user_type}
                  onChange={(event) => setRegistrationForm((prev) => ({ ...prev, user_type: event.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                  disabled={submitting}
                >
                  <option value="vendor">Vendor / Supplier</option>
                  <option value="consultant">Consultant</option>
                  <option value="individual">Individual applicant</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider text-slate-400">Password</label>
                <input
                  type="password"
                  required
                  value={registrationForm?.password}
                  onChange={(event) => setRegistrationForm((prev) => ({ ...prev, password: event.target.value }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                  placeholder="Create a secure password"
                  disabled={submitting}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? <Loader className="h-4 w-4 animate-spin" /> : null}
                {submitting ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const ApplicationModal = ({ type, item }) => (
    <AnimatePresence>
      {showApplicationModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 px-4 backdrop-blur"
          onClick={() => {
            setShowApplicationModal(false);
            setSelectedNotice(null);
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 text-slate-100 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-800 bg-slate-900/80 px-6 py-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-cyan-300">
                  {type === 'procurement' ? 'Proposal submission' : 'Career application'}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {item?.title || 'Application'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowApplicationModal(false);
                  setSelectedNotice(null);
                }}
                className="rounded-full border border-slate-700 p-2 text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto px-6 py-6">
              {formErrors?.application && (
                <div className="mb-4 flex items-center gap-2 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                  <AlertTriangle className="h-4 w-4" />
                  {formErrors?.application}
                </div>
              )}

              {uploading && (
                <div className="mb-4 flex items-center gap-2 rounded-2xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
                  <Loader className="h-4 w-4 animate-spin" />
                  Uploading supporting documents…
                </div>
              )}

              {type === 'procurement' ? (
                <form
                  onSubmit={(event) => {
                    const formData = new FormData(event.target);
                    const payload = {
                      company_name: formData.get('company_name'),
                      technical_proposal: formData.get('technical_proposal'),
                      financial_proposal: formData.get('financial_proposal'),
                      delivery_timeline: formData.get('delivery_timeline'),
                      warranty_period: formData.get('warranty_period'),
                      payment_terms: formData.get('payment_terms'),
                      additional_information: formData.get('additional_information')
                    };
                    handleApplicationSubmit(event, payload);
                  }}
                  className="space-y-6"
                >
                  <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 text-sm text-cyan-100">
                    <div className="font-medium text-cyan-200">{item?.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-cyan-200/80">
                      <span>Deadline: {item?.submission_deadline || 'Refer notice'}</span>
                      <span>•</span>
                      <span>Estimated value: {item?.estimated_value || 'Upon request'}</span>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-400">Company name</label>
                      <input
                        name="company_name"
                        type="text"
                        required
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                        disabled={submitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-400">Delivery timeline (weeks)</label>
                      <input
                        name="delivery_timeline"
                        type="number"
                        min="0"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-400">Technical proposal</label>
                    <textarea
                      name="technical_proposal"
                      rows={6}
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                      placeholder="Outline methodology, deployment schedule, equipment specifications, and compliance measures."
                      disabled={submitting}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-400">Financial proposal (LKR)</label>
                      <input
                        name="financial_proposal"
                        type="number"
                        required
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                        disabled={submitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-400">Warranty period (months)</label>
                      <input
                        name="warranty_period"
                        type="number"
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-400">Payment terms</label>
                    <input
                      name="payment_terms"
                      type="text"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                      placeholder="e.g., 30% advance, balance on commissioning"
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-400">Additional information</label>
                    <textarea
                      name="additional_information"
                      rows={3}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-cyan-400 focus:outline-none"
                      placeholder="Certifications, local partners, or clarifications"
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs uppercase tracking-wider text-slate-400">Upload required documents</label>
                    <div className="grid gap-3">
                      {(item?.documents_required || ['Company profile', 'Financial statements']).map((doc, index) => (
                        <div
                          key={`${doc}-${index}`}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-sm text-slate-200"
                        >
                          <span>{doc}</span>
                          <div>
                            <input
                              id={`proc-doc-${index}`}
                              type="file"
                              multiple
                              data-document-type={doc}
                              onChange={(event) => handleFileUpload(event, doc)}
                              className="hidden"
                              disabled={submitting || uploading}
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                            <label
                              htmlFor={`proc-doc-${index}`}
                              className="inline-flex items-center gap-2 rounded-full border border-cyan-400 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:bg-cyan-500/10"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadedFiles?.[doc]?.length ? `${uploadedFiles[doc].length} files` : 'Upload'}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowApplicationModal(false);
                        setSelectedNotice(null);
                      }}
                      className="rounded-full border border-slate-700 px-5 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500"
                      disabled={submitting || uploading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || uploading}
                      className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {submitting ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {submitting ? 'Submitting…' : 'Submit proposal'}
                    </button>
                  </div>
                </form>
              ) : (
                <form
                  onSubmit={(event) => {
                    const formData = new FormData(event.target);
                    const payload = {
                      full_name: formData.get('full_name'),
                      email: formData.get('email'),
                      phone: formData.get('phone'),
                      cover_letter: formData.get('cover_letter'),
                      linkedin_profile: formData.get('linkedin_profile')
                    };
                    handleApplicationSubmit(event, payload);
                  }}
                  className="space-y-6"
                >
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-100">
                    <div className="font-medium text-emerald-200">{item?.title}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-emerald-200/80">
                      <span>Department: {item?.department || 'NARA'}</span>
                      <span>•</span>
                      <span>Deadline: {item?.application_deadline || 'Refer notice'}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-400">Full name</label>
                    <input
                      name="full_name"
                      type="text"
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
                      disabled={submitting}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-400">Email address</label>
                      <input
                        name="email"
                        type="email"
                        required
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
                        disabled={submitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider text-slate-400">Phone number</label>
                      <input
                        name="phone"
                        type="tel"
                        required
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
                        disabled={submitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-400">Cover letter</label>
                    <textarea
                      name="cover_letter"
                      rows={6}
                      required
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
                      placeholder="Share your motivation, expertise, and alignment with NARA’s mission."
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-slate-400">LinkedIn profile / Portfolio</label>
                    <input
                      name="linkedin_profile"
                      type="url"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:border-emerald-400 focus:outline-none"
                      placeholder="https://"
                      disabled={submitting}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs uppercase tracking-wider text-slate-400">Upload supporting documents</label>
                    <div className="grid gap-3">
                      {['Curriculum Vitae', 'Academic transcripts', 'Professional certifications'].map((doc, index) => (
                        <div
                          key={`${doc}-${index}`}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 text-sm text-slate-200"
                        >
                          <span>{doc}</span>
                          <div>
                            <input
                              id={`job-doc-${index}`}
                              type="file"
                              data-document-type={doc}
                              onChange={(event) => handleFileUpload(event, doc)}
                              className="hidden"
                              disabled={submitting || uploading}
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                            <label
                              htmlFor={`job-doc-${index}`}
                              className="inline-flex items-center gap-2 rounded-full border border-emerald-400 px-4 py-2 text-sm font-medium text-emerald-300 transition hover:bg-emerald-500/10"
                            >
                              <Upload className="h-4 w-4" />
                              {uploadedFiles?.[doc]?.length ? `${uploadedFiles[doc].length} files` : 'Upload'}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowApplicationModal(false);
                        setSelectedNotice(null);
                      }}
                      className="rounded-full border border-slate-700 px-5 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-500"
                      disabled={submitting || uploading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || uploading}
                      className="flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {submitting ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      {submitting ? 'Submitting…' : 'Submit application'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-100">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -left-32 top-0 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(12,74,110,0.35),_transparent_65%)]" />
        </div>

        <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 pb-16 pt-20 md:px-6">
          <div className="grid gap-10 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.35em] text-cyan-200">
                <Sparkles className="h-4 w-4" />
                {translate('hero.badge', 'NARA Digital Procurement & Recruitment')}
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
                {translate(
                  'hero.title',
                  'Seamless tenders & talent journeys for Sri Lanka’s ocean innovation hub'
                )}
              </h1>
              <p className="text-lg text-slate-300 md:text-xl">
                {translate(
                  'hero.description',
                  'Manage procurement submissions, collaborate with evaluators, and apply to multidisciplinary roles—all in one secure digital workspace governed by NARA.'
                )}
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('procurement')}
                  className={`flex items-center gap-2 rounded-full border border-cyan-500/40 px-5 py-3 text-sm font-semibold transition ${
                    activeTab === 'procurement'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25'
                      : 'text-cyan-200 hover:border-cyan-300 hover:text-white'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  {translate('hero.actions.procurement', 'Browse procurement')}
                </button>
                <button
                  onClick={() => setActiveTab('recruitment')}
                  className={`flex items-center gap-2 rounded-full border border-emerald-500/40 px-5 py-3 text-sm font-semibold transition ${
                    activeTab === 'recruitment'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20'
                      : 'text-emerald-200 hover:border-emerald-300 hover:text-white'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  {translate('hero.actions.recruitment', 'View career roles')}
                </button>
                {!isAuthenticated && (
                  <button
                    onClick={() => setShowRegistrationModal(true)}
                    className="flex items-center gap-2 rounded-full border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-500"
                  >
                    <ArrowRight className="h-4 w-4" />
                    {translate('hero.actions.createAccount', 'Create account')}
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-cyan-300" />
                  <span>
                    {translate('hero.highlights.security', 'GovTech security & transparent audit trails')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Globe2 className="h-4 w-4 text-emerald-300" />
                  <span>
                    {translate('hero.highlights.policy', 'Integrated with national procurement policy')}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-2xl">
              <div className="absolute -top-10 -right-6 h-28 w-28 rounded-full bg-cyan-500/20 blur-3xl" />
              <div className="absolute bottom-8 left-10 h-24 w-24 rounded-full bg-emerald-500/20 blur-3xl" />

              <div className="relative space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.3em] text-slate-400">
                    {translate('hero.timeline.title', 'Live timeline')}
                  </span>
                  <button
                    onClick={handleManualRefresh}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    {translate('hero.timeline.refresh', 'Refresh data')}
                  </button>
                </div>

                <div className="space-y-5 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-cyan-400" />
                    <div>
                      <p className="font-medium text-slate-100">
                        {translate(
                          'hero.timeline.items.0.title',
                          'Digital tender submissions rated in under 12 days'
                        )}
                      </p>
                      <p className="text-xs text-slate-400">
                        {translate('hero.timeline.items.0.subtitle', 'Average evaluation cycle across Q1 2024')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-emerald-400" />
                    <div>
                      <p className="font-medium text-slate-100">
                        {translate(
                          'hero.timeline.items.1.title',
                          'Trusted vendor network powering coastal modernization'
                        )}
                      </p>
                      <p className="text-xs text-slate-400">
                        {translate('hero.timeline.items.1.subtitle', '1,200+ pre-qualified partners nationwide')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-2 w-2 rounded-full bg-purple-400" />
                    <div>
                      <p className="font-medium text-slate-100">
                        {translate(
                          'hero.timeline.items.2.title',
                          'Scholarship-backed research fellowships live now'
                        )}
                      </p>
                      <p className="text-xs text-slate-400">
                        {translate(
                          'hero.timeline.items.2.subtitle',
                          'Work alongside NARA scientists on ocean intelligence'
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                {authLoading ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                    <div className="flex items-center gap-3">
                      <Loader className="h-4 w-4 animate-spin text-cyan-300" />
                      <span>{translate('hero.auth.loading', 'Checking your secure session…')}</span>
                    </div>
                  </div>
                ) : isAuthenticated ? (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-4 w-4 text-cyan-300" />
                      <span>
                        {translate('hero.auth.welcome', 'Welcome back, {{name}}.', {
                          name: user?.first_name || user?.email || translate('hero.auth.visitor', 'partner')
                        })}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className="inline-flex items-center gap-2 rounded-full border border-cyan-400 px-4 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/10"
                      >
                        {translate('hero.auth.goToWorkspace', 'Go to workspace')}
                      </button>
                      <button
                        onClick={logout}
                        className="inline-flex items-center gap-2 rounded-full border border-red-400 px-4 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/10"
                      >
                        {translate('hero.auth.logout', 'Logout')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-cyan-300" />
                      <span>
                        {translate(
                          'hero.auth.prompt',
                          'Already registered? Secure login for vendors & candidates.'
                        )}
                      </span>
                    </div>
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="mt-3 inline-flex items-center gap-2 rounded-full border border-cyan-400 px-4 py-2 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-500/10"
                    >
                      {translate('hero.auth.launchLogin', 'Launch login')}
                    </button>
                    {authError && (
                      <div className="mt-3 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                        {authError}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {heroMetrics.map((metric, index) => (
              <div
                key={metric.label}
                className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-6"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
                <div className="relative flex items-start justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-[0.3em] text-slate-500">{metric.label}</span>
                    <div className="mt-3 text-3xl font-semibold text-white">{metric.value}</div>
                    <p className="mt-2 text-sm text-slate-400">{metric.hint}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-cyan-200">
                    <metric.icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </header>

      <nav className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div className="flex flex-wrap gap-2">
            {navigationTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.key === activeTab;

              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'border-cyan-400 bg-cyan-500/10 text-cyan-200 shadow-[0_0_20px_rgba(34,211,238,0.15)]'
                      : 'border-slate-700 text-slate-300 hover:border-cyan-400 hover:text-cyan-200'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className="text-xs text-slate-400">
            {activeTabMeta?.description}
          </div>
        </div>
      </nav>

      {error && (
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              {error}
            </div>
            <button
              onClick={() => setError(null)}
              className="rounded-full border border-red-400/40 p-1 text-red-200 transition hover:border-red-300"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <main className="relative mx-auto max-w-7xl px-4 py-12 md:px-6">
        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 px-6 py-16 text-center text-slate-300">
            <Loader className="h-8 w-8 animate-spin text-cyan-300" />
            <p>Fetching the latest updates…</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {!loading && activeTab === 'procurement' && renderProcurementSection()}
          {!loading && activeTab === 'recruitment' && renderRecruitmentSection()}
          {!loading && activeTab === 'dashboard' && isAuthenticated && renderDashboardSection()}
        </AnimatePresence>
      </main>

      <footer className="border-t border-slate-800 bg-slate-950/80 py-16">
        <div className="mx-auto max-w-6xl space-y-8 px-4 text-center md:px-6">
          <h2 className="text-3xl font-semibold text-white">Co-create Sri Lanka’s ocean future with NARA</h2>
          <p className="mx-auto max-w-3xl text-lg text-slate-300">
            Collaborate with us on maritime surveillance, climate-resilient fisheries, digital
            infrastructure, and community impact programmes across the island.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setActiveTab('procurement')}
              className="flex items-center gap-2 rounded-full border border-cyan-400 px-6 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/10"
            >
              <FileText className="h-4 w-4" />
              Explore all procurement notices
            </button>
            <button
              onClick={() => setActiveTab('recruitment')}
              className="flex items-center gap-2 rounded-full border border-emerald-400 px-6 py-3 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/10"
            >
              <Users className="h-4 w-4" />
              Meet the teams hiring now
            </button>
          </div>
        </div>
      </footer>

      <LoginModal />
      <RegistrationModal />
      <ApplicationModal type={activeTab} item={selectedNotice} />
    </div>
  );
};

const DashboardMetric = ({ icon: Icon, label, primary, accent }) => (
  <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60 p-6">
    <div className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-10`} />
    <div className="relative space-y-4">
      <div className="inline-flex rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-cyan-200">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <span className="text-xs uppercase tracking-[0.3em] text-slate-500">{label}</span>
        <div className="mt-3 text-3xl font-semibold text-white">{primary}</div>
      </div>
    </div>
  </div>
);

export default ProcurementRecruitmentPortal;
