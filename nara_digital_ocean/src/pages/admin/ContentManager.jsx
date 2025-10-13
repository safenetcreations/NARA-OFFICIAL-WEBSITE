import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import * as Icons from 'lucide-react';
import { AVAILABLE_LANGUAGES } from '../../i18n';

const LANGUAGE_LABELS = {
  en: 'English',
  si: 'සිංහල',
  ta: 'தமிழ்'
};

const EMPTY_HERO_TRANSLATION = {
  badge: '',
  subheading: '',
  title: '',
  highlight: '',
  description: '',
  primaryCtaLabel: '',
  primaryCtaIcon: 'Map',
  secondaryCtaLabel: '',
  secondaryCtaIcon: 'Heart',
  leftStatLabel: '',
  leftStatValue: '',
  rightStatLabel: '',
  rightStatValue: '',
  image: ''
};

const normalizeContent = (rawContent = {}) => {
  const cloned = JSON.parse(JSON.stringify(rawContent));
  cloned.hero = cloned.hero ?? {};
  cloned.hero.translations = cloned.hero.translations ?? {};

  if (!Array.isArray(cloned.hero.images)) {
    cloned.hero.images = [];
  }

  AVAILABLE_LANGUAGES.forEach(({ code }) => {
    cloned.hero.translations[code] = {
      ...EMPTY_HERO_TRANSLATION,
      ...cloned.hero.translations[code]
    };
  });

  if (cloned.hero.title && !cloned.hero.translations.en.title) {
    cloned.hero.translations.en = {
      ...cloned.hero.translations.en,
      badge: cloned.hero.badge ?? '',
      subheading: cloned.hero.subtitle ?? cloned.hero.subheading ?? '',
      title: cloned.hero.title ?? '',
      highlight: cloned.hero.highlight ?? '',
      description: cloned.hero.description ?? '',
      primaryCtaLabel: cloned.hero.ctaText ?? cloned.hero.primaryCtaLabel ?? '',
      secondaryCtaLabel: cloned.hero.secondaryCtaLabel ?? '',
      leftStatLabel: cloned.hero.leftStatLabel ?? '',
      leftStatValue: cloned.hero.leftStatValue ?? '',
      rightStatLabel: cloned.hero.rightStatLabel ?? '',
      rightStatValue: cloned.hero.rightStatValue ?? '',
      image: cloned.hero.image ?? '',
      images: Array.isArray(cloned.hero.images) ? cloned.hero.images : []
    };
  }

  const english = cloned.hero.translations.en ?? EMPTY_HERO_TRANSLATION;
  cloned.hero = {
    ...cloned.hero,
    badge: english.badge,
    subheading: english.subheading,
    title: english.title,
    highlight: english.highlight,
    description: english.description,
    primaryCtaLabel: english.primaryCtaLabel,
    secondaryCtaLabel: english.secondaryCtaLabel,
    leftStatLabel: english.leftStatLabel,
    leftStatValue: english.leftStatValue,
    rightStatLabel: english.rightStatLabel,
    rightStatValue: english.rightStatValue,
    image: english.image,
    images: (cloned.hero.images && cloned.hero.images.length ? cloned.hero.images : english.images?.filter(Boolean)) ?? [],
    translations: cloned.hero.translations
  };

  cloned.metadata = cloned.metadata ?? {
    title: '',
    description: '',
    keywords: ''
  };

  return cloned;
};

