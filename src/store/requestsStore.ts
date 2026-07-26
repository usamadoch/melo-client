import { create } from 'zustand';
import type { IncomingRequest } from '../types/requests';

interface RequestsState {
  incomingRequests: IncomingRequest[];
  outgoingRequests: string[]; // Store target user IDs that we've sent requests to
  addIncomingRequest: (request: IncomingRequest) => void;
  removeIncomingRequest: (userId: string) => void;
  addOutgoingRequest: (targetUserId: string) => void;
  removeOutgoingRequest: (targetUserId: string) => void;
  clearRequests: () => void;
}

export const useRequestsStore = create<RequestsState>((set) => ({
  incomingRequests: [],
  outgoingRequests: [],
  addIncomingRequest: (request) =>
    set((state) => {
      // Don't add duplicate requests from the same user
      if (state.incomingRequests.some((r) => r.id === request.id)) {
        return state;
      }
      return { incomingRequests: [...state.incomingRequests, request] };
    }),
  removeIncomingRequest: (userId) =>
    set((state) => ({
      incomingRequests: state.incomingRequests.filter((r) => r.id !== userId),
    })),
  addOutgoingRequest: (targetUserId) =>
    set((state) => {
      if (state.outgoingRequests.includes(targetUserId)) {
        return state;
      }
      return { outgoingRequests: [...state.outgoingRequests, targetUserId] };
    }),
  removeOutgoingRequest: (targetUserId) =>
    set((state) => ({
      outgoingRequests: state.outgoingRequests.filter((id) => id !== targetUserId),
    })),
  clearRequests: () => set({ incomingRequests: [], outgoingRequests: [] }),
}));
