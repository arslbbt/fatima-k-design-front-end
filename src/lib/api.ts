declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    [key: string]: string | undefined;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const BASE = import.meta.env.VITE_API_BASE_URL as string;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {}
    throw new ApiError(res.status, message);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    request<{ message: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    request<{ message: string }>("/auth/logout", { method: "POST" }),

  me: () => request<User>("/auth/me"),

  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ message: string }>("/auth/change-password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

// ── Admin ─────────────────────────────────────────────────────────────────────

export const adminApi = {
  me: () => request<User>("/admin/me"),

  dashboard: () =>
    request<{
      totalBrides: number;
      newBridesThisMonth: number;
      weekApptsCount: number;
      weekAppts: Array<{
        id: string;
        title: AppointmentTitle;
        brideName: string;
        startTime: string;
      }>;
      nextAppt: {
        id: string;
        title: AppointmentTitle;
        brideName: string;
        startTime: string;
      } | null;
      paidThisMonth: number;
      outstanding: number;
      outstandingBridesCount: number;
      brides: Array<{
        id: string;
        name: string;
        email: string;
        createdAt: string;
        brideProfile: {
          stage: BrideStage;
          weddingDate: string | null;
          phone: string | null;
        } | null;
        balance: number;
        hasDue: boolean;
      }>;
      recentActivity: Array<{
        type: "appointment" | "payment" | "photo";
        label: string;
        brideName: string;
        timestamp: string;
      }>;
    }>("/admin/dashboard"),

  updateMe: (data: { name?: string; email?: string }) =>
    request<User>("/admin/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  registerBride: (data: RegisterBridePayload) =>
    request<BrideWithProfile>("/admin/register-bride", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  resetUserPassword: (userId: string, newPassword: string) =>
    request<{ message: string }>(`/admin/users/${userId}/reset-password`, {
      method: "PATCH",
      body: JSON.stringify({ newPassword }),
    }),

  // Admin management
  listAdmins: () => request<User[]>("/admin/list"),

  createAdmin: (data: { name: string; email: string; password: string }) =>
    request<User>("/admin/create", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateAdmin: (
    id: string,
    data: { name?: string; email?: string; password?: string },
  ) =>
    request<User>(`/admin/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  removeAdmin: (id: string) =>
    request<{ message: string }>(`/admin/${id}`, { method: "DELETE" }),

  // All users with pagination + filters
  listUsers: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: "ADMIN" | "BRIDE";
  }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.search) qs.set("search", params.search);
    if (params?.role) qs.set("role", params.role);
    const q = qs.toString();
    return request<PaginatedResponse<UserWithProfile>>(
      `/admin/users${q ? `?${q}` : ""}`,
    );
  },
};

// ── Brides ────────────────────────────────────────────────────────────────────

export const bridesApi = {
  me: () => request<BrideWithProfile>("/brides/me"),

  updateMe: (data: UpdateBrideProfilePayload) =>
    request<BrideWithProfile>("/brides/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  // Lightweight — only id + name, no pagination. Use for dropdowns.
  names: () => request<{ id: string; name: string }[]>("/brides/names"),

  journey: () =>
    request<{
      currentStage: string;
      currentStageIndex: number;
      progressPct: number;
      stageProgress: Array<{
        key: string;
        label: string;
        status: "done" | "current" | "upcoming";
      }>;
      events: Array<{
        type: "completed" | "in-progress" | "coming-soon";
        appointmentId: string;
        title: string;
        description: string | null;
        location: string | null;
        startTime: string;
        endTime: string;
        whatToBring: string | null;
        fittingId: string | null;
        fittingNumber: number | null;
        notes: string | null;
        photos: Array<{ id: string; imageUrl: string; caption: string | null }>;
      }>;
    }>("/brides/journey"),

  list: (params?: ListBridesParams) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set("search", params.search);
    if (params?.stage) qs.set("stage", params.stage);
    if (params?.stylePreferences)
      qs.set("stylePreferences", params.stylePreferences);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    const query = qs.toString();
    return request<PaginatedResponse<BrideWithProfile>>(
      `/brides${query ? `?${query}` : ""}`,
    );
  },

  get: (id: string) => request<BrideWithProfile>(`/brides/${id}`),

  updateStage: (id: string, stage: BrideStage) =>
    request<BrideWithProfile>(`/brides/${id}/stage`, {
      method: "PATCH",
      body: JSON.stringify({ stage }),
    }),

  remove: (id: string) => request<void>(`/brides/${id}`, { method: "DELETE" }),
};

// ── Appointments ──────────────────────────────────────────────────────────────

export const appointmentsApi = {
  list: (params?: { from?: string; to?: string }) => {
    const qs = new URLSearchParams();
    if (params?.from) qs.set("from", params.from);
    if (params?.to) qs.set("to", params.to);
    const query = qs.toString();
    return request<AppointmentWithBride[]>(
      `/appointments${query ? `?${query}` : ""}`,
    );
  },

  myAppointments: () => request<Appointment[]>("/appointments/my"),

  listForBride: (brideId: string) =>
    request<Appointment[]>(`/appointments/bride/${brideId}`),

  get: (id: string) => request<Appointment>(`/appointments/${id}`),

  create: (data: CreateAppointmentPayload) =>
    request<Appointment>("/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: UpdateAppointmentPayload) =>
    request<Appointment>(`/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  remove: (id: string) =>
    request<void>(`/appointments/${id}`, { method: "DELETE" }),
};

// ── Payments ──────────────────────────────────────────────────────────────────

export type PaymentType =
  | "BOOKING_DEPOSIT"
  | "FABRICATION"
  | "CONSTRUCTION"
  | "FINAL_BALANCE";
export type PaymentStatus = "PAID" | "PENDING" | "OVERDUE";

export interface Payment {
  id: string;
  brideId: string;
  amount: number;
  paymentType: PaymentType;
  status: PaymentStatus;
  dueDate: string | null;
  paidDate: string | null;
  reminderSentAt: string | null;
  notes: string | null;
  createdAt: string;
  bride?: {
    id: string;
    name: string;
    email: string;
    brideProfile?: {
      stylePreferences: string | null;
    } | null;
  };
}

export const paymentsApi = {
  create: (data: {
    brideId: string;
    amount: number;
    paymentType: PaymentType;
    dueDate: string;
    notes?: string;
  }) =>
    request<Payment>("/payments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  listAdmin: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: PaymentStatus;
  }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.search) qs.set("search", params.search);
    if (params?.status) qs.set("status", params.status);
    const query = qs.toString();
    return request<PaginatedResponse<Payment>>(
      `/payments/admin${query ? `?${query}` : ""}`,
    );
  },

  listBridesTracking: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.search) qs.set("search", params.search);
    if (params?.status) qs.set("status", params.status);
    const query = qs.toString();
    return request<PaginatedResponse<any>>(
      `/payments/brides-tracking${query ? `?${query}` : ""}`,
    );
  },

  getAllBridesTracking: () => request<any[]>("/payments/brides-tracking/all"),

  getRevenueOverview: () =>
    request<{
      revenueCollected: number;
      outstanding: number;
      paymentsDue: number;
      overdueCount: number;
    }>("/payments/revenue-overview"),

  getMonthlyRevenue: (year?: number) =>
    request<{ name: string; amount: number }[]>(
      `/payments/monthly-revenue${year ? `?year=${year}` : ""}`,
    ),

  markAsPaid: (id: string) =>
    request<Payment>(`/payments/${id}/mark-paid`, { method: "PATCH" }),

  update: (
    id: string,
    data: {
      amount?: number;
      dueDate?: string;
      notes?: string;
      markAsPaid?: boolean;
    },
  ) =>
    request<Payment>(`/payments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  sendReminder: (id: string) =>
    request<{ reminderSentAt: string }>(`/payments/${id}/remind`, {
      method: "POST",
    }),

  remove: (id: string) =>
    request<{ message: string }>(`/payments/${id}`, { method: "DELETE" }),

  listMine: () => request<Payment[]>("/payments/me"),
};

// ── Types ─────────────────────────────────────────────────────────────────────

export type Role = "ADMIN" | "BRIDE";
export type AppointmentStatus =
  | "SCHEDULED"
  | "RESCHEDULED"
  | "COMPLETED"
  | "CANCELLED";
export type AppointmentTitle =
  | "CONSULTATION"
  | "FIRST_FITTING"
  | "SECOND_FITTING"
  | "THIRD_FITTING"
  | "FINAL_FITTING"
  | "ALTERATION"
  | "COLLECTION_READY"
  | "CUSTOM";

export const APPOINTMENT_TITLE_LABELS: Record<AppointmentTitle, string> = {
  CONSULTATION: "Consultation",
  FIRST_FITTING: "1st Fitting",
  SECOND_FITTING: "2nd Fitting",
  THIRD_FITTING: "3rd Fitting",
  FINAL_FITTING: "Final Fitting",
  ALTERATION: "Alteration",
  COLLECTION_READY: "Collection Ready",
  CUSTOM: "Custom",
};
export type BrideStage =
  | "CONSULTATION"
  | "FIRST_FITTING"
  | "SECOND_FITTING"
  | "THIRD_FITTING"
  | "FINAL_FITTING"
  | "ALTERATION"
  | "COLLECTION_READY";

export const BRIDE_STAGE_LABELS: Record<BrideStage, string> = {
  CONSULTATION: "Consultation",
  FIRST_FITTING: "1st Fitting",
  SECOND_FITTING: "2nd Fitting",
  THIRD_FITTING: "3rd Fitting",
  FINAL_FITTING: "Final Fitting",
  ALTERATION: "Alteration",
  COLLECTION_READY: "Collection Ready",
};

export const BRIDE_STAGE_ORDER: BrideStage[] = [
  "CONSULTATION",
  "FIRST_FITTING",
  "SECOND_FITTING",
  "THIRD_FITTING",
  "FINAL_FITTING",
  "ALTERATION",
  "COLLECTION_READY",
];

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface BrideProfile {
  id: string;
  userId: string;
  weddingDate: string | null;
  phone: string | null;
  address: string | null;
  partnerName: string | null;
  venueName: string | null;
  guestCount: string | null;
  dietaryNotes: string | null;
  stylePreferences: string | null;
  notes: string | null;
  stage: BrideStage;
  createdAt: string;
}

export interface BrideWithProfile extends User {
  brideProfile: BrideProfile | null;
  outstanding?: number;
}

export interface Appointment {
  id: string;
  brideId: string;
  title: AppointmentTitle;
  description: string | null;
  location: string | null;
  startTime: string;
  endTime: string;
  whatToBring: string | null;
  status: AppointmentStatus;
  createdBy: string;
  createdAt: string;
  bride?: BrideWithProfile;
}

export interface AppointmentWithBride extends Appointment {
  bride: BrideWithProfile;
}

export interface UserWithProfile extends User {
  brideProfile?: { stage: BrideStage; weddingDate: string | null } | null;
}

export interface RegisterBridePayload {
  name: string;
  email: string;
  password: string;
  weddingDate?: string;
  phone?: string;
  partnerName?: string;
  venueName?: string;
  notes?: string;
}

export interface UpdateBrideProfilePayload {
  name?: string;
  email?: string;
  weddingDate?: string;
  phone?: string;
  address?: string;
  partnerName?: string;
  venueName?: string;
  guestCount?: string;
  dietaryNotes?: string;
  stylePreferences?: string;
  notes?: string | null;
}

export interface ListBridesParams {
  search?: string;
  stage?: BrideStage;
  stylePreferences?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateAppointmentPayload {
  brideId: string;
  title: AppointmentTitle;
  customTitle?: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
  whatToBring?: string;
}

export interface UpdateAppointmentPayload {
  title?: AppointmentTitle;
  description?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  whatToBring?: string;
  status?: AppointmentStatus;
}

// ── Documents ─────────────────────────────────────────────────────────────────

export interface Document {
  id: string;
  brideId: string;
  title: string;
  fileUrl: string;
  fileType: "pdf" | "docx";
  uploadedAt: string;
  uploadedBy: string;
  bride?: { id: string; name: string; email: string };
}

export const documentsApi = {
  listAll: (params?: { brideId?: string; search?: string }) => {
    const qs = new URLSearchParams();
    if (params?.brideId) qs.set("brideId", params.brideId);
    if (params?.search) qs.set("search", params.search);
    const q = qs.toString();
    return request<Document[]>(`/documents${q ? `?${q}` : ""}`);
  },

  listMine: () => request<Document[]>("/documents/my"),

  listForBride: (brideId: string) =>
    request<Document[]>(`/documents/bride/${brideId}`),

  upload: (brideId: string, file: File, title: string) => {
    const form = new FormData();
    form.append("file", file);
    form.append("title", title);
    return fetch(`${BASE}/documents/bride/${brideId}`, {
      method: "POST",
      credentials: "include",
      body: form,
    }).then(async (res) => {
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new ApiError(res.status, body.message ?? res.statusText);
      }
      return res.json() as Promise<Document>;
    });
  },

  remove: (id: string) =>
    request<{ message: string }>(`/documents/${id}`, { method: "DELETE" }),
};

// ── Fittings ──────────────────────────────────────────────────────────────────

export interface FittingPhoto {
  id: string;
  fittingId: string;
  imageUrl: string;
  caption: string | null;
  uploadedAt: string;
}

export interface Fitting {
  id: string;
  brideId: string;
  appointmentId: string | null;
  fittingNumber: number;
  notes: string | null;
  createdAt: string;
  photos: FittingPhoto[];
}

export const fittingsApi = {
  listForBride: (brideId: string) =>
    request<Fitting[]>(`/fittings/bride/${brideId}`),

  listMine: () => request<Fitting[]>(`/fittings/bride/me`),

  create: (brideId: string, appointmentId: string, notes?: string) =>
    request<Fitting>(`/fittings/bride/${brideId}`, {
      method: "POST",
      body: JSON.stringify({ appointmentId, notes }),
    }),

  uploadPhotos: (fittingId: string, files: File[]) => {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    return fetch(`${BASE}/fittings/${fittingId}/photos`, {
      method: "POST",
      credentials: "include",
      body: form,
    }).then(async (res) => {
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new ApiError(res.status, body.message ?? res.statusText);
      }
      return res.json() as Promise<FittingPhoto[]>;
    });
  },

  deletePhoto: (photoId: string) =>
    request<{ message: string }>(`/fittings/photos/${photoId}`, {
      method: "DELETE",
    }),
};

// ── Inspo ─────────────────────────────────────────────────────────────────────

export interface InspoUpload {
  id: string;
  brideId: string;
  imageUrl: string;
  caption: string | null;
  uploadedAt: string;
}

export const inspoApi = {
  listMine: () => request<InspoUpload[]>("/inspo/my"),

  listForBride: (brideId: string) =>
    request<InspoUpload[]>(`/inspo/bride/${brideId}`),

  upload: (files: File[], caption?: string) => {
    const form = new FormData();
    files.forEach((f) => form.append("files", f));
    if (caption) form.append("caption", caption);
    return fetch(`${BASE}/inspo`, {
      method: "POST",
      credentials: "include",
      body: form,
    }).then(async (res) => {
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new ApiError(res.status, body.message ?? res.statusText);
      }
      return res.json() as Promise<InspoUpload[]>;
    });
  },

  remove: (id: string) =>
    request<{ message: string }>(`/inspo/${id}`, { method: "DELETE" }),
};
