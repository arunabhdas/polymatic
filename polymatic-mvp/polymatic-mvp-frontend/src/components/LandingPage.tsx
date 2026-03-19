import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/* ─── Responsive Hook ─── */

export function useIsMobile(breakpoint = 768) {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [breakpoint]);
  return mobile;
}

/* ─── Brand Tokens ─── */

export const C = {
  bg: '#080f09',
  bg2: '#0d1a0e',
  bg3: '#111f12',
  card: '#0f1a10',
  border: '#1e3320',
  border2: '#2a4a2d',
  green: '#4ade80',
  green2: '#22c55e',
  greenDim: '#1a4a23',
  amber: '#f97316',
  amberDim: '#3d1a08',
  red: '#ef4444',
  redDim: '#3d0f0f',
  teal: '#2dd4bf',
  tealDim: '#0d3330',
  text: '#e8f0e9',
  text2: '#8aab8d',
  text3: '#4a6a4d',
} as const;

export const FONT = {
  mono: "'JetBrains Mono', monospace",
  serif: "'Playfair Display', serif",
  sans: "'DM Sans', sans-serif",
} as const;

/* ─── Data ─── */

const TICKER_ITEMS = [
  { color: C.red, text: 'AIS dark vessels: 7 detected · Hormuz corridor' },
  { color: C.amber, text: 'GPS spoofing eruption · E. Mediterranean · 09:15Z' },
  { color: C.green, text: 'Kalshi · Strait-open probability 61% · \u21914pp since 06:00Z' },
  { color: C.amber, text: 'Damascus airspace closed · NOTAM issued 11:44Z' },
  { color: C.red, text: 'USS Nimitz carrier group · course deviation detected' },
  { color: C.green, text: 'Polymarket · Oil supply disruption 38% probability' },
  { color: C.amber, text: 'Zagros Mountains · seismic anomaly M3.8 · 14:30Z' },
];

const METRICS: { dot: string; label: string; value: string; valueColor?: string }[] = [
  { dot: C.green, label: 'SIGNAL SCORE', value: '87.4' },
  { dot: C.teal, label: 'CROWD ALIGN', value: '72.1' },
  { dot: C.amber, label: 'DIV INDEX', value: '61.8', valueColor: C.amber },
  { dot: C.teal, label: 'OSINT VEL.', value: '68.5' },
  { dot: C.red, label: 'ACTIVE ALERTS', value: '3', valueColor: C.red },
];

const FEATURES = [
  {
    icon: '\uD83C\uDF10',
    iconBg: C.greenDim,
    iconBorder: C.green2,
    name: 'Unified Signal Feed',
    desc: 'LiveUAMap, Bellingcat, FIRMS, Twitter/X, Telegram, Polymarket, Kalshi \u2014 one severity-ranked, velocity-scored stream. No tab switching.',
    tag: 'FEED SYSTEM',
  },
  {
    icon: '\uD83D\uDCE1',
    iconBg: C.tealDim,
    iconBorder: '#0d9488',
    name: 'Sentiments Engine',
    desc: 'LLM-powered batch stance classification across a 6-step pipeline. Detects crowd/market divergence in real-time. You get the alert first.',
    tag: 'DIVERGENCE DETECTION',
  },
  {
    icon: '\u26A1',
    iconBg: C.amberDim,
    iconBorder: '#ea580c',
    name: 'Prediction Correlation',
    desc: 'Market price \u00D7 0.6 + crowd sentiment \u00D7 0.25 + historical base rate \u00D7 0.15. Calibrated against labeled ground truth. Not a toy.',
    tag: 'PREDICTION ENGINE',
  },
  {
    icon: '\uD83D\uDEA8',
    iconBg: C.redDim,
    iconBorder: '#b91c1c',
    name: 'Analyst Scoring',
    desc: 'Every call logged. Every outcome tracked. Signal accuracy, divergence calls, lead time \u2014 six dimensions building your analyst profile.',
    tag: 'ANALYST PROFILE',
  },
];

