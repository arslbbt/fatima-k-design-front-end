/**
 * Centralized query key factory for consistent caching and invalidation
 *
 * Benefits:
 * - Type-safe query keys
 * - Consistent naming across the app
 * - Easy to invalidate specific queries without affecting others
 * - Clear hierarchy for partial invalidation
 */

export const queryKeys = {
  // Auth & User Profile
  auth: {
    me: () => ["auth", "me"] as const,
  },

  admin: {
    me: () => ["admin", "me"] as const,
    dashboard: () => ["admin", "dashboard"] as const,
    users: (page?: number, search?: string, role?: string) =>
      ["admin", "users", { page, search, role }] as const,
  },

  // Brides
  brides: {
    all: () => ["brides"] as const,
    lists: () => ["brides", "list"] as const,
    list: (filters: {
      search?: string;
      stage?: string;
      page?: number;
      limit?: number;
    }) => ["brides", "list", filters] as const,
    detail: (id: string) => ["brides", "detail", id] as const,
    names: () => ["brides", "names"] as const,
    me: () => ["brides", "me"] as const,
    journey: () => ["brides", "journey"] as const,
  },

  // Appointments
  appointments: {
    all: () => ["appointments"] as const,
    lists: () => ["appointments", "list"] as const,
    list: (from?: string, to?: string) =>
      ["appointments", "list", { from, to }] as const,
    detail: (id: string) => ["appointments", "detail", id] as const,
    my: () => ["appointments", "my"] as const,
    forBride: (brideId: string) => ["appointments", "bride", brideId] as const,
  },

  // Payments
  payments: {
    all: () => ["payments"] as const,
    revenue: () => ["payments", "revenue"] as const,
    monthly: (year?: number) => ["payments", "monthly", year] as const,
    bridesTracking: (page?: number, search?: string, status?: string) =>
      ["payments", "brides-tracking", { page, search, status }] as const,
    my: () => ["payments", "my"] as const,
  },

  // Fittings
  fittings: {
    all: () => ["fittings"] as const,
    forBride: (brideId: string) => ["fittings", "bride", brideId] as const,
    my: () => ["fittings", "my"] as const,
  },

  // Documents
  documents: {
    all: () => ["documents"] as const,
    forBride: (brideId: string) => ["documents", "bride", brideId] as const,
    my: () => ["documents", "my"] as const,
  },

  // Inspiration
  inspo: {
    all: () => ["inspo"] as const,
    forBride: (brideId: string) => ["inspo", "bride", brideId] as const,
    my: () => ["inspo", "my"] as const,
  },
} as const;

/**
 * Helper to invalidate related queries after mutations
 *
 * Example usage:
 * ```ts
 * onSuccess: () => {
 *   invalidateQueries.afterBrideCreate(queryClient);
 * }
 * ```
 */
export const invalidateQueries = {
  // After creating/updating a bride
  afterBrideCreate: (queryClient: any) => {
    // Invalidate all bride list queries (with any filters)
    queryClient.invalidateQueries({
      queryKey: queryKeys.brides.lists(),
      refetchType: "active",
    });
    // Also invalidate the base "brides" key to catch any other bride queries
    queryClient.invalidateQueries({
      queryKey: queryKeys.brides.all(),
      refetchType: "active",
    });
    queryClient.invalidateQueries({ queryKey: queryKeys.brides.names() });
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard() });
  },

  afterBrideUpdate: (queryClient: any, brideId?: string) => {
    // Invalidate all bride list queries
    queryClient.invalidateQueries({ queryKey: queryKeys.brides.lists() });
    queryClient.invalidateQueries({ queryKey: queryKeys.brides.all() });
    if (brideId) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.brides.detail(brideId),
      });
    }
    queryClient.invalidateQueries({ queryKey: queryKeys.brides.me() });
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard() });
  },

  // After creating/updating an appointment
  afterAppointmentMutation: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.appointments.lists() });
    queryClient.invalidateQueries({ queryKey: queryKeys.appointments.my() });
    queryClient.invalidateQueries({ queryKey: queryKeys.brides.journey() });
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard() });
  },

  // After payment mutation
  afterPaymentMutation: (queryClient: any) => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.payments.all(),
      refetchType: "active",
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.brides.lists(),
      refetchType: "active",
    });
    queryClient.invalidateQueries({
      queryKey: queryKeys.admin.dashboard(),
      refetchType: "active",
    });
  },

  // After fitting photo upload/delete
  afterFittingMutation: (queryClient: any, brideId?: string) => {
    if (brideId) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.fittings.forBride(brideId),
      });
    }
    queryClient.invalidateQueries({ queryKey: queryKeys.fittings.my() });
    queryClient.invalidateQueries({ queryKey: queryKeys.brides.journey() });
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard() });
  },

  // After document upload/delete
  afterDocumentMutation: (queryClient: any, brideId?: string) => {
    if (brideId) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.documents.forBride(brideId),
      });
    }
    queryClient.invalidateQueries({ queryKey: queryKeys.documents.my() });
  },

  // After inspo upload/delete
  afterInspoMutation: (queryClient: any, brideId?: string) => {
    if (brideId) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.inspo.forBride(brideId),
      });
    }
    queryClient.invalidateQueries({ queryKey: queryKeys.inspo.my() });
  },

  // After admin/user management
  afterUserMutation: (queryClient: any) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.users() });
  },
};
