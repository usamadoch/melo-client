import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

import { SOCKET_URL } from '../constants/config';

export interface UseDirectCallSocketProps {
  token?: string | null;
  remoteUserId: string | null;
  initiator: boolean;
  conversationId: string;
  webrtc: {
    initializeMedia: () => Promise<MediaStream>;
    createPeerConnection: (onIceCandidate: (candidate: RTCIceCandidate) => void, onTrack: (stream: MediaStream) => void, onDisconnect: () => void) => RTCPeerConnection;
    addLocalTracks: (pc: RTCPeerConnection, stream: MediaStream) => void;
    createOffer: (pc: RTCPeerConnection) => Promise<RTCSessionDescriptionInit>;
    handleReceiveOffer: (pc: RTCPeerConnection, offer: RTCSessionDescriptionInit) => Promise<RTCSessionDescriptionInit>;
    handleReceiveAnswer: (pc: RTCPeerConnection, answer: RTCSessionDescriptionInit) => Promise<void>;
    handleReceiveIceCandidate: (pc: RTCPeerConnection, candidate: RTCIceCandidateInit) => Promise<void>;
    cleanupConnection: () => void;
    stopAll: () => void;
    peerConnectionRef: React.MutableRefObject<RTCPeerConnection | null>;
  };
}

export function useDirectCallSocket({
  token,
  remoteUserId,
  initiator,
  conversationId,
  webrtc
}: UseDirectCallSocketProps) {
  const router = useRouter();
  const socketRef = useRef<Socket | null>(null);
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([]);
  const pendingOfferRef = useRef<{offer: RTCSessionDescriptionInit, from: string} | null>(null);

  const drainPendingCandidates = async (pc: RTCPeerConnection) => {
    const pending = pendingCandidatesRef.current;
    pendingCandidatesRef.current = [];
    for (const candidate of pending) {
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.warn('Failed to add queued ICE candidate', e);
      }
    }
  };

  // Use a ref to keep track of the latest webrtc object without triggering effect loops
  const webrtcRef = useRef(webrtc);
  useEffect(() => {
    webrtcRef.current = webrtc;
  }, [webrtc]);

  useEffect(() => {
    if (!token || !remoteUserId) return;

    const socket = io(SOCKET_URL, { auth: { token } });
    socketRef.current = socket;

    socket.on('connect', async () => {
      console.log(`[WebRTC] Socket connected. Initiator: ${initiator}`);
      try {
        console.log(`[WebRTC] Joined signaling room: ${conversationId}`);
        socket.emit('join_direct_room', { roomId: conversationId });
        
        const stream = await webrtcRef.current.initializeMedia();
        console.log('[WebRTC] Local media obtained');
        
        const pc = webrtcRef.current.createPeerConnection(
          (candidate: RTCIceCandidate) => {
            console.log('[WebRTC] ICE candidate sent');
            socket.emit('webrtc_ice_candidate', { candidate, to: remoteUserId });
          },
          () => {},
          () => webrtcRef.current.cleanupConnection()
        );
        console.log('[WebRTC] RTCPeerConnection created');

        webrtcRef.current.addLocalTracks(pc, stream);
        console.log('[WebRTC] Local tracks added');

        if (initiator) {
          const offer = await webrtcRef.current.createOffer(pc);
          console.log('[WebRTC] Offer sent');
          socket.emit('webrtc_offer', { offer, to: remoteUserId });
        } else {
          if (pendingOfferRef.current) {
            console.log('[WebRTC] Processing queued offer...');
            const { offer, from } = pendingOfferRef.current;
            pendingOfferRef.current = null;
            try {
              const answer = await webrtcRef.current.handleReceiveOffer(pc, offer);
              await drainPendingCandidates(pc);
              console.log('[WebRTC] Sending answer back to:', from);
              socket.emit('webrtc_answer', { answer, to: from });
            } catch (err) {
              console.error('[WebRTC] Error processing queued offer:', err);
            }
          }
        }
      } catch (err) {
        console.error('Failed to setup WebRTC', err);
      }
    });

    socket.on('webrtc_offer', async ({ offer, from }) => {
      console.log('[WebRTC] Offer received from:', from);
      console.log('[WebRTC] peerConnectionRef.current exists?', !!webrtcRef.current.peerConnectionRef.current);
      if (!webrtcRef.current.peerConnectionRef.current) {
        console.warn('[WebRTC] EARLY RETURN: RTCPeerConnection is null. Queuing the offer.');
        pendingOfferRef.current = { offer, from };
        return;
      }
      try {
        console.log('[WebRTC] Calling handleReceiveOffer...');
        const answer = await webrtcRef.current.handleReceiveOffer(webrtcRef.current.peerConnectionRef.current, offer);
        console.log('[WebRTC] handleReceiveOffer completed successfully');
        console.log('[WebRTC] Draining pending candidates...');
        await drainPendingCandidates(webrtcRef.current.peerConnectionRef.current);
        console.log('[WebRTC] Sending answer back to:', from);
        socket.emit('webrtc_answer', { answer, to: from });
        console.log('[WebRTC] Answer sent over socket');
      } catch (err) {
        console.error('[WebRTC] Exception in webrtc_offer handler:', err);
      }
    });

    socket.on('webrtc_answer', async ({ answer }) => {
      console.log('[WebRTC] Answer received');
      if (!webrtcRef.current.peerConnectionRef.current) return;
      await webrtcRef.current.handleReceiveAnswer(webrtcRef.current.peerConnectionRef.current, answer);
      await drainPendingCandidates(webrtcRef.current.peerConnectionRef.current);
    });

    socket.on('webrtc_ice_candidate', async ({ candidate }) => {
      console.log('[WebRTC] ICE candidate received');
      const pc = webrtcRef.current.peerConnectionRef.current;
      if (!pc || !pc.remoteDescription) {
        pendingCandidatesRef.current.push(candidate);
        return;
      }
      try {
        await webrtcRef.current.handleReceiveIceCandidate(pc, candidate);
      } catch (e) {
        console.warn('Failed to add ICE candidate', e);
      }
    });

    socket.on('call_ended', () => {
      webrtcRef.current.cleanupConnection();
      router.push('/explore');
    });

    socket.on('peer_disconnected', () => {
      webrtcRef.current.cleanupConnection();
      router.push('/explore');
    });

    return () => {
      socket.disconnect();
      webrtcRef.current.stopAll();
    };
  }, [token, remoteUserId, initiator, conversationId, router]); // Remove webrtc from dependencies

  const endCall = () => {
    const socket = socketRef.current;
    if (socket) {
      socket.emit('end_call', { roomId: conversationId });
      setTimeout(() => {
        socket.disconnect();
      }, 300);
    }
    webrtc.stopAll();
    router.push('/explore');
  };

  return { endCall };
}
