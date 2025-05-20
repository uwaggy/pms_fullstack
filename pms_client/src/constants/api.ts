export const API_BASE_URL = "http://localhost:7070/api";

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    verifyAccountInitiate: "/auth/verify-account/initiate",
    verifyAccountConfirm: (code: string) => `/auth/verify-account/confirm/${code}`,
    resetPasswordInitiate: "/auth/reset-password/initiate",
    resetPasswordConfirm: "/auth/reset-password/confirm",
    me: "/auth/me",
  },
  users: {
    all: "/users",
    search: "/users/search",
    update: "/users/update",
    updatePassword: "/users/update-password",
    updateAvatar: "/users/update-avatar",
    removeAvatar: "/users/remove-avatar",
  },
  vehicles: {
    all: "/vehicles",
    create: "/vehicles",
    getById: (id: string) => `/vehicles/${id}`,
    update: (id: string) => `/vehicles/${id}`,
    delete: (id: string) => `/vehicles/${id}`,
    recordExit: (id: string) => `/vehicles/${id}/exit`,
    generateTicket: (id: string) => `/vehicles/${id}/ticket`,
    generateBill: (id: string) => `/vehicles/${id}/bill`,
    history: (id: string) => `/vehicles/${id}/history`,
  },
  parkingSlots: {
    all: "/parking-slots",
    create: "/parking-slots",
    getById: (id: string) => `/parking-slots/${id}`,
    update: (id: string) => `/parking-slots/${id}`,
    delete: (id: string) => `/parking-slots/${id}`,
    available: "/parking-slots/available",
    active: "/parking-slots/active",
  },
  parkingRequests: {
    all: "/parking-requests",
    create: "/parking-requests",
    entry: "/parking-requests/entry",
    exit: "/parking-requests/exit",
    getById: (id: string) => `/parking-requests/${id}`,
    update: (id: string) => `/parking-requests/${id}`,
    delete: (id: string) => `/parking-requests/${id}`,
    approve: (id: string) => `/parking-requests/${id}/approve`,
    reject: (id: string) => `/parking-requests/${id}/reject`,
  },
};

export default API_ENDPOINTS;
