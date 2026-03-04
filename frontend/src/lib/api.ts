const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function authFetch(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('salon_token');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'API Request Failed');
    }
    // Avoid parsing JSON on 204 No Content
    if (res.status === 204) return null;
    return res.json();
}

export const api = {
    // === AUTH ===
    auth: {
        login: async (data: any) => authFetch(`${API_URL}/auth/login`, { method: 'POST', body: JSON.stringify(data) }),
        register: async (data: any) => authFetch(`${API_URL}/auth/register`, { method: 'POST', body: JSON.stringify(data) }),
    },

    // === PUBLIC (Booking Online) ===
    public: {
        getSalon: async (slug: string) => authFetch(`${API_URL}/public/${slug}`),
        checkAvailability: async (slug: string, date: string, professionalId: string) => authFetch(`${API_URL}/public/${slug}/availability?date=${date}&professionalId=${professionalId}`),
        bookAppointment: async (slug: string, data: any) => authFetch(`${API_URL}/public/${slug}/bookings`, { method: 'POST', body: JSON.stringify(data) })
    },

    // === DASHBOARD & REPORTS (Protected) ===
    getDashboardMetrics: async (date?: string) => authFetch(date ? `${API_URL}/dashboard/metrics?date=${date}` : `${API_URL}/dashboard/metrics`),
    getTopProfessionals: async () => authFetch(`${API_URL}/professionals/top`),

    // === AGENDA (Protected) ===
    getAgenda: async (date?: string) => authFetch(date ? `${API_URL}/agenda?date=${date}` : `${API_URL}/agenda`),
    getWaitlist: async () => authFetch(`${API_URL}/waitlist`),
    // Now called createAdminBooking to bypass the customer validations Date checks.
    createAdminBooking: async (data: any) => authFetch(`${API_URL}/bookings/admin`, { method: 'POST', body: JSON.stringify(data) }),
    updateBookingStatus: async (id: string, status: string) => authFetch(`${API_URL}/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),

    // === CLIENTS (Protected) ===
    getClients: async () => authFetch(`${API_URL}/clients`),
    deleteClient: async (id: string) => authFetch(`${API_URL}/clients/${id}`, { method: 'DELETE' }),

    // === SERVICES (Protected) ===
    getServices: async () => authFetch(`${API_URL}/services`),
    createService: async (data: any) => authFetch(`${API_URL}/services`, { method: 'POST', body: JSON.stringify(data) }),
    deleteService: async (id: string) => authFetch(`${API_URL}/services/${id}`, { method: 'DELETE' }),

    // === PROFESSIONALS (Protected) ===
    getProfessionals: async () => authFetch(`${API_URL}/professionals`),
    createProfessional: async (data: any) => authFetch(`${API_URL}/professionals`, { method: 'POST', body: JSON.stringify(data) }),
    deleteProfessional: async (id: string) => authFetch(`${API_URL}/professionals/${id}`, { method: 'DELETE' })
};
