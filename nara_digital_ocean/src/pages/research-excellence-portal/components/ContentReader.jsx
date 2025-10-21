import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFirebaseAuth } from '../../../contexts/FirebaseAuthContext';
import { getResearchContentById, incrementDownloads } from '../../../services/researchContentService';

const ContentReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['researchPortal']);
  const { user } = useFirebaseAuth();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('abstract');

  useEffect(() => {
    loadContent();
  }, [id]);

  const loadContent = async () => {
    try {
      const data = await getResearchContentById(id);
      setContent(data);
    } catch (error) {
      console.error('Error loading content:', error);
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icons.FileX className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Content Not Found</h2>
          <Link to="/research-excellence-portal" className="text-blue-600 hover:underline">
            {t('reader.backToPortal')}
          </Link>
        </div>
      </div>
    );
  }

  // Show login prompt if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/research-excellence-portal" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6"
          >
            <Icons.ArrowLeft className="w-5 h-5" />
            {t('reader.backToPortal')}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            {/* Preview Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-slate-900 mb-4">
                {getCurrentLangContent(content.title)}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
                <div className="flex items-center gap-2">
                  <Icons.Users className="w-4 h-4" />
                  <span>{content.authors?.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.Calendar className="w-4 h-4" />
                  <span>{new Date(content.publicationDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.Eye className="w-4 h-4" />
                  <span>{content.views} {t('card.views')}</span>
                </div>
              </div>
              
              <div className="prose max-w-none mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('reader.abstract')}</h3>
                <p className="text-slate-700">{getCurrentLangContent(content.abstract)}</p>
              </div>
            </div>

            {/* Login Required Message */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-8 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.Lock className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('reader.loginRequired')}</h2>
              <p className="text-slate-600 mb-6">{t('reader.loginMessage')}</p>
              <div className="flex gap-4 justify-center">
                <Link
                  to="/login"
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('reader.loginButton')}
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
                >
                  {t('reader.registerButton')}
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Full content for authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            to="/research-excellence-portal" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900"
          >
            <Icons.ArrowLeft className="w-5 h-5" />
            {t('reader.backToPortal')}
          </Link>
          
          <div className="flex gap-3">
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
                <div className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {getCurrentLangContent(content.fullContent)}
                </div>
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