const ContentManager = () => {
  const [selectedPage, setSelectedPage] = useState('homepage');
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeHeroLanguage, setActiveHeroLanguage] = useState('en');

  const pages = [
    { id: 'homepage', name: 'Homepage', icon: Icons.Home },
    { id: 'research', name: 'Research Portal', icon: Icons.FlaskConical },
    { id: 'ocean-intelligence', name: 'Ocean Intelligence', icon: Icons.Waves },
    { id: 'emergency', name: 'Emergency Response', icon: Icons.AlertTriangle },
    { id: 'learning', name: 'Learning Academy', icon: Icons.GraduationCap },
    { id: 'regional-impact-network', name: 'Regional Impact Network', icon: Icons.Globe },
    { id: 'maritime', name: 'Maritime Services', icon: Icons.Ship },
    { id: 'knowledge', name: 'Knowledge Center', icon: Icons.BookOpen },
    { id: 'partnership', name: 'Partnership Gateway', icon: Icons.Handshake },
    { id: 'nara-news-updates-center', name: 'News & Updates Center', icon: Icons.Newspaper },
    { id: 'integration-systems-platform', name: 'Integration Systems Platform', icon: Icons.CircuitBoard }
  ];

  useEffect(() => {
    fetchPageContent(selectedPage);
    setActiveHeroLanguage('en');
  }, [selectedPage]);

  const fetchPageContent = async (pageId) => {
    setLoading(true);
    try {
      const docRef = doc(db, 'pageContent', pageId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setContent(normalizeContent(docSnap.data()));
      } else {
        setContent(
          normalizeContent({
            hero: {},
            sections: [],
            metadata: {
              title: '',
              description: '',
              keywords: ''
            }
          })
        );
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
      const heroTranslations = content.hero?.translations ?? {};
      const englishHero = heroTranslations.en ?? EMPTY_HERO_TRANSLATION;

      const payload = {
        ...content,
        hero: {
          ...content.hero,
          badge: englishHero.badge,
          subheading: englishHero.subheading,
          title: englishHero.title,
          highlight: englishHero.highlight,
          description: englishHero.description,
          primaryCtaLabel: englishHero.primaryCtaLabel,
          secondaryCtaLabel: englishHero.secondaryCtaLabel,
          leftStatLabel: englishHero.leftStatLabel,
          leftStatValue: englishHero.leftStatValue,
          rightStatLabel: englishHero.rightStatLabel,
          rightStatValue: englishHero.rightStatValue,
          image: englishHero.image,
          translations: heroTranslations
        },
        lastUpdated: new Date().toISOString(),
        updatedBy: 'admin'
      };

      try {
        await updateDoc(docRef, payload);
      } catch (updateError) {
        if (updateError.code === 'not-found') {
          await setDoc(docRef, payload, { merge: true });
        } else {
          throw updateError;
        }
      }
      
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

  const heroImages = content.hero?.images ?? [];

  const handleHeroImageChange = (index, value) => {
    const updated = [...heroImages];
    updated[index] = value;
    updateField('hero.images', updated);
  };

  const handleAddHeroImage = () => {
    updateField('hero.images', [...heroImages, '']);
  };

  const handleRemoveHeroImage = (index) => {
    const updated = heroImages.filter((_, idx) => idx !== index);
    updateField('hero.images', updated);
  };

  const handleHeroTranslationChange = (field, value) => {
    setContent((prev) => {
      const next = {
        ...prev,
        hero: {
          ...prev.hero,
          translations: {
            ...prev.hero?.translations,
            [activeHeroLanguage]: {
              ...prev.hero?.translations?.[activeHeroLanguage],
              [field]: value
            }
          }
        }
      };

      if (activeHeroLanguage === 'en') {
        const english = next.hero.translations.en ?? EMPTY_HERO_TRANSLATION;
        next.hero = {
          ...next.hero,
          badge: english.badge,
          subheading: english.subheading,
          title: english.title,
          highlight: english.highlight,
          description: english.description,
          primaryCtaLabel: english.primaryCtaLabel,
          secondaryCtaLabel: english.secondaryCtaLabel,
          leftStatLabel: english.leftStatLabel,
          leftStatValue: english.leftStatValue,
          rightStatLabel: english.rightStatLabel,
          rightStatValue: english.rightStatValue,
          image: english.image
        };
      }

      return next;
    });
  };

  const heroTranslations = content.hero?.translations ?? {};
  const currentHero = heroTranslations[activeHeroLanguage] ?? EMPTY_HERO_TRANSLATION;

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
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                      <Icons.Layout className="w-5 h-5 text-cyan-500" />
                      Hero Section
                    </h3>
                    <div className="flex items-center gap-2">
                      {AVAILABLE_LANGUAGES.map(({ code }) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => setActiveHeroLanguage(code)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                            activeHeroLanguage === code
                              ? 'bg-cyan-500 text-white'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          {LANGUAGE_LABELS[code]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Badge / Eyebrow</label>
                      <input
                        type="text"
                        value={currentHero.badge}
                        onChange={(e) => handleHeroTranslationChange('badge', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Regional Network"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Supporting Title</label>
                      <input
                        type="text"
                        value={currentHero.subheading}
                        onChange={(e) => handleHeroTranslationChange('subheading', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Island-wide Impact"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Headline</label>
                      <input
                        type="text"
                        value={currentHero.title}
                        onChange={(e) => handleHeroTranslationChange('title', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Connecting Communities Through"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Highlight</label>
                      <input
                        type="text"
                        value={currentHero.highlight}
                        onChange={(e) => handleHeroTranslationChange('highlight', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Ocean Science"
                      />
                    </div>

                    <div className="lg:col-span-2 space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-slate-200">Hero Image Gallery</h4>
                        <button
                          type="button"
                          onClick={handleAddHeroImage}
                          className="px-3 py-1.5 rounded bg-slate-800 text-xs font-cta text-white hover:bg-slate-700"
                        >
                          <Icons.Plus className="inline w-3.5 h-3.5 mr-1" /> Add image
                        </button>
                      </div>
                      {heroImages?.length === 0 ? (
                        <p className="text-xs text-slate-400">
                          No gallery images configured. Add one or more image URLs to enable the hero carousel.
                        </p>
                      ) : null}
                      <div className="space-y-2">
                        {heroImages?.map((url, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={url}
                              onChange={(e) => handleHeroImageChange(index, e.target.value)}
                              className="flex-1 px-4 py-2 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                              placeholder="https://example.com/hero-image.jpg"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveHeroImage(index)}
                              className="px-2.5 py-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white"
                              aria-label="Remove image"
                            >
                              <Icons.Trash className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                      <textarea
                        value={currentHero.description}
                        onChange={(e) => handleHeroTranslationChange('description', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="High-level description for this language"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Primary CTA Label</label>
                      <input
                        type="text"
                        value={currentHero.primaryCtaLabel}
                        onChange={(e) => handleHeroTranslationChange('primaryCtaLabel', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Explore Centers"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Secondary CTA Label</label>
                      <input
                        type="text"
                        value={currentHero.secondaryCtaLabel}
                        onChange={(e) => handleHeroTranslationChange('secondaryCtaLabel', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Impact Stories"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Left Stat Label</label>
                      <input
                        type="text"
                        value={currentHero.leftStatLabel}
                        onChange={(e) => handleHeroTranslationChange('leftStatLabel', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Communities served"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Left Stat Value</label>
                      <input
                        type="text"
                        value={currentHero.leftStatValue}
                        onChange={(e) => handleHeroTranslationChange('leftStatValue', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="61"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Right Stat Label</label>
                      <input
                        type="text"
                        value={currentHero.rightStatLabel}
                        onChange={(e) => handleHeroTranslationChange('rightStatLabel', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="Safety record"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Right Stat Value</label>
                      <input
                        type="text"
                        value={currentHero.rightStatValue}
                        onChange={(e) => handleHeroTranslationChange('rightStatValue', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="100%"
                      />
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-medium text-slate-300 mb-2">Hero Image URL</label>
                      <input
                        type="text"
                        value={currentHero.image}
                        onChange={(e) => handleHeroTranslationChange('image', e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-950/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        placeholder="https://..."
                      />
                    </div>
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
