import { useEffect, useCallback, useState, useRef } from 'react';
import { useWebRTC } from './useWebRTC';
import { useMatchingSocket } from './useMatchingSocket';

export function useMatchmaking(token: string | undefined) {
  const webrtc = useWebRTC();
  const socketHook = useMatchingSocket(token);
  const { socket, setMatchStatus, setRemotePeerId, remotePeerId } = socketHook;
  const [mediaError, setMediaError] = useState<string | null>(null);

  // Initialize local media immediately on mount
  const { initializeMedia } = webrtc;
  useEffect(() => {
    initializeMedia().catch(() => {
      setMediaError('Could not access camera. Please check your camera permissions.');
    });
  }, [initializeMedia]);

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
    if (!socket) return;

    const handleMatchFound = async ({ remoteUserId, initiator }: { remoteUserId: string, initiator: boolean }) => {
      setMatchStatus('matched');
      setRemotePeerId(remoteUserId);

      try {
        // This will reuse the already initialized stream, or try again if it failed on mount
        const stream = await webrtcRef.current.initializeMedia();

        const pc = webrtcRef.current.createPeerConnection(
          (candidate) => {
            socket.emit('webrtc_ice_candidate', { candidate, to: remoteUserId });
          },
          () => { }, // remote stream is handled in useWebRTC and attached to ref
          () => {
            // Disconnected
            webrtcRef.current.cleanupConnection();
          }
        );

        webrtcRef.current.addLocalTracks(pc, stream);

        if (initiator) {
          const offer = await webrtcRef.current.createOffer(pc);
          socket.emit('webrtc_offer', { offer, to: remoteUserId });
        } else {
          if (pendingOfferRef.current) {
            const { offer, from } = pendingOfferRef.current;
            pendingOfferRef.current = null;
            try {
              const answer = await webrtcRef.current.handleReceiveOffer(pc, offer);
              await drainPendingCandidates(pc);
              socket.emit('webrtc_answer', { answer, to: from });
            } catch (err) {
              console.error('Error processing queued offer:', err);
            }
          }
        }
      } catch (error) {
        console.error('Failed to setup match:', error);
        setMatchStatus('idle');
      }
    };

    const handleOffer = async ({ offer, from }: { offer: RTCSessionDescriptionInit, from: string }) => {
      if (!webrtcRef.current.peerConnectionRef.current) {
        pendingOfferRef.current = { offer, from };
        return;
      }
      const answer = await webrtcRef.current.handleReceiveOffer(webrtcRef.current.peerConnectionRef.current, offer);
      await drainPendingCandidates(webrtcRef.current.peerConnectionRef.current);
      socket.emit('webrtc_answer', { answer, to: from });
    };

    const handleAnswer = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
      if (!webrtcRef.current.peerConnectionRef.current) return;
      await webrtcRef.current.handleReceiveAnswer(webrtcRef.current.peerConnectionRef.current, answer);
      await drainPendingCandidates(webrtcRef.current.peerConnectionRef.current);
    };

    const handleIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
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
    };

    const handlePeerDisconnected = () => {
      webrtcRef.current.cleanupConnection();
      setMatchStatus('idle');
      setRemotePeerId((prev) => {
        if (prev) socketHook.setPreviousPeerId(prev);
        return null;
      });
    };

    socket.on('match_found', handleMatchFound);
    socket.on('webrtc_offer', handleOffer);
    socket.on('webrtc_answer', handleAnswer);
    socket.on('webrtc_ice_candidate', handleIceCandidate);
    socket.on('peer_disconnected', handlePeerDisconnected);

    return () => {
      socket.off('match_found', handleMatchFound);
      socket.off('webrtc_offer', handleOffer);
      socket.off('webrtc_answer', handleAnswer);
      socket.off('webrtc_ice_candidate', handleIceCandidate);
      socket.off('peer_disconnected', handlePeerDisconnected);
    };
  }, [socket, setMatchStatus, setRemotePeerId]); // Remove webrtc from dependencies

  const handleStart = useCallback(async () => {
    try {
      await webrtc.initializeMedia();
      setMediaError(null);
      socketHook.joinQueue();
    } catch (err) {
      setMediaError('Could not access camera. Please start your camera to continue.');
    }
  }, [socketHook, webrtc]);

  const handleStop = useCallback(() => {
    socketHook.leaveQueue();
    webrtc.stopAll();
  }, [socketHook, webrtc]);

  const handleNext = useCallback(() => {
    webrtc.cleanupConnection();
    socketHook.nextMatch();
  }, [socketHook, webrtc]);

  return {
    ...socketHook,
    ...webrtc,
    mediaError,
    joinQueue: handleStart, // Override joinQueue with handleStart
    handleStop,
    handleNext
  };
}
