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
  const collectionName = COLLECTION_MAP[type] || COLLECTION_MAP.images;
  let composedQuery = query(
    collection(db, collectionName),
    orderBy('createdAt', 'desc'),
    limit(limitResults)
  );

  if (onlyApproved) {
    composedQuery = query(composedQuery, where('approved', '==', true));
  }

  const snapshot = await getDocs(composedQuery);
  return snapshot.docs.map((docSnap) => normalizeMediaRecord(docSnap, type));
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
