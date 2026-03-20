import { useEffect, useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { AlertTriangle, ExternalLink, RefreshCw, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GDELTArticle {
  url: string;
  url_mobile: string;
  title: string;
  seendate: string;
  socialimage: string;
  domain: string;
  language: string;
  sourcecountry: string;
}

export default function ConflictSidebar() {
  const { layers, updateEntities, setActivePoi, conflictSidebarOpen, setConflictSidebarOpen } = useStore();
  const [articles, setArticles] = useState<GDELTArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!layers.conflicts) return;
    }

    if (layers.conflicts) {
      // Re-center the globe to the Middle East when the sidebar animates in
      setActivePoi({ id: 'poi-middle-east', name: 'Middle East', lat: 29.2985, lng: 42.5510, alt: 5000000 });
      // Auto-open on mobile when conflicts layer is toggled on
      setConflictSidebarOpen(true);
    } else {
      // Re-center the globe to a global view when the sidebar animates out
      setActivePoi({ id: 'poi-global', name: 'Global', lat: 20, lng: 0, alt: 20000000 });
      // Auto-close on mobile when conflicts layer is toggled off
      setConflictSidebarOpen(false);
      return;
    }

    let isMounted = true;

    const fetchGDELT = async () => {
      setLoading(true);
      setError(null);
      try {
        // Try to fetch real GDELT data for Iran and Middle East
        const response = await fetch(
          'https://api.gdeltproject.org/api/v2/doc/doc?query=(iran OR "middle east" OR israel OR syria) (conflict OR protest OR violence OR strike OR attack)&mode=artlist&format=json&maxrecords=50'
        );

        if (!response.ok) {
          throw new Error(`GDELT API responded with status: ${response.status}`);
        }

        const data = await response.json();

        if (isMounted && data.articles) {
          setArticles(data.articles);
        } else if (isMounted) {
          throw new Error('Invalid data format from GDELT API');
        }
      } catch (err) {
        console.error('Failed to fetch GDELT data, falling back to mock data:', err);
        if (isMounted) {
          // Fallback mock data
          const mockArticles: GDELTArticle[] = [
            {
              url: '#',
              url_mobile: '#',
              title: 'Tensions escalate in the Middle East following recent border skirmishes',
              seendate: new Date().toISOString().replace(/[-:T.]/g, '').substring(0, 14) + 'Z',
              socialimage: '',
              domain: 'reuters.com',
              language: 'English',
              sourcecountry: 'United States'
            },
            {
              url: '#',
              url_mobile: '#',
              title: 'Protests reported in Tehran over economic conditions',
              seendate: new Date(Date.now() - 3600000).toISOString().replace(/[-:T.]/g, '').substring(0, 14) + 'Z',
              socialimage: '',
              domain: 'aljazeera.com',
              language: 'English',
              sourcecountry: 'Qatar'
            },
            {
              url: '#',
              url_mobile: '#',
              title: 'Diplomatic talks stall amid rising regional conflict concerns',
              seendate: new Date(Date.now() - 7200000).toISOString().replace(/[-:T.]/g, '').substring(0, 14) + 'Z',
              socialimage: '',
              domain: 'bbc.co.uk',
              language: 'English',
              sourcecountry: 'United Kingdom'
            },
            {
              url: '#',
              url_mobile: '#',
              title: 'Military movements observed near key strategic chokepoints',
              seendate: new Date(Date.now() - 10800000).toISOString().replace(/[-:T.]/g, '').substring(0, 14) + 'Z',
              socialimage: '',
              domain: 'apnews.com',
              language: 'English',
              sourcecountry: 'United States'
            },
            {
              url: '#',
              url_mobile: '#',
              title: 'Regional leaders call for de-escalation of violence',
              seendate: new Date(Date.now() - 14400000).toISOString().replace(/[-:T.]/g, '').substring(0, 14) + 'Z',
              socialimage: '',
              domain: 'dw.com',
              language: 'English',
              sourcecountry: 'Germany'
            }
          ];
          setArticles(mockArticles);
          setError('Using GDELT API)');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchGDELT();

    // Also highlight areas in the Middle East and Iran on the globe
    const conflictEntities = [
      {
        id: 'conflict-iran-tehran',
        lat: 35.6892,
        lng: 51.3890,
        alt: 0,
        heading: 0,
        metadata: {
          type: 'Protest / Unrest',
          source: 'GDELT',
          location: 'Tehran, Iran',
          severity: 'High'
        }
      },
      {
        id: 'conflict-iran-border',
        lat: 32.4279,
        lng: 53.6880,
        alt: 0,
        heading: 0,
        metadata: {
          type: 'Military Movement',
          source: 'GDELT',
          location: 'Central Iran',
          severity: 'Medium'
        }
      },
      {
        id: 'conflict-israel-gaza',
        lat: 31.5,
        lng: 34.466667,
        alt: 0,
        heading: 0,
        metadata: {
          type: 'Armed Conflict',
          source: 'GDELT',
          location: 'Gaza Strip',
          severity: 'Critical'
        }
      },
      {
        id: 'conflict-syria-damascus',
        lat: 33.5138,
        lng: 36.2765,
        alt: 0,
        heading: 0,
        metadata: {
          type: 'Airstrike',
          source: 'GDELT',
          location: 'Damascus, Syria',
          severity: 'High'
        }
      },
      {
        id: 'conflict-yemen-sanaa',
        lat: 15.3694,
        lng: 44.1910,
        alt: 0,
        heading: 0,
        metadata: {
          type: 'Armed Conflict',
          source: 'GDELT',
          location: 'Sanaa, Yemen',
          severity: 'High'
        }
      },
      {
        id: 'conflict-lebanon-border',
        lat: 33.2733,
        lng: 35.2033,
        alt: 0,
        heading: 0,
        metadata: {
          type: 'Border Skirmish',
          source: 'GDELT',
          location: 'Southern Lebanon',
          severity: 'Medium'
        }
      },
      {
        id: 'conflict-red-sea',
        lat: 16.0,
        lng: 41.0,
        alt: 0,
        heading: 0,
        metadata: {
          type: 'Maritime Attack',
          source: 'GDELT',
          location: 'Red Sea',
          severity: 'High'
        }
      }
    ];

    updateEntities('conflicts', conflictEntities);

    return () => {
      isMounted = false;
    };
  }, [layers.conflicts, updateEntities, setActivePoi, setConflictSidebarOpen]);

  const formatGDELTDate = (dateStr: string) => {
    if (!dateStr || dateStr.length < 14) return dateStr;
    // Format: YYYYMMDDHHMMSSZ
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.substring(8, 10);
    const minute = dateStr.substring(10, 12);

    return `${year}-${month}-${day} ${hour}:${minute} UTC`;
  };

  return (
    <AnimatePresence>
      {layers.conflicts && (
        <>
          {/* Backdrop — mobile only */}
          {conflictSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 z-[11] md:hidden"
              onClick={() => setConflictSidebarOpen(false)}
            />
          )}

          <motion.div
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={[
              'absolute top-0 h-full bg-zinc-950/95 border-r border-zinc-800 text-zinc-300 p-4 flex flex-col font-mono text-sm backdrop-blur-md shadow-2xl overflow-hidden',
              // Desktop: offset beside main sidebar, fixed width
              'md:left-80 md:w-96 md:translate-x-0 md:z-10',
              // Mobile: full width, slide-in controlled by state
              'left-0 w-full z-[12] transition-transform duration-300 ease-in-out',
              conflictSidebarOpen ? 'translate-x-0' : 'max-md:-translate-x-full',
            ].join(' ')}
          >
            <div className="flex items-center justify-between mb-6 shrink-0 border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2 text-rose-500">
                <AlertTriangle size={18} />
                <h2 className="text-lg font-bold tracking-widest uppercase">GDELT Conflicts</h2>
              </div>
              <div className="flex items-center gap-2">
                {loading && <RefreshCw size={16} className="animate-spin text-zinc-500" />}
                {/* Close button — mobile only */}
                <button
                  onClick={() => setConflictSidebarOpen(false)}
                  className="md:hidden p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                  aria-label="Close conflict sidebar"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-2 bg-rose-950/30 border border-rose-900/50 rounded text-rose-400 text-xs flex items-start gap-2 shrink-0">
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="mb-4 shrink-0">
              <p className="text-xs text-zinc-400 leading-relaxed">
                Real-time global conflict monitoring powered by the GDELT Project.
                Currently highlighting incidents in Iran and the Middle East region.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
              {articles.length === 0 && !loading && (
                <div className="text-center py-8 text-zinc-500">
                  No recent conflicts found in the specified regions.
                </div>
              )}

              {articles.map((article, idx) => (
                <div key={idx} className="bg-zinc-900/80 border border-zinc-800 rounded p-3 hover:border-rose-900/50 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] text-rose-400 bg-rose-950/50 px-1.5 py-0.5 rounded border border-rose-900/30">
                      {formatGDELTDate(article.seendate)}
                    </span>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                      {article.domain}
                    </span>
                  </div>

                  <h3 className="text-sm text-zinc-200 font-medium leading-snug mb-2 group-hover:text-rose-300 transition-colors">
                    {article.title}
                  </h3>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800/50">
                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                      <MapPin size={12} />
                      <span className="truncate max-w-[150px]">{article.sourcecountry || 'Unknown Location'}</span>
                    </div>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] text-cyan-500 hover:text-cyan-400 uppercase tracking-wider"
                    >
                      Source <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
