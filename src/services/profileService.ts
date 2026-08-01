import { api } from './api';
import type { Profile } from '../store/authStore';

export interface CreateProfilePayload {
  displayName: string;
  categories: string[];
  subcategories: string[];
  freeTextInterest: string;

  showOnExplore: boolean;
  allowRandomMatching: boolean;
}

export interface SubcategoryDef {
  name: string;
}

export interface CategoryDef {
  name: string;
  subcategories: SubcategoryDef[];
}

export interface CategoriesResponse {
  categories: CategoryDef[];
}

export interface ExploreDataResponse {
  users: Array<{
    id: string;
    name: string;
    avatar: string;

    categories: string[];
    subcategories: string[];
    freeTextInterest?: string;
    exploreThumbnail?: string;
  }>;
  categories: string[];
}

export class ProfileService {
  static async getCategories(): Promise<CategoryDef[]> {
    const response = await api.get<CategoriesResponse>('/interests');
    return response.data.categories;
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

  static async getPublicProfile(userId: string): Promise<{name: string, categories: string[], subcategories: string[]}> {
    const response = await api.get<{name: string, categories: string[], subcategories: string[]}>(`/profile/${userId}/public`);
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
