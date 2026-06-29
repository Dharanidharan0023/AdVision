import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Mail, CheckCircle, Trash2, MailOpen, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    try {
      const res = await api.get('/admin/contact-messages');
      setMessages(res.data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleReadStatus = async (id, currentStatus) => {
    try {
      await api.put(`/admin/contact-messages/${id}`, { isRead: !currentStatus });
      fetchMessages();
    } catch (err) {
      console.error('Error updating message status:', err);
      alert('Failed to update status.');
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/admin/contact-messages/${id}`);
      fetchMessages();
    } catch (err) {
      console.error('Error deleting message:', err);
      alert('Failed to delete message.');
    }
  };

  if (loading) {
    return <div className="text-gray-400">Loading messages...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black text-white flex items-center gap-3">
          <Mail className="text-neon-cyan" /> Inbox
        </h2>
        <p className="text-gray-500 text-xs uppercase tracking-[0.35em] mt-1">Review and manage contact submissions.</p>
      </div>

      {messages.length === 0 ? (
        <div className="py-10 text-center border border-white/5 rounded-3xl bg-black/20">
          <p className="text-gray-500 text-sm font-black uppercase tracking-widest">Inbox is empty</p>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`p-6 rounded-3xl border transition-all duration-300 ${msg.isRead ? 'bg-black/20 border-white/5' : 'bg-neon-cyan/5 border-neon-cyan/20 shadow-[0_0_15px_rgba(0,255,255,0.05)]'}`}
              >
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4 border-b border-white/5 pb-4">
                  <div>
                    <h3 className="text-lg font-black text-white flex items-center gap-2">
                      {!msg.isRead && <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse" />}
                      {msg.name}
                    </h3>
                    <a href={`mailto:${msg.email}`} className="text-neon-cyan text-xs font-bold tracking-wider hover:underline">{msg.email}</a>
                  </div>
                  <div className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    {new Date(msg.createdAt).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
                
                <p className="text-gray-300 text-sm leading-relaxed mb-6 whitespace-pre-wrap">
                  {msg.message}
                </p>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    onClick={() => toggleReadStatus(msg.id, msg.isRead)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                  >
                    {msg.isRead ? <><Mail size={14} /> Mark Unread</> : <><MailOpen size={14} className="text-neon-cyan" /> Mark Read</>}
                  </button>
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <Trash2 size={14} /> Purge
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
