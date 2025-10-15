import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';

// ============================================
// Evidence Documents Service
// ============================================

export const evidenceDocumentsService = {
  /**
   * Get all evidence documents with optional filters
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'evidence_documents');
      const queryConstraints = [orderBy('publishedDate', 'desc')];

      if (filters.category) {
        queryConstraints.unshift(where('category', '==', filters.category));
      }

      if (filters.policyArea) {
        queryConstraints.unshift(where('policyArea', '==', filters.policyArea));
      }

      if (filters.status) {
        queryConstraints.unshift(where('status', '==', filters.status));
      }

      if (filters.limit) {
        queryConstraints.push(limit(filters.limit));
      }

      q = query(q, ...queryConstraints);
      const snapshot = await getDocs(q);

      const documents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: documents, error: null };
    } catch (error) {
      console.error('Error getting evidence documents:', error);
      return { data: [], error };
    }
  },

  /**
   * Get document by ID
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'evidence_documents', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Document not found') };
      }

      // Increment view count
      await updateDoc(docRef, {
        viewCount: (docSnap.data().viewCount || 0) + 1
      });

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting document:', error);
      return { data: null, error };
    }
  },

  /**
   * Search documents by keywords
   */
  search: async (searchTerm) => {
    try {
      // In production, use a proper search service like Algolia
      // For now, we'll fetch all and filter client-side
      const { data: documents } = await evidenceDocumentsService.getAll();

      const filtered = documents.filter(doc => {
        const searchLower = searchTerm.toLowerCase();
        return (
          doc.title?.toLowerCase().includes(searchLower) ||
          doc.abstract?.toLowerCase().includes(searchLower) ||
          doc.keywords?.some(k => k.toLowerCase().includes(searchLower)) ||
          doc.authors?.some(a => a.toLowerCase().includes(searchLower))
        );
      });

      return { data: filtered, error: null };
    } catch (error) {
      console.error('Error searching documents:', error);
      return { data: [], error };
    }
  },

  /**
   * Create new evidence document
   */
  create: async (documentData) => {
    try {
      const docRef = await addDoc(collection(db, 'evidence_documents'), {
        ...documentData,
        viewCount: 0,
        downloadCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...documentData }, error: null };
    } catch (error) {
      console.error('Error creating document:', error);
      return { data: null, error };
    }
  },

  /**
   * Update evidence document
   */
  update: async (id, documentData) => {
    try {
      const docRef = doc(db, 'evidence_documents', id);
      await updateDoc(docRef, {
        ...documentData,
        updatedAt: serverTimestamp()
      });
      return { data: { id, ...documentData }, error: null };
    } catch (error) {
      console.error('Error updating document:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete evidence document
   */
  delete: async (id) => {
    try {
      const docRef = doc(db, 'evidence_documents', id);
      await deleteDoc(docRef);
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting document:', error);
      return { data: null, error };
    }
  },

  /**
   * Increment download count
   */
  incrementDownload: async (id) => {
    try {
      const docRef = doc(db, 'evidence_documents', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        await updateDoc(docRef, {
          downloadCount: (docSnap.data().downloadCount || 0) + 1
        });
      }

      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error incrementing download count:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Policy Briefs Service
// ============================================

export const policyBriefsService = {
  /**
   * Get all policy briefs
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'policy_briefs');
      const queryConstraints = [orderBy('publishedDate', 'desc')];

      if (filters.policyArea) {
        queryConstraints.unshift(where('policyArea', '==', filters.policyArea));
      }

      if (filters.status) {
        queryConstraints.unshift(where('status', '==', filters.status));
      }

      if (filters.limit) {
        queryConstraints.push(limit(filters.limit));
      }

      q = query(q, ...queryConstraints);
      const snapshot = await getDocs(q);

      const briefs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: briefs, error: null };
    } catch (error) {
      console.error('Error getting policy briefs:', error);
      return { data: [], error };
    }
  },

  /**
   * Get policy brief by ID
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'policy_briefs', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Policy brief not found') };
      }

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting policy brief:', error);
      return { data: null, error };
    }
  },

  /**
   * Create policy brief
   */
  create: async (briefData) => {
    try {
      const docRef = await addDoc(collection(db, 'policy_briefs'), {
        ...briefData,
        viewCount: 0,
        downloadCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...briefData }, error: null };
    } catch (error) {
      console.error('Error creating policy brief:', error);
      return { data: null, error };
    }
  },

  /**
   * Update policy brief
   */
  update: async (id, briefData) => {
    try {
      const docRef = doc(db, 'policy_briefs', id);
      await updateDoc(docRef, {
        ...briefData,
        updatedAt: serverTimestamp()
      });
      return { data: { id, ...briefData }, error: null };
    } catch (error) {
      console.error('Error updating policy brief:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete policy brief
   */
  delete: async (id) => {
    try {
      const docRef = doc(db, 'policy_briefs', id);
      await deleteDoc(docRef);
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting policy brief:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Data Visualizations Service
// ============================================

export const dataVisualizationsService = {
  /**
   * Get all data visualizations
   */
  getAll: async (filters = {}) => {
    try {
      let q = collection(db, 'data_visualizations');
      const queryConstraints = [orderBy('createdAt', 'desc')];

      if (filters.dataType) {
        queryConstraints.unshift(where('dataType', '==', filters.dataType));
      }

      if (filters.limit) {
        queryConstraints.push(limit(filters.limit));
      }

      q = query(q, ...queryConstraints);
      const snapshot = await getDocs(q);

      const visualizations = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return { data: visualizations, error: null };
    } catch (error) {
      console.error('Error getting visualizations:', error);
      return { data: [], error };
    }
  },

  /**
   * Get visualization by ID
   */
  getById: async (id) => {
    try {
      const docRef = doc(db, 'data_visualizations', id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return { data: null, error: new Error('Visualization not found') };
      }

      return {
        data: {
          id: docSnap.id,
          ...docSnap.data()
        },
        error: null
      };
    } catch (error) {
      console.error('Error getting visualization:', error);
      return { data: null, error };
    }
  },

  /**
   * Create visualization
   */
  create: async (vizData) => {
    try {
      const docRef = await addDoc(collection(db, 'data_visualizations'), {
        ...vizData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { data: { id: docRef.id, ...vizData }, error: null };
    } catch (error) {
      console.error('Error creating visualization:', error);
      return { data: null, error };
    }
  },

  /**
   * Update visualization
   */
  update: async (id, vizData) => {
    try {
      const docRef = doc(db, 'data_visualizations', id);
      await updateDoc(docRef, {
        ...vizData,
        updatedAt: serverTimestamp()
      });
      return { data: { id, ...vizData }, error: null };
    } catch (error) {
      console.error('Error updating visualization:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete visualization
   */
  delete: async (id) => {
    try {
      const docRef = doc(db, 'data_visualizations', id);
      await deleteDoc(docRef);
      return { data: { id }, error: null };
    } catch (error) {
      console.error('Error deleting visualization:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// Dashboard Statistics Service
// ============================================

export const evidenceDashboardService = {
  /**
   * Get comprehensive dashboard statistics
   */
  getStatistics: async () => {
    try {
      const [documentsResult, briefsResult, vizResult] = await Promise.all([
        evidenceDocumentsService.getAll(),
        policyBriefsService.getAll(),
        dataVisualizationsService.getAll()
      ]);

      const documents = documentsResult.data || [];
      const briefs = briefsResult.data || [];
      const visualizations = vizResult.data || [];

      // Calculate statistics
      const stats = {
        documents: {
          total: documents.length,
          published: documents.filter(d => d.status === 'published').length,
          draft: documents.filter(d => d.status === 'draft').length,
          totalViews: documents.reduce((sum, d) => sum + (d.viewCount || 0), 0),
          totalDownloads: documents.reduce((sum, d) => sum + (d.downloadCount || 0), 0)
        },
        briefs: {
          total: briefs.length,
          published: briefs.filter(b => b.status === 'published').length,
          draft: briefs.filter(b => b.status === 'draft').length
        },
        visualizations: {
          total: visualizations.length
        },
        recentDocuments: documents.slice(0, 5),
        recentBriefs: briefs.slice(0, 5),
        popularDocuments: documents
          .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
          .slice(0, 5)
      };

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return { data: null, error };
    }
  }
};

// ============================================
// File Upload Service
// ============================================

export const evidenceFileService = {
  /**
   * Upload document file to Firebase Storage
   */
  uploadFile: async (file, category) => {
    try {
      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name}`;
      const storageRef = ref(storage, `evidence/${category}/${filename}`);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      return { data: { url: downloadURL, path: storageRef.fullPath }, error: null };
    } catch (error) {
      console.error('Error uploading file:', error);
      return { data: null, error };
    }
  },

  /**
   * Delete file from Firebase Storage
   */
  deleteFile: async (filePath) => {
    try {
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      return { data: { success: true }, error: null };
    } catch (error) {
      console.error('Error deleting file:', error);
      return { data: null, error };
    }
  }
};
