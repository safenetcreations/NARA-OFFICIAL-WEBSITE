// Supabase is disabled in this project. This file provides a safe, awaitable stub
// so any legacy imports won't crash the app while we migrate to Firebase-only.
// All operations resolve to empty data structures.

const createBuilder = () => {
  const builder = {
    // Make this object awaitable: `await builder` resolves to { data, error }
    then: (resolve) => resolve({ data: [], error: null }),
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    order: () => builder,
    eq: () => builder,
    gte: () => builder,
    lte: () => builder,
    in: () => builder,
    limit: () => builder,
    single: () => builder
  };
  return builder;
};

export const supabase = {
  auth: {
    getUser: async () => ({ data: { user: null } })
  },
  from: () => createBuilder(),
  storage: {
    from: () => ({
      upload: async () => ({ data: { path: '' }, error: null }),
      createSignedUrl: async () => ({ data: { signedUrl: '' }, error: null }),
      download: async () => ({ data: null, error: null }),
      list: async () => ({ data: [], error: null }),
      remove: async () => ({ data: null, error: null })
    })
  }
};

export default supabase;
