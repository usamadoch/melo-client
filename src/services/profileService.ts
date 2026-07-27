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

export interface ExploreDataResponse {
  users: Array<{
    id: string;
    name: string;
    avatar: string;
    bio?: string;
    conversationTitle?: string;
    interests: string[];
    exploreThumbnail?: string;
  }>;
  categories: string[];
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

  static async getExploreProfiles(): Promise<ExploreDataResponse> {
    const response = await api.get<ExploreDataResponse>('/profile/explore');
    return response.data;
  }

  static async updateProfile(profileData: Partial<Profile>): Promise<Profile> {
    const response = await api.patch<Profile>('/profile', profileData);
    return response.data;
  }

  static async getPublicProfile(userId: string): Promise<{name: string, bio: string, interests: string[]}> {
    const response = await api.get<{name: string, bio: string, interests: string[]}>(`/profile/${userId}/public`);
    return response.data;
  }

  static async getUploadUrl(fileType: string): Promise<{ uploadUrl: string; publicUrl: string }> {
    const response = await api.get<{ uploadUrl: string; publicUrl: string }>(`/profile/upload-url?fileType=${encodeURIComponent(fileType)}`);
    return response.data;
  }

  static async uploadImageToS3(uploadUrl: string, blob: Blob): Promise<void> {
    await fetch(uploadUrl, {
      method: 'PUT',
      body: blob,
      headers: { 'Content-Type': blob.type || 'image/jpeg' }
    });
  }
}
