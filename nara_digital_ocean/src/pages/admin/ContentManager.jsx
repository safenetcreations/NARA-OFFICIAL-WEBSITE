import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, getDoc, updateDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import * as Icons from 'lucide-react';

const ContentManager = () => {
  const [selectedPage, setSelectedPage] = useState('homepage');
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const pages = [
    { id: 'homepage', name: 'Homepage', icon: Icons.Home },
    { id: 'research', name: 'Research Portal', icon: Icons.FlaskConical },
    { id: 'ocean-intelligence', name: 'Ocean Intelligence', icon: Icons.Waves },
    { id: 'emergency', name: 'Emergency Response', icon: Icons.AlertTriangle },
    { id: 'learning', name: 'Learning Academy', icon: Icons.GraduationCap },
    { id: 'regional', name: 'Regional Impact', icon: Icons.Globe },
    { id: 'maritime', name: 'Maritime Services', icon: Icons.Ship },
    { id: 'knowledge', name: 'Knowledge Center', icon: Icons.BookOpen },
    { id: 'partnership', name: 'Partnership Gateway', icon: Icons.Handshake }
  ];

  useEffect(() => {
    fetchPageContent(selectedPage);
  }, [selectedPage]);

  const fetchPageContent = async (pageId) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'pageContent', pageId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setContent(docSnap.data());
      } else {
        // Default content structure
        setContent({
          hero: {
            title: '',
            subtitle: '',
            description: '',
            ctaText: '',
            ctaLink: ''
          },
          sections: [],
          metadata: {
            title: '',
            description: '',
            keywords: ''
          }
        });
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const docRef = doc(db, 'pageContent', selectedPage);
      await updateDoc(docRef, {
        ...content,
        lastUpdated: new Date().toISOString(),
        updatedBy: 'admin'
      });
      
      setMessage('Content saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving content:', error);
      setMessage('Error saving content. Please try again.');
    }
    setSaving(false);
  };

  const updateField = (path, value) => {
    const keys = path.split('.');
    const updated = { ...content };
    let current = updated;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setContent(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Content Manager</h1>
          <p className="text-slate-400 mt-1">Edit and manage all website content</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg shadow-cyan-500/30 flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Icons.Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Icons.Save className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Success Message */}
      {message && (
        <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400">
          <Icons.CheckCircle className="w-5 h-5" />
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Page Selector */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-4">
            <h3 className="text-white font-semibold mb-4">Select Page</h3>
            <div className="space-y-1">
              {pages.map((page) => (
                <button
                  key={page.id}
                  onClick={() => setSelectedPage(page.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    selectedPage === page.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <page.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{page.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="lg:col-span-3">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl border border-slate-800 p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Icons.Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Hero Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Icons.Layout className="w-5 h-5 text-cyan-500" />
                    Hero Section
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                    <input
                      type="text"
                      value={content.hero?.title || ''}
                      onChange={(e) => updateField('hero.title', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Main headline"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Subtitle</label>
                    <input
                      type="text"
                      value={content.hero?.subtitle || ''}
                      onChange={(e) => updateField('hero.subtitle', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Supporting text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                    <textarea
                      value={content.hero?.description || ''}
                      onChange={(e) => updateField('hero.description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Detailed description"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">CTA Button Text</label>
                      <input
                        type="text"
                        value={content.hero?.ctaText || ''}
                        onChange={(e) => updateField('hero.ctaText', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Get Started"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">CTA Link</label>
                      <input
                        type="text"
                        value={content.hero?.ctaLink || ''}
                        onChange={(e) => updateField('hero.ctaLink', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="/contact"
                      />
                    </div>
                  </div>
                </div>

                <hr className="border-slate-800" />

                {/* SEO Metadata */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Icons.Search className="w-5 h-5 text-cyan-500" />
                    SEO Metadata
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Meta Title</label>
                    <input
                      type="text"
                      value={content.metadata?.title || ''}
                      onChange={(e) => updateField('metadata.title', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="SEO optimized title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Meta Description</label>
                    <textarea
                      value={content.metadata?.description || ''}
                      onChange={(e) => updateField('metadata.description', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="SEO description (150-160 characters)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Keywords</label>
                    <input
                      type="text"
                      value={content.metadata?.keywords || ''}
                      onChange={(e) => updateField('metadata.keywords', e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="keyword1, keyword2, keyword3"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentManager;
