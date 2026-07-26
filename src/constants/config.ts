export const getBaseUrl = (): string => {
  // Use explicitly defined backend URL if provided
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    return process.env.NEXT_PUBLIC_BACKEND_URL;
  }

  // In the browser, dynamically resolve to the same hostname on port 5000
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.hostname}:5000`;
  }

  // Fallback for SSR
  return 'http://localhost:5000';
};

export const API_URL = process.env.NEXT_PUBLIC_API_URL || `${getBaseUrl()}/api`;
export const SOCKET_URL = getBaseUrl();
