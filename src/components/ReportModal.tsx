import { useState } from 'react';
import { ReportService, CreateReportPayload } from '../services/reportService';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMatchId: string | null;
  previousMatchId: string | null;
  onReportCurrent: () => void; // Triggered if current match is reported
}

type ReportReason = CreateReportPayload['reason'];

const REASONS: { id: ReportReason; label: string }[] = [
  { id: 'nudity', label: 'Nudity' },
  { id: 'harassment', label: 'Harassment' },
  { id: 'spam', label: 'Spam' },
  { id: 'hate_speech', label: 'Hate Speech' },
  { id: 'fake_camera', label: 'Fake Camera' },
  { id: 'other', label: 'Other' }
];

export default function ReportModal({ isOpen, onClose, currentMatchId, previousMatchId, onReportCurrent }: ReportModalProps) {
  const [matchType, setMatchType] = useState<'current' | 'previous'>(currentMatchId ? 'current' : 'previous');
  const [reason, setReason] = useState<ReportReason | null>(null);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reason) {
      setError('Please select a reason');
      return;
    }

    const reportedUserId = matchType === 'current' ? currentMatchId : previousMatchId;

    if (!reportedUserId) {
      setError(`No ${matchType} match found to report`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await ReportService.submitReport({
        reportedUserId,
        reason,
        text,
        matchType
      });
      
      onClose();
      if (matchType === 'current') {
        onReportCurrent();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Report User</h2>

        {/* Toggle Current / Previous */}
        <div className="flex gap-2 p-1 bg-black/30 rounded-xl mb-6">
          <button
            onClick={() => setMatchType('current')}
            disabled={!currentMatchId}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${matchType === 'current' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'} ${!currentMatchId && 'opacity-50 cursor-not-allowed'}`}
          >
            Current Match
          </button>
          <button
            onClick={() => setMatchType('previous')}
            disabled={!previousMatchId}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${matchType === 'previous' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-zinc-300'} ${!previousMatchId && 'opacity-50 cursor-not-allowed'}`}
          >
            Previous Match
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm rounded-xl">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-6">
          <label className="text-sm font-semibold text-zinc-400">Reason</label>
          {REASONS.map((r) => (
            <label key={r.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer border border-transparent hover:border-white/5 transition-colors">
              <input 
                type="radio" 
                name="report_reason" 
                value={r.id}
                checked={reason === r.id}
                onChange={() => setReason(r.id)}
                className="w-5 h-5 text-emerald-500 bg-zinc-950 border-white/20 focus:ring-emerald-500 focus:ring-offset-zinc-900"
              />
              <span className="text-zinc-200">{r.label}</span>
            </label>
          ))}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-zinc-400 mb-2">Additional info (optional)</label>
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white placeholder-zinc-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 resize-none h-24"
            placeholder="Tell us more about what happened..."
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !reason}
          className="w-full py-4 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:hover:bg-rose-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] active:scale-95"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </div>
  );
}
