import { collection, query, where, orderBy, limit, getDocs, doc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_MAP = {
  images: 'media_images',
  videos: 'media_videos'
};

const DEFAULT_LIMIT = 60;

const withId = (snapshotDoc, overrides = {}) => ({
  id: snapshotDoc.id,
  ...snapshotDoc.data(),
  ...overrides
});

const normalizeMediaRecord = (docSnap, type) => {
  const record = withId(docSnap);
  const fallbackThumb = type === 'images' ? record.url : record.thumbnail;

  return {
    ...record,
    type,
    thumbnail: record.thumbnail || fallbackThumb,
    // Normalize translation containers from admin (titleTranslations, translations.title, etc.)
    titleTranslations: record.titleTranslations || record.translations?.title || null,
    descriptionTranslations: record.descriptionTranslations || record.translations?.description || null,
    // Ensure tags/source metadata always exist for filtering
    tags: Array.isArray(record.tags) ? record.tags : [],
    source: record.source || 'manual',
    sourceName: record.sourceName || '',
    createdAt: record.createdAt || record.date || null,
    date: record.date || record.createdAt?.slice?.(0, 10) || null,
    approved: record.approved ?? false,
    views: typeof record.views === 'number' ? record.views : 0,
    likes: typeof record.likes === 'number' ? record.likes : 0
  };
};

export const fetchMediaItems = async ({
  type = 'images',
  limitResults = DEFAULT_LIMIT,
  onlyApproved = true
} = {}) => {
  try {
    const collectionName = COLLECTION_MAP[type] || COLLECTION_MAP.images;
    
    // First try with approved filter
    if (onlyApproved) {
      try {
        const approvedQuery = query(
          collection(db, collectionName),
          where('approved', '==', true),
          orderBy('createdAt', 'desc'),
          limit(limitResults)
        );
        const snapshot = await getDocs(approvedQuery);
        
        if (snapshot.docs.length > 0) {
          return snapshot.docs.map((docSnap) => normalizeMediaRecord(docSnap, type));
        }
      } catch (approvedError) {
        console.warn('Query with approved filter failed, trying without filter:', approvedError);
      }
    }
    
    // Fallback: query without approved filter, then filter in memory
    const basicQuery = query(
      collection(db, collectionName),
      orderBy('createdAt', 'desc'),
      limit(limitResults * 2) // Get more to compensate for filtering
    );
    
    const snapshot = await getDocs(basicQuery);
    let results = snapshot.docs.map((docSnap) => normalizeMediaRecord(docSnap, type));
    
    // Filter approved items in memory if needed
    if (onlyApproved) {
      results = results.filter(item => item.approved === true);
    }
    
    return results.slice(0, limitResults);
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    throw error;
  }
};

export const incrementMediaMetric = async (type, id, field = 'views', amount = 1) => {
  const collectionName = COLLECTION_MAP[type];
  if (!collectionName) {
    throw new Error(`Unknown media type: ${type}`);
  }

  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      [field]: increment(amount),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Failed to increment ${field} for ${type}:${id}`, error);
  }
};

export const mediaGalleryService = {
  fetchMediaItems,
  incrementMediaMetric
};

export default mediaGalleryService;
