export type Availability = 'available' | 'busy' | 'offline';

export interface IncomingRequest {
  id: string;
  name: string;
  avatarUrl: string;
  info: string;
  tags: string[];
  availability: Availability;
}
