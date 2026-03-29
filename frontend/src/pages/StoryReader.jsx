import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, BookOpen, Sun, Moon, Coffee,
  List, X, Clock, ArrowLeft
} from 'lucide-react';
import api from '../api/axios';

const THEMES = {
  dark: {
    id: 'dark', icon: Moon, label: 'Dark',
    bg: 'bg-[#0a0a0f]', text: 'text-gray-100',
    prose: 'text-gray-200', title: 'text-white',
    card: 'bg-[#111118]', border: 'border-white/5',
    btn: 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white',
    progress: 'bg-neon-purple',
  },
  sepia: {
    id: 'sepia', icon: Coffee, label: 'Sepia',
    bg: 'bg-[#f5ede0]', text: 'text-[#3b2f1e]',
    prose: 'text-[#4a3728]', title: 'text-[#2a1f12]',
    card: 'bg-[#ede0cd]', border: 'border-[#c4a882]/40',
    btn: 'bg-[#c4a882]/30 hover:bg-[#c4a882]/50 text-[#6b4c2a] hover:text-[#3b2f1e]',
    progress: 'bg-[#8b6343]',
  },
  light: {
    id: 'light', icon: Sun, label: 'Light',
    bg: 'bg-[#fafafa]', text: 'text-gray-900',
    prose: 'text-gray-700', title: 'text-gray-950',
    card: 'bg-white', border: 'border-gray-200',
    btn: 'bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900',
    progress: 'bg-neon-blue',
  },
};

const wordsPerMinute = 220;
const estimateReadTime = (text) => {
  const words = text?.split(/\s+/).filter(Boolean).length ?? 0;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes <= 1 ? '1 min read' : `${minutes} min read`;
};

