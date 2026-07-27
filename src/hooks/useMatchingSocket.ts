import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

import { SOCKET_URL } from '../constants/config';

export type MatchStatus = 'idle' | 'searching' | 'matched';

export function useMatchingSocket(token: string | undefined) {
  const socketRef = useRef<Socket | null>(null);
  const [matchStatus, setMatchStatus] = useState<MatchStatus>('idle');
  const [remotePeerId, setRemotePeerId] = useState<string | null>(null);
  const [previousPeerId, setPreviousPeerId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(SOCKET_URL, {
      auth: { token }
    });

    socket.on('connect', () => {});
    
    socket.on('disconnect', () => {
      setMatchStatus('idle');
      setRemotePeerId((prev) => {
        if (prev) setPreviousPeerId(prev);
        return null;
      });
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
    setRemotePeerId((prev) => {
      if (prev) setPreviousPeerId(prev);
      return null;
    });
    socketRef.current.emit('leave_queue');
  }, []);

  const nextMatch = useCallback(() => {
    if (!socketRef.current) return;
    setMatchStatus('searching');
    setRemotePeerId((prev) => {
      if (prev) setPreviousPeerId(prev);
      return null;
    });
    socketRef.current.emit('next_match');
  }, []);

  return {
    socket: socketRef.current,
    matchStatus,
    setMatchStatus,
    remotePeerId,
    setRemotePeerId,
    previousPeerId,
    setPreviousPeerId,
    joinQueue,
    leaveQueue,
    nextMatch
  };
}
