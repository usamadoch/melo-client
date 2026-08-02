import React, { useState, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

interface LiveChatPanelProps {
  socket: Socket | null;
  matchId: string;
  remoteUserId: string;
}

interface Message {
  _id: string;
  text: string;
  isMine: boolean;
  status: 'DELIVERED' | 'BLOCKED' | 'PENDING';
}

export default function LiveChatPanel({ socket, matchId, remoteUserId }: LiveChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (data: any) => {
      setMessages((prev) => [
        ...prev,
        {
          _id: data._id,
          text: data.text,
          isMine: false,
          status: data.status,
        },
      ]);
    };

    const handleError = (data: { text: string; message: string }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.text === data.text && msg.status === 'PENDING'
            ? { ...msg, status: 'BLOCKED' }
            : msg
        )
      );
    };

    socket.on('chat_message', handleMessage);
    socket.on('chat_error', handleError);

    return () => {
      socket.off('chat_message', handleMessage);
      socket.off('chat_error', handleError);
    };
  }, [socket]);

  // Clear messages when match changes
  useEffect(() => {
    setMessages([]);
  }, [matchId]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !socket) return;

    const text = inputValue.trim();
    
    // Optimistic UI
    setMessages((prev) => [
      ...prev,
      {
        _id: Date.now().toString(),
        text,
        isMine: true,
        status: 'PENDING',
      },
    ]);

    socket.emit('chat_message', {
      matchId,
      toUserId: remoteUserId,
      text,
    });

    setInputValue('');
  };

  // Change status of PENDING to DELIVERED after a short delay for UX
  useEffect(() => {
    const timeoutIds = messages
      .filter((m) => m.isMine && m.status === 'PENDING')
      .map((msg) =>
        setTimeout(() => {
          setMessages((prev) =>
            prev.map((m) => (m._id === msg._id && m.status === 'PENDING' ? { ...m, status: 'DELIVERED' } : m))
          );
        }, 500) // Optimistic delay before showing it as delivered
      );
    
    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-zinc-900 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
      <div className="bg-zinc-800/80 p-3 border-b border-white/5">
        <h3 className="text-white font-semibold text-sm">Live Chat</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, idx) => (
          <div key={msg._id || idx} className={`flex flex-col ${msg.isMine ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm ${
                msg.status === 'BLOCKED'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : msg.isMine
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-800 text-zinc-100'
              }`}
            >
              {msg.text}
            </div>
            {msg.status === 'BLOCKED' && (
              <span className="text-[10px] text-rose-500 mt-1 font-semibold">Message Blocked</span>
            )}
            {msg.status === 'PENDING' && !msg.isMine && (
              <span className="text-[10px] text-zinc-500 mt-1">Sending...</span>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-zinc-800/50 border-t border-white/5">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-zinc-950/50 border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || !socket}
            className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-emerald-500 text-white rounded-xl px-4 py-2 text-sm font-bold transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
