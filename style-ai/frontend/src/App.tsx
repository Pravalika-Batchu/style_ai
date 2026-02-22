import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const OCCASIONS = ["Office", "Wedding", "Reception", "Ball / Gala", "College", "Party", "Festive", "Casual"];
const AESTHETICS = ["Indian Traditional", "Modern Indian", "Bridal", "Western Formal", "Boho", "Modest", "Minimalist", "Street Style", "Regal"];

function App() {
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [styling, setStyling] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [occasion, setOccasion] = useState("Casual");
  const [aesthetic, setAesthetic] = useState("Minimalist");
  const [preferences, setPreferences] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError("Failed to analyze image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateStyle = async () => {
    if (!analysis) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:5000/style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skin_tone: analysis.skin_tone,
          season: analysis.season,
          undertone: analysis.undertone,
          occasion,
          aesthetic,
          preferences
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Styling failed");

      const parsedStyling = typeof data === 'string' ? JSON.parse(data) : data;
      setStyling(parsedStyling);

      setTimeout(() => {
        document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error("Styling failed:", err);
      setError(err.message || "Something went wrong. Please check your API key.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefine = async (idx: number, feedback: string) => {
    if (!analysis || !styling) return;
    setLoading(true);
    setError(null);
    const outfit = styling.outfit_recommendations[idx];

    try {
      const res = await fetch('http://localhost:5000/refine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skin_tone: analysis.skin_tone,
          season: analysis.season,
          undertone: analysis.undertone,
          occasion,
          aesthetic,
          feedback,
          previous_name: outfit["Outfit Name"]
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Refinement failed");

      const newOutfit = typeof data === 'string' ? JSON.parse(data) : data;
      const newRecommendations = [...styling.outfit_recommendations];
      newRecommendations[idx] = newOutfit;
      setStyling({ ...styling, outfit_recommendations: newRecommendations });
    } catch (err: any) {
      console.error("Refine failed:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-grid bg-[#080808]">
      {/* SIDEBAR */}
      <aside className="border-r border-white/5 bg-[#0a0a0a] p-8 flex flex-col h-screen overflow-y-auto sticky top-0">
        <div className="mb-12">
          <h1 className="text-3xl font-black grad-text tracking-tighter mb-1">StyleAI</h1>
          <p className="text-caption">The Intelligence of Style</p>
        </div>

        <div className="space-y-10 flex-1">
          {/* UPLOAD BOX */}
          <section>
            <p className="text-caption mb-4">Identity Capture</p>
            <label className="block aspect-square w-full rounded-2xl border border-dashed border-white/10 hover:border-[#C5A059]/50 transition-all cursor-pointer overflow-hidden relative group">
              <input type="file" onChange={handleImageUpload} className="hidden" />
              {preview ? (
                <img src={preview} alt="Upload" className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-40 group-hover:opacity-100 transition-opacity">
                  <span className="text-2xl mb-2">📸</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest">Initialize Scan</span>
                </div>
              )}
            </label>
          </section>

          {/* ANALYSIS DATA */}
          <AnimatePresence>
            {analysis && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <p className="text-caption">Biometric Analysis</p>
                {[
                  { k: "Tone", v: analysis.skin_tone },
                  { k: "Season", v: analysis.season },
                  { k: "Base", v: analysis.hex },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-gray-500">{item.k}</span>
                    <span className="text-xs font-bold text-[#C5A059]">{item.v}</span>
                  </div>
                ))}
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] text-red-500 font-bold uppercase tracking-widest leading-relaxed">
            ⚠️ {error}
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <main className="p-8 lg:p-20 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <motion.header
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-16"
          >
            <h2 className="text-6xl lg:text-8xl text-display mb-6 grad-text">Studio<br />Curation.</h2>
            <p className="text-gray-500 text-lg font-medium max-w-xl leading-relaxed">
              Enter your context below. Our neural engine will synthesize high-fashion catalogs aligned with your biometric signature.
            </p>
          </motion.header>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
            <div className="space-y-10">
              <div>
                <p className="text-caption mb-6">Select Context</p>
                <div className="flex flex-wrap gap-2">
                  {OCCASIONS.map(o => (
                    <button
                      key={o}
                      onClick={() => setOccasion(o)}
                      className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${occasion === o ? 'bg-[#C5A059] text-black' : 'bg-white/5 text-gray-500 hover:text-white border border-white/5'}`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-caption mb-6">Define Aesthetic</p>
                <div className="flex flex-wrap gap-2">
                  {AESTHETICS.map(a => (
                    <button
                      key={a}
                      onClick={() => setAesthetic(a)}
                      className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${aesthetic === a ? 'bg-[#C5A059] text-black' : 'bg-white/5 text-gray-500 hover:text-white border border-white/5'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <p className="text-caption mb-6">Refinement Constraints</p>
                <input
                  type="text"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="E.G. SILK TOUCH, MINIMALIST JEWELRY, MONOCHROME..."
                  className="w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-5 focus:outline-none focus:border-[#C5A059]/30 text-xs font-bold uppercase tracking-widest transition-all"
                />
              </div>

              <button
                onClick={generateStyle}
                disabled={!analysis || loading}
                className="mt-10 btn-premium w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs disabled:opacity-10"
              >
                {loading ? 'Synthesizing...' : 'Generate Catalog'}
              </button>
            </div>
          </section>

          <div id="results-section">
            <AnimatePresence>
              {styling && (
                <motion.section
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pt-20 border-t border-white/5"
                >
                  <div className="flex flex-col lg:flex-row justify-between items-baseline mb-16 gap-4">
                    <h3 className="text-5xl lg:text-7xl text-display italic grad-text">{styling["Style DNA"]}</h3>
                    <div className="flex gap-8">
                      <div className="text-right">
                        <p className="text-caption mb-1 text-[#C5A059]">Optimum</p>
                        <p className="text-xs font-black uppercase italic">{styling["Top 3 Colors to wear"]?.slice(0, 2).join(" / ")}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-caption mb-1 text-red-500/50">Avoid</p>
                        <p className="text-xs font-black uppercase italic text-red-500/80">{styling["1 Color to avoid"]}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {styling.outfit_recommendations?.map((outfit: any, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="studio-glass p-8 rounded-3xl outfit-card"
                      >
                        <div className="flex justify-between items-start mb-8">
                          <h4 className="text-2xl font-black tracking-tighter uppercase grad-text">{outfit["Outfit Name"]}</h4>
                          <div className="flex gap-4">
                            <button onClick={() => handleRefine(idx, "Love this")} className="text-xs opacity-40 hover:opacity-100 hover:text-[#C5A059] transition-all">LIKE</button>
                            <button onClick={() => handleRefine(idx, "Try again")} className="text-xs opacity-40 hover:opacity-100 hover:text-white transition-all">REFINE</button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-10 border-l border-white/10 pl-6">
                          <div><p className="text-caption mb-1">Top</p><p className="text-xs font-bold uppercase">{outfit.Top}</p></div>
                          <div><p className="text-caption mb-1">Bottom</p><p className="text-xs font-bold uppercase">{outfit.Bottom}</p></div>
                          <div><p className="text-caption mb-1">Shoes</p><p className="text-xs font-bold uppercase">{outfit.Shoes}</p></div>
                          <div><p className="text-caption mb-1">Accents</p><p className="text-xs font-bold uppercase">{outfit.Accessories}</p></div>
                        </div>

                        <p className="text-[11px] text-gray-500 font-medium italic leading-relaxed mb-8">
                          {outfit["Style Explanation"]}
                        </p>

                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(outfit["Shopping Search Terms"])}`}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-center py-4 rounded-xl bg-white/5 border border-white/5 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#C5A059] hover:text-black transition-all"
                        >
                          Acquire Catalog Item
                        </a>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
