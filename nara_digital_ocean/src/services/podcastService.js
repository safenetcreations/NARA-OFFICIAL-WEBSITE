import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit as firestoreLimit,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ============================================
// Podcast Service
// ============================================

export const podcastService = {
  /**
   * Create a new podcast episode
   */
  create: async (podcastData) => {
    try {
      console.log('🎙️ Creating podcast episode:', podcastData.title);
      const docRef = await addDoc(collection(db, 'podcasts'), {
        ...podcastData,
        status: podcastData.status || 'published',
        views: 0,
        likes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      console.log('✅ Podcast episode created:', docRef.id);
      return {
        data: {
          id: docRef.id,
          ...podcastData
        },
        error: null
      };
    } catch (error) {
      console.error('❌ Error creating podcast:', error);
      return { data: null, error };
    }
  },

  /**
   * Get all podcasts with optional filters
   */
  getAll: async (filters = {}) => {
    try {
      console.log('🎙️ Fetching podcasts with filters:', filters);
      let q = collection(db, 'podcasts');
      const constraints = [];

      if (filters.status) {
        constraints.push(where('status', '==', filters.status));
      }

      if (filters.category) {
        constraints.push(where('category', '==', filters.category));
      }

      if (filters.featured) {
        constraints.push(where('featured', '==', true));
      }

      // Order by publishedAt or createdAt
      constraints.push(orderBy(filters.orderBy || 'publishedAt', 'desc'));

      if (filters.limit) {
        constraints.push(firestoreLimit(filters.limit));
      }

      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }

      const snapshot = await getDocs(q);
      console.log('🎙️ Podcasts snapshot size:', snapshot.size);

      const podcasts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        publishedAt: doc.data().publishedAt?.toDate()
      }));

      console.log('🎙️ Returning podcasts:', podcasts.length);
      return { data: podcasts, error: null };
    } catch (error) {
      console.error('❌ Error getting podcasts:', error);
      return { data: [], error };
    }
  },

  /**
   * Get a single podcast by ID
   */
  getById: async (podcastId) => {
    try {
      const docRef = doc(db, 'podcasts', podcastId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Podcast not found') };
      }

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate(),
          publishedAt: docSnap.data().publishedAt?.toDate()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting podcast:', error);
      return { data: null, error };
    }
  },

  /**
   * Update a podcast
   */
  update: async (podcastId, updates) => {
    try {
      const docRef = doc(db, 'podcasts', podcastId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });

      return { data: { id: podcastId, ...updates }, error: null };
    } catch (error) {
      console.error('Error updating podcast:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete a podcast
   */
  delete: async (podcastId) => {
    try {
      const docRef = doc(db, 'podcasts', podcastId);
      await deleteDoc(docRef);
      return { data: { id: podcastId }, error: null };
    } catch (error) {
      console.error('Error deleting podcast:', error);
      return { data: null, error };
    }
  },

  /**
   * Increment views count
   */
  incrementViews: async (podcastId) => {
    try {
      const docRef = doc(db, 'podcasts', podcastId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentViews = docSnap.data().views || 0;
        await updateDoc(docRef, {
          views: currentViews + 1,
          updatedAt: serverTimestamp()
        });
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error incrementing views:', error);
      return { data: null, error };
    }
  },

  /**
   * Toggle like
   */
  toggleLike: async (podcastId, userId) => {
    try {
      const docRef = doc(db, 'podcasts', podcastId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const likes = docSnap.data().likedBy || [];
        const hasLiked = likes.includes(userId);

        await updateDoc(docRef, {
          likedBy: hasLiked
            ? likes.filter(id => id !== userId)
            : [...likes, userId],
          likes: hasLiked
            ? (docSnap.data().likes || 0) - 1
            : (docSnap.data().likes || 0) + 1,
          updatedAt: serverTimestamp()
        });

        return { data: { liked: !hasLiked }, error: null };
      }

      return { data: null, error: new Error('Podcast not found') };
    } catch (error) {
      console.error('Error toggling like:', error);
      return { data: null, error };
    }
  },

  /**
   * Get featured podcasts
   */
  getFeatured: async (limit = 5) => {
    try {
      const q = query(
        collection(db, 'podcasts'),
        where('featured', '==', true),
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc'),
        firestoreLimit(limit)
      );

      const snapshot = await getDocs(q);
      const podcasts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        publishedAt: doc.data().publishedAt?.toDate()
      }));

      return { data: podcasts, error: null };
    } catch (error) {
      console.error('Error getting featured podcasts:', error);
      return { data: [], error };
    }
  },

  /**
   * Get podcasts by category
   */
  getByCategory: async (category, limit = 10) => {
    try {
      const q = query(
        collection(db, 'podcasts'),
        where('category', '==', category),
        where('status', '==', 'published'),
        orderBy('publishedAt', 'desc'),
        firestoreLimit(limit)
      );

      const snapshot = await getDocs(q);
      const podcasts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        publishedAt: doc.data().publishedAt?.toDate()
      }));

      return { data: podcasts, error: null };
    } catch (error) {
      console.error('Error getting podcasts by category:', error);
      return { data: [], error };
    }
  },

  /**
   * Search podcasts
   */
  search: async (searchTerm) => {
    try {
      // Note: For production, consider using Algolia or similar for better search
      const snapshot = await getDocs(collection(db, 'podcasts'));
      const podcasts = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
          publishedAt: doc.data().publishedAt?.toDate()
        }))
        .filter(podcast =>
          podcast.title?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          podcast.description?.en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          podcast.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        );

      return { data: podcasts, error: null };
    } catch (error) {
      console.error('Error searching podcasts:', error);
      return { data: [], error };
    }
  }
};

// ============================================
// Podcast Analytics Service
// ============================================

export const podcastAnalyticsService = {
  /**
   * Get podcast statistics
   */
  getStatistics: async () => {
    try {
      const snapshot = await getDocs(collection(db, 'podcasts'));
      const podcasts = snapshot.docs.map(doc => doc.data());

      const stats = {
        total: podcasts.length,
        published: podcasts.filter(p => p.status === 'published').length,
        draft: podcasts.filter(p => p.status === 'draft').length,
        totalViews: podcasts.reduce((sum, p) => sum + (p.views || 0), 0),
        totalLikes: podcasts.reduce((sum, p) => sum + (p.likes || 0), 0),
        categories: {}
      };

      // Count by category
      podcasts.forEach(podcast => {
        if (podcast.category) {
          stats.categories[podcast.category] = (stats.categories[podcast.category] || 0) + 1;
        }
      });

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error getting podcast statistics:', error);
      return { data: null, error };
    }
  },

  /**
   * Get trending podcasts (most viewed in last 7 days)
   */
  getTrending: async (limit = 10) => {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const q = query(
        collection(db, 'podcasts'),
        where('status', '==', 'published'),
        where('publishedAt', '>=', Timestamp.fromDate(sevenDaysAgo)),
        orderBy('publishedAt', 'desc'),
        orderBy('views', 'desc'),
        firestoreLimit(limit)
      );

      const snapshot = await getDocs(q);
      const podcasts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        publishedAt: doc.data().publishedAt?.toDate()
      }));

      return { data: podcasts, error: null };
    } catch (error) {
      console.error('Error getting trending podcasts:', error);
      return { data: [], error };
    }
  }
};
