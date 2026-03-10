import { useEffect } from 'react';
import { useStore } from './store/useStore';
import { Menu } from 'lucide-react';
import Globe from './components/Globe';
import Sidebar from './components/Sidebar';
import EventFeed from './components/EventFeed';
import ConflictSidebar from './components/ConflictSidebar';

export default function App() {
  const { updateEntities, addEvent, sidebarOpen, setSidebarOpen } = useStore();

  useEffect(() => {
    // Connect to the WebSocket server
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/stream`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('Connected to PolyMatic stream');
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'ENTITY_UPDATE') {
          updateEntities(message.layer, message.data);
        } else if (message.type === 'EVENT_ALERT') {
          addEvent(message.data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = () => {
      console.log('Disconnected from PolyMatic stream');
    };

    return () => {
      ws.close();
    };
  }, [updateEntities, addEvent]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black font-sans">
      <Globe />

      {/* Hamburger toggle — mobile only, hidden when sidebar is open */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-20 md:hidden p-2 rounded-lg bg-zinc-950/80 border border-zinc-800 backdrop-blur-sm text-zinc-300 hover:text-white hover:bg-zinc-900 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>
      )}

      <Sidebar />
      <ConflictSidebar />
      <EventFeed />
    </div>
  );
}
