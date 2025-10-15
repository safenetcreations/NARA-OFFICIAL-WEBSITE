import { auth } from '../lib/firebase';

// API Base URL - should be configured via environment variable
const API_BASE_URL = import.meta.env.VITE_LIBRARY_API_URL || 'http://localhost:5000/api';

/**
 * Get Firebase ID token for authenticated requests
 */
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return await user.getIdToken();
};

/**
 * Make authenticated API request
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * Make public API request (no authentication required)
 */
const publicApiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('Public API request error:', error);
    throw error;
  }
};

// ============================================
// CATALOGUE SERVICES
// ============================================

export const catalogueService = {
  /**
   * Get all catalogue items
   */
  getAllItems: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await publicApiRequest(`/catalogue?${queryString}`);
  },

  /**
   * Get item by ID
   */
  getItemById: async (id) => {
    return await publicApiRequest(`/catalogue/${id}`);
  },

  /**
   * Get item by barcode
   */
  getItemByBarcode: async (barcode) => {
    return await publicApiRequest(`/catalogue/barcode/${barcode}`);
  },

  /**
   * Create new item (librarian/admin only)
   */
  createItem: async (itemData) => {
    return await apiRequest('/catalogue', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  /**
   * Update item (librarian/admin only)
   */
  updateItem: async (id, updates) => {
    return await apiRequest(`/catalogue/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete item (admin only)
   */
  deleteItem: async (id) => {
    return await apiRequest(`/catalogue/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Bulk import items
   */
  bulkImport: async (items) => {
    return await apiRequest('/catalogue/bulk/import', {
      method: 'POST',
      body: JSON.stringify({ items }),
    });
  },

  /**
   * Get all material types
   */
  getMaterialTypes: async () => {
    return await publicApiRequest('/catalogue/material-types/all');
  },

  /**
   * Generate unique barcode
   */
  generateBarcode: async () => {
    return await apiRequest('/catalogue/generate/barcode');
  },
};

// ============================================
// CIRCULATION SERVICES
// ============================================

export const circulationService = {
  /**
   * Check out item
   */
  checkOut: async (patronId, itemId, barcode) => {
    return await apiRequest('/circulation/checkout', {
      method: 'POST',
      body: JSON.stringify({ patron_id: patronId, item_id: itemId, barcode }),
    });
  },

  /**
   * Check in item
   */
  checkIn: async (itemId, barcode) => {
    return await apiRequest('/circulation/checkin', {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId, barcode }),
    });
  },

  /**
   * Renew item
   */
  renewItem: async (transactionId) => {
    return await apiRequest(`/circulation/renew/${transactionId}`, {
      method: 'POST',
    });
  },

  /**
   * Get all active loans
   */
  getActiveLoans: async () => {
    return await apiRequest('/circulation/active-loans');
  },

  /**
   * Get patron's active loans
   */
  getPatronActiveLoans: async (patronId) => {
    return await apiRequest(`/circulation/active-loans/patron/${patronId}`);
  },

  /**
   * Get overdue items
   */
  getOverdueItems: async () => {
    return await apiRequest('/circulation/overdue');
  },

  /**
   * Get transaction history
   */
  getTransactionHistory: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/circulation/history?${queryString}`);
  },

  /**
   * Get patron history
   */
  getPatronHistory: async (patronId) => {
    return await apiRequest(`/circulation/history/patron/${patronId}`);
  },

  /**
   * Get item history
   */
  getItemHistory: async (itemId) => {
    return await apiRequest(`/circulation/history/item/${itemId}`);
  },

  /**
   * Place hold on item
   */
  placeHold: async (patronId, itemId) => {
    return await apiRequest('/circulation/holds', {
      method: 'POST',
      body: JSON.stringify({ patron_id: patronId, item_id: itemId }),
    });
  },

  /**
   * Get all holds
   */
  getAllHolds: async (status) => {
    const queryString = status ? `?status=${status}` : '';
    return await apiRequest(`/circulation/holds${queryString}`);
  },

  /**
   * Get patron holds
   */
  getPatronHolds: async (patronId) => {
    return await apiRequest(`/circulation/holds/patron/${patronId}`);
  },

  /**
   * Get item holds
   */
  getItemHolds: async (itemId) => {
    return await apiRequest(`/circulation/holds/item/${itemId}`);
  },

  /**
   * Update hold status
   */
  updateHold: async (holdId, status, notes) => {
    return await apiRequest(`/circulation/holds/${holdId}`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  },

  /**
   * Cancel hold
   */
  cancelHold: async (holdId) => {
    return await apiRequest(`/circulation/holds/${holdId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get all fines
   */
  getAllFines: async (status) => {
    const queryString = status ? `?status=${status}` : '';
    return await apiRequest(`/circulation/fines${queryString}`);
  },

  /**
   * Get patron fines
   */
  getPatronFines: async (patronId) => {
    return await apiRequest(`/circulation/fines/patron/${patronId}`);
  },

  /**
   * Pay fine
   */
  payFine: async (fineId, amount, paymentMethod, paymentReference) => {
    return await apiRequest(`/circulation/fines/${fineId}/pay`, {
      method: 'POST',
      body: JSON.stringify({
        amount,
        payment_method: paymentMethod,
        payment_reference: paymentReference,
      }),
    });
  },

  /**
   * Waive fine
   */
  waiveFine: async (fineId, reason) => {
    return await apiRequest(`/circulation/fines/${fineId}/waive`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
};

// ============================================
// PATRON SERVICES
// ============================================

export const patronService = {
  /**
   * Get all patrons
   */
  getAllPatrons: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/patrons?${queryString}`);
  },

  /**
   * Get patron by ID
   */
  getPatronById: async (id) => {
    return await apiRequest(`/patrons/${id}`);
  },

  /**
   * Get patron by Firebase UID
   */
  getPatronByFirebaseUid: async (uid) => {
    return await apiRequest(`/patrons/firebase/${uid}`);
  },

  /**
   * Get patron by patron number
   */
  getPatronByNumber: async (patronNumber) => {
    return await apiRequest(`/patrons/number/${patronNumber}`);
  },

  /**
   * Create patron
   */
  createPatron: async (patronData) => {
    return await apiRequest('/patrons', {
      method: 'POST',
      body: JSON.stringify(patronData),
    });
  },

  /**
   * Update patron
   */
  updatePatron: async (id, updates) => {
    return await apiRequest(`/patrons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete patron
   */
  deletePatron: async (id) => {
    return await apiRequest(`/patrons/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get patron statistics
   */
  getPatronStatistics: async (id) => {
    return await apiRequest(`/patrons/${id}/statistics`);
  },

  /**
   * Get patron categories
   */
  getPatronCategories: async () => {
    return await apiRequest('/patrons/categories/all');
  },

  /**
   * Generate patron number
   */
  generatePatronNumber: async () => {
    return await apiRequest('/patrons/generate/patron-number');
  },
};

// ============================================
// SEARCH SERVICES
// ============================================

export const searchService = {
  /**
   * Full-text search
   */
  search: async (query, params = {}) => {
    const queryString = new URLSearchParams({ q: query, ...params }).toString();
    return await publicApiRequest(`/search?${queryString}`);
  },

  /**
   * Advanced search
   */
  advancedSearch: async (searchCriteria) => {
    return await publicApiRequest('/search/advanced', {
      method: 'POST',
      body: JSON.stringify(searchCriteria),
    });
  },

  /**
   * Get search facets
   */
  getFacets: async () => {
    return await publicApiRequest('/search/facets');
  },

  /**
   * Get autocomplete suggestions
   */
  getSuggestions: async (query) => {
    return await publicApiRequest(`/search/suggestions?q=${encodeURIComponent(query)}`);
  },

  /**
   * Get popular items
   */
  getPopularItems: async (limit = 10) => {
    return await publicApiRequest(`/search/popular?limit=${limit}`);
  },

  /**
   * Get new arrivals
   */
  getNewArrivals: async (limit = 20) => {
    return await publicApiRequest(`/search/new-arrivals?limit=${limit}`);
  },

  /**
   * Get related items
   */
  getRelatedItems: async (itemId, limit = 5) => {
    return await publicApiRequest(`/search/related/${itemId}?limit=${limit}`);
  },
};

// ============================================
// ACQUISITIONS SERVICES
// ============================================

export const acquisitionsService = {
  /**
   * Get all acquisitions
   */
  getAllAcquisitions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/acquisitions?${queryString}`);
  },

  /**
   * Get acquisition by ID
   */
  getAcquisitionById: async (id) => {
    return await apiRequest(`/acquisitions/${id}`);
  },

  /**
   * Create acquisition
   */
  createAcquisition: async (acquisitionData) => {
    return await apiRequest('/acquisitions', {
      method: 'POST',
      body: JSON.stringify(acquisitionData),
    });
  },

  /**
   * Update acquisition
   */
  updateAcquisition: async (id, updates) => {
    return await apiRequest(`/acquisitions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete acquisition
   */
  deleteAcquisition: async (id) => {
    return await apiRequest(`/acquisitions/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get acquisition items
   */
  getAcquisitionItems: async (id) => {
    return await apiRequest(`/acquisitions/${id}/items`);
  },

  /**
   * Add item to acquisition
   */
  addAcquisitionItem: async (id, itemData) => {
    return await apiRequest(`/acquisitions/${id}/items`, {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  /**
   * Get all suppliers
   */
  getAllSuppliers: async (status) => {
    const queryString = status ? `?status=${status}` : '';
    return await apiRequest(`/acquisitions/suppliers/all${queryString}`);
  },

  /**
   * Create supplier
   */
  createSupplier: async (supplierData) => {
    return await apiRequest('/acquisitions/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplierData),
    });
  },

  /**
   * Get budget report
   */
  getBudgetReport: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/acquisitions/reports/budget?${queryString}`);
  },
};

// ============================================
// SERIALS SERVICES
// ============================================

export const serialsService = {
  /**
   * Get all serials
   */
  getAllSerials: async (status) => {
    const queryString = status ? `?status=${status}` : '';
    return await publicApiRequest(`/serials${queryString}`);
  },

  /**
   * Get serial by ID
   */
  getSerialById: async (id) => {
    return await publicApiRequest(`/serials/${id}`);
  },

  /**
   * Create serial
   */
  createSerial: async (serialData) => {
    return await apiRequest('/serials', {
      method: 'POST',
      body: JSON.stringify(serialData),
    });
  },

  /**
   * Update serial
   */
  updateSerial: async (id, updates) => {
    return await apiRequest(`/serials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Get serial issues
   */
  getSerialIssues: async (id) => {
    return await apiRequest(`/serials/${id}/issues`);
  },

  /**
   * Create serial issue
   */
  createSerialIssue: async (id, issueData) => {
    return await apiRequest(`/serials/${id}/issues`, {
      method: 'POST',
      body: JSON.stringify(issueData),
    });
  },

  /**
   * Get missing issues
   */
  getMissingIssues: async (id) => {
    return await apiRequest(`/serials/${id}/issues/missing`);
  },

  /**
   * Claim missing issue
   */
  claimMissingIssue: async (id, issueId) => {
    return await apiRequest(`/serials/${id}/issues/${issueId}/claim`, {
      method: 'POST',
    });
  },

  /**
   * Get upcoming renewals
   */
  getUpcomingRenewals: async (days = 30) => {
    return await apiRequest(`/serials/renewals/upcoming?days=${days}`);
  },
};

// ============================================
// REPORTS SERVICES
// ============================================

export const reportsService = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async () => {
    return await apiRequest('/reports/dashboard');
  },

  /**
   * Get daily circulation
   */
  getDailyCirculation: async (date) => {
    const queryString = date ? `?date=${date}` : '';
    return await apiRequest(`/reports/circulation/daily${queryString}`);
  },

  /**
   * Get monthly circulation
   */
  getMonthlyCirculation: async (year, month) => {
    const queryString = new URLSearchParams({ year, month }).toString();
    return await apiRequest(`/reports/circulation/monthly?${queryString}`);
  },

  /**
   * Get yearly circulation
   */
  getYearlyCirculation: async (year) => {
    return await apiRequest(`/reports/circulation/yearly?year=${year}`);
  },

  /**
   * Get collection statistics
   */
  getCollectionStatistics: async () => {
    return await apiRequest('/reports/collection/statistics');
  },

  /**
   * Get most borrowed items
   */
  getMostBorrowedItems: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/reports/collection/most-borrowed?${queryString}`);
  },

  /**
   * Get patron statistics
   */
  getPatronStatistics: async () => {
    return await apiRequest('/reports/patrons/statistics');
  },

  /**
   * Get top borrowers
   */
  getTopBorrowers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/reports/patrons/top-borrowers?${queryString}`);
  },

  /**
   * Get fines report
   */
  getFinesReport: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiRequest(`/reports/financial/fines?${queryString}`);
  },

  /**
   * Get overdue summary
   */
  getOverdueSummary: async () => {
    return await apiRequest('/reports/overdue/summary');
  },

  /**
   * Get overdue detailed
   */
  getOverdueDetailed: async () => {
    return await apiRequest('/reports/overdue/detailed');
  },
};

// ============================================
// SETTINGS SERVICES
// ============================================

export const settingsService = {
  /**
   * Get all settings
   */
  getAllSettings: async () => {
    return await apiRequest('/settings');
  },

  /**
   * Get setting by key
   */
  getSettingByKey: async (key) => {
    return await apiRequest(`/settings/${key}`);
  },

  /**
   * Update setting
   */
  updateSetting: async (key, value, description) => {
    return await apiRequest(`/settings/${key}`, {
      method: 'PUT',
      body: JSON.stringify({ setting_value: value, description }),
    });
  },

  /**
   * Bulk update settings
   */
  bulkUpdateSettings: async (settings) => {
    return await apiRequest('/settings/bulk', {
      method: 'POST',
      body: JSON.stringify({ settings }),
    });
  },
};

// Export all services
export default {
  catalogue: catalogueService,
  circulation: circulationService,
  patron: patronService,
  search: searchService,
  acquisitions: acquisitionsService,
  serials: serialsService,
  reports: reportsService,
  settings: settingsService,
};

