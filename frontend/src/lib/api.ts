const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { error: data.message || 'Something went wrong' };
    }

    return { data };
  } catch (error) {
    return { error: 'Network error' };
  }
}

export interface User {
  _id: string;
  username: string;
  email: string;
  token?: string;
}

export interface Message {
  _id: string;
  sender: string;
  senderName: string;
  content: string;
  room: string;
  createdAt: string;
}

export const authApi = {
  register: (username: string, email: string, password: string) =>
    fetchApi<User>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),

  login: (email: string, password: string) =>
    fetchApi<User>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getMe: () => fetchApi<User>('/api/auth/me'),
};

export const messageApi = {
  getMessages: (room: string = 'general') =>
    fetchApi<Message[]>(`/api/messages/${room}`),
};
