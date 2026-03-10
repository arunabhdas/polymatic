import { useStore } from '../store/useStore';
import { AlertTriangle } from 'lucide-react';

export default function EventFeed() {
  const { events } = useStore();

  return (
    <div className="absolute bottom-0 right-0 w-96 max-h-96 overflow-y-auto bg-zinc-950/90 border-l border-t border-zinc-800 text-zinc-300 p-4 z-10 font-mono text-xs backdrop-blur-sm">
      <h2 className="uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2 sticky top-0 bg-zinc-950/90 py-2">
        <AlertTriangle size={14} className="text-red-500" /> Live Event Feed
      </h2>
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="border border-red-900/50 bg-red-950/20 p-3 rounded">
            <div className="flex justify-between text-red-400 mb-1">
              <span className="font-bold">{event.title}</span>
              <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
            </div>
            <div className="text-zinc-400">LOC: {event.location}</div>
            <div className="text-zinc-500 uppercase mt-1">SEV: {event.severity}</div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="text-zinc-600 text-center py-4 italic">Awaiting intelligence signals...</div>
        )}
      </div>
    </div>
  );
}
