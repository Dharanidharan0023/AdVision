import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ChevronLeft, ChevronRight, Clock, User, Tag, Layers } from 'lucide-react';
import api from '../api/axios';

const StoryDetail = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/public/stories/${id}`)
      .then(res => setStory(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        className="w-10 h-10 border-2 border-neon-purple border-t-transparent rounded-full"
      />
    </div>
  );

  if (!story) return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center text-gray-500">
      <div className="text-center">
        <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
        <p className="text-xl font-bold">Story not found</p>
        <Link to="/stories" className="text-neon-cyan text-sm mt-4 inline-block hover:underline">← Back to Library</Link>
      </div>
    </div>
  );

  const firstChapter = story.chapters?.[0];

  return (
    <div className="min-h-screen bg-dark-bg text-white">

      {/* Hero */}
      <div className="relative min-h-[55vh] flex items-end overflow-hidden">
        {story.coverUrl ? (
          <img src={story.coverUrl} alt={story.title} className="absolute inset-0 w-full h-full object-cover opacity-15" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/15 via-dark-bg to-neon-blue/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/70 to-transparent" />

        <div className="relative container mx-auto px-6 pb-14 pt-36">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/stories" className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-sm font-bold mb-6 transition-colors group">
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Story Library
            </Link>

            <div className="flex flex-wrap gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-neon-purple/20 text-neon-purple border border-neon-purple/30">
                {story.genre}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${story.status === 'Completed'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30'}`}>
                {story.status}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4 leading-none">{story.title}</h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400 mb-6">
              <span className="flex items-center gap-2"><User size={14} /> {story.author}</span>
              <span className="flex items-center gap-2"><Layers size={14} /> {story.chapters.length} {story.chapters.length === 1 ? 'chapter' : 'chapters'}</span>
              <span className="flex items-center gap-2"><Clock size={14} /> {new Date(story.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>

            <p className="text-gray-300 text-lg max-w-2xl leading-relaxed">{story.summary}</p>
          </motion.div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container mx-auto px-6 py-12 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Chapter List */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black tracking-tight">Chapters</h2>
                {firstChapter && (
                  <Link
                    to={`/stories/${story.id}/chapters/${firstChapter.id}`}
                    className="inline-flex items-center gap-2 bg-neon-purple text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-neon-purple/80 transition-all shadow-[0_0_20px_rgba(176,38,255,0.3)] hover:scale-105 active:scale-95"
                  >
                    <BookOpen size={14} /> Start Reading
                  </Link>
                )}
              </div>

              {story.chapters.length === 0 ? (
                <div className="glass-modern rounded-2xl p-10 text-center text-gray-500">
                  <BookOpen size={36} className="mx-auto mb-3 opacity-30" />
                  <p>No chapters published yet. Check back soon!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {story.chapters.map((chapter, i) => (
                    <motion.div
                      key={chapter.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.04 }}
                    >
                      <Link
                        to={`/stories/${story.id}/chapters/${chapter.id}`}
                        className="group flex items-center gap-4 glass-modern rounded-2xl px-6 py-4 neon-border hover:border-neon-purple/50 hover:bg-white/5 transition-all duration-300"
                      >
                        {/* Chapter Number */}
                        <div className="w-10 h-10 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center flex-shrink-0 group-hover:bg-neon-purple/20 transition-colors">
                          <span className="text-neon-purple text-xs font-black">{chapter.chapterNo}</span>
                        </div>

                        {/* Chapter Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-bold truncate group-hover:text-neon-cyan transition-colors">
                            {chapter.title}
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {new Date(chapter.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <ChevronRight size={16} className="text-gray-600 group-hover:text-neon-cyan group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar Info */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-modern rounded-3xl p-6 space-y-6 sticky top-28"
            >
              {/* Cover */}
              {story.coverUrl && (
                <div className="relative rounded-2xl overflow-hidden aspect-[3/4]">
                  <img src={story.coverUrl} alt={story.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Story Details */}
              <div className="space-y-4">
                <InfoRow icon={User} label="Author" value={story.author} />
                <InfoRow icon={Tag} label="Genre" value={story.genre} />
                <InfoRow icon={Layers} label="Chapters" value={story.chapters.length} />
                <InfoRow icon={Clock} label="Status" value={story.status}
                  valueClass={story.status === 'Completed' ? 'text-green-400' : 'text-neon-cyan'} />
              </div>

              {/* CTA */}
              {firstChapter && (
                <Link
                  to={`/stories/${story.id}/chapters/${firstChapter.id}`}
                  className="w-full flex items-center justify-center gap-2 bg-white text-black py-3 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-neon-cyan transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <BookOpen size={14} /> Begin Reading
                </Link>
              )}
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value, valueClass = 'text-white' }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-500 text-sm flex items-center gap-2">
      <Icon size={13} /> {label}
    </span>
    <span className={`text-sm font-bold ${valueClass}`}>{value}</span>
  </div>
);

export default StoryDetail;
