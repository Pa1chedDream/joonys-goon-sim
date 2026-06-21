import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, 
  History, 
  Award, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Send, 
  Volume2, 
  RefreshCw, 
  Tv, 
  MessageSquare, 
  TrendingUp, 
  Search, 
  HelpCircle, 
  GraduationCap, 
  Flame, 
  ArrowLeft,
  X,
  FileText,
  Lock,
  Sparkles,
  Gamepad2,
  Play
} from "lucide-react";
import { Artwork, AnalysisEvaluation, LeaderboardEntry } from "./types";
const joonyAvatar = "https://i.imgur.com/RW5sg2R_d.webp?maxwidth=760&fidelity=grand";

// Dynamic pre-populated mock chat messages for a true German Twitch Chat experience
const streamChatsInitial = [
  { id: 1, user: "KaiserWilhelm_Fan", text: "Endlich wieder Geschichts-Analyse! PogChamp", badge: "sub" },
  { id: 2, user: "Lara_Mandy", text: "Joony, bewertest du heute die Romantik?", badge: "mod" },
  { id: 3, user: "KevinOstfront", text: "Bismarck war einfach ein Gigachad damals, ungelogen", badge: "none" },
  { id: 4, user: "HistoryNerd99", text: "Der Schrei von Munch geht unter die Haut, wildes Bild", badge: "sub" },
  { id: 5, user: "StreamEnjoyer", text: "Hype!! Joony is live!", badge: "none" }
];

