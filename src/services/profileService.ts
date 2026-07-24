import { api } from './api';
import type { Profile } from '../store/authStore';

export interface CreateProfilePayload {
  displayName: string;
  interests: string[];
  bio: string;
  conversationTitle: string;
  showOnExplore: boolean;
  allowRandomMatching: boolean;
}

export interface InterestsResponse {
  interests: string[];
}

export class ProfileService {
  static async getInterests(): Promise<string[]> {
    const response = await api.get<InterestsResponse>('/interests');
    return response.data.interests;
  }

  static async createProfile(profileData: CreateProfilePayload): Promise<Profile> {
    const response = await api.post<Profile>('/profile', profileData);
    return response.data;
  }

  static async getMyProfile(): Promise<Profile> {
    const response = await api.get<Profile>('/profile/me');
    return response.data;
  }
}
