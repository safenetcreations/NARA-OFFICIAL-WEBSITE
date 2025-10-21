import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useFirebaseAuth } from '../../../contexts/FirebaseAuthContext';
import { uploadResearchContent } from '../../../services/researchContentService';

const AdminUpload = ({ onSuccess }) => {
  const { t, i18n } = useTranslation(['researchPortal']);
  const { user } = useFirebaseAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  
  const [formData, setFormData] = useState({
    title: { en: '', si: '', ta: '' },
    description: { en: '', si: '', ta: '' },
    abstract: { en: '', si: '', ta: '' },
    fullContent: { en: '', si: '', ta: '' },
    authors: '',
    category: 'marineEcology',
    keywords: '',
    publicationDate: '',
    doi: '',
    journal: '',
    volume: '',
    issue: '',
    pages: '',
    language: 'en',
    status: 'published'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultilingualChange = (field, lang, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], [lang]: value }
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setPdfFile(file);
    } else {
      setMessage({ type: 'error', text: 'Please select a valid PDF file' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const contentData = {
        ...formData,
        authors: formData.authors.split(',').map(a => a.trim()),
        tags: formData.keywords.split(',').map(k => k.trim()),
      };

      await uploadResearchContent(contentData, pdfFile, user.uid);
      
      setMessage({ type: 'success', text: t('admin.form.success') });
      
      // Reset form
      setFormData({
        title: { en: '', si: '', ta: '' },
        description: { en: '', si: '', ta: '' },
        abstract: { en: '', si: '', ta: '' },
        fullContent: { en: '', si: '', ta: '' },
        authors: '',
        category: 'marineEcology',
        keywords: '',
        publicationDate: '',
        doi: '',
        journal: '',
        volume: '',
        issue: '',
        pages: '',
        language: 'en',
        status: 'published'
      });
      setPdfFile(null);
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Upload error:', error);
      setMessage({ type: 'error', text: t('admin.form.error') });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Icons.Upload className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t('admin.title')}</h2>
          <p className="text-slate-600">{t('admin.uploadNew')}</p>
        </div>
      </div>

      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          <div className="flex items-start gap-2">
            {message.type === 'success' ? (
              <Icons.CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            ) : (
              <Icons.AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            )}
            <p className="text-sm">{message.text}</p>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Multilingual Title */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">{t('admin.form.title')}</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder={t('admin.form.titleEn')}
              value={formData.title.en}
              onChange={(e) => handleMultilingualChange('title', 'en', e.target.value)}
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder={t('admin.form.titleSi')}
              value={formData.title.si}
              onChange={(e) => handleMultilingualChange('title', 'si', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input
              type="text"
              placeholder={t('admin.form.titleTa')}
              value={formData.title.ta}
              onChange={(e) => handleMultilingualChange('title', 'ta', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Multilingual Description */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">{t('admin.form.description')}</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <textarea
              placeholder={t('admin.form.descriptionEn')}
              value={formData.description.en}
              onChange={(e) => handleMultilingualChange('description', 'en', e.target.value)}
              required
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              placeholder={t('admin.form.descriptionSi')}
              value={formData.description.si}
              onChange={(e) => handleMultilingualChange('description', 'si', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              placeholder={t('admin.form.descriptionTa')}
              value={formData.description.ta}
              onChange={(e) => handleMultilingualChange('description', 'ta', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Multilingual Abstract */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">{t('admin.form.abstract')}</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <textarea
              placeholder={t('admin.form.abstractEn')}
              value={formData.abstract.en}
              onChange={(e) => handleMultilingualChange('abstract', 'en', e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              placeholder={t('admin.form.abstractSi')}
              value={formData.abstract.si}
              onChange={(e) => handleMultilingualChange('abstract', 'si', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              placeholder={t('admin.form.abstractTa')}
              value={formData.abstract.ta}
              onChange={(e) => handleMultilingualChange('abstract', 'ta', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Multilingual Full Content */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700">{t('admin.form.fullContent')}</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <textarea
              placeholder={t('admin.form.fullContentEn')}
              value={formData.fullContent.en}
              onChange={(e) => handleMultilingualChange('fullContent', 'en', e.target.value)}
              required
              rows={8}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              placeholder={t('admin.form.fullContentSi')}
              value={formData.fullContent.si}
              onChange={(e) => handleMultilingualChange('fullContent', 'si', e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <textarea
              placeholder={t('admin.form.fullContentTa')}
              value={formData.fullContent.ta}
              onChange={(e) => handleMultilingualChange('fullContent', 'ta', e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Authors & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('admin.form.authors')}</label>
            <input
              type="text"
              name="authors"
              value={formData.authors}
              onChange={handleChange}
              required
              placeholder="John Doe, Jane Smith"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('admin.form.category')}</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="marineEcology">{t('categories.marineEcology')}</option>
              <option value="oceanography">{t('categories.oceanography')}</option>
              <option value="fisheries">{t('categories.fisheries')}</option>
              <option value="climateChange">{t('categories.climateChange')}</option>
              <option value="conservation">{t('categories.conservation')}</option>
              <option value="biotechnology">{t('categories.biotechnology')}</option>
              <option value="policy">{t('categories.policy')}</option>
              <option value="other">{t('categories.other')}</option>
            </select>
          </div>
        </div>

        {/* Keywords & Publication Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('admin.form.keywords')}</label>
            <input
              type="text"
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="marine, ecology, conservation"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('admin.form.publicationDate')}</label>
            <input
              type="date"
              name="publicationDate"
              value={formData.publicationDate}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Journal Details */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('admin.form.journal')}</label>
            <input
              type="text"
              name="journal"
              value={formData.journal}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('admin.form.volume')}</label>
            <input
              type="text"
              name="volume"
              value={formData.volume}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('admin.form.issue')}</label>
            <input
              type="text"
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('admin.form.pages')}</label>
            <input
              type="text"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
              placeholder="1-10"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* DOI */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t('admin.form.doi')}</label>
          <input
            type="text"
            name="doi"
            value={formData.doi}
            onChange={handleChange}
            placeholder="10.1000/xyz123"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* PDF Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">{t('admin.form.uploadFile')}</label>
          <div className="flex items-center gap-4">
            <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
              <Icons.Upload className="w-5 h-5 text-slate-400" />
              <span className="text-sm text-slate-600">
                {pdfFile ? pdfFile.name : 'Choose PDF file'}
              </span>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {pdfFile && (
              <button
                type="button"
                onClick={() => setPdfFile(null)}
                className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Language & Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('admin.form.language')}</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="en">English</option>
              <option value="si">සිංහල</option>
              <option value="ta">தமிழ்</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">{t('admin.form.status')}</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="published">{t('admin.form.published')}</option>
              <option value="draft">{t('admin.form.draft')}</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Icons.Loader2 className="w-5 h-5 animate-spin" />
                {t('admin.form.uploading')}
              </>
            ) : (
              <>
                <Icons.Upload className="w-5 h-5" />
                {t('admin.form.submit')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminUpload;
