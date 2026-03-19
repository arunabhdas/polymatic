import { Link } from 'react-router-dom';
import { C, FONT, landingCSS, TickerBar, TopNav, FeaturesStrip, StepsSection, Dot, useIsMobile } from './LandingPage';
import DemoGlobe from './DemoGlobe';

export default function DemoPage() {
  const mobile = useIsMobile();
  return (
    <>
      <style>{landingCSS}</style>
      <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: FONT.sans }}>
        <TickerBar />
        <TopNav />

        {/* Demo Hero — live Cesium globe */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Live badge */}
          <div style={{
            position: 'absolute', top: 12, left: mobile ? 12 : 16, zIndex: 20,
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(9,15,10,0.85)', border: `1px solid ${C.border2}`,
            padding: mobile ? '5px 10px' : '6px 14px', borderRadius: 20, backdropFilter: 'blur(8px)',
          }}>
            <Dot color={C.green} pulse />
            <span style={{ fontFamily: FONT.mono, fontSize: 9, letterSpacing: '.14em', color: C.green }}>
              LIVE AIS · GLOBAL SHIPPING
            </span>
          </div>

          {/* Headline overlay */}
          <div style={{
            position: 'absolute', bottom: mobile ? 24 : 60, left: mobile ? 16 : 40, right: mobile ? 16 : undefined, zIndex: 20,
            maxWidth: mobile ? undefined : 520, pointerEvents: 'none',
          }}>
            <h1 style={{ fontFamily: FONT.serif, fontSize: mobile ? 28 : 48, fontWeight: 900, lineHeight: 1.05, color: C.text, marginBottom: 10, textShadow: '0 2px 20px rgba(0,0,0,0.7)' }}>
              Live Maritime<br /><em style={{ fontStyle: 'italic', color: C.green }}>Intelligence.</em>
            </h1>
            {!mobile && (
              <p style={{ fontSize: 13, color: C.text2, lineHeight: 1.6, marginBottom: 16, textShadow: '0 1px 10px rgba(0,0,0,0.8)' }}>
                Real-time AIS vessel tracking across global shipping lanes. Open-source maritime data rendered on a 3D globe.
              </p>
            )}
            <Link
              to="/dashboard"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: C.green2, color: '#050f06',
                fontFamily: FONT.mono, fontSize: 10, fontWeight: 600, letterSpacing: '.12em',
                padding: '10px 22px', borderRadius: 6, textDecoration: 'none',
                pointerEvents: 'auto',
                width: mobile ? '100%' : undefined, justifyContent: 'center',
              }}
            >
              LAUNCH FULL DASHBOARD
            </Link>
          </div>

          {/* Metric ribbon */}
          {!mobile && (
            <div style={{
              position: 'absolute', top: 16, right: 60, zIndex: 20,
              display: 'flex', gap: 8,
            }}>
              {[
                { label: 'VESSELS', value: '2,847', color: C.amber },
                { label: 'REGIONS', value: '12', color: C.teal },
                { label: 'LATENCY', value: '< 5s', color: C.green },
              ].map((m) => (
                <div key={m.label} style={{
                  background: 'rgba(9,15,10,0.85)', border: `1px solid ${C.border}`,
                  borderRadius: 6, padding: '8px 12px', backdropFilter: 'blur(8px)',
                  display: 'flex', flexDirection: 'column', gap: 2,
                }}>
                  <span style={{ fontFamily: FONT.mono, fontSize: 8, letterSpacing: '.1em', color: C.text3 }}>{m.label}</span>
                  <span style={{ fontFamily: FONT.mono, fontSize: 16, fontWeight: 600, color: m.color }}>{m.value}</span>
                </div>
              ))}
            </div>
          )}

          <DemoGlobe mobile={mobile} />
        </div>

        <FeaturesStrip />
        <StepsSection />
      </div>
    </>
  );
}
