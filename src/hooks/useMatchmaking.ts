import { useEffect, useCallback, useState } from 'react';
import { useWebRTC } from './useWebRTC';
import { useMatchingSocket } from './useMatchingSocket';

export function useMatchmaking(token: string | undefined) {
  const webrtc = useWebRTC();
  const socketHook = useMatchingSocket(token);
  const { socket, setMatchStatus, setRemotePeerId, remotePeerId } = socketHook;
  const [mediaError, setMediaError] = useState<string | null>(null);



  useEffect(() => {
    if (!socket) return;

    const handleMatchFound = async ({ remoteUserId, initiator }: { remoteUserId: string, initiator: boolean }) => {
      setMatchStatus('matched');
      setRemotePeerId(remoteUserId);

      try {
        // This will reuse the already initialized stream, or try again if it failed on mount
        const stream = await webrtc.initializeMedia();

        const pc = webrtc.createPeerConnection(
          (candidate) => {
            socket.emit('webrtc_ice_candidate', { candidate, to: remoteUserId });
          },
          () => { }, // remote stream is handled in useWebRTC and attached to ref
          () => {
            // Disconnected
            webrtc.cleanupConnection();
          }
        );

        webrtc.addLocalTracks(pc, stream);

        if (initiator) {
          const offer = await webrtc.createOffer(pc);
          socket.emit('webrtc_offer', { offer, to: remoteUserId });
        }
      } catch (error) {
        console.error('Failed to setup match:', error);
        setMatchStatus('idle');
      }
    };

    const handleOffer = async ({ offer, from }: { offer: RTCSessionDescriptionInit, from: string }) => {
      if (!webrtc.peerConnectionRef.current) return;
      const answer = await webrtc.handleReceiveOffer(webrtc.peerConnectionRef.current, offer);
      socket.emit('webrtc_answer', { answer, to: from });
    };

    const handleAnswer = async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
      if (!webrtc.peerConnectionRef.current) return;
      await webrtc.handleReceiveAnswer(webrtc.peerConnectionRef.current, answer);
    };

    const handleIceCandidate = async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
      if (!webrtc.peerConnectionRef.current) return;
      await webrtc.handleReceiveIceCandidate(webrtc.peerConnectionRef.current, candidate);
    };

    const handlePeerDisconnected = () => {
      webrtc.cleanupConnection();
      setMatchStatus('idle');
      setRemotePeerId(null);
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
  }, [socket, webrtc, setMatchStatus, setRemotePeerId]);

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
