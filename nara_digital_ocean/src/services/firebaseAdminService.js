// Firebase Admin Service for NARA Digital Ocean (Firebase-only)
import { collection, doc, getDocs, setDoc, updateDoc, query, where, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from '../lib/firebase';

class FirebaseAdminService {
  // Real-time dashboard statistics
  subscribeToDashboardStats(callback) {
    const unsubscribers = [];

    // Subscribe to user activities
    const userActivitiesQuery = query(
      collection(db, 'userActivities'),
      orderBy('timestamp', 'desc'),
      limit(100)
    );

    const unsubscribeActivities = onSnapshot(userActivitiesQuery, (snapshot) => {
      const activities = snapshot?.docs?.map(doc => ({
        id: doc?.id,
        ...doc?.data()
      }));
      callback('activities', activities);
    });

    unsubscribers?.push(unsubscribeActivities);

    return () => {
      unsubscribers?.forEach(unsubscribe => unsubscribe());
    };
  }

  // Get system analytics (Firebase only)
  async getSystemAnalytics() {
    try {
      const firebaseStats = await this.getFirebaseAnalytics();
      return {
        firebase: firebaseStats,
        supabase: { totalUsers: 0, activeUsers: 0, totalProjects: 0, activeProjects: 0, totalCollaborations: 0, activeCollaborations: 0 },
        combined: {
          totalUsers: firebaseStats?.totalUsers,
          activeUsers: firebaseStats?.activeUsers,
          systemHealth: 'excellent'
        }
      };
    } catch (error) {
      console.error('Error fetching system analytics:', error);
      throw error;
    }
  }

  // Firebase-specific analytics
  async getFirebaseAnalytics() {
    try {
      const [adminProfiles, userActivities, systemLogs] = await Promise.all([
        getDocs(collection(db, 'adminProfiles')),
        getDocs(query(collection(db, 'userActivities'), limit(1000))),
        getDocs(query(collection(db, 'systemLogs'), orderBy('timestamp', 'desc'), limit(500)))
      ]);

      return {
        totalUsers: adminProfiles?.size,
        activeUsers: adminProfiles?.docs?.filter(doc => {
          const data = doc?.data();
          const lastLogin = data?.lastLoginAt?.toDate();
          return lastLogin && (new Date() - lastLogin) < 24 * 60 * 60 * 1000; // 24 hours
        })?.length,
        totalActivities: userActivities?.size,
        systemEvents: systemLogs?.size,
        lastUpdated: new Date()
      };
    } catch (error) {
      console.error('Error fetching Firebase analytics:', error);
      throw error;
    }
  }

  // Legacy method retained for compatibility; returns zeros (Supabase removed)
  async getSupabaseAnalytics() {
    return { totalUsers: 0, activeUsers: 0, totalProjects: 0, activeProjects: 0, totalCollaborations: 0, activeCollaborations: 0 };
  }

  // User management operations
  async getAllUsers(filters = {}) {
    try {
      let q = query(collection(db, 'adminProfiles'));
      if (filters?.role) {
        q = query(collection(db, 'adminProfiles'), where('role', '==', filters?.role));
      }
      const snapshot = await getDocs(q);
      let users = snapshot?.docs?.map(d => ({ id: d?.id, ...d?.data() })) || [];
      if (filters?.isActive !== undefined) {
        users = users?.filter(u => !!u?.is_active === !!filters?.isActive);
      }
      // Sort by createdAt if present, else by displayName
      users?.sort((a, b) => (b?.createdAt?.seconds || 0) - (a?.createdAt?.seconds || 0));
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  async updateUser(userId, updates) {
    try {
      await updateDoc(doc(db, 'adminProfiles', userId), { ...updates, updatedAt: new Date() });
      await this.logAdminAction('user_updated', { userId, updates });
      return { id: userId, ...updates };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deactivateUser(userId) {
    try {
      await updateDoc(doc(db, 'adminProfiles', userId), { is_active: false, updatedAt: new Date() });
      await this.logAdminAction('user_deactivated', { userId });
      return { id: userId, is_active: false };
    } catch (error) {
      console.error('Error deactivating user:', error);
      throw error;
    }
  }

  // Content management operations
  async getNewsArticles(filters = {}) {
    try {
      // Firestore collection: newsArticles
      let q = query(collection(db, 'newsArticles'), orderBy('createdAt', 'desc'));
      if (filters?.status) {
        q = query(collection(db, 'newsArticles'), where('status', '==', filters?.status), orderBy('createdAt', 'desc'));
      }
      const snapshot = await getDocs(q);
      return snapshot?.docs?.map(d => ({ id: d?.id, ...d?.data() })) || [];
    } catch (error) {
      console.error('Error fetching news articles:', error);
      return [];
    }
  }

  async updateNewsArticle(articleId, updates) {
    try {
      await updateDoc(doc(db, 'newsArticles', articleId), { ...updates, updatedAt: new Date() });
      await this.logAdminAction('news_article_updated', { articleId, updates });
      return { id: articleId, ...updates };
    } catch (error) {
      console.error('Error updating news article:', error);
      throw error;
    }
  }

  // Application tracking operations
  async getApplications(type = 'all', filters = {}) {
    try {
      // Firestore collection optional: adminApplications
      let q = query(collection(db, 'adminApplications'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      let apps = snapshot?.docs?.map(d => ({ id: d?.id, ...d?.data() })) || [];
      if (type !== 'all') apps = apps?.filter(a => a?.type === type);
      if (filters?.status) apps = apps?.filter(a => a?.status === filters?.status);
      return apps;
    } catch (error) {
      // If collection doesn't exist, return empty array gracefully
      return [];
    }
  }

  async updateApplicationStatus(applicationId, type, status, comments) {
    try {
      await updateDoc(doc(db, 'adminApplications', applicationId), { status, admin_comments: comments, reviewed_at: new Date() });
      await this.logAdminAction('application_status_updated', { applicationId, type, status, comments });
      return { id: applicationId, status, admin_comments: comments };
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  }

  // Cloud Functions management
  async executeCloudFunction(functionName, data = {}) {
    try {
      const cloudFunction = httpsCallable(functions, functionName);
      const result = await cloudFunction(data);

      await this.logAdminAction('cloud_function_executed', { 
        functionName, 
        data, 
        result: result?.data 
      });

      return result?.data;
    } catch (error) {
      console.error(`Error executing cloud function ${functionName}:`, error);
      throw error;
    }
  }

  // Email notification system
  async sendEmailNotification(recipients, subject, content, type = 'general') {
    try {
      const emailFunction = httpsCallable(functions, 'sendEmailNotification');
      const result = await emailFunction({
        recipients,
        subject,
        content,
        type,
        timestamp: serverTimestamp()
      });

      await this.logAdminAction('email_sent', { recipients, subject, type });

      return result?.data;
    } catch (error) {
      console.error('Error sending email notification:', error);
      throw error;
    }
  }

  // System monitoring and logging
  async logAdminAction(action, details = {}) {
    try {
      await setDoc(doc(collection(db, 'adminLogs')), {
        action,
        details,
        timestamp: serverTimestamp(),
        adminId: details?.adminId || 'system'
      });
    } catch (error) {
      console.error('Error logging admin action:', error);
    }
  }

  async getSystemLogs(limit = 100) {
    try {
      const logsQuery = query(
        collection(db, 'adminLogs'),
        orderBy('timestamp', 'desc'),
        limit(limit)
      );

      const snapshot = await getDocs(logsQuery);
      return snapshot?.docs?.map(doc => ({
        id: doc?.id,
        ...doc?.data()
      }));
    } catch (error) {
      console.error('Error fetching system logs:', error);
      throw error;
    }
  }

  // Real-time notifications
  subscribeToNotifications(callback) {
    const notificationsQuery = query(
      collection(db, 'adminNotifications'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    return onSnapshot(notificationsQuery, (snapshot) => {
      const notifications = snapshot?.docs?.map(doc => ({
        id: doc?.id,
        ...doc?.data()
      }));
      callback(notifications);
    });
  }

  // Data backup operations
  async createDataBackup() {
    try {
      const backupFunction = httpsCallable(functions, 'createDataBackup');
      const result = await backupFunction({
        timestamp: new Date()?.toISOString(),
        includeSupabase: false
      });

      await this.logAdminAction('data_backup_created', { result: result?.data });

      return result?.data;
    } catch (error) {
      console.error('Error creating data backup:', error);
      throw error;
    }
  }
}

export default new FirebaseAdminService();