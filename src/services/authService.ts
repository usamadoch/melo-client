import { api } from './api';
import type { User } from '../store/authStore';

export interface AuthResponse {
  token: string;
  user: User;
  onboardingCompleted: boolean;
}

export class AuthService {
  static async loginWithGoogle(credential: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/google', { credential });
    return response.data;
  }

  static async logout(): Promise<void> {
    await api.post('/auth/logout');
  }
}
