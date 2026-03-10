import { useEffect } from 'react';
import { useStore } from './store/useStore';
import Globe from './components/Globe';
import Sidebar from './components/Sidebar';
import EventFeed from './components/EventFeed';
import ConflictSidebar from './components/ConflictSidebar';

export default function App() {
  const { updateEntities, addEvent } = useStore();

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
      <Sidebar />
      <ConflictSidebar />
      <EventFeed />
    </div>
  );
}
