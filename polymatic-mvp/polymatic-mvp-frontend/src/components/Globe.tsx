import { useMemo, useRef } from 'react';
import { Viewer, Entity, PointGraphics, CameraFlyTo, ImageryLayer, CesiumComponentRef } from 'resium';
import { Cartesian3, Color, UrlTemplateImageryProvider, Viewer as CesiumViewer } from 'cesium';
import { Plus, Minus } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Globe() {
  const { 
    layers, aircraft, ships, satellites, wildfires, earthquakes, 
    militaryBases, chokepoints, ports, conflicts,
    volcanoes, oilGas, powerGrid, mining, internet,
    weather, floods, darkShips, airspace,
    commodityPrices, preciousMetals, industrialMetals, rareEarths,
    agriculturalCommodities, cropYields, foodSupplyChain, energyCommodities,
    mineralExports, priceShocks,
    selectEntity, activePoi 
  } = useStore();
  const viewerRef = useRef<CesiumComponentRef<CesiumViewer>>(null);

  const politicalProvider = useMemo(
    () =>
      new UrlTemplateImageryProvider({
        url: 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
      }),
    []
  );

  const satelliteImageryProvider = useMemo(
    () =>
      new UrlTemplateImageryProvider({
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      }),
    []
  );

  const handleZoomIn = () => {
    const camera = viewerRef.current?.cesiumElement?.camera;
    if (camera) {
      const height = camera.positionCartographic.height;
      camera.zoomIn(height * 0.5);
    }
  };

  const handleZoomOut = () => {
    const camera = viewerRef.current?.cesiumElement?.camera;
    if (camera) {
      const height = camera.positionCartographic.height;
      camera.zoomOut(height * 0.5);
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-black z-0">
      <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 bg-zinc-950/90 p-2 rounded border border-zinc-800 backdrop-blur-sm shadow-xl">
        <div className="flex gap-2 justify-center">
          <button onClick={handleZoomIn} className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors" title="Zoom In">
            <Plus size={16} />
          </button>
          <button onClick={handleZoomOut} className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors" title="Zoom Out">
            <Minus size={16} />
          </button>
        </div>
      </div>

      <Viewer ref={viewerRef} full timeline={false} animation={false} baseLayerPicker={false} geocoder={false} homeButton={false} sceneModePicker={false} navigationHelpButton={false}>
        {layers.satelliteImagery && (
          <ImageryLayer
            imageryProvider={satelliteImageryProvider}
            alpha={1.0}
          />
        )}
        {layers.political && (
          <ImageryLayer
            imageryProvider={politicalProvider}
            alpha={0.8}
          />
        )}
        {activePoi && (
          <CameraFlyTo
            duration={2}
            destination={Cartesian3.fromDegrees(activePoi.lng, activePoi.lat, activePoi.alt)}
          />
        )}
        {layers.aircraft &&
          Object.values(aircraft).map((ac) => (
            <Entity
              key={ac.id}
              position={Cartesian3.fromDegrees(ac.lng, ac.lat, ac.alt)}
              name={ac.metadata.callsign}
              description={`Speed: ${ac.metadata.speed} knots\nType: ${ac.metadata.type}`}
              onClick={() => selectEntity(ac)}
            >
              <PointGraphics pixelSize={6} color={ac.metadata.type === 'Military' ? Color.RED : Color.CYAN} outlineColor={Color.WHITE} outlineWidth={1} />
            </Entity>
          ))}
        {layers.ships &&
          Object.values(ships).map((ship) => (
            <Entity
              key={ship.id}
              position={Cartesian3.fromDegrees(ship.lng, ship.lat, ship.alt)}
              name={ship.metadata.vesselName}
              description={`Speed: ${ship.metadata.speed} knots\nType: ${ship.metadata.type}`}
              onClick={() => selectEntity(ship)}
            >
              <PointGraphics pixelSize={8} color={Color.ORANGE} outlineColor={Color.WHITE} outlineWidth={1} />
            </Entity>
          ))}
        {layers.satellites &&
          Object.values(satellites).map((sat) => (
            <Entity
              key={sat.id}
              position={Cartesian3.fromDegrees(sat.lng, sat.lat, sat.alt)}
              name={sat.metadata.name}
              description={`Velocity: ${sat.metadata.velocity}\nType: ${sat.metadata.type}`}
              onClick={() => selectEntity(sat)}
            >
              <PointGraphics pixelSize={5} color={Color.VIOLET} outlineColor={Color.WHITE} outlineWidth={1} />
            </Entity>
          ))}
        {layers.wildfires &&
          Object.values(wildfires).map((fire) => (
            <Entity
              key={fire.id}
              position={Cartesian3.fromDegrees(fire.lng, fire.lat, fire.alt)}
              name="Wildfire Detection"
              description={`Confidence: ${fire.metadata.confidence}\nFRP: ${fire.metadata.frp}`}
              onClick={() => selectEntity(fire)}
            >
              <PointGraphics pixelSize={10} color={Color.RED.withAlpha(0.8)} outlineColor={Color.YELLOW} outlineWidth={2} />
            </Entity>
          ))}
        {layers.earthquakes &&
          Object.values(earthquakes).map((eq) => (
            <Entity
              key={eq.id}
              position={Cartesian3.fromDegrees(eq.lng, eq.lat, eq.alt)}
              name={`Earthquake M${eq.metadata.magnitude}`}
              description={`Magnitude: ${eq.metadata.magnitude}\nDepth: ${eq.metadata.depth}`}
              onClick={() => selectEntity(eq)}
            >
              <PointGraphics pixelSize={parseFloat(eq.metadata.magnitude) * 3} color={Color.MAGENTA.withAlpha(0.6)} outlineColor={Color.WHITE} outlineWidth={1} />
            </Entity>
          ))}
        {layers.militaryBases &&
          Object.values(militaryBases).map((base) => (
            <Entity
              key={base.id}
              position={Cartesian3.fromDegrees(base.lng, base.lat, base.alt)}
              name={base.metadata.name}
              description={`Type: ${base.metadata.type}`}
              onClick={() => selectEntity(base)}
            >
              <PointGraphics pixelSize={12} color={Color.GREEN} outlineColor={Color.BLACK} outlineWidth={2} />
            </Entity>
          ))}
        {layers.chokepoints &&
          Object.values(chokepoints).map((choke) => (
            <Entity
              key={choke.id}
              position={Cartesian3.fromDegrees(choke.lng, choke.lat, choke.alt)}
              name={choke.metadata.name}
              description={`Type: ${choke.metadata.type}`}
              onClick={() => selectEntity(choke)}
            >
              <PointGraphics pixelSize={15} color={Color.RED.withAlpha(0.5)} outlineColor={Color.RED} outlineWidth={2} />
            </Entity>
          ))}
        {layers.ports &&
          Object.values(ports).map((port) => (
            <Entity
              key={port.id}
              position={Cartesian3.fromDegrees(port.lng, port.lat, port.alt)}
              name={port.metadata.name}
              description={`Type: ${port.metadata.type}`}
              onClick={() => selectEntity(port)}
            >
              <PointGraphics pixelSize={10} color={Color.SKYBLUE} outlineColor={Color.WHITE} outlineWidth={1} />
            </Entity>
          ))}
        {layers.conflicts &&
          Object.values(conflicts).map((conflict) => (
            <Entity
              key={conflict.id}
              position={Cartesian3.fromDegrees(conflict.lng, conflict.lat, conflict.alt)}
              name="Conflict Event"
              description={`Type: ${conflict.metadata.type}\nSource: ${conflict.metadata.source}`}
              onClick={() => selectEntity(conflict)}
            >
              <PointGraphics 
                pixelSize={16} 
                color={Color.CRIMSON.withAlpha(0.8)} 
                outlineColor={Color.YELLOW} 
                outlineWidth={2} 
              />
            </Entity>
          ))}
        {layers.volcanoes &&
          Object.values(volcanoes).map((volcano) => (
            <Entity
              key={volcano.id}
              position={Cartesian3.fromDegrees(volcano.lng, volcano.lat, volcano.alt)}
              name={volcano.metadata.name}
              description={`Status: ${volcano.metadata.status}`}
              onClick={() => selectEntity(volcano)}
            >
              <PointGraphics pixelSize={14} color={Color.ORANGERED} outlineColor={Color.YELLOW} outlineWidth={2} />
            </Entity>
          ))}
        {layers.oilGas &&
          Object.values(oilGas).map((infra) => (
            <Entity
              key={infra.id}
              position={Cartesian3.fromDegrees(infra.lng, infra.lat, infra.alt)}
              name={infra.metadata.name}
              description={`Type: ${infra.metadata.type}`}
              onClick={() => selectEntity(infra)}
            >
              <PointGraphics pixelSize={10} color={Color.DARKGRAY} outlineColor={Color.WHITE} outlineWidth={1} />
            </Entity>
          ))}
        {layers.powerGrid &&
          Object.values(powerGrid).map((infra) => (
            <Entity
              key={infra.id}
              position={Cartesian3.fromDegrees(infra.lng, infra.lat, infra.alt)}
              name={infra.metadata.name}
              description={`Type: ${infra.metadata.type}`}
              onClick={() => selectEntity(infra)}
            >
              <PointGraphics pixelSize={10} color={Color.YELLOW} outlineColor={Color.BLACK} outlineWidth={1} />
            </Entity>
          ))}
        {layers.mining &&
          Object.values(mining).map((mine) => (
            <Entity
              key={mine.id}
              position={Cartesian3.fromDegrees(mine.lng, mine.lat, mine.alt)}
              name={mine.metadata.name}
              description={`Type: ${mine.metadata.type}`}
              onClick={() => selectEntity(mine)}
            >
              <PointGraphics pixelSize={12} color={Color.SADDLEBROWN} outlineColor={Color.WHITE} outlineWidth={1} />
            </Entity>
          ))}
        {layers.internet &&
          Object.values(internet).map((infra) => (
            <Entity
              key={infra.id}
              position={Cartesian3.fromDegrees(infra.lng, infra.lat, infra.alt)}
              name={infra.metadata.name}
              description={`Type: ${infra.metadata.type}`}
              onClick={() => selectEntity(infra)}
            >
              <PointGraphics pixelSize={8} color={Color.DODGERBLUE} outlineColor={Color.WHITE} outlineWidth={1} />
            </Entity>
          ))}
        {layers.weather &&
          Object.values(weather).map((w) => (
            <Entity
              key={w.id}
              position={Cartesian3.fromDegrees(w.lng, w.lat, w.alt)}
              name={w.metadata.name}
              description={`Category: ${w.metadata.category}`}
              onClick={() => selectEntity(w)}
            >
              <PointGraphics pixelSize={20} color={Color.LIGHTBLUE.withAlpha(0.6)} outlineColor={Color.WHITE} outlineWidth={2} />
            </Entity>
          ))}
        {layers.floods &&
          Object.values(floods).map((flood) => (
            <Entity
              key={flood.id}
              position={Cartesian3.fromDegrees(flood.lng, flood.lat, flood.alt)}
              name="Flood Risk"
              description={`Region: ${flood.metadata.region}\nRisk: ${flood.metadata.risk}`}
              onClick={() => selectEntity(flood)}
            >
              <PointGraphics pixelSize={15} color={Color.BLUE.withAlpha(0.5)} outlineColor={Color.BLUE} outlineWidth={2} />
            </Entity>
          ))}
        {layers.darkShips &&
          Object.values(darkShips).map((ship) => (
            <Entity
              key={ship.id}
              position={Cartesian3.fromDegrees(ship.lng, ship.lat, ship.alt)}
              name="Dark Ship Detected"
              description={`Detection: ${ship.metadata.detection}\nConfidence: ${ship.metadata.confidence}`}
              onClick={() => selectEntity(ship)}
            >
              <PointGraphics pixelSize={10} color={Color.DARKSLATEGRAY} outlineColor={Color.RED} outlineWidth={2} />
            </Entity>
          ))}
        {layers.airspace &&
          Object.values(airspace).map((space) => (
            <Entity
              key={space.id}
              position={Cartesian3.fromDegrees(space.lng, space.lat, space.alt)}
              name="Airspace Restriction"
              description={`Type: ${space.metadata.type}\nReason: ${space.metadata.reason}`}
              onClick={() => selectEntity(space)}
            >
              <PointGraphics pixelSize={15} color={Color.RED.withAlpha(0.3)} outlineColor={Color.RED} outlineWidth={2} />
            </Entity>
          ))}
        {layers.commodityPrices &&
          Object.values(commodityPrices).map((cp) => (
            <Entity
              key={cp.id}
              position={Cartesian3.fromDegrees(cp.lng, cp.lat, cp.alt)}
              name={cp.metadata.commodity}
              description={`Price: ${cp.metadata.price}\nChange: ${cp.metadata.change}`}
              onClick={() => selectEntity(cp)}
            >
              <PointGraphics pixelSize={18} color={cp.metadata.change.startsWith('+') ? Color.LIMEGREEN.withAlpha(0.7) : Color.RED.withAlpha(0.7)} outlineColor={Color.WHITE} outlineWidth={1} />
            </Entity>
          ))}
        {layers.preciousMetals &&
          Object.values(preciousMetals).map((pm) => (
            <Entity
              key={pm.id}
              position={Cartesian3.fromDegrees(pm.lng, pm.lat, pm.alt)}
              name={pm.metadata.name}
              description={`Type: ${pm.metadata.type}\nStatus: ${pm.metadata.status}`}
              onClick={() => selectEntity(pm)}
            >
              <PointGraphics pixelSize={12} color={Color.GOLD} outlineColor={Color.WHITE} outlineWidth={1} />
            </Entity>
          ))}
        {layers.industrialMetals &&
          Object.values(industrialMetals).map((im) => (
            <Entity
              key={im.id}
              position={Cartesian3.fromDegrees(im.lng, im.lat, im.alt)}
              name={im.metadata.name}
              description={`Type: ${im.metadata.type}\nStatus: ${im.metadata.status}`}
              onClick={() => selectEntity(im)}
            >
              <PointGraphics pixelSize={12} color={Color.SLATEGRAY} outlineColor={Color.WHITE} outlineWidth={1} />
            </Entity>
          ))}
        {layers.rareEarths &&
          Object.values(rareEarths).map((re) => (
            <Entity
              key={re.id}
              position={Cartesian3.fromDegrees(re.lng, re.lat, re.alt)}
              name={re.metadata.name}
              description={`Type: ${re.metadata.type}\nStatus: ${re.metadata.status}`}
              onClick={() => selectEntity(re)}
            >
              <PointGraphics pixelSize={12} color={Color.MEDIUMPURPLE} outlineColor={Color.WHITE} outlineWidth={1} />
            </Entity>
          ))}
        {layers.agriculturalCommodities &&
          Object.values(agriculturalCommodities).map((ac) => (
            <Entity
              key={ac.id}
              position={Cartesian3.fromDegrees(ac.lng, ac.lat, ac.alt)}
              name={ac.metadata.commodity}
              description={`Price: ${ac.metadata.price}\nSeason: ${ac.metadata.season}`}
              onClick={() => selectEntity(ac)}
            >
              <PointGraphics pixelSize={14} color={Color.FORESTGREEN} outlineColor={Color.WHITE} outlineWidth={1} />
            </Entity>
          ))}
        {layers.cropYields &&
          Object.values(cropYields).map((cy) => (
            <Entity
              key={cy.id}
              position={Cartesian3.fromDegrees(cy.lng, cy.lat, cy.alt)}
              name={cy.metadata.crop}
              description={`NDVI: ${cy.metadata.ndvi}\nForecast: ${cy.metadata.forecast}`}
              onClick={() => selectEntity(cy)}
            >
              <PointGraphics pixelSize={14} color={Color.YELLOWGREEN} outlineColor={Color.WHITE} outlineWidth={1} />
            </Entity>
          ))}
        {layers.foodSupplyChain &&
          Object.values(foodSupplyChain).map((fs) => (
            <Entity
              key={fs.id}
              position={Cartesian3.fromDegrees(fs.lng, fs.lat, fs.alt)}
              name={fs.metadata.name}
              description={`Type: ${fs.metadata.type}\nCapacity: ${fs.metadata.capacity}`}
              onClick={() => selectEntity(fs)}
            >
              <PointGraphics pixelSize={12} color={Color.CORNFLOWERBLUE} outlineColor={Color.WHITE} outlineWidth={1} />
            </Entity>
          ))}
        {layers.energyCommodities &&
          Object.values(energyCommodities).map((ec) => (
            <Entity
              key={ec.id}
              position={Cartesian3.fromDegrees(ec.lng, ec.lat, ec.alt)}
              name={ec.metadata.name}
              description={`Type: ${ec.metadata.type}\nStatus: ${ec.metadata.status}`}
              onClick={() => selectEntity(ec)}
            >
              <PointGraphics pixelSize={14} color={Color.ORANGE} outlineColor={Color.WHITE} outlineWidth={1} />
            </Entity>
          ))}
        {layers.mineralExports &&
          Object.values(mineralExports).map((me) => (
            <Entity
              key={me.id}
              position={Cartesian3.fromDegrees(me.lng, me.lat, me.alt)}
              name={me.metadata.name}
              description={`Type: ${me.metadata.type}\nVolume: ${me.metadata.volume}`}
              onClick={() => selectEntity(me)}
            >
              <PointGraphics pixelSize={12} color={Color.STEELBLUE} outlineColor={Color.WHITE} outlineWidth={1} />
            </Entity>
          ))}
        {layers.priceShocks &&
          Object.values(priceShocks).map((ps) => (
            <Entity
              key={ps.id}
              position={Cartesian3.fromDegrees(ps.lng, ps.lat, ps.alt)}
              name={`Price Shock: ${ps.metadata.commodity}`}
              description={`Change: ${ps.metadata.change}\nReason: ${ps.metadata.reason}\nConfidence: ${ps.metadata.confidence}`}
              onClick={() => selectEntity(ps)}
            >
              <PointGraphics pixelSize={20} color={Color.RED} outlineColor={Color.YELLOW} outlineWidth={2} />
            </Entity>
          ))}
      </Viewer>
    </div>
  );
}
