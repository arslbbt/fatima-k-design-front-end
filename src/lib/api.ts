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

// ── Brides ────────────────────────────────────────────────────────────────────

export const bridesApi = {
  me: () => request<BrideWithProfile>("/brides/me"),

  updateMe: (data: UpdateBrideProfilePayload) =>
    request<BrideWithProfile>("/brides/me", {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  list: () => request<BrideWithProfile[]>("/brides"),

  get: (id: string) => request<BrideWithProfile>(`/brides/${id}`),

  remove: (id: string) => request<void>(`/brides/${id}`, { method: "DELETE" }),
};

// ── Appointments ──────────────────────────────────────────────────────────────

export const appointmentsApi = {
  list: () => request<Appointment[]>("/appointments"),

  myAppointments: () => request<Appointment[]>("/appointments/my"),

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

// ── Types ─────────────────────────────────────────────────────────────────────

export type Role = "ADMIN" | "BRIDE";
export type AppointmentStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED";
export type AppointmentTitle = "CONSULTATION" | "FITTING" | "FINAL_PICKUP";

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
  stylePreferences: string | null;
  notes: string | null;
  createdAt: string;
}

export interface BrideWithProfile extends User {
  brideProfile: BrideProfile | null;
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

export interface UpdateBrideProfilePayload {
  name?: string;
  weddingDate?: string;
  phone?: string;
  stylePreferences?: string;
  notes?: string;
}

export interface CreateAppointmentPayload {
  brideId: string;
  title: AppointmentTitle;
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
