import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, FileText, Award, CheckCircle, AlertTriangle, Users,
  Plus, Loader, Ship, Anchor, Factory, Building, XCircle, Clock,
  TrendingUp, Sparkles, ArrowUpRight, Search, Filter, Download,
  Eye, ChevronRight, Zap, Target, Shield, Globe, Network, Scale,
  FileCheck, Bell, Calendar, MapPin, Phone, Mail, ExternalLink,
  Map, Waves
} from 'lucide-react';
import NauticalChartsSection from '../../components/government-services/NauticalChartsSection';
import HydrographicSurveySection from '../../components/government-services/HydrographicSurveySection';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import {
  eiaService,
  licensingService,
  complianceService,
  emergencyService,
  collaborationService,
  dashboardService
} from '../../services/governmentService';

const GovernmentServicesPortal = () => {
  const { t, i18n } = useTranslation(['common', 'knowledge']);
  const currentLang = i18n.language || 'en';
  const { user } = useFirebaseAuth();
  const { scrollYProgress } = useScroll();

  const heroY = useTransform(scrollYProgress, [0, 0.5], [0, 200]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const [activeSection, setActiveSection] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [eiaApplications, setEiaApplications] = useState([]);
  const [licenses, setLicenses] = useState([]);
  const [complianceRecords, setComplianceRecords] = useState([]);
  const [emergencyIncidents, setEmergencyIncidents] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const { data: statsData } = await dashboardService.getStatistics();
      setStats(statsData);

      if (user) {
        const [eiaData, licenseData, complianceData, emergencyData, workspaceData] = await Promise.all([
          eiaService.getUserSubmissions(user.uid),
          licensingService.getUserApplications(user.uid),
          complianceService.getRecords({ limit: 10 }),
          emergencyService.getIncidents({ limit: 10 }),
          collaborationService.getWorkspaces(user.uid)
        ]);

        setEiaApplications(eiaData.data || []);
        setLicenses(licenseData.data || []);
        setComplianceRecords(complianceData.data || []);
        setEmergencyIncidents(emergencyData.data || []);
        setWorkspaces(workspaceData.data || []);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const sections = useMemo(() => [
    {
      id: 'dashboard',
      name: { en: 'Dashboard', si: 'උපකරණ පුවරුව', ta: 'டாஷ்போர்டு' },
      icon: LayoutDashboard,
      color: 'from-cyan-400 to-blue-600',
      count: null
    },
    {
      id: 'eia',
      name: { en: 'EIA Management', si: 'පරිසර බලපෑම් තක්සේරුව', ta: 'சுற்றுச்சூழல் தாக்க மதிப்பீடு' },
      icon: FileText,
      color: 'from-blue-400 to-indigo-600',
      count: stats?.eia?.total
    },
    {
      id: 'licensing',
      name: { en: 'Digital Licensing', si: 'ඩිජිටල් බලපත්‍ර', ta: 'டிஜிட்டல் உரிமம்' },
      icon: Award,
      color: 'from-purple-400 to-pink-600',
      count: stats?.licenses?.total
    },
    {
      id: 'compliance',
      name: { en: 'Compliance Dashboard', si: 'අනුකූලතා පුවරුව', ta: 'இணக்க டாஷ்போர்டு' },
      icon: CheckCircle,
      color: 'from-green-400 to-emerald-600',
      count: stats?.compliance?.total
    },
    {
      id: 'emergency',
      name: { en: 'Emergency Response', si: 'හදිසි ප්‍රතිචාරය', ta: 'அவசர பதில்' },
      icon: AlertTriangle,
      color: 'from-red-400 to-orange-600',
      count: stats?.emergencies?.active
    },
    {
      id: 'collaboration',
      name: { en: 'Inter-Agency Collaboration', si: 'අන්තර් ආයතන සහයෝගීතාව', ta: 'நிறுவனங்களுக்கு இடையேயான ஒத்துழைப்பு' },
      icon: Users,
      color: 'from-amber-400 to-yellow-600',
      count: workspaces.length
    },
    {
      id: 'nautical-charts',
      name: { en: 'Nautical Charts', si: 'නාවික සිතියම්', ta: 'கடல் வரைபடங்கள்' },
      icon: Map,
      color: 'from-blue-400 to-cyan-600',
      count: null
    },
    {
      id: 'hydrographic-survey',
      name: { en: 'Hydrographic Surveys', si: 'ජල විද්‍යාත්මක සමීක්ෂණ', ta: 'நீர்வியல் ஆய்வுகள்' },
      icon: Waves,
      color: 'from-purple-400 to-pink-600',
      count: null
    }
  ], [stats, workspaces, currentLang]);

  const metrics = useMemo(() => [
    {
      id: 'eia',
      label: { en: 'EIA Applications', si: 'EIA අයදුම්පත්', ta: 'EIA விண்ணப்பங்கள்' }[currentLang],
      value: stats?.eia?.total || 0,
      change: `+${stats?.eia?.pending || 0} pending`,
      icon: FileText,
      color: 'from-blue-400 to-indigo-600',
      description: { en: 'Environmental assessments', si: 'පරිසර තක්සේරු', ta: 'சுற்றுச்சூழல் மதிப்பீடுகள்' }[currentLang]
    },
    {
      id: 'licenses',
      label: { en: 'Active Licenses', si: 'සක්‍රීය බලපත්‍ර', ta: 'செயலில் உள்ள உரிமங்கள்' }[currentLang],
      value: stats?.licenses?.active || 0,
      change: `${stats?.licenses?.total || 0} total`,
      icon: Award,
      color: 'from-purple-400 to-pink-600',
      description: { en: 'Issued and active', si: 'නිකුත් කර ඇති සහ සක්‍රීය', ta: 'வெளியிடப்பட்ட மற்றும் செயலில்' }[currentLang]
    },
    {
      id: 'compliance',
      label: { en: 'Compliance Rate', si: 'අනුකූලතා අනුපාතය', ta: 'இணக்க விகிதம்' }[currentLang],
      value: stats?.compliance?.total > 0 ? `${Math.round((stats.compliance.compliant / stats.compliance.total) * 100)}%` : '0%',
      change: `${stats?.compliance?.compliant || 0} compliant`,
      icon: CheckCircle,
      color: 'from-green-400 to-emerald-600',
      description: { en: 'Regulatory compliance', si: 'නියාමන අනුකූලතාව', ta: 'ஒழுங்குமுறை இணக்கம்' }[currentLang]
    },
    {
      id: 'emergency',
      label: { en: 'Active Emergencies', si: 'සක්‍රීය හදිසි අවස්ථා', ta: 'செயலில் உள்ள அவசரநிலைகள்' }[currentLang],
      value: stats?.emergencies?.active || 0,
      change: { en: 'Live incidents', si: 'සජීවී සිදුවීම්', ta: 'நேரடி சம்பவங்கள்' }[currentLang],
      icon: AlertTriangle,
      color: 'from-red-400 to-orange-600',
      description: { en: 'Require immediate action', si: 'ක්ෂණික ක්‍රියාමාර්ග අවශ්‍ය', ta: 'உடனடி நடவடிக்கை தேவை' }[currentLang]
    }
  ], [stats, currentLang]);

  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.button
          whileHover={{ scale: 1.02, y: -5 }}
          onClick={() => setActiveSection('eia')}
          className="relative p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {{ en: 'New EIA Application', si: 'නව EIA අයදුම්පත', ta: 'புதிய EIA விண்ணப்பம்' }[currentLang]}
            </h3>
            <p className="text-slate-400 text-sm">
              {{ en: 'Submit environmental impact assessment', si: 'පරිසර බලපෑම් තක්සේරුව ඉදිරිපත් කරන්න', ta: 'சுற்றுச்சூழல் தாக்க மதிப்பீட்டை சமர்ப்பிக்கவும்' }[currentLang]}
            </p>
          </div>
          <ArrowUpRight className="absolute top-8 right-8 w-6 h-6 text-white/40 group-hover:text-white/80 transition-colors" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -5 }}
          onClick={() => setActiveSection('licensing')}
          className="relative p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-purple-400 to-pink-600 mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {{ en: 'Apply for License', si: 'බලපත්‍රයක් සඳහා අයදුම් කරන්න', ta: 'உரிமத்திற்கு விண்ணப்பிக்கவும்' }[currentLang]}
            </h3>
            <p className="text-slate-400 text-sm">
              {{ en: 'Get permits for marine operations', si: 'සාගර මෙහෙයුම් සඳහා අවසර ලබා ගන්න', ta: 'கடல் செயல்பாடுகளுக்கு அனுமதிகளைப் பெறுங்கள்' }[currentLang]}
            </p>
          </div>
          <ArrowUpRight className="absolute top-8 right-8 w-6 h-6 text-white/40 group-hover:text-white/80 transition-colors" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -5 }}
          onClick={() => setActiveSection('emergency')}
          className="relative p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-red-400 to-orange-600 mb-4">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {{ en: 'Report Emergency', si: 'හදිසියක් වාර්තා කරන්න', ta: 'அவசரநிலையைப் புகார் செய்யவும்' }[currentLang]}
            </h3>
            <p className="text-slate-400 text-sm">
              {{ en: 'Immediate response coordination', si: 'ක්ෂණික ප්‍රතිචාර සම්බන්ධීකරණය', ta: 'உடனடி பதில் ஒருங்கிணைப்பு' }[currentLang]}
            </p>
          </div>
          <ArrowUpRight className="absolute top-8 right-8 w-6 h-6 text-white/40 group-hover:text-white/80 transition-colors" />
        </motion.button>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {{ en: 'Recent EIA Applications', si: 'මෑත EIA අයදුම්පත්', ta: 'சமீபத்திய EIA விண்ணப்பங்கள்' }[currentLang]}
            </h3>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </div>
          <div className="space-y-3">
            {eiaApplications.slice(0, 5).map((app) => (
              <div key={app.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                <div className="flex-1">
                  <p className="font-semibold text-white">{app.projectName}</p>
                  <p className="text-sm text-slate-400">{app.projectType}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  app.status === 'approved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  app.status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
            {eiaApplications.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>{{ en: 'No EIA applications yet', si: 'EIA අයදුම්පත් නොමැත', ta: 'EIA விண்ணப்பங்கள் இல்லை' }[currentLang]}</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">
              {{ en: 'Active Emergencies', si: 'සක්‍රීය හදිසි අවස්ථා', ta: 'செயலில் உள்ள அவசரநிலைகள்' }[currentLang]}
            </h3>
            <Bell className="w-5 h-5 text-red-400 animate-pulse" />
          </div>
          <div className="space-y-3">
            {emergencyIncidents.filter(i => i.status === 'active').slice(0, 5).map((incident) => (
              <div key={incident.id} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    incident.severity === 'critical' ? 'bg-red-500 text-white' :
                    incident.severity === 'high' ? 'bg-orange-500 text-white' :
                    'bg-yellow-500 text-black'
                  }`}>
                    {incident.severity}
                  </span>
                  <span className="text-xs text-slate-400">{incident.location}</span>
                </div>
                <p className="font-semibold text-white">{incident.title}</p>
                <p className="text-sm text-slate-300 mt-1">{incident.description}</p>
              </div>
            ))}
            {emergencyIncidents.filter(i => i.status === 'active').length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400 opacity-50" />
                <p>{{ en: 'No active emergencies', si: 'සක්‍රීය හදිසි අවස්ථා නොමැත', ta: 'செயலில் உள்ள அவசரநிலைகள் இல்லை' }[currentLang]}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderEIAManagement = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">
          {{ en: 'Environmental Impact Assessment', si: 'පරිසර බලපෑම් තක්සේරුව', ta: 'சுற்றுச்சூழல் தாக்க மதிப்பீடு' }[currentLang]}
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-cyan-500/30"
        >
          <Plus className="w-5 h-5" />
          {{ en: 'New EIA', si: 'නව EIA', ta: 'புதிய EIA' }[currentLang]}
        </motion.button>
      </div>

      {/* EIA Process Steps */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6">
          {{ en: 'EIA Process', si: 'EIA ක්‍රියාවලිය', ta: 'EIA செயல்முறை' }[currentLang]}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: 1,
              title: { en: 'Submit Project Info', si: 'ව්‍යාපෘති තොරතුරු ඉදිරිපත් කරන්න', ta: 'திட்ட தகவலை சமர்ப்பிக்கவும்' }[currentLang],
              icon: FileCheck,
              color: 'from-blue-400 to-blue-600'
            },
            {
              step: 2,
              title: { en: 'Technical Review', si: 'තාක්ෂණික සමාලෝචනය', ta: 'தொழில்நுட்ப ஆய்வு' }[currentLang],
              icon: Search,
              color: 'from-purple-400 to-purple-600'
            },
            {
              step: 3,
              title: { en: 'Public Consultation', si: 'පොදු උපදේශනය', ta: 'பொது ஆலோசனை' }[currentLang],
              icon: Users,
              color: 'from-pink-400 to-pink-600'
            },
            {
              step: 4,
              title: { en: 'Final Decision', si: 'අවසන් තීරණය', ta: 'இறுதி முடிவு' }[currentLang],
              icon: Shield,
              color: 'from-green-400 to-green-600'
            }
          ].map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-white">
                {item.step}
              </div>
              <h4 className="font-semibold text-white mb-2">{item.title}</h4>
              {index < 3 && (
                <ChevronRight className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 hidden md:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Applications List */}
      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">
          {{ en: 'Your Applications', si: 'ඔබගේ අයදුම්පත්', ta: 'உங்கள் விண்ணப்பங்கள்' }[currentLang]}
        </h3>
        <div className="space-y-3">
          {eiaApplications.map((app) => (
            <motion.div
              key={app.id}
              whileHover={{ x: 4 }}
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-white text-lg mb-1">{app.projectName}</h4>
                  <p className="text-slate-400">{app.projectType}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    app.status === 'approved' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                    app.status === 'rejected' ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white' :
                    'bg-gradient-to-r from-yellow-500 to-amber-600 text-white'
                  }`}>
                    {app.status}
                  </span>
                  <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    <Eye className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {eiaApplications.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">{{ en: 'No EIA applications yet', si: 'EIA අයදුම්පත් නොමැත', ta: 'EIA விண்ணப்பங்கள் இல்லை' }[currentLang]}</p>
              <p className="text-sm mt-2">{{ en: 'Start your first application above', si: 'ඉහත ඔබගේ පළමු අයදුම්පත ආරම්භ කරන්න', ta: 'மேலே உங்கள் முதல் விண்ணப்பத்தைத் தொடங்குங்கள்' }[currentLang]}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderCompliance = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="text-3xl font-bold text-white">
        {{ en: 'Compliance Dashboard', si: 'අනුකූලතා උපකරණ පුවරුව', ta: 'இணக்க டாஷ்போர்டு' }[currentLang]}
      </h2>

      {/* Compliance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          className="relative p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="w-12 h-12 text-green-400" />
              <span className="text-4xl font-bold text-green-400">{stats?.compliance?.compliant || 0}</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              {{ en: 'Compliant', si: 'අනුකූල', ta: 'இணக்கமான' }[currentLang]}
            </h3>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          className="relative p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-orange-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <XCircle className="w-12 h-12 text-red-400" />
              <span className="text-4xl font-bold text-red-400">{stats?.compliance?.nonCompliant || 0}</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              {{ en: 'Non-Compliant', si: 'අනුකූල නොවන', ta: 'இணக்கமற்ற' }[currentLang]}
            </h3>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          className="relative p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-amber-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-12 h-12 text-yellow-400" />
              <span className="text-4xl font-bold text-yellow-400">{stats?.compliance?.pending || 0}</span>
            </div>
            <h3 className="text-xl font-bold text-white">
              {{ en: 'Under Review', si: 'සමාලෝචනයට', ta: 'மதிப்பாய்வில்' }[currentLang]}
            </h3>
          </div>
        </motion.div>
      </div>

      {/* Recent Records */}
      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">
          {{ en: 'Recent Compliance Records', si: 'මෑත අනුකූලතා වාර්තා', ta: 'சமீபத்திய இணக்க பதிவுகள்' }[currentLang]}
        </h3>
        <div className="space-y-3">
          {complianceRecords.slice(0, 10).map((record) => (
            <motion.div
              key={record.id}
              whileHover={{ x: 4 }}
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-green-500/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-white text-lg mb-1">{record.entityName}</h4>
                  <p className="text-slate-400">{record.type}</p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  record.status === 'compliant' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                  record.status === 'non-compliant' ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white' :
                  'bg-gradient-to-r from-yellow-500 to-amber-600 text-white'
                }`}>
                  {record.status}
                </span>
              </div>
            </motion.div>
          ))}
          {complianceRecords.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">{{ en: 'No compliance records', si: 'අනුකූලතා වාර්තා නොමැත', ta: 'இணக்க பதிவுகள் இல்லை' }[currentLang]}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderEmergency = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">
          {{ en: 'Emergency Response', si: 'හදිසි ප්‍රතිචාරය', ta: 'அவசர பதில்' }[currentLang]}
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-orange-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-red-500/30"
        >
          <Plus className="w-5 h-5" />
          {{ en: 'Report Emergency', si: 'හදිසියක් වාර්තා කරන්න', ta: 'அவசரநிலையைப் புகார் செய்யவும்' }[currentLang]}
        </motion.button>
      </div>

      {/* Emergency Hotline */}
      <div className="p-8 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-600/20 backdrop-blur-xl border border-red-500/30">
        <div className="flex items-start gap-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-red-500 to-orange-600">
            <Phone className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2">
              {{ en: 'Emergency Hotline', si: 'හදිසි හොට්ලයින්', ta: 'அவசர ஹாட்லைன்' }[currentLang]}
            </h3>
            <p className="text-4xl font-bold text-white mb-2">1915</p>
            <p className="text-slate-300">
              {{ en: 'Available 24/7 for marine emergencies', si: 'සාගර හදිසි අවස්ථා සඳහා 24/7 ලබා ගත හැකි', ta: 'கடல் அவசரநிலைகளுக்கு 24/7 கிடைக்கும்' }[currentLang]}
            </p>
          </div>
        </div>
      </div>

      {/* Active Incidents */}
      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            {{ en: 'Active Incidents', si: 'සක්‍රීය සිදුවීම්', ta: 'செயலில் உள்ள சம்பவங்கள்' }[currentLang]}
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
            <span className="text-red-400 font-semibold">
              {emergencyIncidents.filter(i => i.status === 'active').length} {{ en: 'Active', si: 'සක්‍රීය', ta: 'செயலில்' }[currentLang]}
            </span>
          </div>
        </div>

        <div className="space-y-4">
          {emergencyIncidents.filter(i => i.status === 'active').map((incident) => (
            <motion.div
              key={incident.id}
              whileHover={{ scale: 1.01 }}
              className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-600/10 border border-red-500/30"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    incident.severity === 'critical' ? 'bg-red-500 text-white' :
                    incident.severity === 'high' ? 'bg-orange-500 text-white' :
                    'bg-yellow-500 text-black'
                  }`}>
                    {incident.severity}
                  </span>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <MapPin className="w-4 h-4" />
                    {incident.location}
                  </div>
                </div>
              </div>
              <h4 className="text-xl font-bold text-white mb-2">{incident.title}</h4>
              <p className="text-slate-300 mb-4">{incident.description}</p>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {{ en: 'View Details', si: 'විස්තර බලන්න', ta: 'விவரங்களைப் பார்க்கவும்' }[currentLang]}
                </button>
              </div>
            </motion.div>
          ))}
          {emergencyIncidents.filter(i => i.status === 'active').length === 0 && (
            <div className="text-center py-16">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400 opacity-50" />
              <p className="text-lg text-slate-400">
                {{ en: 'No active emergencies', si: 'සක්‍රීය හදිසි අවස්ථා නොමැත', ta: 'செயலில் உள்ள அவசரநிலைகள் இல்லை' }[currentLang]}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Resolved Incidents */}
      {emergencyIncidents.filter(i => i.status === 'resolved').length > 0 && (
        <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
          <h3 className="text-xl font-bold text-white mb-4">
            {{ en: 'Resolved Incidents', si: 'විසඳන ලද සිදුවීම්', ta: 'தீர்க்கப்பட்ட சம்பவங்கள்' }[currentLang]}
          </h3>
          <div className="space-y-3">
            {emergencyIncidents.filter(i => i.status === 'resolved').slice(0, 5).map((incident) => (
              <div key={incident.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                <div className="flex-1">
                  <p className="font-semibold text-white">{incident.title}</p>
                  <p className="text-sm text-slate-400">{incident.location}</p>
                </div>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold border border-green-500/30">
                  {{ en: 'Resolved', si: 'විසඳන ලද', ta: 'தீர்க்கப்பட்டது' }[currentLang]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderCollaboration = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">
          {{ en: 'Inter-Agency Collaboration', si: 'අන්තර් ආයතන සහයෝගීතාවය', ta: 'நிறுவனங்களுக்கு இடையேயான ஒத்துழைப்பு' }[currentLang]}
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-amber-500/30"
        >
          <Plus className="w-5 h-5" />
          {{ en: 'New Workspace', si: 'නව වැඩපොළ', ta: 'புதிய பணியிடம்' }[currentLang]}
        </motion.button>
      </div>

      {/* Active Workspaces */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {workspaces.map((workspace) => (
          <motion.div
            key={workspace.id}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-yellow-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{workspace.name}</h3>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">
                  {workspace.status}
                </span>
              </div>
              <p className="text-slate-400 mb-6">{workspace.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-slate-400" />
                  <span className="text-slate-300 text-sm">
                    {workspace.members?.length || 0} {{ en: 'members', si: 'සාමාජිකයින්', ta: 'உறுப்பினர்கள்' }[currentLang]}
                  </span>
                </div>
                <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors flex items-center gap-2">
                  {{ en: 'Open', si: 'විවෘත කරන්න', ta: 'திறக்கவும்' }[currentLang]}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
        {workspaces.length === 0 && (
          <div className="col-span-2 text-center py-16 text-slate-400">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg">{{ en: 'No workspaces yet', si: 'වැඩපොළවල් නොමැත', ta: 'பணியிடங்கள் இல்லை' }[currentLang]}</p>
          </div>
        )}
      </div>

      {/* Key Agency Partners */}
      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <h3 className="text-xl font-bold text-white mb-6">
          {{ en: 'Key Agency Partners', si: 'ප්‍රධාන ආයතන හවුල්කරුවන්', ta: 'முக்கிய நிறுவன பங்காளிகள்' }[currentLang]}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: { en: 'Ministry of Environment', si: 'පරිසර අමාත්‍යාංශය', ta: 'சுற்றுச்சூழல் அமைச்சகம்' }[currentLang],
              icon: Building,
              color: 'from-blue-400 to-blue-600'
            },
            {
              name: { en: 'Ministry of Fisheries', si: 'ධීවර අමාත්‍යාංශය', ta: 'மீன்வள அமைச்சகம்' }[currentLang],
              icon: Building,
              color: 'from-cyan-400 to-cyan-600'
            },
            {
              name: { en: 'Port Authority', si: 'වරාය අධිකාරිය', ta: 'துறைமுக ஆணையம்' }[currentLang],
              icon: Building,
              color: 'from-green-400 to-green-600'
            }
          ].map((partner, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02, y: -2 }}
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${partner.color} flex items-center justify-center mb-4`}>
                <partner.icon className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-white">{partner.name}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderLicensing = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">
          {{ en: 'Digital Licensing System', si: 'ඩිජිටල් බලපත්‍ර පද්ධතිය', ta: 'டிஜிட்டல் உரிம அமைப்பு' }[currentLang]}
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold flex items-center gap-2 shadow-lg shadow-purple-500/30"
        >
          <Plus className="w-5 h-5" />
          {{ en: 'New Application', si: 'නව අයදුම්පත', ta: 'புதிய விண்ணப்பம்' }[currentLang]}
        </motion.button>
      </div>

      {/* License Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            type: { en: 'Fishing License', si: 'ධීවර බලපත්‍රය', ta: 'மீன்பிடி உரிமம்' }[currentLang],
            icon: Ship,
            color: 'from-blue-400 to-blue-600',
            description: { en: 'Commercial fishing operations', si: 'වාණිජ ධීවර කටයුතු', ta: 'வணிக மீன்பிடி செயல்பாடுகள்' }[currentLang]
          },
          {
            type: { en: 'Anchoring License', si: 'නැංගුරම් බලපත්‍රය', ta: 'நங்கூரம் உரிமம்' }[currentLang],
            icon: Anchor,
            color: 'from-cyan-400 to-cyan-600',
            description: { en: 'Vessel anchoring permits', si: 'යාත්‍රා නැංගුරම් ලෑමේ අවසර', ta: 'கப்பல் நங்கூரம் போடுவதற்கான அனுமதிகள்' }[currentLang]
          },
          {
            type: { en: 'Industrial License', si: 'කාර්මික බලපත්‍රය', ta: 'தொழில்துறை உரிமம்' }[currentLang],
            icon: Factory,
            color: 'from-green-400 to-green-600',
            description: { en: 'Marine industrial activities', si: 'සාගර කාර්මික කටයුතු', ta: 'கடல் தொழில்துறை செயல்பாடுகள்' }[currentLang]
          }
        ].map((license, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            className="relative p-8 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group cursor-pointer"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${license.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
            <div className="relative z-10">
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${license.color} mb-4`}>
                <license.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{license.type}</h3>
              <p className="text-slate-400 mb-6">{license.description}</p>
              <button className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors border border-white/10">
                {{ en: 'Apply Now', si: 'අයදුම් කරන්න', ta: 'இப்போது விண்ணப்பிக்கவும்' }[currentLang]}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Your Licenses */}
      <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
        <h3 className="text-xl font-bold text-white mb-4">
          {{ en: 'Your Licenses', si: 'ඔබගේ බලපත්‍ර', ta: 'உங்கள் உரிமங்கள்' }[currentLang]}
        </h3>
        <div className="space-y-3">
          {licenses.map((license) => (
            <motion.div
              key={license.id}
              whileHover={{ x: 4 }}
              className="p-6 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-white font-semibold">{license.licenseNumber || 'Pending'}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-300">{license.type}</span>
                  </div>
                  <p className="text-slate-400 text-sm">{license.holderName}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    license.status === 'active' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' :
                    license.status === 'expired' ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white' :
                    'bg-gradient-to-r from-yellow-500 to-amber-600 text-white'
                  }`}>
                    {license.status}
                  </span>
                  <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                    <Download className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          {licenses.length === 0 && (
            <div className="text-center py-16 text-slate-400">
              <Award className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-lg">{{ en: 'No licenses yet', si: 'බලපත්‍ර නොමැත', ta: 'உரிமங்கள் இல்லை' }[currentLang]}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader className="w-12 h-12 animate-spin text-cyan-400 mx-auto mb-4" />
          <p className="text-xl text-white">
            {{ en: 'Loading...', si: 'පැටවෙමින...', ta: 'ஏற்றுகிறது...' }[currentLang]}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Hero Section */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative overflow-hidden pt-32 pb-24 px-4"
      >
        {/* Animated Background Blobs */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{ duration: 8, repeat: Infinity, delay: 1 }}
            className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-300 uppercase tracking-wider">
                {{ en: 'Government Services Portal', si: 'රජයේ සේවා ද්වාරය', ta: 'அரசாங்க சேவைகள் போர்டல்' }[currentLang]}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
              {{ en: 'Integrated Marine', si: 'ඒකාබද්ධ සාගර', ta: 'ஒருங்கிணைந்த கடல்' }[currentLang]}
              <br />
              {{ en: 'Governance Services', si: 'පාලන සේවා', ta: 'ஆட்சி சேவைகள்' }[currentLang]}
            </h1>

            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              {{
                en: 'Streamlined government services for environmental compliance, licensing, and emergency response coordination',
                si: 'පරිසර අනුකූලතාව, බලපත්‍ර සහ හදිසි ප්‍රතිචාර සම්බන්ධීකරණය සඳහා විධිමත් රජයේ සේවා',
                ta: 'சுற்றுச்சூழல் இணக்கம், உரிமம் மற்றும் அவசர பதில் ஒருங்கிணைப்புக்கான நெறிப்படுத்தப்பட்ட அரசாங்க சேவைகள்'
              }[currentLang]}
            </p>
          </motion.div>

          {/* Live Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative p-6 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 overflow-hidden group cursor-pointer"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${metric.color} mb-4`}>
                    <metric.icon className="w-6 h-6 text-white" />
                  </div>

                  <div className="text-3xl font-bold text-white mb-1">
                    {metric.value}
                  </div>

                  <div className="text-sm text-slate-400 mb-2">
                    {metric.label}
                  </div>

                  <div className="flex items-center gap-1 text-green-400 text-xs font-semibold">
                    <TrendingUp className="w-3 h-3" />
                    {metric.change}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pb-24">
        {/* Tabs Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all whitespace-nowrap ${
                activeSection === section.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
              }`}
            >
              <section.icon className="w-4 h-4" />
              <span>{section.name[currentLang]}</span>
              {section.count !== null && section.count !== undefined && (
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-bold">
                  {section.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeSection === 'dashboard' && <div key="dashboard">{renderDashboard()}</div>}
          {activeSection === 'eia' && <div key="eia">{renderEIAManagement()}</div>}
          {activeSection === 'licensing' && <div key="licensing">{renderLicensing()}</div>}
          {activeSection === 'compliance' && <div key="compliance">{renderCompliance()}</div>}
          {activeSection === 'emergency' && <div key="emergency">{renderEmergency()}</div>}
          {activeSection === 'collaboration' && <div key="collaboration">{renderCollaboration()}</div>}
          {activeSection === 'nautical-charts' && <div key="nautical-charts"><NauticalChartsSection /></div>}
          {activeSection === 'hydrographic-survey' && <div key="hydrographic-survey"><HydrographicSurveySection /></div>}
        </AnimatePresence>
      </section>
    </div>
  );
};

export default GovernmentServicesPortal;
