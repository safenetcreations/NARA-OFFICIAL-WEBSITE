import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Image as ImageIcon, Video, Download, Share2,
  Calendar, Tag, MapPin, ExternalLink, Eye, Heart,
  Grid3x3, List, SlidersHorizontal, X, Play,
  Facebook, Linkedin, AlertCircle, CheckCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchMediaItems, incrementMediaMetric } from '../../services/mediaGalleryService';

const CATEGORY_FALLBACKS = {
  all: 'All Media',
  research: 'Research Activities',
  'marine-life': 'Marine Life',
  events: 'Events & Conferences',
  facilities: 'Facilities & Equipment',
  'field-work': 'Field Work',
  conservation: 'Conservation Efforts',
  education: 'Education & Training',
  partnerships: 'Partnerships'
};

const SOURCE_FALLBACKS = {
  all: 'All Sources',
  manual: 'NARA Official',
  social: 'Social Media',
  news: 'News Outlets',
  partners: 'Partner Organizations'
};

const DATE_RANGE_FALLBACKS = {
  all: 'All Time',
  today: 'Today',
  week: 'Last 7 Days',
  month: 'Last 30 Days',
  year: 'Last 12 Months'
};

const normalizeTagKey = (tag = '') => tag.toString().toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const MediaGallery = () => {
  const { t, i18n } = useTranslation(['mediaGallery', 'common']);
  const currentLang = i18n.language || 'en';
  const [activeTab, setActiveTab] = useState('images'); // 'images' or 'videos'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [connectionError, setConnectionError] = useState(null);
  const [dataSource, setDataSource] = useState(null); // 'firebase' or 'fallback'

  const baseCategories = [
    { id: 'all', icon: Grid3x3 },
    { id: 'research', icon: ImageIcon },
    { id: 'marine-life', icon: ImageIcon },
    { id: 'events', icon: Calendar },
    { id: 'facilities', icon: ImageIcon },
    { id: 'field-work', icon: MapPin },
    { id: 'conservation', icon: Heart },
    { id: 'education', icon: ImageIcon },
    { id: 'partnerships', icon: ImageIcon }
  ];

  const categories = useMemo(() => (
    baseCategories.map(option => ({
      ...option,
      label: t(`mediaGallery:filters.categories.${option.id}`, CATEGORY_FALLBACKS[option.id] || option.id)
    }))
  ), [i18n.language, t]);

  const baseSources = [
    { id: 'all', icon: Grid3x3 },
    { id: 'manual', icon: ImageIcon },
    { id: 'social', icon: Facebook },
    { id: 'news', icon: ExternalLink },
    { id: 'partners', icon: Linkedin }
  ];

  const sources = useMemo(() => (
    baseSources.map(option => ({
      ...option,
      label: t(`mediaGallery:filters.sources.${option.id}`, SOURCE_FALLBACKS[option.id] || option.id)
    }))
  ), [i18n.language, t]);

  const dateOptions = useMemo(() => (
    Object.keys(DATE_RANGE_FALLBACKS).map(key => ({
      id: key,
      label: t(`mediaGallery:filters.dates.${key}`, DATE_RANGE_FALLBACKS[key])
    }))
  ), [i18n.language, t]);

  const mediaCacheRef = useRef({});
  const [usingFallback, setUsingFallback] = useState(false);
  const [galleryInsights, setGalleryInsights] = useState({
    counts: { images: 0, videos: 0 },
    totalViews: 0,
    totalLikes: 0,
    totalSources: 0,
    totalCategories: 0,
    lastUpdated: null
  });

  const numberFormatter = useMemo(() => new Intl.NumberFormat(i18n.language), [i18n.language]);
  const compactNumberFormatter = useMemo(
    () => new Intl.NumberFormat(i18n.language, { notation: 'compact', compactDisplay: 'short' }),
    [i18n.language]
  );
  const dateFormatter = useMemo(
    () => new Intl.DateTimeFormat(i18n.language, { year: 'numeric', month: 'short', day: 'numeric' }),
    [i18n.language]
  );

  const getLocalizedTagLabel = useCallback(
    (tag) => {
      const key = normalizeTagKey(tag);
      return key ? t(`mediaGallery:tags.${key}`, tag) : tag;
    },
    [t]
  );

  const getLocalizedTags = useCallback((item) => {
    if (!item) {
      return [];
    }

    if (item.tagTranslations && typeof item.tagTranslations === 'object') {
      return item.tagTranslations[currentLang] || item.tagTranslations.en || item.tags || [];
    }

    if (item.translations && typeof item.translations === 'object') {
      const localized = item.translations[currentLang]?.tags;
      if (Array.isArray(localized)) {
        return localized;
      }
      const english = item.translations.en?.tags;
      if (Array.isArray(english)) {
        return english;
      }
    }

    return item.tags || [];
  }, [currentLang]);

  const getLocalizedLocation = useCallback(
    (item) => getLocalizedTextValue(item, 'locationTranslations', 'location'),
    [currentLang]
  );

  const updateInsights = useCallback(() => {
    const images = mediaCacheRef.current.images || [];
    const videos = mediaCacheRef.current.videos || [];
    const combined = [...images, ...videos];

    if (combined.length === 0) {
      setGalleryInsights({
        counts: { images: images.length, videos: videos.length },
        totalViews: 0,
        totalLikes: 0,
        totalSources: 0,
        totalCategories: 0,
        lastUpdated: null
      });
      return;
    }

    const totalViews = combined.reduce((sum, item) => sum + (item.views || 0), 0);
    const totalLikes = combined.reduce((sum, item) => sum + (item.likes || 0), 0);
    const sourceSet = new Set();
    const categorySet = new Set();
    let lastUpdatedDate = null;

    combined.forEach(item => {
      if (item.source) {
        sourceSet.add(item.source);
      }
      if (item.sourceName) {
        sourceSet.add(item.sourceName);
      }
      if (item.category) {
        categorySet.add(item.category);
      }
      const rawDate = item.createdAt || item.date;
      if (rawDate) {
        const parsed = new Date(rawDate);
        if (!Number.isNaN(parsed.getTime()) && (!lastUpdatedDate || parsed > lastUpdatedDate)) {
          lastUpdatedDate = parsed;
        }
      }
    });

    setGalleryInsights({
      counts: { images: images.length, videos: videos.length },
      totalViews,
      totalLikes,
      totalSources: sourceSet.size,
      totalCategories: categorySet.size,
      lastUpdated: lastUpdatedDate ? lastUpdatedDate.toISOString() : null
    });
  }, []);

  const getLocalizedTextValue = (item, translationField, fallbackField) => {
    const directTranslations = item?.[translationField];
    if (directTranslations && typeof directTranslations === 'object') {
      const localized = directTranslations[currentLang];
      if (localized) {
        return localized;
      }
      if (directTranslations.en) {
        return directTranslations.en;
      }
    }

    const nestedTranslations = item?.translations;
    if (nestedTranslations && typeof nestedTranslations === 'object') {
      const localized = nestedTranslations[currentLang]?.[fallbackField];
      if (localized) {
        return localized;
      }
      if (nestedTranslations.en?.[fallbackField]) {
        return nestedTranslations.en[fallbackField];
      }
    }

    return item?.[fallbackField] || '';
  };

  const getLocalizedTitle = useCallback(
    (item) => getLocalizedTextValue(item, 'titleTranslations', 'title'),
    [currentLang]
  );
  const getLocalizedDescription = useCallback(
    (item) => getLocalizedTextValue(item, 'descriptionTranslations', 'description'),
    [currentLang]
  );

  const getSourceLabel = useCallback((item) => {
    if (item?.sourceName) {
      const directTranslations = item.sourceNameTranslations;
      if (directTranslations?.[currentLang]) {
        return directTranslations[currentLang];
      }
      if (directTranslations?.en) {
        return directTranslations.en;
      }

      const nestedTranslations = item.translations;
      if (nestedTranslations?.[currentLang]?.sourceName) {
        return nestedTranslations[currentLang].sourceName;
      }
      if (nestedTranslations?.en?.sourceName) {
        return nestedTranslations.en.sourceName;
      }

      return item.sourceName;
    }

    if (item?.source) {
      return t(`mediaGallery:filters.sources.${item.source}`, SOURCE_FALLBACKS[item.source] || SOURCE_FALLBACKS.manual);
    }

    return SOURCE_FALLBACKS.manual;
  }, [t, currentLang]);

  const getCategoryLabel = useCallback((categoryId) => (
    t(`mediaGallery:filters.categories.${categoryId}`, CATEGORY_FALLBACKS[categoryId] || categoryId)
  ), [t]);

  const formatDateDisplay = useCallback((value) => {
    if (!value) {
      return t('mediaGallery:labels.dateUnknown', 'Date unavailable');
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return dateFormatter.format(parsed);
  }, [dateFormatter, t]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const stored = window.localStorage.getItem('nara-media-favorites');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (error) {
      console.warn('Failed to load stored favorites', error);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem('nara-media-favorites', JSON.stringify(favorites));
    } catch (error) {
      console.warn('Failed to persist favorites', error);
    }
  }, [favorites]);

  useEffect(() => {
    let isMounted = true;
    const alternateType = activeTab === 'images' ? 'videos' : 'images';

    const loadType = async (type) => {
      try {
        const items = await fetchMediaItems({
          type,
          limitResults: 100,
          onlyApproved: true
        });
        const processed = (items.length ? items : getFallbackData(type)).map(item => ({
          ...item,
          type
        }));

        if (!isMounted) {
          return;
        }

        mediaCacheRef.current[type] = processed;
        updateInsights();
      } catch (error) {
        console.error('Error preloading media:', error);
        if (!isMounted) {
          return;
        }
        if (!mediaCacheRef.current[type]) {
          const fallbackItems = getFallbackData(type).map(item => ({
            ...item,
            type
          }));
          mediaCacheRef.current[type] = fallbackItems;
          updateInsights();
        }
      }
    };

    const cached = mediaCacheRef.current[activeTab];

    if (cached) {
      setMediaItems(cached);
      setUsingFallback(Boolean(cached.some(item => item.__fallback)));
      setLoading(false);
      updateInsights();

      if (!mediaCacheRef.current[alternateType]) {
        loadType(alternateType);
      }

      return () => {
        isMounted = false;
      };
    }

    const load = async () => {
      setLoading(true);
      setConnectionError(null);
      try {
        const items = await fetchMediaItems({
          type: activeTab,
          limitResults: 100,
          onlyApproved: true
        });
        
        if (items.length > 0) {
          const processed = items.map(item => ({
            ...item,
            type: activeTab
          }));

          if (!isMounted) {
            return;
          }

          mediaCacheRef.current[activeTab] = processed;
          setMediaItems(processed);
          setUsingFallback(false);
          setDataSource('firebase');
          setConnectionError(null);
          updateInsights();

          if (!mediaCacheRef.current[alternateType]) {
            loadType(alternateType);
          }
        } else {
          // No items found in Firebase, use fallback
          console.log('No items found in Firebase, using fallback data');
          const fallbackItems = getFallbackData(activeTab).map(item => ({
            ...item,
            type: activeTab
          }));

          if (!isMounted) {
            return;
          }

          mediaCacheRef.current[activeTab] = fallbackItems;
          setMediaItems(fallbackItems);
          setUsingFallback(true);
          setDataSource('fallback');
          setConnectionError('No media items found in database. Showing sample data. Please add media via the admin panel.');
          updateInsights();

          if (!mediaCacheRef.current[alternateType]) {
            loadType(alternateType);
          }
        }
      } catch (error) {
        console.error('Error loading media:', error);
        if (!isMounted) {
          return;
        }
        const fallbackItems = getFallbackData(activeTab).map(item => ({
          ...item,
          type: activeTab
        }));
        mediaCacheRef.current[activeTab] = fallbackItems;
        setMediaItems(fallbackItems);
        setUsingFallback(true);
        setDataSource('fallback');
        setConnectionError(`Failed to load data from Firebase: ${error.message}. Showing sample data.`);
        updateInsights();

        if (!mediaCacheRef.current[alternateType]) {
          loadType(alternateType);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [activeTab, updateInsights]);

  // Fallback data for demonstration
  const getFallbackData = (type = 'images') => {
    if (type === 'images') {
      return [
        {
          id: '1',
          title: 'Marine Research Expedition - Southern Coast',
          description: 'NARA researchers conducting marine biodiversity assessment in southern waters',
          url: 'https://picsum.photos/800/600?random=1',
          thumbnail: 'https://picsum.photos/400/300?random=1',
          category: 'research',
          source: 'manual',
          sourceName: 'NARA Official',
          tags: ['research', 'marine biology', 'field work'],
          location: 'Galle, Sri Lanka',
          date: '2024-10-10',
          photographer: 'NARA Media Team',
          views: 1245,
          likes: 89,
          approved: true,
          __fallback: true,
          type: 'images',
          translations: {
            si: {
              title: 'දකුණු වෙරළ මුහුදු පර්යේෂණ මෙහෙයුම',
              description: 'දකුණු මුහුදු ජලවල ජීව විවිධත්ව ඇගයීම සිදු කරන NARA ගවේෂකයින්',
              location: 'ගාල්ල, ශ්‍රී ලංකාව',
              tags: ['පර්යේෂණ', 'මුහුදු ජීව විද්‍යාව', 'ක්ෂේත්‍ර කටයුතු'],
              sourceName: 'NARA නිල'
            },
            ta: {
              title: 'தெற்கு கடற்கரை கடல் ஆராய்ச்சி பயணம்',
              description: 'தெற்கு கடல் நீரில் கடல் உயிரியல் பல்வகைமையை மதிப்பீடு செய்யும் NARA ஆராய்ச்சியாளர்கள்',
              location: 'காலி, இலங்கை',
              tags: ['ஆராய்ச்சி', 'கடல் உயிரியல்', 'துறைத்தொழில்'],
              sourceName: 'NARA அதிகாரப்பூர்வம்'
            }
          }
        },
        {
          id: '2',
          title: 'Coral Reef Conservation Project',
          description: 'Underwater documentation of coral restoration efforts',
          url: 'https://picsum.photos/800/600?random=2',
          thumbnail: 'https://picsum.photos/400/300?random=2',
          category: 'conservation',
          source: 'manual',
          sourceName: 'NARA Official',
          tags: ['coral', 'conservation', 'underwater'],
          location: 'Hikkaduwa Marine Sanctuary',
          date: '2024-10-08',
          photographer: 'Dr. Priya Fernando',
          views: 2134,
          likes: 156,
          approved: true,
          __fallback: true,
          type: 'images',
          translations: {
            si: {
              title: 'පවල් පරවල සංරක්ෂණ ව්‍යාපෘතිය',
              description: 'පවල් පුනරුත්ථාන උත්සාහයන්ගේ ජලයටැසී ලේඛනගත කිරීම',
              location: 'හික්කඩුව මුහුදු සංරක්ෂිතය',
              tags: ['පවල්', 'සංරක්ෂණ', 'ජලයටැසී'],
              sourceName: 'NARA නිල'
            },
            ta: {
              title: 'பவளப் பாறை பாதுகாப்பு திட்டம்',
              description: 'பவளப் பாறைகளை மீளுருவாக்கும் முயற்சிகளின் நீர்மூழ்கிய ஆவணப்படுத்தல்',
              location: 'ஹிக்கடுவா கடல் காப்பகம்',
              tags: ['பவளங்கள்', 'பாதுகாப்பு', 'நீரடுக்கு'],
              sourceName: 'NARA அதிகாரப்பூர்வம்'
            }
          }
        },
        {
          id: '3',
          title: 'International Ocean Conference 2024',
          description: 'NARA delegation at the Indo-Pacific Marine Science Summit',
          url: 'https://picsum.photos/800/600?random=3',
          thumbnail: 'https://picsum.photos/400/300?random=3',
          category: 'events',
          source: 'news',
          sourceName: 'Daily News',
          tags: ['conference', 'international', 'collaboration'],
          location: 'Colombo Convention Center',
          date: '2024-10-05',
          photographer: 'Daily News',
          views: 3456,
          likes: 234,
          approved: true,
          __fallback: true,
          type: 'images',
          translations: {
            si: {
              title: 'ජාත්‍යන්තර මුහුදු සම්මේලනය 2024',
              description: 'ඉන්දෝ-ප්‍රශාන්තික මුහුදු විද්‍යා සමුළුවට NARA නියෝජිතයෝ',
              location: 'කොළඹ සම්මේළන මධ්‍යස්ථානය',
              tags: ['සම්මේලනය', 'ජාත්‍යන්තර', 'සහයෝගිතාව']
            },
            ta: {
              title: 'சர்வதேச கடல் மாநாடு 2024',
              description: 'இந்தோ-பசிபிக் கடல் அறிவியல் உச்சிமாநாட்டில் NARA பிரதிநிதிகள்',
              location: 'கொழும்பு மாநாட்டு மையம்',
              tags: ['மாநாடு', 'சர்வதேச', 'கூட்டு வேலை']
            }
          }
        },
        {
          id: '4',
          title: 'Sea Turtle Nesting Monitoring',
          description: 'Conservation team tracking sea turtle nesting patterns',
          url: 'https://picsum.photos/800/600?random=4',
          thumbnail: 'https://picsum.photos/400/300?random=4',
          category: 'marine-life',
          source: 'social',
          sourceName: 'Facebook',
          tags: ['turtles', 'conservation', 'wildlife'],
          location: 'Rekawa Beach',
          date: '2024-10-03',
          photographer: 'NARA Facebook',
          views: 5678,
          likes: 423,
          approved: true,
          __fallback: true,
          type: 'images',
          translations: {
            si: {
              title: 'මුහුදු කරත්ත බිත්තර දැමීම නිරීක්ෂණය',
              description: 'සංරක්ෂණ කණ්ඩායම මුහුදු කරත්ත බිත්තර තැබීමේ රටාවන් ලුහුබැඳයි',
              location: 'රෑකව වෙරළ',
              tags: ['කරත්ත', 'සංරක්ෂණ', 'වනජීවී']
            },
            ta: {
              title: 'கடல் ஆமை முட்டையிடல் கண்காணிப்பு',
              description: 'பாதுகாப்பு அணி கடல் ஆமைகளின் முட்டையிடும் முன்னேற்றத்தை கண்காணிக்கிறது',
              location: 'ரேகவா கடற்கரை',
              tags: ['ஆமைகள்', 'பாதுகாப்பு', 'காட்டு உயிர்கள்']
            }
          }
        },
        {
          id: '5',
          title: 'Advanced Marine Laboratory Equipment',
          description: 'New state-of-the-art research equipment installation',
          url: 'https://picsum.photos/800/600?random=5',
          thumbnail: 'https://picsum.photos/400/300?random=5',
          category: 'facilities',
          source: 'manual',
          sourceName: 'NARA Official',
          tags: ['laboratory', 'equipment', 'research'],
          location: 'NARA Colombo',
          date: '2024-09-28',
          photographer: 'NARA Media Team',
          views: 876,
          likes: 67,
          approved: true,
          __fallback: true,
          type: 'images',
          translations: {
            si: {
              title: 'අධුනික මුහුදු රසායනාගාර උපකරණ',
              description: 'නව තාක්ෂණික පර්යේෂණ උපකරණ පිහිටුවීම',
              location: 'NARA කොළඹ',
              tags: ['රසායනාගාරය', 'උපකරණ', 'පර්යේෂණ'],
              sourceName: 'NARA නිල'
            },
            ta: {
              title: 'மேம்பட்ட கடல் ஆய்வக உபகரணங்கள்',
              description: 'புதிய அதிநவீன ஆராய்ச்சி உபகரணங்கள் நிறுவல்',
              location: 'NARA கொழும்பு',
              tags: ['ஆய்வகம்', 'உபகரணங்கள்', 'ஆராய்ச்சி'],
              sourceName: 'NARA அதிகாரப்பூர்வம்'
            }
          }
        },
        {
          id: '6',
          title: 'School Outreach Program',
          description: 'Marine biology education session with local school students',
          url: 'https://picsum.photos/800/600?random=6',
          thumbnail: 'https://picsum.photos/400/300?random=6',
          category: 'education',
          source: 'manual',
          sourceName: 'NARA Official',
          tags: ['education', 'outreach', 'students'],
          location: 'NARA Learning Center',
          date: '2024-09-25',
          photographer: 'NARA Education Team',
          views: 1543,
          likes: 198,
          approved: true,
          __fallback: true,
          type: 'images',
          translations: {
            si: {
              title: 'පාසල් සම්බන්ධතා වැඩසටහන',
              description: 'ප්‍රාදේශීය පාසල් සිසුන් සමඟ මුහුදු ජීව විද්‍යා අධ්‍යාපන සෙසුම',
              location: 'NARA අධ්‍යයන මධ්‍යස්ථානය',
              tags: ['අධ්‍යාපනය', 'ප්‍රවේශය', 'සිසුන්'],
              sourceName: 'NARA නිල'
            },
            ta: {
              title: 'பள்ளி தொடர்பு திட்டம்',
              description: 'உள்ளூர் பள்ளி மாணவர்களுடன் கடல் உயிரியல் கல்வி அமர்வு',
              location: 'NARA கற்றல் மையம்',
              tags: ['கல்வி', 'விரிவு', 'மாணவர்கள்'],
              sourceName: 'NARA அதிகாரப்பூர்வம்'
            }
          }
        }
      ];
    } else {
      return [
        {
          id: 'v1',
          title: 'NARA 2024 Year in Review',
          description: 'Comprehensive overview of NARA\'s major achievements and research highlights',
          thumbnail: 'https://picsum.photos/400/300?random=11',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '8:45',
          category: 'research',
          source: 'manual',
          sourceName: 'NARA Official',
          tags: ['annual review', 'highlights', 'research'],
          date: '2024-10-12',
          views: 12456,
          likes: 892,
          approved: true,
          __fallback: true,
          type: 'videos',
          translations: {
            si: {
              title: 'NARA 2024 වර්ෂ සමාලෝචනය',
              description: 'NARAයේ ප්‍රධාන සාර්ථකත්ව සහ පර්යේෂණ විශේෂාංග පිළිබඳ සවිස්තර අවලෝකනය',
              tags: ['වාර්ෂික සමාලෝචනය', 'ප්‍රධාන අවධානම්', 'පර්යේෂණ'],
              sourceName: 'NARA නිල'
            },
            ta: {
              title: 'NARA 2024 ஆண்டுச் சுருக்கம்',
              description: 'NARA-வின் முக்கிய சாதனைகள் மற்றும் ஆராய்ச்சி சிறப்பம்சங்களின் விரிவான பார்வை',
              tags: ['ஆண்டு மீள்பார்வை', 'முக்கிய அம்சங்கள்', 'ஆராய்ச்சி'],
              sourceName: 'NARA அதிகாரப்பூர்வம்'
            }
          }
        },
        {
          id: 'v2',
          title: 'Underwater Documentary: Sri Lankan Coral Reefs',
          description: '4K underwater footage showcasing the biodiversity of Sri Lankan coral ecosystems',
          thumbnail: 'https://picsum.photos/400/300?random=12',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '15:30',
          category: 'marine-life',
          source: 'manual',
          sourceName: 'NARA Official',
          tags: ['coral reefs', 'underwater', 'documentary'],
          date: '2024-10-09',
          views: 23789,
          likes: 1567,
          approved: true,
          __fallback: true,
          type: 'videos',
          translations: {
            si: {
              title: 'ජලයටැසී වාර්තාව: ශ්‍රී ලාංකීය පවල් පරළි',
              description: 'ශ්‍රී ලංකාවේ පවල් පරළු ජීව විවිධත්වය පෙන්වන 4K ජලයටැසී දෘශ්‍ය',
              tags: ['පවල් පරළි', 'ජලයටැසී', 'චිත්‍රපටය'],
              sourceName: 'NARA නිල'
            },
            ta: {
              title: 'நீரடுக்கு ஆவணம்: இலங்கை பவளப் பாறைகள்',
              description: 'இலங்கை பவளப் பாறைகளின் உயிர்ச்சிறப்பை காட்டும் 4K நீரடுக்கு காட்சிகள்',
              tags: ['பவளப் பாறைகள்', 'நீரடுக்கு', 'ஆவணப்படம்'],
              sourceName: 'NARA அதிகாரப்பூர்வம்'
            }
          }
        },
        {
          id: 'v3',
          title: 'Marine Research Methods Training',
          description: 'Educational video on modern marine research techniques and equipment',
          thumbnail: 'https://picsum.photos/400/300?random=13',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '12:20',
          category: 'education',
          source: 'manual',
          sourceName: 'NARA Official',
          tags: ['training', 'education', 'methods'],
          date: '2024-10-01',
          views: 8934,
          likes: 567,
          approved: true,
          __fallback: true,
          type: 'videos',
          translations: {
            si: {
              title: 'මුහුදු පර්යේෂණ ක්‍රම පුහුණු කිරීම',
              description: 'අධුනික මුහුදු පර්යේෂණ ක්‍රම හා උපකරණ පිළිබඳ අධ්‍යාපනික වීඩියෝව',
              tags: ['පුහුණුව', 'අධ්‍යාපනය', 'ක්‍රම'],
              sourceName: 'NARA නිල'
            },
            ta: {
              title: 'கடல் ஆராய்ச்சி முறைகள் பயிற்சி',
              description: 'நவீன கடல் ஆராய்ச்சி முறைகள் மற்றும் உபகரணங்களை விளக்கும் கல்வி வீடியோ',
              tags: ['பயிற்சி', 'கல்வி', 'முறைகள்'],
              sourceName: 'NARA அதிகாரப்பூர்வம்'
            }
          }
        },
        {
          id: 'v4',
          title: 'Blue Whale Sighting - Southern Coast',
          description: 'Rare footage of blue whales migrating through Sri Lankan waters',
          thumbnail: 'https://picsum.photos/400/300?random=14',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          duration: '5:15',
          category: 'marine-life',
          source: 'social',
          sourceName: 'YouTube',
          tags: ['whales', 'wildlife', 'migration'],
          date: '2024-09-28',
          views: 45678,
          likes: 3245,
          approved: true,
          __fallback: true,
          type: 'videos',
          translations: {
            si: {
              title: 'නිල් මාළිඟු නිරීක්ෂණය - දකුණු වෙරළ',
              description: 'ශ්‍රී ලාංකීය මුහුදෙන් ගමන් කරන නිල් මාළිඟුගේ දුර්ලභ දසුන්',
              tags: ['මාළිඟු', 'වනජීවී', 'ගමනාගමනය']
            },
            ta: {
              title: 'நீலத் திமிங்கலம் காட்சி - தெற்கு கடற்கரை',
              description: 'இலங்கை கடல் வழியாக செல்கின்ற நீலத் திமிங்கலங்களின் அரிதான காட்சிகள்',
              tags: ['திமிங்கல்கள்', 'காட்டு உயிர்கள்', 'குடிபெயர்வு']
            }
          }
        }
      ];
    }
  };
  const filteredMedia = useMemo(() => {
    if (!mediaItems.length) {
      return [];
    }

    const loweredSearch = searchQuery.trim().toLowerCase();
    const dayInMs = 24 * 60 * 60 * 1000;
    const now = new Date();
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const parseDate = (value) => {
      if (!value) {
        return null;
      }
      const parsed = new Date(value);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    };

    const withinDateFilter = (item) => {
      if (dateFilter === 'all') {
        return true;
      }

      const itemDate = parseDate(item.date || item.createdAt);
      if (!itemDate) {
        return false;
      }

      switch (dateFilter) {
        case 'today':
          return itemDate >= startOfToday;
        case 'week':
          return now.getTime() - itemDate.getTime() <= dayInMs * 7;
        case 'month':
          return now.getTime() - itemDate.getTime() <= dayInMs * 30;
        case 'year':
          return now.getTime() - itemDate.getTime() <= dayInMs * 365;
        default:
          return true;
      }
    };

    return mediaItems.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }

      if (selectedSource !== 'all' && item.source !== selectedSource) {
        return false;
      }

      if (!withinDateFilter(item)) {
        return false;
      }

      if (!loweredSearch) {
        return true;
      }

      const searchCorpus = [
        getLocalizedTitle(item),
        getLocalizedDescription(item),
        getLocalizedLocation(item),
        item.photographer,
        getSourceLabel(item),
        getLocalizedTags(item).join(' ')
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchCorpus.includes(loweredSearch);
    });
  }, [mediaItems, searchQuery, selectedCategory, selectedSource, dateFilter, getLocalizedTitle, getLocalizedDescription, getLocalizedLocation, getSourceLabel, getLocalizedTags]);

  const decoratedMedia = useMemo(() => (
    filteredMedia.map(item => ({
      ...item,
      displayTitle: getLocalizedTitle(item),
      displayDescription: getLocalizedDescription(item),
      displaySource: getSourceLabel(item),
      displayCategory: getCategoryLabel(item.category),
      displayDate: formatDateDisplay(item.date || item.createdAt),
      displayLocation: getLocalizedLocation(item),
      displayTags: getLocalizedTags(item).map(tag => getLocalizedTagLabel(tag))
    }))
  ), [filteredMedia, getLocalizedTitle, getLocalizedDescription, getSourceLabel, getCategoryLabel, formatDateDisplay, getLocalizedLocation, getLocalizedTags, getLocalizedTagLabel]);

  const sourceBreakdown = useMemo(() => {
    if (!mediaItems.length) {
      return [];
    }

    const counts = mediaItems.reduce((acc, item) => {
      const label = getSourceLabel(item);
      acc[label] = (acc[label] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [mediaItems, getSourceLabel]);

  const topTags = useMemo(() => {
    const tagCounts = {};
    mediaItems.forEach(item => {
      (item.tags || []).forEach(tag => {
        const key = normalizeTagKey(tag);
        if (!key) {
          return;
        }
        if (!tagCounts[key]) {
          tagCounts[key] = { key, raw: tag, count: 0 };
        }
        tagCounts[key].count += 1;
      });
    });

    return Object.values(tagCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 8)
      .map(entry => ({
        key: entry.key,
        count: entry.count,
        label: getLocalizedTagLabel(entry.raw)
      }));
  }, [mediaItems, getLocalizedTagLabel]);

  const latestMediaHighlights = useMemo(() => {
    const sorted = [...mediaItems].sort((a, b) => {
      const dateA = new Date(a.createdAt || a.date || 0).getTime();
      const dateB = new Date(b.createdAt || b.date || 0).getTime();
      return dateB - dateA;
    });

    return sorted.slice(0, 3).map(item => ({
      id: item.id,
      title: getLocalizedTitle(item),
      date: formatDateDisplay(item.date || item.createdAt),
      source: getSourceLabel(item)
    }));
  }, [mediaItems, getLocalizedTitle, formatDateDisplay, getSourceLabel]);

  const heroStats = useMemo(() => {
    const totalItems = galleryInsights.counts.images + galleryInsights.counts.videos;
    return [
      {
        key: 'items',
        icon: ImageIcon,
        value: compactNumberFormatter.format(totalItems),
        label: t('mediaGallery:stats.approvedItems', 'Approved Assets')
      },
      {
        key: 'views',
        icon: Eye,
        value: compactNumberFormatter.format(galleryInsights.totalViews),
        label: t('mediaGallery:stats.totalViews', 'Total Views')
      },
      {
        key: 'categories',
        icon: Tag,
        value: numberFormatter.format(galleryInsights.totalCategories),
        label: t('mediaGallery:stats.categories', 'Categories')
      },
      {
        key: 'sources',
        icon: ExternalLink,
        value: numberFormatter.format(galleryInsights.totalSources),
        label: t('mediaGallery:stats.sources', 'Sources')
      }
    ];
  }, [galleryInsights, compactNumberFormatter, numberFormatter, t]);

  const lastUpdatedText = useMemo(() => {
    if (!galleryInsights.lastUpdated) {
      return t('mediaGallery:stats.lastUpdated.placeholder', 'Awaiting first sync from admin panel');
    }
    return t('mediaGallery:stats.lastUpdated.value', {
      date: formatDateDisplay(galleryInsights.lastUpdated)
    });
  }, [galleryInsights.lastUpdated, formatDateDisplay, t]);

  const updateMediaState = (id, updates, type = activeTab) => {
    const cached = mediaCacheRef.current[type];
    if (Array.isArray(cached)) {
      mediaCacheRef.current[type] = cached.map(item =>
        item.id === id ? { ...item, ...updates } : item
      );
    }

    if (type === activeTab) {
      setMediaItems(prev => prev.map(item =>
        item.id === id ? { ...item, ...updates } : item
      ));
    }

    setSelectedMedia(prev => {
      if (!prev || prev.id !== id) {
        return prev;
      }
      return { ...prev, ...updates };
    });

    updateInsights();
  };

  const handleOpenMedia = (item) => {
    const type = item.type || activeTab;
    const cachedItem = mediaCacheRef.current[type]?.find(media => media.id === item.id) || item;
    const currentViews = cachedItem?.views || 0;
    const updatedViews = currentViews + 1;
    const displayTitle = getLocalizedTitle(cachedItem);
    const displayDescription = getLocalizedDescription(cachedItem);
    const displaySource = getSourceLabel(cachedItem);
    const displayCategory = getCategoryLabel(cachedItem.category);
    const displayDate = formatDateDisplay(cachedItem.date || cachedItem.createdAt);
    const displayLocation = getLocalizedLocation(cachedItem);
    const displayTags = getLocalizedTags(cachedItem).map(tag => getLocalizedTagLabel(tag));
    setSelectedMedia({
      ...cachedItem,
      type,
      views: updatedViews,
      displayTitle,
      displayDescription,
      displaySource,
      displayCategory,
      displayDate,
      displayLocation,
      displayTags
    });

    if (item.__fallback || !item.id) {
      return;
    }

    updateMediaState(item.id, { views: updatedViews }, type);
    incrementMediaMetric(type, item.id, 'views').catch(() => {});
  };

  const toggleFavorite = (item) => {
    if (!item || !item.id) {
      return;
    }

    setFavorites(prev => {
      const alreadyFavorite = prev.includes(item.id);
      const nextFavorites = alreadyFavorite
        ? prev.filter(fav => fav !== item.id)
        : [...prev, item.id];

      if (!item.__fallback && item.id) {
        const type = item.type || activeTab;
        const cachedItem = mediaCacheRef.current[type]?.find(media => media.id === item.id) || item;
        const currentLikes = cachedItem?.likes ?? 0;
        const delta = alreadyFavorite ? -1 : 1;
        const newLikes = Math.max(0, currentLikes + delta);
        updateMediaState(item.id, { likes: newLikes }, type);
        incrementMediaMetric(type, item.id, 'likes', delta).catch(() => {});
      }

      return nextFavorites;
    });
  };

  const handleDownloadMedia = (item) => {
    if (!item || typeof window === 'undefined') {
      return;
    }

    const targetUrl = item.url || item.videoUrl || item.thumbnail;
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }

    if (!item.__fallback && item.id) {
      const type = item.type || activeTab;
      incrementMediaMetric(type, item.id, 'downloads').catch(() => {});
    }
  };

  const handleShareMedia = async (item) => {
    if (!item || typeof window === 'undefined') {
      return;
    }

    const shareUrl = item.videoUrl || item.url || window.location.href;

    if (!item.__fallback && item.id) {
      const type = item.type || activeTab;
      incrementMediaMetric(type, item.id, 'shares').catch(() => {});
    }

    if (typeof navigator === 'undefined') {
      return;
    }

    const sharePayload = {
      title: item.title,
      text: item.description || item.title,
      url: shareUrl
    };

    if (navigator.share) {
      try {
        await navigator.share(sharePayload);
      } catch (error) {
        console.warn('Share cancelled', error);
      }
      return;
    }

    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(sharePayload.url);
      } catch (error) {
        console.warn('Clipboard copy failed', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-center">
            {t('mediaGallery:hero.title', '📸 NARA Media Gallery')}
          </h1>
          <p className="text-xl md:text-2xl text-center text-cyan-100 mb-8" lang={currentLang}>
            {t('mediaGallery:hero.subtitle', 'Explore our visual journey through ocean research, conservation, and marine science')}
          </p>

          {/* Main Search Bar */}
          <div className="max-w-3xl mx-auto relative">
            <input
              type="text"
              placeholder={t('mediaGallery:search.placeholder', 'Search images, videos, tags, locations...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pr-12 rounded-2xl bg-white/20 backdrop-blur-lg border-2 border-white/30 text-white placeholder-white/60 text-lg focus:outline-none focus:border-cyan-300 transition-all"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-white/60" />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-4xl mx-auto">
            {heroStats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-cyan-300" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-cyan-200">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <p className="mt-6 text-center text-sm text-cyan-100/80">
            {lastUpdatedText}
          </p>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Connection Status Messages */}
        {connectionError && (
          <div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-100">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-semibold mb-1">
                {dataSource === 'fallback' ? 'Using Sample Data' : 'Notice'}
              </p>
              <p className="text-sm">{connectionError}</p>
              {dataSource === 'fallback' && (
                <a 
                  href="/admin/media" 
                  className="inline-flex items-center gap-2 mt-2 text-sm font-semibold text-cyan-300 hover:text-cyan-200 underline"
                >
                  Go to Admin Panel to Add Media →
                </a>
              )}
            </div>
          </div>
        )}

        {dataSource === 'firebase' && !connectionError && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/10 border border-green-400/30 text-green-100">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span>✅ Connected to live database - Showing {filteredData.length} media items</span>
          </div>
        )}

        {usingFallback && !connectionError && (
          <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-100">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{t('mediaGallery:fallback.notice', 'Showing curated sample media while the live gallery loads from the admin panel.')}</span>
          </div>
        )}

        {/* Tabs and Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          {/* Image/Video Tabs */}
          <div className="flex gap-2 bg-slate-800/50 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('images')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'images'
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              {t('mediaGallery:tabs.images', 'Images')} ({galleryInsights.counts.images})
            </button>
            <button
              onClick={() => setActiveTab('videos')}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                activeTab === 'videos'
                  ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/50'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Video className="w-5 h-5" />
              {t('mediaGallery:tabs.videos', 'Videos')} ({galleryInsights.counts.videos})
            </button>
          </div>

          {/* View Mode and Filters */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-all"
            >
              <SlidersHorizontal className="w-5 h-5" />
              {t('mediaGallery:filters.toggle', 'Filters')}
            </button>
            <div className="flex gap-1 bg-slate-800/50 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'grid' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid3x3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-all ${
                  viewMode === 'list' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 bg-slate-800/30 backdrop-blur-lg rounded-2xl p-6 border border-slate-700/50"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-cyan-300">
                    {t('mediaGallery:filters.categoryLabel', 'Category')}
                  </label>
                  <div className="space-y-2">
                    {categories.slice(0, 6).map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                          selectedCategory === cat.id
                            ? 'bg-cyan-500 text-white'
                            : 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50'
                        }`}
                      >
                        <cat.icon className="w-4 h-4" />
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Source Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-purple-300">
                    {t('mediaGallery:filters.sourceLabel', 'Source')}
                  </label>
                  <div className="space-y-2">
                    {sources.map(src => (
                      <button
                        key={src.id}
                        onClick={() => setSelectedSource(src.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all ${
                          selectedSource === src.id
                            ? 'bg-purple-500 text-white'
                            : 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50'
                        }`}
                      >
                        <src.icon className="w-4 h-4" />
                        {src.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Filter */}
                <div>
                  <label className="block text-sm font-semibold mb-3 text-blue-300">
                    {t('mediaGallery:filters.dateLabel', 'Date Range')}
                  </label>
                  <div className="space-y-2">
                    {dateOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => setDateFilter(option.id)}
                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all capitalize ${
                          dateFilter === option.id
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-700/30 text-slate-300 hover:bg-slate-700/50'
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-cyan-200 mb-3">
              {t('mediaGallery:insights.sources.title', 'Top Sources')}
            </h3>
            {sourceBreakdown.length === 0 ? (
              <p className="text-xs text-slate-400">
                {t('mediaGallery:insights.sources.empty', 'No sources available yet.')}
              </p>
            ) : (
              <ul className="space-y-2">
                {sourceBreakdown.map((source) => (
                  <li key={source.label} className="flex items-center justify-between text-sm text-slate-200">
                    <span>{source.label}</span>
                    <span className="text-cyan-300 font-medium">{source.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-cyan-200 mb-3">
              {t('mediaGallery:insights.tags.title', 'Trending Tags')}
            </h3>
            {topTags.length === 0 ? (
              <p className="text-xs text-slate-400">
                {t('mediaGallery:insights.tags.empty', 'Tags will appear once media is available.')}
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {topTags.map(tag => (
                  <span key={tag.key} className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-200 text-xs">
                    #{tag.label} • {tag.count}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-cyan-200 mb-3">
              {t('mediaGallery:insights.latest.title', 'Latest Updates')}
            </h3>
            {latestMediaHighlights.length === 0 ? (
              <p className="text-xs text-slate-400">
                {t('mediaGallery:insights.latest.empty', 'Newly approved media will surface here.')}
              </p>
            ) : (
              <ul className="space-y-2 text-sm text-slate-200">
                {latestMediaHighlights.map(item => (
                  <li key={item.id} className="flex flex-col">
                    <span className="font-semibold line-clamp-1">{item.title}</span>
                    <span className="text-xs text-slate-400">{item.date} · {item.source}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Media Grid/List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-400">{t('mediaGallery:loading', 'Loading media...')}</p>
          </div>
        ) : decoratedMedia.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon className="w-24 h-24 mx-auto text-slate-600 mb-4" />
            <h3 className="text-2xl font-bold text-slate-400 mb-2">{t('mediaGallery:empty.title', 'No media found')}</h3>
            <p className="text-slate-500">{t('mediaGallery:empty.description', 'Try adjusting your search or filters')}</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }>
            {decoratedMedia.map((item, index) => (
              <MediaCard
                key={item.id}
                item={item}
                viewMode={viewMode}
                isVideo={activeTab === 'videos'}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={() => toggleFavorite(item)}
                onClick={() => handleOpenMedia(item)}
                index={index}
              />
            ))}
          </div>
        )}
      </div>

      {/* Media Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <MediaModal
            media={selectedMedia}
            isVideo={(selectedMedia.type || activeTab) === 'videos'}
            onClose={() => setSelectedMedia(null)}
            onDownload={() => handleDownloadMedia(selectedMedia)}
            onShare={() => handleShareMedia(selectedMedia)}
            onToggleFavorite={() => toggleFavorite(selectedMedia)}
            isFavorite={favorites.includes(selectedMedia.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Media Card Component
const MediaCard = ({ item, viewMode, isVideo, isFavorite, onToggleFavorite, onClick, index }) => {
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        className="flex gap-4 bg-slate-800/30 backdrop-blur-lg rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 transition-all group cursor-pointer"
        onClick={onClick}
      >
        <div className="relative w-48 h-32 flex-shrink-0">
          <img src={item.thumbnail} alt={item.displayTitle} className="w-full h-full object-cover" />
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Play className="w-12 h-12 text-white" />
              <span className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs">
                {item.duration}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 py-3 pr-4">
          <h3 className="font-bold text-lg mb-1 group-hover:text-cyan-400 transition-colors">{item.displayTitle}</h3>
          <p className="text-sm text-slate-400 mb-2 line-clamp-2">{item.displayDescription}</p>
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
            <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {item.displayCategory}</span>
            <span className="flex items-center gap-1"><ExternalLink className="w-3 h-3" /> {item.displaySource}</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.displayDate}</span>
            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {item.views}</span>
            <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {item.likes}</span>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className="p-4"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="group relative bg-slate-800/30 backdrop-blur-lg rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/20 transition-all cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={item.thumbnail}
          alt={item.displayTitle || item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/60 transition-colors">
            <Play className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
            <span className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded text-sm font-semibold">
              {item.duration}
            </span>
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all z-10"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-white'}`} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2">
          {item.displayTitle}
        </h3>
        <p className="text-sm text-slate-400 mb-3 line-clamp-2">{item.displayDescription}</p>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.displayDate}</span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {item.views}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="flex items-center gap-1"><Tag className="w-3 h-3" /> {item.displayCategory}</span>
          <span className="flex items-center gap-1"><ExternalLink className="w-3 h-3" /> {item.displaySource}</span>
        </div>
        {(item.displayLocation || item.location) && (
          <div className="flex items-center gap-1 text-xs text-cyan-400 mb-2">
            <MapPin className="w-3 h-3" /> {item.displayLocation || item.location}
          </div>
        )}
        <div className="flex flex-wrap gap-1">
          {(item.displayTags || item.tags || []).slice(0, 3).map((tag, idx) => (
            <span key={`${item.id}-tag-${idx}`} className="px-2 py-1 bg-slate-700/50 rounded text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Media Modal Component
const MediaModal = ({ media, isVideo, onClose, onDownload, onShare, onToggleFavorite, isFavorite }) => {
  const { t } = useTranslation('mediaGallery');
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-6xl w-full max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        <div className="max-h-[90vh] overflow-y-auto">
          {isVideo && media.videoUrl ? (
            <div className="aspect-video bg-black">
              <iframe
                src={media.videoUrl.replace('watch?v=', 'embed/')}
                className="w-full h-full"
                allowFullScreen
                title={media.displayTitle || media.title}
              />
            </div>
          ) : media.url ? (
            <div className="relative">
              <img src={media.url} alt={media.displayTitle || media.title} className="w-full" />
            </div>
          ) : (
            <div className="aspect-video bg-slate-800 flex items-center justify-center text-slate-500">
              <ImageIcon className="w-10 h-10 mr-2" />
              <span>{t('mediaFallback.empty', 'No media available')}</span>
            </div>
          )}

          <div className="p-6">
            <h2 className="text-3xl font-bold mb-2">{media.displayTitle || media.title}</h2>
            <p className="text-slate-400 mb-4">{media.displayDescription || media.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyan-400" />
                <span className="text-sm">{media.displayDate || media.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-cyan-400" />
                <span className="text-sm">{t('metrics.views', { defaultValue: '{{count}} views', count: media.views })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400" />
                <span className="text-sm">{t('metrics.likes', { defaultValue: '{{count}} likes', count: media.likes })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-5 h-5 text-cyan-400" />
                <span className="text-sm">{media.displayCategory || CATEGORY_FALLBACKS[media.category] || media.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-cyan-400" />
                <span className="text-sm">{media.displaySource || media.sourceName || SOURCE_FALLBACKS[media.source] || media.source}</span>
              </div>
              {(media.displayLocation || media.location) && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <span className="text-sm">{media.displayLocation || media.location}</span>
                </div>
              )}
            </div>

            {media.photographer && (
              <p className="text-sm text-slate-500 mb-4">
                📸 {t('metrics.photoBy', 'Photo by')}: {media.photographer}
              </p>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {(media.displayTags || media.tags || []).map((tag, idx) => (
                <span key={`${media.id}-modal-tag-${idx}`} className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-sm">
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDownload?.();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-all"
              >
                <Download className="w-4 h-4" />
                {t('actions.download', 'Download')}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onShare?.();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all"
              >
                <Share2 className="w-4 h-4" />
                {t('actions.share', 'Share')}
              </button>
              {onToggleFavorite && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite();
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isFavorite
                      ? 'bg-rose-500 text-white hover:bg-rose-600'
                      : 'bg-slate-700 text-white hover:bg-slate-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
                  {isFavorite
                    ? t('actions.favorited', 'Favorited')
                    : t('actions.favorite', 'Add to Favorites')}
                </button>
              )}
              {!isVideo && media.url && (
                <a
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t('actions.openOriginal', 'Open Original')}
                </a>
              )}
              {isVideo && media.videoUrl && (
                <a
                  href={media.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  {t('actions.watchSource', 'Watch on Source')}
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MediaGallery;
