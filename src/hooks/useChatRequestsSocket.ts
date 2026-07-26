import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { useRequestsStore } from '../store/requestsStore';
import type { IncomingRequest } from '../types/requests';

import { SOCKET_URL } from '../constants/config';

export function useChatRequestsSocket() {
  const { token, isAuthenticated } = useAuthStore();
  const socketRef = useRef<Socket | null>(null);
  const router = useRouter();
  
  const { 
    addIncomingRequest, 
    removeIncomingRequest, 
    addOutgoingRequest,
    removeOutgoingRequest
  } = useRequestsStore();

  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const socket = io(SOCKET_URL, {
      auth: { token }
    });

    socket.on('connect', () => {
      console.log('Connected to chat requests socket');
    });

    socket.on('incoming_chat_request', (payload: IncomingRequest) => {
      addIncomingRequest(payload);
    });

    socket.on('chat_request_accepted', ({ roomId, remoteUserId, initiator }) => {
      // Remove any requests associated with this acceptance
      removeIncomingRequest(remoteUserId);
      removeOutgoingRequest(remoteUserId);
      
      // Navigate to chat room immediately
      router.push(`/chat/${roomId}?remoteUserId=${remoteUserId}&initiator=${initiator}`);
    });

    socket.on('chat_request_rejected', ({ targetUserId }) => {
      removeOutgoingRequest(targetUserId);
      // Optional: show a toast notification here
    });

    socket.on('chat_request_failed', ({ targetUserId, message }) => {
      removeOutgoingRequest(targetUserId);
      // Optional: show a toast notification
      console.warn('Chat request failed:', message);
    });

    socket.on('chat_request_cancelled', ({ requesterUserId }) => {
      removeIncomingRequest(requesterUserId);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [token, isAuthenticated, router]);

  const sendChatRequest = (targetUserId: string) => {
    if (socketRef.current) {
      addOutgoingRequest(targetUserId);
      socketRef.current.emit('send_chat_request', { targetUserId });
    }
  };

  const acceptChatRequest = (requesterUserId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('accept_chat_request', { requesterUserId });
    }
  };

  const rejectChatRequest = (requesterUserId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('reject_chat_request', { requesterUserId });
      removeIncomingRequest(requesterUserId);
    }
  };

  return {
    sendChatRequest,
    acceptChatRequest,
    rejectChatRequest
  };
}
