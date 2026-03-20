import { C, FONT, landingCSS, TickerBar, TopNav, FeaturesStrip, useIsMobile } from './LandingPage';

export default function BlogPage() {
  const mobile = useIsMobile();
  return (
    <>
      <style>{landingCSS}</style>
      <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: FONT.sans, display: 'flex', flexDirection: 'column' }}>
        <TickerBar />
        <TopNav />

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 20px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 50% 50%, rgba(185,28,28,.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
          
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 640 }}>
            <h1 style={{ fontFamily: FONT.serif, fontSize: mobile ? 44 : 72, fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
              Intel <em style={{ fontStyle: 'italic', color: C.red }}>Dispatches</em>
            </h1>
            <p style={{ fontSize: 16, color: C.text2, lineHeight: 1.7, marginBottom: 40 }}>
              Read our latest operational briefings, comprehensive platform changelogs, and deep-dive analytical post-mortems mapping out historical divergence events.
            </p>
          </div>
        </div>

        <FeaturesStrip />
      </div>
    </>
  );
}
