import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { Viewer, Entity, PointGraphics, CameraFlyTo, ImageryLayer } from 'resium';
import { Cartesian3, Color, Ion, UrlTemplateImageryProvider, Viewer as CesiumViewer, Cartographic, type CesiumComponentRef } from 'cesium';
import { Plus, Minus } from 'lucide-react';

Ion.defaultAccessToken = process.env.CESIUM_ION_TOKEN ?? '';

interface ShipEntity {
  id: string;
  lat: number;
  lng: number;
  alt: number;
  heading: number;
  metadata: {
    vesselName: string;
    speed: number;
    type: string;
  };
}

export default function DemoGlobe({ mobile = false }: { mobile?: boolean }) {
  const viewerRef = useRef<CesiumComponentRef<CesiumViewer>>(null);
  const [ships, setShips] = useState<Record<string, ShipEntity>>({});

  const darkBasemap = useMemo(
    () =>
      new UrlTemplateImageryProvider({
        url: 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      }),
    []
  );

  // Connect to the WebSocket for live ship data
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/stream`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'ENTITY_UPDATE' && message.layer === 'ships') {
          setShips((prev) => {
            const next = { ...prev };
            (message.data as ShipEntity[]).forEach((entity) => {
              next[entity.id] = entity;
            });
            return next;
          });
        }
      } catch {
        // ignore parse errors
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  const animateZoom = useCallback((factor: number) => {
    const camera = viewerRef.current?.cesiumElement?.camera;
    if (!camera) return;
    const carto = Cartographic.fromCartesian(camera.position);
    const newHeight = carto.height * factor;
    camera.flyTo({
      destination: Cartesian3.fromRadians(carto.longitude, carto.latitude, newHeight),
      duration: 0.5,
    });
  }, []);

  const shipEntities = Object.values(ships);

  return (
    <div style={{ position: 'relative', width: '100%', height: mobile ? 320 : 520, background: '#000' }}>
      {/* Zoom controls */}
      <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 20, display: 'flex', flexDirection: 'column', gap: 4, background: 'rgba(9,15,10,0.9)', padding: 6, borderRadius: 6, border: '1px solid #1e3320' }}>
        <button
          onClick={() => animateZoom(0.5)}
          style={{ background: 'transparent', border: 'none', color: '#8aab8d', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Zoom In"
        >
          <Plus size={16} />
        </button>
        <button
          onClick={() => animateZoom(2.0)}
          style={{ background: 'transparent', border: 'none', color: '#8aab8d', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Zoom Out"
        >
          <Minus size={16} />
        </button>
      </div>

      {/* Bottom gradient overlay */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(to top, #080f09, transparent)', zIndex: 10, pointerEvents: 'none' }} />

      <Viewer
        ref={viewerRef}
        full
        timeline={false}
        animation={false}
        baseLayerPicker={false}
        geocoder={false}
        homeButton={false}
        sceneModePicker={false}
        navigationHelpButton={false}
        fullscreenButton={false}
        infoBox={false}
        selectionIndicator={false}
      >
        <ImageryLayer imageryProvider={darkBasemap} alpha={0.8} />
        <CameraFlyTo
          duration={0}
          destination={Cartesian3.fromDegrees(40, 20, 15000000)}
        />
        {shipEntities.map((ship) => (
          <Entity
            key={ship.id}
            position={Cartesian3.fromDegrees(ship.lng, ship.lat, ship.alt)}
            name={ship.metadata.vesselName}
          >
            <PointGraphics
              pixelSize={7}
              color={Color.ORANGE}
              outlineColor={Color.WHITE}
              outlineWidth={1}
            />
          </Entity>
        ))}
      </Viewer>
    </div>
  );
}
