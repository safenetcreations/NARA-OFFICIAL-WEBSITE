// Stub service - Supabase removed
const stubResponse = { data: [], error: null };

const firebaseAdminService = {
  users: {
    getAll: async () => stubResponse,
    create: async () => stubResponse,
    update: async () => stubResponse,
    delete: async () => stubResponse
  },
  content: {
    getAll: async () => stubResponse,
    create: async () => stubResponse,
    update: async () => stubResponse,
    delete: async () => stubResponse
  },
  applications: {
    getAll: async () => stubResponse,
    update: async () => stubResponse,
    approve: async () => stubResponse,
    reject: async () => stubResponse
  },
  analytics: {
    getDashboard: async () => stubResponse
  }
};

export default firebaseAdminService;