const StoryReader = () => {
  const { id, chapterId } = useParams();
  const navigate = useNavigate();
  const [chapter, setChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('reader-theme') || 'dark');
  const [fontSize, setFontSize] = useState(() => parseInt(localStorage.getItem('reader-font-size') || '18'));
  const [scrollProgress, setScrollProgress] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const contentRef = useRef(null);
  const t = THEMES[theme] || THEMES.dark;

  const fetchChapter = useCallback(() => {
    setLoading(true);
    api.get(`/public/stories/${id}/chapters/${chapterId}`)
      .then(res => setChapter(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id, chapterId]);

  useEffect(() => { fetchChapter(); }, [fetchChapter]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [chapterId]);

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      const el = contentRef.current;
      if (!el) return;
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeTheme = (th) => {
    setTheme(th);
    localStorage.setItem('reader-theme', th);
  };

  const changeFontSize = (size) => {
    setFontSize(size);
    localStorage.setItem('reader-font-size', String(size));
  };

  const chapters = chapter?.story?.chapters ?? [];
  const currentIndex = chapters.findIndex(c => c.id === parseInt(chapterId));
  const prevChapter = chapters[currentIndex - 1];
  const nextChapter = chapters[currentIndex + 1];

  const goToChapter = (ch) => {
    navigate(`/stories/${id}/chapters/${ch.id}`);
    setDrawerOpen(false);
  };

  if (loading) return (
    <div className={`min-h-screen ${t.bg} ${t.text} flex items-center justify-center transition-colors duration-300`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-10 h-10 border-2 border-neon-purple border-t-transparent rounded-full"
      />
    </div>
  );

  if (!chapter) return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center text-gray-500">
      <div className="text-center">
        <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
        <p className="text-xl font-bold">Chapter not found</p>
        <Link to={`/stories/${id}`} className="text-neon-cyan text-sm mt-4 inline-block hover:underline">← Back to Story</Link>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${t.bg} ${t.text} transition-colors duration-300`}>

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[200] bg-white/5">
        <motion.div
          className={`h-full ${t.progress}`}
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Fixed Top Bar */}
      <div className={`fixed top-1 left-0 w-full z-[100] ${t.card} ${t.border} border-b backdrop-blur-xl`}>
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Back */}
          <Link
            to={`/stories/${id}`}
            className={`flex items-center gap-2 text-sm font-bold ${t.btn} px-3 py-2 rounded-xl transition-all`}
          >
            <ArrowLeft size={14} /> <span className="hidden sm:block">Story</span>
          </Link>

          {/* Title */}
          <div className="text-center flex-1 min-w-0">
            <p className="text-xs opacity-50 truncate">{chapter.story?.title}</p>
            <p className={`text-sm font-black truncate ${t.title}`}>Ch.{chapter.chapterNo} — {chapter.title}</p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-1">
            {/* Font Size */}
            <button onClick={() => changeFontSize(Math.max(14, fontSize - 1))} className={`w-8 h-8 rounded-lg text-xs font-bold ${t.btn} flex items-center justify-center transition-all`}>A-</button>
            <button onClick={() => changeFontSize(Math.min(26, fontSize + 1))} className={`w-8 h-8 rounded-lg text-sm font-bold ${t.btn} flex items-center justify-center transition-all`}>A+</button>

            {/* Theme */}
            {Object.values(THEMES).map(th => {
              const Icon = th.icon;
              return (
                <button
                  key={th.id}
                  onClick={() => changeTheme(th.id)}
                  title={th.label}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${theme === th.id ? 'ring-2 ring-neon-cyan' : ''} ${t.btn}`}
                >
                  <Icon size={13} />
                </button>
              );
            })}

            {/* Chapter List */}
            <button
              onClick={() => setDrawerOpen(true)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${t.btn}`}
            >
              <List size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main ref={contentRef} className="max-w-2xl mx-auto px-6 pt-28 pb-24">

        {/* Chapter Header */}
        <motion.div
          key={chapterId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className={`text-xs font-black uppercase tracking-[0.2em] opacity-40 mb-2`}>
            Chapter {chapter.chapterNo}
          </p>
          <h1 className={`text-3xl md:text-4xl font-black tracking-tight leading-tight mb-4 ${t.title}`}>
            {chapter.title}
          </h1>
          <div className={`flex items-center gap-4 text-xs opacity-50 pb-6 border-b ${t.border}`}>
            <span className="flex items-center gap-1.5"><Clock size={12} /> {estimateReadTime(chapter.content)}</span>
            <span>{new Date(chapter.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </motion.div>

        {/* Chapter Body */}
        <motion.div
          key={chapterId + 'content'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={`${t.prose} leading-[1.9] whitespace-pre-wrap`}
          style={{ fontSize: `${fontSize}px`, fontFamily: "'Georgia', 'Playfair Display', serif" }}
        >
          {chapter.content}
        </motion.div>

        {/* Chapter Navigation */}
        <div className={`mt-16 pt-8 border-t ${t.border} flex items-center justify-between gap-4`}>
          {prevChapter ? (
            <button
              onClick={() => goToChapter(prevChapter)}
              className={`group flex items-center gap-3 px-5 py-4 rounded-2xl ${t.btn} transition-all max-w-[45%] text-left`}
            >
              <ChevronLeft size={18} className="flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider opacity-50 font-bold mb-0.5">Previous</p>
                <p className="font-bold text-sm truncate">Ch.{prevChapter.chapterNo} {prevChapter.title}</p>
              </div>
            </button>
          ) : <div />}

          {nextChapter ? (
            <button
              onClick={() => goToChapter(nextChapter)}
              className={`group flex items-center gap-3 px-5 py-4 rounded-2xl ${t.btn} transition-all max-w-[45%] text-right ml-auto`}
            >
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wider opacity-50 font-bold mb-0.5">Next</p>
                <p className="font-bold text-sm truncate">Ch.{nextChapter.chapterNo} {nextChapter.title}</p>
              </div>
              <ChevronRight size={18} className="flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <div className="ml-auto text-center">
              <p className="text-sm font-bold opacity-50 mb-2">🎉 You've reached the end!</p>
              <Link
                to={`/stories/${id}`}
                className="text-xs text-neon-cyan hover:underline font-bold"
              >
                Back to Story ↩
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Chapter Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={`fixed right-0 top-0 h-screen w-[320px] max-w-full z-[160] ${t.card} border-l ${t.border} flex flex-col`}
            >
              <div className={`flex items-center justify-between px-6 py-5 border-b ${t.border}`}>
                <h3 className={`font-black text-lg ${t.title}`}>Chapters</h3>
                <button onClick={() => setDrawerOpen(false)} className={`w-8 h-8 rounded-full flex items-center justify-center ${t.btn}`}>
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-3 px-4 space-y-1">
                {chapters.map(ch => {
                  const isActive = ch.id === parseInt(chapterId);
                  return (
                    <button
                      key={ch.id}
                      onClick={() => goToChapter(ch)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${isActive
                        ? 'bg-neon-purple/20 text-neon-purple'
                        : `${t.btn}`
                        }`}
                    >
                      <span className={`text-xs font-black w-6 flex-shrink-0 ${isActive ? 'text-neon-purple' : 'opacity-40'}`}>
                        {ch.chapterNo}
                      </span>
                      <span className="text-sm font-bold truncate">{ch.title}</span>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-neon-purple ml-auto flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoryReader;