const STEPS = [
  { num: '01', title: 'Connect Your Feeds', desc: 'Link OSINT, social, and prediction market sources. Set regions of interest and alert thresholds. One toggle from mock to live.' },
  { num: '02', title: 'Watch the Divergence', desc: 'Real-time crowd vs. market splits surface automatically. 90-second classification windows, no manual monitoring required.' },
  { num: '03', title: 'Call Your Signal', desc: 'Log your prediction, set confidence, track against outcomes. Every call builds your analyst accuracy profile across six dimensions.' },
  { num: '04', title: 'Get Actionable Insights', desc: 'Receive prioritized intelligence briefs with confidence scores attached. Act on divergence signals before the market corrects.' },
];

const GLOBE_PINS = [
  { left: '62%', top: '44%', color: C.red },
  { left: '54%', top: '38%', color: C.amber },
  { left: '56%', top: '40%', color: C.amber },
  { left: '50%', top: '35%', color: C.green },
];

const GLOBE_LABELS = [
  { left: '66%', top: '38%', text: 'HORMUZ' },
  { left: '52%', top: '29%', text: 'MED' },
];

/* ─── Scoped Styles ─── */

export const landingCSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=DM+Sans:wght@300;400;500;600&display=swap');

@keyframes pm-ticker {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes pm-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
`;

/* ─── Sub-components (exported for reuse by DemoPage) ─── */

export function Dot({ color, pulse }: { color: string; pulse?: boolean }) {
  return (
    <span
      style={{
        width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
        background: color, boxShadow: `0 0 6px ${color}`,
        animation: pulse ? 'pm-pulse 2s infinite' : undefined,
      }}
    />
  );
}

export function TickerBar() {
  const mobile = useIsMobile();
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{ background: C.bg2, borderBottom: `1px solid ${C.border}`, overflow: 'hidden', height: 32, display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'pm-ticker 40s linear infinite' }}>
        {items.map((item, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: mobile ? '0 12px' : '0 28px', fontFamily: FONT.mono, fontSize: 10, color: C.text2, letterSpacing: '.04em', flexShrink: 0 }}>
            <Dot color={item.color} pulse />
            {item.text}
            {i < items.length - 1 && <span style={{ color: C.text3, marginLeft: mobile ? 12 : 28 }}>|</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TopNav() {
  const mobile = useIsMobile();
  const navLinks = ['PLATFORM', 'FEATURES', 'PRICING', 'ABOUT', 'BLOG'];
  return (
    <nav style={{ display: 'flex', alignItems: 'center', padding: mobile ? '0 16px' : '0 32px', height: 56, background: C.bg, borderBottom: `1px solid ${C.border}`, position: 'relative', zIndex: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: mobile ? 0 : 40, flex: mobile ? 1 : undefined }}>
        <div style={{ width: 30, height: 30, background: C.greenDim, border: `1px solid ${C.green2}`, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
          {'\uD83C\uDF10'}
        </div>
        <span style={{ fontFamily: FONT.mono, fontSize: 13, fontWeight: 600, letterSpacing: '.18em', color: C.text }}>POLYMATIC</span>
      </div>

      {!mobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          {navLinks.map((link, i) => (
            <span
              key={link}
              style={{
                fontFamily: FONT.mono, fontSize: 10, letterSpacing: '.1em', padding: '6px 14px', borderRadius: 5, cursor: 'pointer',
                border: i === 0 ? `1px solid ${C.border2}` : '1px solid transparent',
                color: i === 0 ? C.green : C.text3,
                background: i === 0 ? C.greenDim : 'transparent',
              }}
            >
              {link}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {!mobile && (
          <div style={{ fontFamily: FONT.mono, fontSize: 9, letterSpacing: '.1em', color: C.green, background: C.greenDim, border: `1px solid ${C.green2}`, padding: '3px 10px', borderRadius: 20 }}>
            LIVE INTEL
          </div>
        )}
        {!mobile && (
          <span style={{ fontFamily: FONT.mono, fontSize: 10, letterSpacing: '.12em', color: C.text2, border: `1px solid ${C.border2}`, padding: '8px 18px', borderRadius: 7, cursor: 'pointer', textDecoration: 'none' }}>
            SIGN IN
          </span>
        )}
        <Link
          to="/dashboard"
          style={{ fontFamily: FONT.mono, fontSize: 10, fontWeight: 600, letterSpacing: '.12em', color: '#050f06', background: C.green2, padding: '8px 18px', borderRadius: 7, cursor: 'pointer', textDecoration: 'none' }}
        >
          LAUNCH DASHBOARD
        </Link>
      </div>
    </nav>
  );
}

function GlobeMock({ mobile }: { mobile: boolean }) {
  const size = mobile ? 260 : 360;
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `radial-gradient(ellipse 70% 70% at 50% 50%, ${C.bg3} 0%, ${C.bg} 100%)`, borderLeft: mobile ? 'none' : `1px solid ${C.border}`, padding: mobile ? '20px 0' : undefined }}>
      <div style={{ width: size, height: size, borderRadius: '50%', background: `conic-gradient(from 180deg at 50% 50%, ${C.bg3} 0deg, ${C.bg2} 60deg, ${C.bg3} 120deg, ${C.bg2} 180deg, ${C.bg3} 240deg, ${C.bg2} 300deg, ${C.bg3} 360deg)`, border: `1px solid ${C.border2}`, position: 'relative', boxShadow: '0 0 80px rgba(34,197,94,.07)' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(ellipse 60% 60% at 35% 35%, rgba(34,197,94,.04) 0%, transparent 60%)' }} />
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: '50%', overflow: 'hidden' }} viewBox="0 0 360 360" fill="none">
          <circle cx="180" cy="180" r="179" stroke="#2a4a2d" strokeWidth="0.5" />
          <ellipse cx="180" cy="180" rx="179" ry="60" stroke="#1e3320" strokeWidth="0.5" />
          <ellipse cx="180" cy="180" rx="179" ry="120" stroke="#1e3320" strokeWidth="0.5" />
          <line x1="1" y1="180" x2="359" y2="180" stroke="#1e3320" strokeWidth="0.5" />
          <line x1="180" y1="1" x2="180" y2="359" stroke="#1e3320" strokeWidth="0.5" />
          <line x1="90" y1="1" x2="90" y2="359" stroke="#1e3320" strokeWidth="0.5" />
          <line x1="270" y1="1" x2="270" y2="359" stroke="#1e3320" strokeWidth="0.5" />
        </svg>
        {GLOBE_PINS.map((pin, i) => (
          <div
            key={i}
            style={{ position: 'absolute', width: 10, height: 10, borderRadius: '50%', background: pin.color, boxShadow: `0 0 10px ${pin.color}`, animation: 'pm-pulse 1.4s infinite', left: pin.left, top: pin.top }}
          />
        ))}
        {GLOBE_LABELS.map((label, i) => (
          <div
            key={i}
            style={{ position: 'absolute', fontFamily: FONT.mono, fontSize: 8, letterSpacing: '.08em', color: C.text2, background: C.bg, border: `1px solid ${C.border}`, padding: '2px 6px', borderRadius: 3, whiteSpace: 'nowrap', transform: 'translateX(-50%)', left: label.left, top: label.top }}
          >
            {label.text}
          </div>
        ))}
      </div>
    </div>
  );
}

export function FeaturesStrip() {
  const mobile = useIsMobile();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(4, 1fr)', borderTop: `1px solid ${C.border}` }}>
      {FEATURES.map((feat, i) => (
        <div key={feat.name} style={{ padding: mobile ? '24px 20px' : '36px 32px', borderRight: !mobile && i < 3 ? `1px solid ${C.border}` : 'none', borderBottom: mobile && i < FEATURES.length - 1 ? `1px solid ${C.border}` : 'none', cursor: 'pointer' }}>
          <div style={{ width: 38, height: 38, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginBottom: 14, background: feat.iconBg, border: `1px solid ${feat.iconBorder}` }}>
            {feat.icon}
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 7 }}>{feat.name}</div>
          <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.text2, lineHeight: 1.65, marginBottom: 12 }}>{feat.desc}</div>
          <span style={{ fontFamily: FONT.mono, fontSize: 8, letterSpacing: '.12em', color: C.text3, border: `1px solid ${C.border2}`, padding: '3px 9px', borderRadius: 3, display: 'inline-block' }}>
            {feat.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

export function StepsSection() {
  const mobile = useIsMobile();
  return (
    <div style={{ padding: mobile ? '32px 20px' : '64px 80px', borderTop: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', alignItems: mobile ? 'flex-start' : 'flex-end', justifyContent: 'space-between', gap: mobile ? 16 : 0, marginBottom: mobile ? 24 : 36 }}>
        <h2 style={{ fontFamily: FONT.serif, fontSize: mobile ? 28 : 44, fontWeight: 900, lineHeight: 1.1 }}>
          Four steps to<br /><em style={{ fontStyle: 'italic', color: C.green }}>see the world.</em>
        </h2>
        <p style={{ fontSize: 13, color: C.text2, maxWidth: 320, lineHeight: 1.6, textAlign: mobile ? 'left' : 'right' }}>
          The analyst shouldn't be manually correlating fifteen tabs. The correlation should
          surface automatically — with a confidence score attached.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : 'repeat(4, 1fr)', gap: 16 }}>
        {STEPS.map((step) => (
          <div key={step.num} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: '24px 20px' }}>
            <div style={{ fontFamily: FONT.mono, fontSize: mobile ? 28 : 36, fontWeight: 600, color: C.text3, lineHeight: 1, marginBottom: 12 }}>{step.num}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 7 }}>{step.title}</div>
            <div style={{ fontFamily: FONT.mono, fontSize: 10, color: C.text2, lineHeight: 1.65 }}>{step.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */

export default function LandingPage() {
  const mobile = useIsMobile();
  return (
    <>
      <style>{landingCSS}</style>
      <div style={{ minHeight: '100vh', background: C.bg, color: C.text, fontFamily: FONT.sans }}>
        <TickerBar />
        <TopNav />

        {/* Hero */}
        <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', minHeight: mobile ? undefined : 580, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 80% at 30% 50%, rgba(34,197,94,.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ padding: mobile ? '40px 20px' : '80px 60px 80px 80px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 8 : 14, marginBottom: mobile ? 20 : 28 }}>
              <div style={{ width: mobile ? 20 : 36, height: 1, background: C.border2 }} />
              <span style={{ fontFamily: FONT.mono, fontSize: 9, letterSpacing: '.22em', color: C.text3 }}>
                REAL-TIME · GEOSPATIAL · MACRO INTELLIGENCE
              </span>
              {!mobile && <div style={{ width: 36, height: 1, background: C.border2 }} />}
            </div>

            <h1 style={{ fontFamily: FONT.serif, fontSize: mobile ? 36 : 72, lineHeight: 1.0, fontWeight: 900, color: C.text, marginBottom: 8 }}>
              Polymatic<br /><em style={{ fontStyle: 'italic', color: C.green }}>Intelligence.</em>
            </h1>

            <p style={{ fontSize: mobile ? 13 : 14, color: C.amber, fontWeight: 500, letterSpacing: '.02em', marginBottom: 6 }}>
              One pane of glass — or <em style={{ fontStyle: 'italic', color: C.text2 }}>fifteen disconnected tabs.</em>
            </p>

            <p style={{ fontSize: mobile ? 13 : 14, color: C.text2, lineHeight: 1.7, maxWidth: 440, marginBottom: mobile ? 24 : 36 }}>
              Fuse OSINT feeds, social sentiment, and prediction markets into a single severity-ranked
              stream. Surface the crowd/market divergence before the market prices it in.
            </p>

            <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: 12, marginBottom: mobile ? 24 : 40 }}>
              <Link
                to="/dashboard"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: C.green2, color: '#050f06', fontFamily: FONT.mono, fontSize: 11, fontWeight: 600, letterSpacing: '.12em', padding: '14px 28px', borderRadius: 7, border: 'none', cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap' }}
              >
                LAUNCH DASHBOARD
              </Link>
              <Link
                to="/demo"
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'transparent', color: C.text2, fontFamily: FONT.mono, fontSize: 11, fontWeight: 500, letterSpacing: '.12em', padding: '12px 24px', borderRadius: 7, border: `1px solid ${C.border2}`, cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none' }}
              >
                WATCH DEMO &#9655;
              </Link>
            </div>

            {/* Metric pills */}
            <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)', gap: 8 }}>
              {METRICS.map((m) => (
                <div key={m.label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 7, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Dot color={m.dot} pulse />
                    <span style={{ fontFamily: FONT.mono, fontSize: 8, letterSpacing: '.1em', color: C.text3 }}>{m.label}</span>
                  </div>
                  <span style={{ fontFamily: FONT.mono, fontSize: 18, fontWeight: 600, color: m.valueColor ?? C.text }}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>

          <GlobeMock mobile={mobile} />
        </div>

        <FeaturesStrip />
        <StepsSection />
      </div>
    </>
  );
}