export default function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [gameState, setGameState] = useState<"start" | "game">("start");
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [activeTab, setActiveTab] = useState<"game" | "leaderboard" | "info">("game");
  const [username, setUsername] = useState<string>(() => {
    return localStorage.getItem("joony_user") || "Macher_Schüler_" + Math.floor(Math.random() * 900 + 100);
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [analysisText, setAnalysisText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<AnalysisEvaluation | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<"All" | "Geschichte" | "Deutsch">("All");
  const [hintOpen, setHintOpen] = useState(false);
  const [streamChats, setStreamChats] = useState(streamChatsInitial);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [imgZoomed, setImgZoomed] = useState(false);
  const [chatMode, setChatMode] = useState<"simulated" | "real">("simulated");
  const [hostname, setHostname] = useState("");
  const [twitchChannel, setTwitchChannel] = useState<string>(() => {
    return localStorage.getItem("joony_twitch_channel") || "mainjoony";
  });
  const [isEditingTwitchChannel, setIsEditingTwitchChannel] = useState(false);
  const [tempTwitchChannel, setTempTwitchChannel] = useState("");

  // Slot Machine states
  const [isSlotOpen, setIsSlotOpen] = useState(false);
  const [isSlotSpinning, setIsSlotSpinning] = useState(false);
  const [slotCurrentArt, setSlotCurrentArt] = useState<Artwork | null>(null);
  const [slotWinnerArt, setSlotWinnerArt] = useState<Artwork | null>(null);

  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Fetch initial artworks and leaderboard
  useEffect(() => {
    fetchArtworks();
    fetchLeaderboard();
    if (typeof window !== "undefined") {
      setHostname(window.location.hostname);
    }
  }, []);

  // Sync username to localstorage
  useEffect(() => {
    localStorage.setItem("joony_user", username);
  }, [username]);

  // Sync twitch channel to localstorage
  useEffect(() => {
    localStorage.setItem("joony_twitch_channel", twitchChannel);
  }, [twitchChannel]);

  // Infinite Twitch Chat simulator while on the artwork page!
  useEffect(() => {
    if (!selectedArtwork) return;

    const chatTemplates = [
      { user: "FühlIchExtrem", text: "Schreibe mal über die Rückenfigur, bruder!", badge: "none" },
      { user: "MemeLord", text: "Note 6 kommt gleich LUL", badge: "none" },
      { user: "GefühlsMensch", text: "Romantik ist der beste Deutschstoff tbh", badge: "sub" },
      { user: "ZensurOpfer", text: "Zensur-Club deklassiert Meinungsfreiheit damals, echt traurig", badge: "none" },
      { user: "JoonyMod", text: "Kein Spam im Chat! Wir analysieren hier wissenschaftlich!", badge: "mod" },
      { user: "HistorikerBock", text: "Die Trikolore steht für Freiheit, Gleichheit, Brüderlichkeit!", badge: "sub" },
      { user: "GamerGott", text: "Bismarck entlassen war der größte Fehler Wilhelms II.", badge: "none" },
      { user: "MunchFan", text: "Das ist expressionistische Seelenqual pur!", badge: "none" },
      { user: "Schüler_2026", text: "Habe Angst vor Joonys Rüge. Er zieht immer so streng ab.", badge: "sub" },
      { user: "MacherAbgabe", text: "Macher gibt gleich ab! Drück die Daumen!", badge: "none" },
    ];

    const interval = setInterval(() => {
      const template = chatTemplates[Math.floor(Math.random() * chatTemplates.length)];
      const newChat = {
        id: Date.now() + Math.random(),
        user: template.user,
        text: template.text,
        badge: template.badge
      };
      setStreamChats(prev => {
        const sliced = prev.length > 25 ? prev.slice(prev.length - 20) : prev;
        return [...sliced, newChat];
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [selectedArtwork]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [streamChats]);

  const fetchArtworks = async () => {
    try {
      const res = await fetch("/api/artworks");
      const data = await res.json();
      setArtworks(data);
    } catch (e) {
      console.error("Artworks fetch failed", e);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      const data = await res.json();
      setLeaderboard(data);
    } catch (e) {
      console.error("Leaderboard fetch failed", e);
    }
  };

  const startAnalysis = (artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setAnalysisText("");
    setEvaluation(null);
    setHintOpen(false);
    // Restart chat
    setStreamChats([
      { id: 1, user: "JoonyMod", text: `Willkommen im Stream! Joony bewertet jetzt: "${artwork.title}"!`, badge: "mod" },
      { id: 2, user: "Analyse_Fanatiker", text: "Viel Glück beim Aufsatz schreiben! Mach uns Stolz!", badge: "sub" },
      ...streamChatsInitial
    ]);
  };

  const handleAbgabe = async () => {
    if (!selectedArtwork) return;
    if (analysisText.trim().length < 20) {
      triggerNotification("⚠️ Deine Analyse ist viel zu kurz! Schreib mindestens ein paar fundierte Sätze, Bruder!");
      return;
    }

    setIsSubmitting(true);
    triggerNotification("🚀 Analyse wird an Lehrer Joony übertragen... Er liest es sich gerade im Stream durch!");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artworkId: selectedArtwork.id,
          analysisText
        })
      });

      if (!response.ok) {
        throw new Error("HTTP Fehler auf dem Server");
      }

      const evalData: AnalysisEvaluation = await response.json();
      setEvaluation(evalData);

      // Trigger chat reactions based on how good the evaluation was
      setTimeout(() => {
        const chatsToAdd = [];
        if (evalData.score >= 85) {
          chatsToAdd.push(
            { id: Date.now() + 1, user: "LulBot", text: "OHA! EINSER-SCHÜLER IN DA HOUSE! 🔥🔥🔥", badge: "sub" },
            { id: Date.now() + 2, user: "Nerd_X", text: "Wow, vollste Ehrfurcht vor dieser Analyse!", badge: "none" },
            { id: Date.now() + 3, user: "JoonyMod", text: "Joony klopft auf den Tisch! Stabil!", badge: "mod" }
          );
        } else if (evalData.score >= 60) {
          chatsToAdd.push(
            { id: Date.now() + 1, user: "StandardBoy", text: "Joah, ganz solide Leistung! Note 3 passt.", badge: "none" },
            { id: Date.now() + 2, user: "HistoryGamer", text: "Metternich nickt gutmütig im Sarkophag", badge: "sub" }
          );
        } else {
          chatsToAdd.push(
            { id: Date.now() + 1, user: "MemeKing", text: "RIP BRUDER! Ab in die Nachmittags-Nachhilfe LUL", badge: "none" },
            { id: Date.now() + 2, user: "Lara_Mandy", text: "Autsch, das tat weh zu lesen, aber Kopf hoch!", badge: "mod" },
            { id: Date.now() + 3, user: "GamerGott", text: "F im Chat für unseren gefallenen Bruder", badge: "none" }
          );
        }
        setStreamChats(prev => [...prev, ...chatsToAdd]);
      }, 1200);

      // Post score to leaderboard automatically
      await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          artworkTitle: selectedArtwork.title,
          artworkId: selectedArtwork.id,
          subject: selectedArtwork.subject,
          score: evalData.score,
          grade: evalData.grade
        })
      });

      // Refetch leaderboard
      fetchLeaderboard();

    } catch (e) {
      console.error(e);
      triggerNotification("❌ Server-Fehler beim Graden. Probiere es noch einmal!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const triggerNotification = (msg: string) => {
    setShowNotification(msg);
    setTimeout(() => {
      setShowNotification(null);
    }, 4500);
  };

  const speakText = (text: string) => {
    if (!window.speechSynthesis) {
      triggerNotification("🔊 Sprachausgabe wird von deinem Browser nicht unterstützt.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "de-DE";
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
    triggerNotification("📣 Joony spricht gerade laut vor...");
  };

  const triggerSlotMachine = () => {
    if (artworks.length === 0) return;
    setIsSlotOpen(true);
    setIsSlotSpinning(true);
    setSlotWinnerArt(null);

    // Dynamic progressive slow-down sequence to mimic physical slot rolling:
    const delays = [
      60, 60, 60, 60, 60, 65, 65, 70, 75, 80, 90, 100, 115, 130, 150, 180, 220, 260, 310, 370, 440, 520
    ];
    let step = 0;

    const runStep = () => {
      if (step < delays.length) {
        // Shuffle through random artworks to show action in the display window
        setSlotCurrentArt((prev) => {
          const others = artworks.filter((a) => (prev ? a.id !== prev.id : true));
          return others[Math.floor(Math.random() * others.length)] || artworks[0];
        });
        setTimeout(runStep, delays[step]);
        step++;
      } else {
        // Pick the actual random landing result
        const winner = artworks[Math.floor(Math.random() * artworks.length)];
        setSlotCurrentArt(winner);
        setSlotWinnerArt(winner);
        setIsSlotSpinning(false);

        // Add fun live-chat comments regarding the roll outcome
        const chatComments = [
          { id: Date.now() + 10, user: "KaiserWilhelm_Fan", text: `🎰 JACKPOT! "${winner.title}" wurde gerollt! 🔥`, badge: "sub" },
          { id: Date.now() + 20, user: "JoonyMod", text: "Die Walzen haben entschieden! Schreibt fleißig, Brudis!", badge: "mod" },
          { id: Date.now() + 30, user: "KevinOstfront", text: `${winner.title} ist ein absoluter Klassiker, das kriegst du hin!`, badge: "none" }
        ];
        setStreamChats((prev) => [...prev, ...chatComments]);
      }
    };

    runStep();
  };

  const filteredArtworks = artworks.filter(a => {
    if (selectedSubjectFilter === "All") return true;
    return a.subject === selectedSubjectFilter;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white" id="joonys_main">
      
      {gameState === 'start' ? (
        <div className="flex-grow flex flex-col items-center justify-center relative overflow-hidden bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-zinc-950 to-zinc-950" id="start_screen">
          {/* Animated Background effects */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-600/10 rounded-full blur-[120px] animate-pulse delay-700"></div>

          <div className="z-10 text-center space-y-12 max-w-2xl px-6">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-zinc-900/80 border border-zinc-800 px-4 py-2 rounded-2xl shadow-xl">
                <Gamepad2 className="h-5 w-5 text-purple-400" />
                <span className="text-xs font-bold tracking-[0.2em] text-zinc-400 uppercase">Interactive Arcade Experience</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white">
                <span className="block italic text-zinc-500 text-2xl md:text-3xl font-medium tracking-normal mb-[-10px]">Hr.</span>
                <span className="bg-gradient-to-br from-white via-zinc-400 to-zinc-600 bg-clip-text text-transparent">JOONY</span>
                <span className="block text-4xl md:text-5xl bg-gradient-to-r from-purple-400 to-rose-400 bg-clip-text text-transparent mt-2">SIMULATOR</span>
              </h1>
            </div>

            <div className="flex flex-col items-center space-y-6">
               <button 
                onClick={() => setGameState('game')}
                className="group relative inline-flex items-center justify-center px-12 py-6 font-bold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-rose-600 rounded-3xl hover:from-purple-500 hover:to-rose-500 shadow-[0_0_40px_-5px_rgba(147,51,234,0.3)] hover:shadow-[0_0_60px_-5px_rgba(147,51,234,0.5)] transform hover:scale-105 active:scale-95"
                id="btn_start_game"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-rose-500 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center space-x-3">
                  <Play className="h-6 w-6 fill-current transition-transform group-hover:scale-110" />
                  <span className="text-xl tracking-tight uppercase">Singleplayer</span>
                </div>
              </button>

              <p className="text-zinc-500 text-xs font-medium max-w-xs mx-auto leading-relaxed">
                Tauche ein in das Universum von Lehrer Joony. Analysiere Kunst, sammle Punkte und werde zum ultimativen Macher.
              </p>
            </div>

            {/* Version / Credits tag */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-2 text-[10px] text-zinc-700 font-bold uppercase tracking-widest">
              <span>Build v2026.06.21</span>
              <span className="h-1 w-1 rounded-full bg-zinc-800"></span>
              <span>Cloud Engine v3.5</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Toast Notification Banner */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-50 bg-purple-900 border border-purple-500 rounded-lg shadow-2xl p-4 flex items-center space-x-3 text-sm animate-fade-in text-white max-w-md" id="notification_toast">
          <MessageSquare className="h-5 w-5 text-purple-300 shrink-0" />
          <span>{showNotification}</span>
          <button onClick={() => setShowNotification(null)} className="hover:text-purple-300">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Primary Top Bar */}
      <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md sticky top-0 z-30 px-4 md:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4" id="primary_header">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => { setSelectedArtwork(null); setEvaluation(null); }}>
          <div className="bg-gradient-to-tr from-purple-600 to-crimson-600 h-10 w-10 rounded-xl flex items-center justify-center shadow-lg shadow-purple-900/30">
            <Tv className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-black bg-gradient-to-r from-purple-400 via-rose-400 to-amber-300 bg-clip-text text-transparent tracking-tight">
              HR. JOONY SIMULATOR
            </span>
            <div className="text-[10px] text-zinc-500 tracking-widest uppercase font-semibold">
              Live aus dem Deutsch- & Geschichtsstudio
            </div>
          </div>
        </div>

        {/* User profile configuration */}
        <div className="flex items-center space-x-3 bg-zinc-900/80 p-2 rounded-xl border border-zinc-800">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-teal-500 to-indigo-500 flex items-center justify-center font-bold text-xs text-white">
            {username.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <div className="text-[10px] text-zinc-500 uppercase font-semibold">Dein Streamer-Name</div>
            {isEditingName ? (
              <div className="flex items-center space-x-1 mt-0.5">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => { if (e.key === "Enter") setIsEditingName(false); }}
                  className="bg-zinc-800 border border-purple-500 rounded px-1.5 py-0.5 text-xs text-white outline-none w-28"
                  autoFocus
                />
                <button 
                  onClick={() => setIsEditingName(false)} 
                  className="text-[10px] px-1 bg-purple-700 text-white rounded hover:bg-purple-600"
                >
                  OK
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-zinc-300 hover:text-white cursor-pointer" onClick={() => setIsEditingName(true)}>
                  {username}
                </span>
                <span className="text-[9px] px-1 bg-zinc-800 border border-zinc-700 rounded text-zinc-400 hover:text-white cursor-pointer" onClick={() => setIsEditingName(true)}>
                  Ändern
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Tabs navigation */}
      <div className="bg-zinc-900/50 border-b border-zinc-800/80 flex items-center justify-center py-2 space-x-2" id="nav_tabs">
        <button
          onClick={() => { setActiveTab("game"); setSelectedArtwork(null); setEvaluation(null); }}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
            activeTab === "game"
              ? "bg-purple-600 text-white shadow-md shadow-purple-900/20"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
          id="btn_tab_game"
        >
          <GraduationCap className="h-4 w-4" />
          <span>Klassenzimmer</span>
        </button>
        <button
          onClick={() => { setActiveTab("leaderboard"); }}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
            activeTab === "leaderboard"
              ? "bg-purple-600 text-white shadow-md shadow-purple-900/20"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
          id="btn_tab_leaderboard"
        >
          <Award className="h-4 w-4" />
          <span>Bestenliste</span>
        </button>
        <button
          onClick={() => { setActiveTab("info"); }}
          className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
            activeTab === "info"
              ? "bg-purple-600 text-white shadow-md shadow-purple-900/20"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
          id="btn_tab_info"
        >
          <HelpCircle className="h-4 w-4" />
          <span>Spielregeln & Joony</span>
        </button>
      </div>

      {/* Core Pages Container */}
      <main className="flex-grow p-4 md:p-8 max-w-7xl w-full mx-auto" id="main_content_area">
        
        {/* TAB 1: KLASSENZIMMER / GAMING */}
        {activeTab === "game" && (
          <>
            {/* 1.1 Artwork Selection List (Home Screen) */}
            {!selectedArtwork && (
              <div className="space-y-8 animate-fade-in" id="artwork_selection_screen">
                
                {/* Hero Showcase Intro with Joony */}
                <div className="bg-gradient-to-r from-zinc-900 via-purple-950/20 to-zinc-900 rounded-3xl p-6 md:p-8 border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden" id="hero_intro">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="space-y-3 z-10 max-w-xl text-center md:text-left">
                    <div className="inline-flex items-center space-x-2 bg-purple-950/60 text-purple-300 border border-purple-800 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                      <Flame className="h-3 w-3 text-orange-400 animate-pulse" />
                      <span>Lehrer Joonys Spezial-Unterricht</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                      Joonys Kunst-Lotterie!
                    </h1>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      In diesem Modus entscheidet der pure Zufall, welches Bild du analysieren darfst! Ziehe am Hebel der Slot-Machine oder drücke auf <strong>"Jetzt drehen"</strong>, um deine nächste Analyse-Herausforderung zu errollen. Schaffst du bei Lehrer Joony die Bestnote?
                    </p>
                  </div>

                  <div className="flex bg-zinc-900 border border-zinc-800 p-4 rounded-2xl items-center space-x-4 max-w-sm shrink-0 shadow-lg">
                    {/* Character Avatar */}
                    <div className="relative">
                      <div className="h-16 w-16 rounded-2xl border-2 border-purple-500 overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${joonyAvatar})` }}>
                        {/* Streamer Avatar */}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-red-600 text-white font-black text-[8px] px-1 py-0.5 rounded leading-none">LIVE</div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-bold text-sm text-purple-300 flex items-center gap-1.5">
                        <span>Joony</span>
                        <span className="text-[10px] text-zinc-500">@mainjoony</span>
                      </div>
                      <p className="text-[11px] text-zinc-400 italic">"In the jungle, the mighty jungle..."</p>
                    </div>
                  </div>
                </div>

                {/* 🎰 THE ONLY SLOT MACHINE MODE VIEW 🎰 */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="slot_machine_main_mode">
                  
                  {/* Left Column: Outer Arcade Cabinet Case */}
                  <div className="lg:col-span-5 bg-zinc-900 border-4 border-pink-500/80 rounded-3xl p-6 relative shadow-2xl shadow-purple-950/40 flex flex-col items-center">
                    
                    {/* Retro physical arcade details */}
                    <div className="absolute top-2 left-6 right-6 flex justify-between text-[8px] text-zinc-650 font-mono tracking-widest select-none">
                      <span>CABINET MODEL J-2026</span>
                      <span>INSERT COIN PLAY ONLY</span>
                    </div>

                    {/* Slot Header */}
                    <div className="text-center space-y-1 mt-2 mb-4 select-none w-full">
                      <div className="text-yellow-400 text-[10px] font-black tracking-widest uppercase animate-pulse">
                        ★ LEHRER JOONYS WEB-BINGO ★
                      </div>
                      <h2 className="text-2xl font-black bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-400 bg-clip-text text-transparent tracking-tight">
                        KUNST-LOTTERIE
                      </h2>
                      <p className="text-[11px] text-zinc-400 font-medium">Erhalte ein zufälliges Gemälde zur Analyse!</p>
                    </div>

                    {/* Vintage Slot Cabinet Viewport */}
                    <div className="w-full bg-zinc-950 border-4 border-purple-600/80 rounded-2xl p-4 flex flex-col items-center relative overflow-hidden shadow-inner select-none mb-5">
                      
                      {/* Scanline pattern overlay */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20"></div>
                      
                      {/* Inner Slot Glass Box */}
                      <div className="w-full h-56 bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden relative flex items-center justify-center">
                        {slotCurrentArt ? (
                          <div className={`w-full h-full flex flex-col items-center justify-center transition-all ${isSlotSpinning ? "blur-[2px] scale-95" : "scale-100 duration-300"}`}>
                            <img 
                              src={slotCurrentArt.imageUrl} 
                              alt={slotCurrentArt.title} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover opacity-80"
                            />
                            {/* Shadow barrier */}
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent"></div>
                          </div>
                        ) : (
                          <div className="text-center p-6 space-y-3">
                            <div className="text-pink-500 animate-bounce">
                              <Sparkles className="h-10 w-10 mx-auto" />
                            </div>
                            <div className="text-zinc-400 text-sm font-semibold uppercase tracking-wide">Bereit zum Drehen!</div>
                            <p className="text-zinc-650 text-xs px-2">Zieh am Hebel rechts oder klicke den Button unten, um deine Ziehung zu starten!</p>
                          </div>
                        )}
                        
                        {/* Pointer triangles */}
                        <div className="absolute left-2 top-1/2 -translate-y-1/2 text-pink-500 font-bold text-lg animate-bounce">▶</div>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-pink-500 font-bold text-lg animate-bounce">◀</div>

                        {/* Floating subject badge inside slot */}
                        {slotCurrentArt && (
                          <div className="absolute top-3 left-3">
                            <span className={`text-[10px] uppercase tracking-wider font-extrabold px-3 py-1 rounded-full border shadow-lg ${
                              slotCurrentArt.subject === "Geschichte" 
                                ? "bg-yellow-950/95 text-yellow-300 border-yellow-700" 
                                : "bg-purple-950/95 text-purple-300 border-purple-700"
                            }`}>
                              {slotCurrentArt.subject}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Title display bar on Slot */}
                      <div className="w-full mt-4 bg-zinc-900 border border-zinc-805 rounded-lg p-2 text-center h-16 flex flex-col justify-center">
                        {slotCurrentArt ? (
                          <>
                            <div className="text-[10px] text-zinc-500 font-semibold">{slotCurrentArt.artist} ({slotCurrentArt.year})</div>
                            <div className={`text-sm font-black px-1 truncate leading-tight ${isSlotSpinning ? "text-zinc-400 opacity-60" : "text-yellow-400"}`}>
                              {slotCurrentArt.title}
                            </div>
                          </>
                        ) : (
                          <span className="text-zinc-500 text-xs text-center">Kein Bild geladen - Bitte am Hebel ziehen</span>
                        )}
                      </div>
                    </div>

                    {/* Interaction Cabinet Controls */}
                    <div className="w-full space-y-4">
                      {isSlotSpinning ? (
                        <button
                          disabled
                          className="w-full bg-zinc-800 text-zinc-400 border border-zinc-700 font-bold py-3 px-6 rounded-xl text-xs flex items-center justify-center space-x-2 cursor-not-allowed uppercase tracking-wider animate-pulse"
                        >
                          <RefreshCw className="h-4 w-4 animate-spin text-purple-400" />
                          <span>Walzen rotieren...</span>
                        </button>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <button
                            onClick={triggerSlotMachine}
                            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 hover:from-purple-500 hover:via-pink-500 hover:to-yellow-400 text-white font-extrabold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-lg shadow-purple-950/40 active:scale-[0.98] hover:scale-[1.01]"
                          >
                            <span>🎰 {slotWinnerArt ? "Nochmal rollen (Reroll)" : "Jetzt drehen (Roll)"}</span>
                          </button>

                          {slotWinnerArt && (
                            <button
                              onClick={() => {
                                startAnalysis(slotWinnerArt);
                              }}
                              className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold py-3.5 px-6 rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/50 transition-all transform hover:scale-[1.01] animate-bounce mt-1"
                            >
                              <span>Hier Analyse starten! 📝</span>
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Decorative Lever Arm on the right of the cabinet for realism */}
                    <div 
                      className="absolute right-[-24px] top-[40%] h-32 w-4 cursor-pointer hidden md:flex flex-col items-center select-none"
                      onClick={() => { if (!isSlotSpinning) triggerSlotMachine(); }}
                    >
                      {/* Lever node stick */}
                      <div className={`w-2 bg-gradient-to-r from-zinc-400 to-zinc-600 border border-zinc-700 transition-all origin-bottom rounded-t`}
                        style={{ 
                          height: '80px',
                          transform: isSlotSpinning ? 'rotateX(85deg) translateY(10px)' : 'rotateX(0deg)' 
                        }}
                      />
                      {/* Lever red ball candy */}
                      <div className="h-6 w-6 rounded-full bg-red-600 border border-red-700 shadow-md transform -translate-y-2 active:scale-95 transition-transform" />
                    </div>

                  </div>

                  {/* Right Column: Catalog List (Read-only, Locked display) */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h3 className="font-bold text-lg text-white flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-yellow-500" />
                            <span>Mögliche Gemälde & Karikaturen</span>
                          </h3>
                          <p className="text-xs text-zinc-500">Diese Meisterwerke befinden sich in der Slot-Trommel:</p>
                        </div>
                        <span className="text-[10px] bg-zinc-800 text-zinc-400 border border-zinc-700 px-3 py-1 rounded font-mono">
                          {artworks.length} geladene Motive
                        </span>
                      </div>

                      {/* Display small row list of locked documents */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {artworks.map((art) => (
                          <div 
                            key={art.id} 
                            className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3 flex items-center space-x-3 relative opacity-85 hover:opacity-100 transition-all"
                          >
                            <div className="h-16 w-16 rounded-lg overflow-hidden bg-zinc-900 shrink-0 border border-zinc-800 relative">
                              <img 
                                src={art.imageUrl} 
                                alt={art.title} 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover grayscale opacity-50"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Lock className="h-4 w-4 text-zinc-400" />
                              </div>
                            </div>
                            <div className="space-y-0.5 min-w-0 flex-1">
                              <span className={`text-[8px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded border inline-block ${
                                art.subject === "Geschichte" 
                                  ? "bg-yellow-950/80 text-yellow-400 border-yellow-850" 
                                  : "bg-purple-950/80 text-purple-400 border-purple-850"
                              }`}>
                                {art.subject}
                              </span>
                              <h4 className="text-xs font-bold text-zinc-300 truncate" title={art.title}>{art.title}</h4>
                              <p className="text-[10px] text-zinc-500 truncate">Künstler: {art.artist}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 text-xs text-zinc-400 space-y-2 leading-relaxed">
                        <p className="font-semibold text-zinc-300 flex items-center gap-1">
                          <span className="text-pink-500">💡</span>
                          <span>Wie läuft die Kunst-Lotterie ab?</span>
                        </p>
                        <p>
                          1. Klicke auf <strong>"Jetzt drehen"</strong> oder ziehe am Hebel links, um die Trommel in Bewegung zu setzen.
                        </p>
                        <p>
                          2. Die Walzen laufen erst schnell und verlangsamen sich dann mechanisch, bis sie auf einem Kunstwerk stoppen.
                        </p>
                        <p>
                          3. Hast du ein Bild erwischt, schaltet sich die Schaltfläche <strong>"Hier Analyse starten!"</strong> frei.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 1.2 Active Game Analysis Studio Workspace */}
            {selectedArtwork && !evaluation && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in" id="analysis_workspace">
                
                {/* Back button Row */}
                <div className="lg:col-span-12 flex items-center justify-between">
                  <button 
                    onClick={() => setSelectedArtwork(null)} 
                    className="flex items-center space-x-2 text-xs text-zinc-400 hover:text-white bg-zinc-900 px-3.5 py-2 rounded-xl border border-zinc-800"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Zurück zur Übersicht</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-bold text-emerald-400">Joony schaut zu</span>
                  </div>
                </div>

                {/* Left Side: Artwork Visual Stage & Simulated Stream */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* The Image Canvas with Custom Zoom Tool */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 overflow-hidden space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse"></span>
                        <h3 className="font-extrabold text-sm text-zinc-300">{selectedArtwork.title}</h3>
                      </div>
                      <button 
                        onClick={() => setImgZoomed(!imgZoomed)} 
                        className="text-xs bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white transition-all"
                      >
                        {imgZoomed ? "Verkleinern" : "Bild vergrößern 🔍"}
                      </button>
                    </div>

                    <div className={`relative bg-zinc-950 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-300 ${
                      imgZoomed ? "h-[500px]" : "h-96"
                    }`}>
                      <img 
                        src={selectedArtwork.imageUrl} 
                        alt={selectedArtwork.title} 
                        referrerPolicy="no-referrer"
                        className={`object-contain transition-all duration-300 ${
                          imgZoomed ? "max-h-full w-full" : "max-h-full max-w-[90%]"
                        }`}
                      />
                      <div className="absolute bottom-3 left-3 bg-zinc-900/80 border border-zinc-800 px-3 py-1.5 rounded-xl text-[11px] text-zinc-400">
                        {selectedArtwork.artist} ({selectedArtwork.year})
                      </div>
                    </div>

                    {/* Quick Specs metadata table */}
                    <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-3 rounded-2xl border border-zinc-800/80 text-xs">
                      <div className="text-center">
                        <div className="text-zinc-500 text-[10px] font-semibold uppercase">Künstler</div>
                        <div className="font-bold text-zinc-300 truncate">{selectedArtwork.artist}</div>
                      </div>
                      <div className="text-center border-x border-zinc-800">
                        <div className="text-zinc-500 text-[10px] font-semibold uppercase">Jahrgang</div>
                        <div className="font-bold text-zinc-300">{selectedArtwork.year}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-zinc-500 text-[10px] font-semibold uppercase">Fach/Spezialisierung</div>
                        <div className="font-bold text-zinc-300 text-[11px] truncate">{selectedArtwork.subject} • {selectedArtwork.subSubject}</div>
                      </div>
                    </div>
                  </div>

                  {/* Joony Streamer Deck - Simulated Streaming overlay */}
                  <div className="bg-gradient-to-br from-zinc-900 to-purple-950/20 border border-zinc-800 rounded-3xl p-5 flex flex-col md:flex-row items-center gap-4 relative">
                    <div className="h-20 w-20 shrink-0 rounded-2xl overflow-hidden border-2 border-purple-500 shadow-md shadow-purple-950/50 relative">
                      <img 
                        src={joonyAvatar} 
                        alt="Joony Stream Setup" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {/* Interactive Webcam effect overlay */}
                      <div className="absolute top-1 left-1 h-1.5 w-1.5 rounded-full bg-red-600 animate-ping"></div>
                    </div>

                    <div className="flex-grow space-y-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-purple-400">Joony Leitet</span>
                        <span className="text-[9px] bg-red-600/20 text-red-400 font-extrabold px-1.5 py-0.5 rounded border border-red-500/30">STUDIO COCKPIT</span>
                      </div>
                      
                      <div className="bg-zinc-950/90 border border-zinc-800 rounded-2xl p-3 text-xs leading-relaxed text-zinc-300 relative shadow-inner">
                        <p className="italic">"Wichtig ist, dass du nicht nur beschreibst, was auf dem Bild zu sehen ist, Bruder! Ich will fundierten historischen oder literarischen Kontext lesen. Erwähne die Epoche, benutze Fachbegriffe und rede über Symbole! Dann regnet es dicke Punkte im Chat!"</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: The Task Workspace & Stream Chat Feed */}
                <div className="lg:col-span-5 space-y-6 flex flex-col">
                  
                  {/* Task Instructions Paper and Hint panel */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4.5 w-4.5 text-purple-400" />
                        <h4 className="font-extrabold text-sm text-white">Aufgabenstellung</h4>
                      </div>
                      
                      {/* Hint Trigger button */}
                      <button 
                        onClick={() => setHintOpen(!hintOpen)}
                        className={`text-xs px-2.5 py-1 rounded-lg border flex items-center space-x-1 transition-all ${
                          hintOpen 
                            ? "bg-purple-900/30 border-purple-500 text-purple-300"
                            : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white"
                        }`}
                      >
                        <HelpCircle className="h-3 w-3" />
                        <span>Hilfreicher Beipackzettel</span>
                      </button>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-3.5 rounded-2xl border border-zinc-850">
                      {selectedArtwork.taskDescription}
                    </p>

                    {/* Expandable Hint / Cheat Sheet block */}
                    {hintOpen && (
                      <div className="bg-purple-950/40 border border-purple-800/80 p-4 rounded-2xl space-y-2 animate-fade-in text-xs text-purple-200">
                        <div className="font-bold flex items-center space-x-1.5 text-purple-300">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <span>Spickzettel & Epochenwissen:</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-purple-300/90 whitespace-pre-line bg-zinc-950/40 p-2.5 rounded-xl border border-purple-900">
                          {selectedArtwork.historicalContext}
                        </p>
                        <div className="text-[10px] text-zinc-400 bg-zinc-950/20 p-2 rounded-lg leading-relaxed">
                          📌 <strong className="text-purple-300">Tipp:</strong> Baue Schlagwörter wie e.g. <em className="text-zinc-300">"{selectedArtwork.gradingPrompts.excellentPoints[0]}"</em> in deinen Aufsatz ein, um Bonuspunkte zu kassieren!
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Core Essay Workspace Form */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-zinc-400">Dein Aufsatz (In Deutsch verfassen)</div>
                      <div className="text-xs text-zinc-500 font-mono">
                        {analysisText.trim() === "" ? 0 : analysisText.trim().split(/\s+/).length} Wörter (Empfohlen: &gt; 80)
                      </div>
                    </div>

                    <textarea
                      value={analysisText}
                      onChange={(e) => setAnalysisText(e.target.value)}
                      placeholder="Schreibe deine hochwissenschaftliche Bildanalyse hier auf Deutsch rein... Erwähne Bildteilung, symbolische Farbtöne, geschichtliche Meilensteine und Epochenspezifika."
                      rows={8}
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-purple-500 rounded-2xl p-4 text-xs font-serif leading-relaxed text-zinc-200 outline-none resize-none focus:ring-1 focus:ring-purple-500"
                    />

                    {/* Submission triggers */}
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <button
                        onClick={handleAbgabe}
                        disabled={isSubmitting}
                        className="w-full sm:w-auto flex-grow bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-extrabold text-xs py-3 px-6 rounded-2xl flex items-center justify-center space-x-2 shadow-lg shadow-purple-900/20 transition-all disabled:opacity-50"
                        id="btn_abgabe_system"
                      >
                        {isSubmitting ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Joony korrigiert noch...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4" />
                            <span>Analyse zur Note abgeben! 🚀</span>
                          </>
                        )}
                      </button>
                      <button 
                        onClick={() => { setSelectedArtwork(null); }}
                        className="w-full sm:w-auto bg-zinc-800 text-zinc-400 hover:text-white px-4 py-3 rounded-2xl text-xs border border-zinc-700 font-semibold"
                      >
                        Abbrechen
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Stream Chat Feed (Simulated or Real Twitch) */}
                  <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-4 flex flex-col h-80 flex-grow">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800/80 pb-2 mb-2">
                      <div className="flex items-center space-x-1.5 font-sans">
                        <MessageSquare className="h-4 w-4 text-purple-400" />
                        <span className="text-xs font-bold text-zinc-300">Twitch Chat Feed</span>
                        <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      </div>
                      
                      {/* Interactive toggle tabs */}
                      <div className="flex bg-zinc-950 p-0.5 rounded-lg border border-zinc-800 self-start sm:self-auto shrink-0 items-center font-sans">
                        <button
                          onClick={() => setChatMode("simulated")}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                            chatMode === "simulated"
                              ? "bg-purple-900/50 text-purple-300 border border-purple-800"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          Simuliert
                        </button>
                        <button
                          onClick={() => setChatMode("real")}
                          className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                            chatMode === "real"
                              ? "bg-purple-900/50 text-purple-300 border border-purple-800"
                              : "text-zinc-500 hover:text-zinc-300"
                          }`}
                        >
                          Live (@{twitchChannel})
                        </button>
                      </div>
                    </div>

                    {isEditingTwitchChannel ? (
                      <div className="flex items-center gap-1.5 p-2 bg-zinc-950 rounded-xl border border-zinc-850 mb-2 font-sans">
                        <input
                          type="text"
                          value={tempTwitchChannel}
                          onChange={(e) => setTempTwitchChannel(e.target.value)}
                          placeholder="z.B. papaplatte, gronkh..."
                          className="bg-zinc-900 border border-zinc-800 px-2 py-1 rounded-lg text-[11px] text-white placeholder-zinc-600 flex-grow outline-none min-w-0 font-medium"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              if (tempTwitchChannel.trim()) {
                                setTwitchChannel(tempTwitchChannel.trim().toLowerCase());
                              }
                              setIsEditingTwitchChannel(false);
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            if (tempTwitchChannel.trim()) {
                              setTwitchChannel(tempTwitchChannel.trim().toLowerCase());
                            }
                            setIsEditingTwitchChannel(false);
                          }}
                          className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[9px] px-2 py-1 rounded-md transition"
                        >
                          OK
                        </button>
                        <button
                          onClick={() => setIsEditingTwitchChannel(false)}
                          className="text-zinc-500 hover:text-zinc-300 text-[9px] font-bold transition"
                        >
                          X
                        </button>
                      </div>
                    ) : (
                      chatMode === "real" && (
                        <div className="flex items-center justify-between px-2.5 py-1 text-[9px] text-zinc-500 bg-zinc-950/60 rounded-xl border border-zinc-850 mb-2 font-sans">
                          <span>Kanal: <strong className="text-purple-400">twitch.tv/{twitchChannel}</strong></span>
                          <button
                            onClick={() => {
                              setTempTwitchChannel(twitchChannel);
                              setIsEditingTwitchChannel(true);
                            }}
                            className="text-purple-400 hover:text-purple-300 underline font-semibold transition"
                          >
                            Kanal ändern ✍️
                          </button>
                        </div>
                      )
                    )}

                    {chatMode === "simulated" ? (
                      /* Chat log wrapper */
                      <div 
                        ref={chatContainerRef}
                        className="flex-grow overflow-y-auto space-y-2.5 pr-2 Scrollbar-thin font-mono text-[11px]"
                        id="twitch_chat_log"
                      >
                        {streamChats.map((c) => (
                           <div key={c.id} className="leading-relaxed break-words hover:bg-zinc-850 p-0.5 rounded transition-colors">
                            {c.badge === "mod" && (
                              <span className="bg-green-600 text-white text-[8px] font-bold px-1 rounded mr-1.5 select-none">MOD</span>
                            )}
                            {c.badge === "sub" && (
                              <span className="bg-purple-600 text-white text-[8px] font-bold px-1 rounded mr-1.5 select-none">SUB</span>
                            )}
                            <strong className="text-purple-300 mr-1.5">{c.user}:</strong>
                            <span className="text-zinc-300">{c.text}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Real twitch chat iframe with multiple grandparent-friendly parent domains */
                      <div className="flex-grow rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800/80 h-full min-h-[160px] relative">
                        <iframe
                          src={`https://www.twitch.tv/embed/${encodeURIComponent(twitchChannel)}/chat?parent=${encodeURIComponent(hostname || "localhost")}&parent=localhost&parent=ai.studio&parent=aistudio.google.com&parent=google.com&parent=vercel.app&parent=firebaseapp.com&parent=web.app&darkpopout`}
                          className="absolute inset-0 w-full h-full border-0"
                          title="Twitch Live Chat"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* 1.3 Detailed Grade & Report Card Show (After submitting) */}
            {selectedArtwork && evaluation && (
              <div className="max-w-3xl mx-auto space-y-8 animate-fade-in" id="grade_results_card">
                
                {/* Header Back option */}
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-lg text-white flex items-center space-x-2">
                    <GraduationCap className="h-6 w-6 text-purple-400" />
                    <span>Dein Offizielles Zeugnis</span>
                  </h3>
                  <button 
                    onClick={() => { setEvaluation(null); setSelectedArtwork(null); }}
                    className="text-xs text-zinc-400 hover:text-white bg-zinc-900 px-3.5 py-2 rounded-xl border border-zinc-800"
                  >
                    Nächstes Bild bewerten ➔
                  </button>
                </div>

                {/* Main Grading Report Container */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-8 relative overflow-hidden" id="report_sheet">
                  
                  {/* Watermark badge backdrop */}
                  <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 bg-purple-600/5 rounded-full blur-3xl pointer-events-none"></div>

                  <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-zinc-800 pb-6 relative z-10">
                    
                    {/* Art metadata under review */}
                    <div className="space-y-2 text-center md:text-left">
                      <div className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-3 py-1 rounded-full font-bold uppercase tracking-wider inline-block">
                        Fachevaluation: {selectedArtwork.subject}
                      </div>
                      <h2 className="text-2xl font-black text-white">{selectedArtwork.title}</h2>
                      <p className="text-xs text-zinc-400">{selectedArtwork.artist} • Epoche: {selectedArtwork.subSubject}</p>
                    </div>

                    {/* Giant rotating grade stamp */}
                    <div className="flex items-center space-x-4 shrink-0">
                      <div className="text-center p-3 bg-zinc-950 rounded-2xl border border-zinc-850">
                        <div className="text-[9px] text-zinc-500 font-semibold uppercase">Punkte</div>
                        <div className="text-2xl font-black text-purple-400">{evaluation.score} <span className="text-xs text-zinc-500">/ 100</span></div>
                      </div>

                      {/* Grade stamp */}
                      <div className="relative h-24 w-24 flex items-center justify-center bg-zinc-950 rounded-full border-4 border-red-600/50 transform rotate-12 shadow-lg shadow-red-950/20">
                        <div className="text-center">
                          <div className="text-[8px] text-red-500/80 font-black tracking-widest uppercase">Note</div>
                          <div className="text-4xl font-extrabold text-red-500 tracking-tighter drop-shadow-md">{evaluation.grade}</div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Joony's Voice and Streamer comment */}
                  <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-850 space-y-3 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full border border-purple-500 overflow-hidden bg-cover bg-center" style={{ backgroundImage: `url(${joonyAvatar})` }}></div>
                        <div>
                          <div className="font-bold text-xs text-purple-300">Lehrer Joony</div>
                          <div className="text-[9px] text-zinc-500">Live Streamer & Kunstrichter</div>
                        </div>
                      </div>

                      <button
                        onClick={() => speakText(evaluation.funnyTeacherComment)}
                        className="bg-purple-900/50 hover:bg-purple-800 text-purple-300 border border-purple-700 p-2 rounded-xl text-xs flex items-center space-x-1.5 transition-all"
                        title="Kommentar vorlesen lassen"
                      >
                        <Volume2 className="h-4 w-4" />
                        <span className="hidden sm:inline font-bold">Vorlesen</span>
                      </button>
                    </div>

                    {/* Comment Bubble */}
                    <div className="p-3 bg-zinc-900 rounded-xl text-xs italic text-zinc-200 border border-zinc-800 leading-relaxed font-mono">
                      "{evaluation.funnyTeacherComment}"
                    </div>
                  </div>

                  {/* Analytical scores breakdown */}
                  <div className="space-y-4">
                    <h4 className="font-extrabold text-xs text-zinc-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <TrendingUp className="h-4 w-4 text-purple-400" />
                      <span>Akademische Kompetenzbereiche</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      {/* Sub-item 1: Inhaltliche Analyse */}
                      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-zinc-400">Inhaltlich (Symbolik)</span>
                          <span className="font-mono text-purple-400 font-bold">{evaluation.subScores?.inhaltlich ?? 0} / 30</span>
                        </div>
                        <div className="w-full bg-zinc-900 rounded-full h-1.5">
                          <div 
                            className="bg-purple-500 h-1.5 rounded-full transition-all duration-1000" 
                            style={{ width: `${Math.min(100, ((evaluation.subScores?.inhaltlich ?? 0) / 30) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Sub-item 2: Stilmittel */}
                      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-zinc-400">Stilmittel & Aufbau</span>
                          <span className="font-mono text-purple-400 font-bold">{evaluation.subScores?.stilMittel ?? 0} / 35</span>
                        </div>
                        <div className="w-full bg-zinc-900 rounded-full h-1.5">
                          <div 
                            className="bg-pink-500 h-1.5 rounded-full transition-all duration-1000" 
                            style={{ width: `${Math.min(100, ((evaluation.subScores?.stilMittel ?? 0) / 35) * 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Sub-item 3: Historischer Bezug */}
                      <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-zinc-400">Historischer Bezug</span>
                          <span className="font-mono text-purple-400 font-bold">{evaluation.subScores?.historischerBezug ?? 0} / 35</span>
                        </div>
                        <div className="w-full bg-zinc-900 rounded-full h-1.5">
                          <div 
                            className="bg-yellow-500 h-1.5 rounded-full transition-all duration-1000" 
                            style={{ width: `${Math.min(100, ((evaluation.subScores?.historischerBezug ?? 0) / 35) * 100)}%` }}
                          />
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Academic feedback text */}
                  <div className="space-y-2.5">
                    <h4 className="font-extrabold text-xs text-zinc-400 uppercase tracking-wider">
                      Umfassendes Gutachten
                    </h4>
                    <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-2xl border border-zinc-850 whitespace-pre-line">
                      {evaluation.academicFeedback}
                    </p>
                  </div>

                  {/* Achievements lists: Accuracies & Misses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    
                    {/* What they spotted right */}
                    <div className="bg-emerald-950/20 border border-emerald-900 rounded-2xl p-4 space-y-3">
                      <div className="font-bold text-xs text-emerald-400 flex items-center space-x-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Das hast du super erkannt:</span>
                      </div>
                      <ul className="text-[11px] text-zinc-300 space-y-2 pl-1 select-none">
                        {evaluation.historicalAccuracies && evaluation.historicalAccuracies.length > 0 ? (
                          evaluation.historicalAccuracies.map((acc, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-emerald-400 mr-1.5 shrink-0">✓</span>
                              <span>{acc}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-zinc-500 italic">Keine nennenswerten Treffer verzeichnet.</li>
                        )}
                      </ul>
                    </div>

                    {/* What they missed */}
                    <div className="bg-amber-950/20 border border-amber-900 rounded-2xl p-4 space-y-3">
                      <div className="font-bold text-xs text-amber-400 flex items-center space-x-1.5">
                        <AlertCircle className="h-4 w-4" />
                        <span>Hieran musst du noch arbeiten:</span>
                      </div>
                      <ul className="text-[11px] text-zinc-300 space-y-2 pl-1 select-none">
                        {evaluation.missedPoints && evaluation.missedPoints.length > 0 ? (
                          evaluation.missedPoints.map((miss, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-amber-500 mr-1.5 shrink-0">!</span>
                              <span>{miss}</span>
                            </li>
                          ))
                        ) : (
                          <li className="text-emerald-500 italic">Absolut lückenlose Analyse, keine groben Lücken entdeckt!</li>
                        )}
                      </ul>
                    </div>

                  </div>

                  {/* Actions buttons */}
                  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 border-t border-zinc-800 pt-6">
                    <button
                      onClick={() => {
                        setAnalysisText("");
                        setEvaluation(null);
                      }}
                      className="w-full sm:w-auto bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-lg transition-all"
                    >
                      Bessere Note versuchen (Nochmal spielen! 🔁)
                    </button>
                    <button
                      onClick={() => {
                        setEvaluation(null);
                        setSelectedArtwork(null);
                      }}
                      className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-6 py-3 rounded-xl text-xs border border-zinc-700 font-bold"
                    >
                      Anderes Bild analysieren
                    </button>
                  </div>

                </div>

              </div>
            )}

          </>
        )}

        {/* TAB 2: GLOBAL LEADERBOARD */}
        {activeTab === "leaderboard" && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in text-zinc-100" id="leaderboard_view">
            
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-2xl font-black text-white flex items-center space-x-2">
                  <Award className="h-7 w-7 text-yellow-500" />
                  <span>Studiengang Leaderboard</span>
                </h2>
                <p className="text-xs text-zinc-500">Wer liefert die am besten formulierten Analysen im Stream?</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-400">
                ⭐ {leaderboard.filter(l => l.userType === "player").length} Aktive Spieler
              </div>
            </div>

            {/* Simple Searchbar to filter leaderboard */}
            <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-5 flex flex-col md:flex-row gap-4 items-center" id="board_header_tools">
              <div className="relative w-full">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Spieler nach Namen durchsuchen..."
                  className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 text-xs text-zinc-300 outline-none"
                  id="leaderboard_search"
                  onChange={(e) => {
                    const term = e.target.value.toLowerCase();
                    setLeaderboard((prev) => {
                      if (!term) {
                        fetchLeaderboard();
                        return prev;
                      }
                      return prev.filter(item => item.username.toLowerCase().includes(term));
                    });
                  }}
                />
              </div>

              <button 
                onClick={fetchLeaderboard}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2.5 rounded-xl text-xs border border-zinc-700 flex items-center space-x-1.5 shrink-0 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Aktualisieren</span>
              </button>
            </div>

            {/* List Table container */}
            <div className="bg-zinc-900 border border-zinc-850 rounded-3xl overflow-hidden shadow-xl" id="leaderboard_table_container">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs text-zinc-300">
                  <thead className="bg-zinc-950 font-sans text-zinc-500 uppercase font-black text-[10px] tracking-wider border-b border-zinc-850">
                    <tr>
                      <th className="py-4 px-5 text-center">Platz</th>
                      <th className="py-4 px-4">Student</th>
                      <th className="py-4 px-4">Analysiertes Bild</th>
                      <th className="py-4 px-4 text-center">Fach</th>
                      <th className="py-4 px-4 text-center">Score / Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-850">
                    {leaderboard.length > 0 ? (
                      leaderboard.map((item, index) => {
                        const isTop = index < 3;
                        const isThisPlayer = item.username === username;
                        return (
                          <tr 
                            key={item.id} 
                            className={`hover:bg-zinc-850/50 transition-colors ${
                              isThisPlayer ? "bg-purple-950/20 text-purple-200 font-bold" : ""
                            }`}
                          >
                            {/* Position cell */}
                            <td className="py-4 px-5 text-center font-bold">
                              {index === 0 && <span className="text-xl">🏆</span>}
                              {index === 1 && <span className="text-xl">🥈</span>}
                              {index === 2 && <span className="text-xl">🥉</span>}
                              {index >= 3 && <span className="text-zinc-500">#{index + 1}</span>}
                            </td>

                            {/* User details cell */}
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold ${
                                  item.userType === "bot" ? "bg-emerald-700" : "bg-purple-700"
                                }`}>
                                  {item.username.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-bold text-white flex items-center space-x-1.5">
                                    <span>{item.username}</span>
                                    {item.userType === "bot" && (
                                      <span className="text-[8px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1 rounded">CHAT BOT</span>
                                    )}
                                  </span>
                                  <span className="text-[9px] text-zinc-500">{new Date(item.playedAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </td>

                            {/* Artwork Title Cell */}
                            <td className="py-4 px-4 font-sans text-zinc-300 font-semibold max-w-[180px] truncate" title={item.artworkTitle}>
                              {item.artworkTitle}
                            </td>

                            {/* Subject badge cell */}
                            <td className="py-4 px-4 text-center">
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                                item.subject === "Geschichte" 
                                  ? "bg-yellow-950/40 text-yellow-400 border-yellow-800" 
                                  : "bg-purple-950/40 text-purple-400 border-purple-800"
                              }`}>
                                {item.subject}
                              </span>
                            </td>

                            {/* Score & Stamp Cell */}
                            <td className="py-4 px-4 text-center">
                              <div className="inline-flex items-center space-x-2">
                                <span className="font-extrabold text-white text-sm">{item.score} <span className="text-[9px] text-zinc-500">Pkt.</span></span>
                                <span className="bg-red-950/80 text-red-500 border border-red-800 px-1.5 py-0.5 rounded-md font-bold text-[11px] min-w-[28px] text-center">{item.grade}</span>
                              </div>
                            </td>

                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-zinc-500 italic">
                          Noch keine Highscores vorhanden. Sei der Erste und analysiere ein Gemälde!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom info banner */}
            <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest leading-relaxed">
              * bots werden simuliert und generieren nach dem Zufallsprinzip Noten, um deine Motivation anzukurbeln!
            </p>

          </div>
        )}

        {/* TAB 3: Spielregeln & Joony Information */}
        {activeTab === "info" && (
          <div className="max-w-2xl mx-auto space-y-6 bg-zinc-900 border border-zinc-850 p-6 md:p-8 rounded-3xl animate-fade-in text-sm text-zinc-300 leading-relaxed" id="info_rules_tab">
            
            <h2 className="text-2xl font-black text-white flex items-center space-x-2 border-b border-zinc-850 pb-4">
              <GraduationCap className="h-7 w-7 text-purple-400" />
              <span>Spielregeln & Wissenswertes</span>
            </h2>

            <div className="space-y-4">
              <h3 className="font-extrabold text-sm text-purple-300 uppercase tracking-wide">Wie funktioniert das Spiel?</h3>
              <p>
                In <strong>Joonys Analyse-Stunde</strong> kannst du deine Fähigkeiten in Geschichte und Deutsch unter Beweis stellen. 
                Du wählst eines der weltberühmten Kunstwerke aus der Malerei oder der Karikaturgeschichte und verfasst dazu eine fundierte Bildanalyse.
              </p>
              
              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-850 space-y-2">
                <h4 className="font-semibold text-zinc-200">Die 3 Kriterien von Lehrer Joony:</h4>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-455">
                  <li><strong>Inhaltlich (max 30 Punkte):</strong> Richtige Erfassung des Hauptthemas, Benennung der dargestellten Personen oder Elemente.</li>
                  <li><strong>Stilmittel (max 35 Punkte):</strong> Analyse von Bildaufbau, Farbwirkungen, Raumtiefe, Lichtverhältnissen und Symbolen.</li>
                  <li><strong>Historischer Bezug (max 35 Punkte):</strong> Gezielte Einordnung der Epoche (z.B. Romantik/Vormärz) oder des historischen Wendepunktes (z.B. Entlassung Bismarcks).</li>
                </ul>
              </div>

              <h3 className="font-extrabold text-sm text-pink-300 uppercase tracking-wide pt-2">Wer ist Joony?</h3>
              <p>
                <strong>Joony</strong> ist ein leidenschaftlicher Gymnasiallehrer für die Fächer Deutsch und Geschichte, der abends leidenschaftlich gerne auf Twitch streamt. 
                Er liebt es, trockenem Schulstoff neues Leben einzuhauchen und reagiert im Stream humorvoll, aber hochkompetent auf eure Einsendungen.
              </p>
              <p>
                Er mag zwar coole Streamer-Floskeln verwenden wie <em>"Stabil"</em>, <em>"Lost"</em> oder <em>"Macher"</em>, aber wenn es um die Zensurvergabe im Abitur-Standard geht, kennt er keine Gnade! Wer schludert, fängt sich schnell eine schmerzhafte Note 5 oder 6 ein. Ein fleißiger Geist hingegen wird mit dem Prädikat <strong>"Note 1+ (Herausragend)"</strong> im Stream gefeiert.
              </p>

              <h3 className="font-extrabold text-sm text-yellow-300 uppercase tracking-wide pt-2">Einbindung der KI</h3>
              <p className="text-zinc-400 text-xs leading-relaxed bg-zinc-950 p-3.5 rounded-xl border border-zinc-850">
                Diese Web-App nutzt das modernste, unzensierte <strong>Gemini 3.5-flash</strong> Modell im Backend, um deine eingegebene Freitextanalyse live auf semantische und inhaltliche Genauigkeit abzugleichen. Wenn keine Internetverbindung besteht, greift das System auf einen cleveren Offline-Grading-Algorithmus zurück, sodass dem Spielspaß nie Grenzen gesetzt sind!
              </p>
            </div>

            <div className="border-t border-zinc-850 pt-6 flex justify-center">
              <button
                onClick={() => { setActiveTab("game"); }}
                className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs py-3 px-8 rounded-xl transition-all"
              >
                Jetzt erstes Bild analysieren! 🚀
              </button>
            </div>

          </div>
        )}

      </main>

      {/* Styled Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-6 px-4 md:px-8 text-center" id="footer_bar">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <div>
            &copy; 2026 <strong>Joonys Analyse-Stunde</strong> • Erstellt für historisch begabte Streamer-Fans.
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>Joony LIVE-Stream: <strong>Bereit zur Bewertung</strong></span>
            </span>
            <span className="text-zinc-700">|</span>
            <span>Version 1.1 (Premium Pro)</span>
          </div>
        </div>
      </footer>
        </>
      )}
    </div>
  );
}
