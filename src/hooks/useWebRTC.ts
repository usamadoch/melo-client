import { useState, useRef, useCallback, useEffect, useMemo } from 'react';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
  ],
};

export function useWebRTC() {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  // Ensure video elements stay in sync with streams even if they re-render
  useEffect(() => {
    if (localVideoRef.current && localStream && localVideoRef.current.srcObject !== localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream, localVideoRef]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream && remoteVideoRef.current.srcObject !== remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, remoteVideoRef]);

  const stopMediaTracks = useCallback((stream: MediaStream | null) => {
    if (!stream) return;
    stream.getTracks().forEach(track => track.stop());
  }, []);

  const cleanupConnection = useCallback(() => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setRemoteStream(null);
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  }, []);

  const initializeMedia = useCallback(async () => {
    // Check if existing stream is still alive (tracks not ended)
    if (localStreamRef.current) {
      const allEnded = localStreamRef.current.getTracks().every(t => t.readyState === 'ended');
      if (!allEnded) return localStreamRef.current;
      // Previous stream is dead, clean it up
      localStreamRef.current = null;
      setLocalStream(null);
    }
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      return stream;
    } catch (error: any) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        localStreamRef.current = stream;
        setLocalStream(stream);
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;
        return stream;
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
  }, []);

  const createPeerConnection = useCallback((
    onIceCandidate: (candidate: RTCIceCandidate) => void,
    onTrack: (stream: MediaStream) => void,
    onDisconnect: () => void
  ) => {
    cleanupConnection();
    
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnectionRef.current = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        onIceCandidate(event.candidate);
      }
    };

    pc.ontrack = (event) => {
      console.log('[WebRTC] ontrack event fired', event.streams[0]);
      if (event.streams && event.streams[0]) {
        onTrack(event.streams[0]);
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          console.log('[WebRTC] Remote stream attached to video element');
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      }
    };

    pc.onconnectionstatechange = () => {
      console.log('[WebRTC] Connection state changes:', pc.connectionState);
    };

    pc.oniceconnectionstatechange = () => {
      console.log('[WebRTC] ICE connection state changes:', pc.iceConnectionState);
      if (
        pc.iceConnectionState === 'disconnected' ||
        pc.iceConnectionState === 'failed' ||
        pc.iceConnectionState === 'closed'
      ) {
        onDisconnect();
      }
    };

    return pc;
  }, [cleanupConnection]);

  const addLocalTracks = useCallback((pc: RTCPeerConnection, stream: MediaStream) => {
    stream.getTracks().forEach((track) => {
      pc.addTrack(track, stream);
    });
  }, []);

  const createOffer = useCallback(async (pc: RTCPeerConnection) => {
    console.log('[WebRTC] Creating offer...');
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    return offer;
  }, []);

  const handleReceiveOffer = useCallback(async (pc: RTCPeerConnection, offer: RTCSessionDescriptionInit) => {
    try {
      console.log('[WebRTC] handleReceiveOffer: Setting remote description...');
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      console.log('[WebRTC] handleReceiveOffer: Remote description set successfully');
      
      console.log('[WebRTC] handleReceiveOffer: Creating answer...');
      const answer = await pc.createAnswer();
      console.log('[WebRTC] handleReceiveOffer: Answer created successfully');
      
      console.log('[WebRTC] handleReceiveOffer: Setting local description...');
      await pc.setLocalDescription(answer);
      console.log('[WebRTC] handleReceiveOffer: Local description set successfully');
      
      return answer;
    } catch (err) {
      console.error('[WebRTC] Error in handleReceiveOffer:', err);
      throw err;
    }
  }, []);

  const handleReceiveAnswer = useCallback(async (pc: RTCPeerConnection, answer: RTCSessionDescriptionInit) => {
    console.log('[WebRTC] Setting remote description (answer)...');
    await pc.setRemoteDescription(new RTCSessionDescription(answer));
    console.log('[WebRTC] Remote description set (answer)');
  }, []);

  const handleReceiveIceCandidate = useCallback(async (pc: RTCPeerConnection, candidate: RTCIceCandidateInit) => {
    await pc.addIceCandidate(new RTCIceCandidate(candidate));
  }, []);

  const stopAll = useCallback(() => {
    cleanupConnection();
    stopMediaTracks(localStreamRef.current);
    localStreamRef.current = null;
    setLocalStream(null);
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  }, [cleanupConnection, stopMediaTracks]);

  return useMemo(() => ({
    localVideoRef,
    remoteVideoRef,
    localStream,
    remoteStream,
    peerConnectionRef,
    initializeMedia,
    createPeerConnection,
    addLocalTracks,
    createOffer,
    handleReceiveOffer,
    handleReceiveAnswer,
    handleReceiveIceCandidate,
    cleanupConnection,
    stopAll
  }), [
    localStream,
    remoteStream,
    initializeMedia,
    createPeerConnection,
    addLocalTracks,
    createOffer,
    handleReceiveOffer,
    handleReceiveAnswer,
    handleReceiveIceCandidate,
    cleanupConnection,
    stopAll
  ]);
}
