import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFirebaseAuth } from '../../../contexts/FirebaseAuthContext';
import { getResearchContentById, incrementDownloads } from '../../../services/researchContentService';
import DocumentReader from './DocumentReader';

const ContentReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['researchPortal']);
  const { user } = useFirebaseAuth();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('abstract');
  const [viewMode, setViewMode] = useState('standard'); // 'standard' or 'reader'

  useEffect(() => {
    loadContent();
  }, [id]);

  const loadContent = async () => {
    try {
      console.log('🔍 Loading research content, ID:', id);
      const data = await getResearchContentById(id);
      console.log('✅ Content loaded:', data);
      
      if (!data) {
        setError('Paper not found in database');
        console.error('❌ No data returned for ID:', id);
      } else {
        setContent(data);
      }
    } catch (error) {
      console.error('❌ Error loading content:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      });
      setError(error.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (content?.fileURL) {
      await incrementDownloads(id);
      window.open(content.fileURL, '_blank');
    }
  };

  const handleCite = () => {
    const citation = `${content.authors?.join(', ')} (${new Date(content.publicationDate).getFullYear()}). ${getCurrentLangContent(content.title)}. ${content.journal}, ${content.volume}(${content.issue}), ${content.pages}. DOI: ${content.doi}`;
    navigator.clipboard.writeText(citation);
    alert(t('reader.citationCopied'));
  };

  const getCurrentLangContent = (multilingualField) => {
    if (!multilingualField) return '';
    return multilingualField[i18n.language] || multilingualField.en || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icons.Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <Icons.FileX className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Content Not Found</h2>
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm font-mono text-red-800 mb-2">
              <strong>Paper ID:</strong> {id}
            </p>
            {error && (
              <p className="text-sm text-red-700">
                <strong>Error:</strong> {error}
              </p>
            )}
            <p className="text-xs text-red-600 mt-2">
              Check browser console (F12) for more details
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Link 
              to="/research-excellence-portal" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t('reader.backToPortal')}
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // REMOVED: Login requirement - Research portal is now FREE TO READ for everyone!
  // Login can be added back later for advanced features (bookmarking, etc.)
  /*
  if (!user) {
    return (
      // ... login gate removed ...
    );
  }
  */

  // Full content - FREE FOR ALL USERS (no login required)
  
  // If in reader mode, show the beautiful document reader
  if (viewMode === 'reader') {
    return <DocumentReader content={content} onBack={() => setViewMode('standard')} />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <Link 
            to="/research-excellence-portal" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <Icons.ArrowLeft className="w-5 h-5" />
            {t('reader.backToPortal')}
          </Link>
          
          <div className="flex gap-3 flex-wrap items-center">
            {/* iPad-Style Reader Button */}
            <button
              onClick={() => setViewMode('reader')}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Icons.BookOpen className="w-5 h-5" />
              <span>📱 iPad Reader</span>
            </button>
            
            {/* Language Switcher - PROMINENT */}
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <span className="text-xs font-semibold text-slate-600 uppercase">Language:</span>
              <div className="flex gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-300 rounded-lg p-1.5 shadow-md">
                <button
                  onClick={() => i18n.changeLanguage('en')}
                  className={`px-4 py-2 rounded-md text-base font-bold transition-all ${
                    i18n.language === 'en'
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'text-slate-700 hover:bg-white hover:shadow'
                  }`}
                >
                  🇬🇧 EN
                </button>
                <button
                  onClick={() => i18n.changeLanguage('si')}
                  className={`px-4 py-2 rounded-md text-base font-bold transition-all ${
                    i18n.language === 'si'
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'text-slate-700 hover:bg-white hover:shadow'
                  }`}
                >
                  🇱🇰 සිංහල
                </button>
                <button
                  onClick={() => i18n.changeLanguage('ta')}
                  className={`px-4 py-2 rounded-md text-base font-bold transition-all ${
                    i18n.language === 'ta'
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'text-slate-700 hover:bg-white hover:shadow'
                  }`}
                >
                  🇱🇰 தமிழ்
                </button>
              </div>
            </div>
            
            {content.fileURL && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Icons.Download className="w-5 h-5" />
                {t('reader.downloadPDF')}
              </button>
            )}
            <button
              onClick={handleCite}
              className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Icons.Quote className="w-5 h-5" />
              {t('reader.cite')}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Title Section */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-8">
            <h1 className="text-4xl font-bold mb-4">
              {getCurrentLangContent(content.title)}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-blue-100">
              <div className="flex items-center gap-2">
                <Icons.Users className="w-5 h-5" />
                <span>{content.authors?.join(', ')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons.Calendar className="w-5 h-5" />
                <span>{new Date(content.publicationDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Icons.BookOpen className="w-5 h-5" />
                <span>{content.journal}</span>
              </div>
              {content.doi && (
                <div className="flex items-center gap-2">
                  <Icons.Link className="w-5 h-5" />
                  <span>DOI: {content.doi}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 border-b border-slate-200">
            <div className="p-4 text-center border-r border-slate-200">
              <div className="flex items-center justify-center gap-2 text-slate-600 mb-1">
                <Icons.Eye className="w-5 h-5" />
                <span className="text-2xl font-bold text-slate-900">{content.views}</span>
              </div>
              <p className="text-sm text-slate-600">{t('card.views')}</p>
            </div>
            <div className="p-4 text-center border-r border-slate-200">
              <div className="flex items-center justify-center gap-2 text-slate-600 mb-1">
                <Icons.Download className="w-5 h-5" />
                <span className="text-2xl font-bold text-slate-900">{content.downloads}</span>
              </div>
              <p className="text-sm text-slate-600">{t('card.downloads')}</p>
            </div>
            <div className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 text-slate-600 mb-1">
                <Icons.Bookmark className="w-5 h-5" />
                <span className="text-2xl font-bold text-slate-900">{content.bookmarks}</span>
              </div>
              <p className="text-sm text-slate-600">{t('card.bookmark')}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200">
            <div className="flex gap-1 p-2">
              {['abstract', 'fullText', 'references'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {t(`reader.${tab}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {activeTab === 'abstract' && (
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('reader.abstract')}</h2>
                <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {getCurrentLangContent(content.abstract)}
                </p>
                
                {content.tags && content.tags.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">{t('card.keywords')}</h3>
                    <div className="flex flex-wrap gap-2">
                      {content.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'fullText' && (
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('reader.fullText')}</h2>
                
                {/* Show PDF viewer if PDF is available */}
                {content.fileURL ? (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 border-2 border-blue-200">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icons.FileText className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">PDF Document Available</h3>
                      <p className="text-slate-600 mb-1">{content.fileName || 'Research Paper'}</p>
                      <p className="text-sm text-slate-500">Click below to view or download the full research paper</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <a
                        href={content.fileURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                      >
                        <Icons.ExternalLink className="w-6 h-6" />
                        <span>Open PDF in New Tab</span>
                      </a>
                      
                      <a
                        href={content.fileURL}
                        download={content.fileName}
                        className="px-8 py-4 bg-white hover:bg-slate-50 text-blue-600 font-semibold rounded-lg border-2 border-blue-600 transition-colors flex items-center justify-center gap-3"
                      >
                        <Icons.Download className="w-6 h-6" />
                        <span>Download PDF</span>
                      </a>
                    </div>
                    
                    <div className="mt-6 bg-white/50 rounded-lg p-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-sm text-slate-600">
                        <Icons.Info className="w-4 h-4" />
                        <span>The PDF will open in a new browser tab where you can read, zoom, and download it.</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
                    <Icons.AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                    <p className="text-slate-700">Full text content not available. Please check back later.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'references' && (
              <div className="prose max-w-none">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('reader.references')}</h2>
                <div className="bg-slate-50 rounded-lg p-6">
                  <p className="text-slate-600">
                    {content.authors?.join(', ')} ({new Date(content.publicationDate).getFullYear()}). 
                    {' '}{getCurrentLangContent(content.title)}. 
                    {' '}<em>{content.journal}</em>, 
                    {' '}{content.volume}({content.issue}), 
                    {' '}{content.pages}.
                    {content.doi && ` DOI: ${content.doi}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContentReader;
