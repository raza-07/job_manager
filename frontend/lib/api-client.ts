export const API_BASE_URL = 'http://localhost:3001';

export const getAuthHeader = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('auth_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const api = {
  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async login(email: string, password: string) { // Changed to email/pass
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async forgotPassword(email: string) {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    
    let data;
    try {
        data = await response.json();
    } catch (e) {
        data = { message: 'An unexpected error occurred' };
    }

    if (!response.ok) throw new Error(data.message || 'Failed to request password reset');
    return data;
  },

  async resetPassword(token: string, newPassword: string) {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to reset password');
    return data;
  },

  async getMe() {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: getAuthHeader(),
      });
      if (!response.ok) throw new Error('Failed to get user');
      return response.json();
  },

  async getAccounts() {
    const response = await fetch(`${API_BASE_URL}/accounts`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to fetch accounts');
    return response.json();
  },

  async createAccount(name: string, email: string) {
    const response = await fetch(`${API_BASE_URL}/accounts`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    if (!response.ok) throw new Error('Failed to create account');
    return response.json();
  },

  async deleteAccount(accountId: number) {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to delete account');
    return true;
  },

  async getJobs(accountId: number) { // Ensure ID is number
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}/jobs`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to fetch jobs');
    return response.json();
  },

  async createJob(accountId: number, job: any) {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}/jobs`, {
      method: 'POST',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    });
    if (!response.ok) throw new Error('Failed to create job');
    return response.json();
  },

  async updateJob(accountId: number, jobId: number, job: any) {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}/jobs/${jobId}`, {
      method: 'PATCH',
      headers: { ...getAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    });
    if (!response.ok) throw new Error('Failed to update job');
    return response.json();
  },

  async deleteJob(accountId: number, jobId: number) {
    const response = await fetch(`${API_BASE_URL}/accounts/${accountId}/jobs/${jobId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!response.ok) throw new Error('Failed to delete job');
    return true;
  }
};
