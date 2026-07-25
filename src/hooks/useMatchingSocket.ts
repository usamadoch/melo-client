import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export type MatchStatus = 'idle' | 'searching' | 'matched';

export function useMatchingSocket(token: string | undefined) {
  const socketRef = useRef<Socket | null>(null);
  const [matchStatus, setMatchStatus] = useState<MatchStatus>('idle');
  const [remotePeerId, setRemotePeerId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token }
    });

    socket.on('connect', () => {});
    
    socket.on('disconnect', () => {
      setMatchStatus('idle');
      setRemotePeerId(null);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const joinQueue = useCallback(() => {
    if (!socketRef.current) return;
    setMatchStatus('searching');
    socketRef.current.emit('join_queue');
  }, []);

  const leaveQueue = useCallback(() => {
    if (!socketRef.current) return;
    setMatchStatus('idle');
    setRemotePeerId(null);
    socketRef.current.emit('leave_queue');
  }, []);

  const nextMatch = useCallback(() => {
    if (!socketRef.current) return;
    setMatchStatus('searching');
    setRemotePeerId(null);
    socketRef.current.emit('next_match');
  }, []);

  return {
    socket: socketRef.current,
    matchStatus,
    setMatchStatus,
    remotePeerId,
    setRemotePeerId,
    joinQueue,
    leaveQueue,
    nextMatch
  };
}
