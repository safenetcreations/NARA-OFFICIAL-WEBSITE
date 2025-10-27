import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
// import DynamicFormRenderer from '../../components/RTIForm/DynamicFormRenderer';
import rtiFormsData from '../../data/rtiFormsData.json';

const RTIPage = () => {
  const { t } = useTranslation('rti');
  const [activeTab, setActiveTab] = useState('forms');
  const [selectedForm, setSelectedForm] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const hero = t('rti.hero', { returnObjects: true }) || {};
  const stats = t('rti.stats', { returnObjects: true }) || {};
  const sections = t('rti.sections', { returnObjects: true }) || {};
  const cta = t('rti.cta', { returnObjects: true }) || {};

  const statsArray = stats ? Object.entries(stats).map(([key, value]) => ({
    ...value,
    key
  })) : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const getIconComponent = (iconName) => {
    const iconMap = {
      'file-text': Icons.FileText,
      'check-circle': Icons.CheckCircle,
      'book-open': Icons.BookOpen,
      'check-square': Icons.CheckSquare,
      'x-circle': Icons.XCircle,
      'clock': Icons.Clock,
      'users': Icons.Users,
      'alert-circle': Icons.AlertCircle,
      'folder': Icons.Folder,
      'send': Icons.Send,
      'list': Icons.List,
      'user': Icons.User,
      'calendar': Icons.Calendar,
      'trending-up': Icons.TrendingUp,
      'flask-conical': Icons.FlaskConical,
      'star': Icons.Star
    };
    return iconMap[iconName] || Icons.FileText;
  };

  const handleOpenForm = (formId) => {
    const formData = rtiFormsData.forms[formId];
    if (formData) {
      setSelectedForm(formData);
      setShowFormModal(true);
    }
  };

  const handleFormSubmit = async (formData) => {
    // Here you can implement actual form submission logic
    // For now, we'll simulate an API call
    console.log('Form submitted:', formData);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // In production, send to backend/Firebase/email service
    // Example: 
    // await fetch('/api/rti/submit', {
    //   method: 'POST',
    //   body: JSON.stringify(formData)
    // });
    
    return true;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-500/10 to-purple-400/10" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-700" />
        </div>

        <motion.div
          className="max-w-7xl mx-auto relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Icons.Scale className="w-4 h-4" />
              {hero?.badge}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
              {hero?.title}
            </h1>
            <p className="text-xl md:text-2xl text-blue-600 font-semibold mb-6">
              {hero?.headline}
            </p>
            <p className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
              {hero?.description}
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {statsArray.map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Tabs Navigation */}
      <section className="py-8 px-4 bg-white border-y border-blue-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {['forms', 'documents', 'officers', 'guidelines'].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tab === 'forms' && 'RTI Forms'}
                {tab === 'documents' && 'Documents Library'}
                {tab === 'officers' && 'RTI Officers'}
                {tab === 'guidelines' && 'How to Request'}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* RTI Forms Tab */}
          {activeTab === 'forms' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  {sections.forms?.title}
                </h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                  {sections.forms?.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections?.forms?.forms?.map((form, index) => {
                  const IconComponent = getIconComponent(form.icon);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all group"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-blue-600 mb-1">
                            {form.code}
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mb-2">
                            {form.title}
                          </h3>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 mb-4">
                        {form.description}
                      </p>
                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => handleOpenForm(form.id)}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <Icons.Edit3 className="w-5 h-5" />
                          Fill Online
                        </button>
                        <a
                          href={`/documents/rti/${form.id}.pdf`}
                          download
                          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                          title="Download PDF Form"
                        >
                          <Icons.Download className="w-5 h-5" />
                        </a>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Documents Library Tab */}
          {activeTab === 'documents' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  {sections.documents?.title}
                </h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                  {sections.documents?.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {sections?.documents?.categories?.map((category, index) => {
                  const IconComponent = getIconComponent(category.icon);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 shadow-xl border border-blue-100"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">
                            {category.name}
                          </h3>
                          <p className="text-blue-600 font-semibold">
                            {category.count} Documents
                          </p>
                        </div>
                      </div>
                      <p className="text-slate-600 mb-6">
                        {category.description}
                      </p>
                      <a
                        href={category.downloadUrl}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                      >
                        <Icons.Download className="w-5 h-5" />
                        Download All
                      </a>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* RTI Officers Tab */}
          {activeTab === 'officers' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  {sections.officers?.title}
                </h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                  {sections.officers?.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {sections?.officers?.officers?.map((officer, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-3xl p-8 shadow-xl"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                        <Icons.User className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                          {officer.name}
                        </h3>
                        <p className="text-blue-600 font-medium text-sm">
                          {officer.designation}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-600">
                        <Icons.Mail className="w-5 h-5 text-blue-600" />
                        <a href={`mailto:${officer.email}`} className="hover:text-blue-600">
                          {officer.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <Icons.Phone className="w-5 h-5 text-blue-600" />
                        <a href={`tel:${officer.phone}`} className="hover:text-blue-600">
                          {officer.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <Icons.MapPin className="w-5 h-5 text-blue-600" />
                        <span>{officer.office}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Guidelines Tab */}
          {activeTab === 'guidelines' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  {sections.guidelines?.title}
                </h2>
              </div>

              <div className="max-w-4xl mx-auto">
                {sections?.guidelines?.steps?.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6 mb-8"
                  >
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {step.step}
                    </div>
                    <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-slate-600">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {cta?.title}
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            {cta?.description}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => setActiveTab('forms')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
            >
              <Icons.Download className="w-5 h-5" />
              {cta?.button}
            </button>
            <Link
              to="/contact-us"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-800 transition-colors shadow-lg hover:shadow-xl"
            >
              <Icons.Mail className="w-5 h-5" />
              {cta?.contact}
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Interactive Form Modal */}
      {/* <AnimatePresence>
        {showFormModal && selectedForm && (
          <DynamicFormRenderer
            formData={selectedForm}
            onSubmit={handleFormSubmit}
            onClose={() => {
              setShowFormModal(false);
              setSelectedForm(null);
            }}
          />
        )}
      </AnimatePresence> */}
    </div>
  );
};

export default RTIPage;
