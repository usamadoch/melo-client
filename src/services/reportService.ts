import { API_URL } from '../constants/config';
import { useAuthStore } from '../store/authStore';

export interface CreateReportPayload {
  reportedUserId: string;
  reason: 'nudity' | 'harassment' | 'spam' | 'hate_speech' | 'fake_camera' | 'other';
  text?: string;
  matchType: 'current' | 'previous';
}

export class ReportService {
  static async submitReport(payload: CreateReportPayload) {
    const token = useAuthStore.getState().token;
    
    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(`${API_URL}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to submit report');
    }

    return await response.json();
  }
}
