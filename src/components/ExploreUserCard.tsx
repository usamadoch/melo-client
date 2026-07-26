import { Send, Check } from 'lucide-react';
import { useChatRequestsSocket } from '../hooks/useChatRequestsSocket';
import { useRequestsStore } from '../store/requestsStore';
// import { useChatRequestsSocket } from '../../hooks/useChatRequestsSocket';
// import { useRequestsStore } from '../../store/requestsStore';

interface ExploreUserCardProps {
  id: string;
  name: string;
  bio: string;
  conversationTitle?: string;
  category: string;
  gradientClass: string;
}

export default function ExploreUserCard({ id, name, bio, conversationTitle, category, gradientClass }: ExploreUserCardProps) {
  const { sendChatRequest } = useChatRequestsSocket();
  const outgoingRequests = useRequestsStore(state => state.outgoingRequests);
  const isSent = outgoingRequests.includes(id);

  const handleRequestChat = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isSent) {
      sendChatRequest(id);
    }
  };

  return (
    <div className={`relative w-full aspect-9/16 group cursor-pointer overflow-hidden ${gradientClass} ${isSent ? 'ring-2 ring-emerald-500 ring-inset' : ''}`}>

      {/* Background Gradient overlay for text readability at bottom */}
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80" />

      {/* Content at the bottom */}
      <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-2">
        <h3 className="text-white font-bold text-lg leading-tight line-clamp-3 shadow-sm">{conversationTitle || bio}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-white/90 text-sm font-medium">{name}</span>
          <span className="px-2 py-0.5 bg-black/40 text-white/80 text-xs font-semibold rounded-md backdrop-blur-md">
            {category}
          </span>
        </div>
      </div>

      {/* Hover Overlay with Request Chat Button */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
        <button
          onClick={handleRequestChat}
          disabled={isSent}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold shadow-xl transition-transform transform scale-95 group-hover:scale-100 ${isSent ? 'bg-zinc-800 text-emerald-400' : 'bg-emerald-500 hover:bg-emerald-600 text-white'
            }`}
        >
          {isSent ? (
            <>
              <Check size={18} />
              <span>Sent!</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Request Chat</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
