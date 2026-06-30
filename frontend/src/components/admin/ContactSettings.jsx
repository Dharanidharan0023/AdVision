import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Save, RefreshCw, Mail, MapPin, Phone, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactSettings = () => {
  const [contact, setContact] = useState({
    id: null,
    pageTitle: 'Contact',
    email: '',
    phone: '',
    address: '',
    googleMapUrl: '',
    businessHours: '',
    contactFormEnabled: true,
    contactFormNote: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await api.get('/public/contact');
        if (res.data) {
          setContact((prev) => ({
            ...prev,
            ...res.data,
            ...res.data
          }));
        }
      } catch (err) {
        console.error('Error fetching contact page:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setContact((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        ...contact
      };

      const res = contact.id
        ? await api.put(`/admin/contact/${contact.id}`, payload)
        : await api.post('/admin/contact', payload);

      setContact((prev) => ({ ...prev, ...res.data }));
      setMessage({ type: 'success', text: 'Contact page saved successfully.' });
    } catch (err) {
      console.error('Error saving contact data:', err);
      setMessage({ type: 'error', text: 'Unable to save contact page.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!contact.id) return;
    if (!window.confirm('Delete the contact page settings? This cannot be undone.')) return;

    try {
      await api.delete(`/admin/contact/${contact.id}`);
      setContact({
        id: null,
        pageTitle: 'Contact',
        email: '',
        phone: '',
        address: '',
        googleMapUrl: '',
        businessHours: '',
        contactFormEnabled: true,
        contactFormNote: ''
      });
      setMessage({ type: 'success', text: 'Contact content removed. You may add it again.' });
    } catch (err) {
      console.error('Error deleting contact page:', err);
      setMessage({ type: 'error', text: 'Failed to delete contact page.' });
    }
  };

  if (loading) {
    return <div className="text-gray-400">Loading contact settings...</div>;
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Contact Page Manager</h2>
          <p className="text-gray-500 text-xs uppercase tracking-[0.35em] mt-1">Edit page contact details, map embed, hours, and social links.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-neon-cyan text-black px-4 py-3 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-neon-cyan/80 disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Contact'}
          </button>
          {contact.id && (
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 bg-red-500/10 text-red-400 px-4 py-3 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-red-500/20"
            >
              <RefreshCw size={18} /> Reset
            </button>
          )}
        </div>
      </div>

      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-3xl border ${message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-300' : 'bg-red-500/10 border-red-500/20 text-red-300'}`}
        >
          {message.text}
        </motion.div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="Page Title" icon={Globe} name="pageTitle" value={contact.pageTitle} onChange={handleChange} placeholder="Contact Us" required />
          <InputGroup label="Email" icon={Mail} name="email" value={contact.email} onChange={handleChange} placeholder="support@dharanixstudio.com" required />
          <InputGroup label="Phone" icon={Phone} name="phone" value={contact.phone} onChange={handleChange} placeholder="+91 98765 43210" required />
          <InputGroup label="Address" icon={MapPin} name="address" value={contact.address} onChange={handleChange} placeholder="Chennai, India" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-[0.35em] text-gray-400">Google Maps Embed URL</label>
            <input
              type="text"
              name="googleMapUrl"
              value={contact.googleMapUrl}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-3xl px-5 py-4 text-white focus:ring-2 focus:ring-neon-cyan/20 outline-none"
              placeholder="https://www.google.com/maps/embed?..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-[0.35em] text-gray-400">Business Hours</label>
            <input
              type="text"
              name="businessHours"
              value={contact.businessHours}
              onChange={handleChange}
              className="w-full bg-black/20 border border-white/10 rounded-3xl px-5 py-4 text-white focus:ring-2 focus:ring-neon-cyan/20 outline-none"
              placeholder="Mon - Sat / 10AM - 8PM"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <input
              id="contactFormEnabled"
              type="checkbox"
              name="contactFormEnabled"
              checked={contact.contactFormEnabled}
              onChange={handleChange}
              className="h-4 w-4 text-neon-cyan bg-black/20 border-white/10 rounded focus:ring-neon-cyan"
            />
            <label htmlFor="contactFormEnabled" className="text-sm font-bold uppercase tracking-[0.35em] text-gray-400">Enable contact form</label>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-[0.35em] text-gray-400">Form Note</label>
            <textarea
              name="contactFormNote"
              value={contact.contactFormNote}
              onChange={handleChange}
              rows={4}
              className="w-full bg-black/20 border border-white/10 rounded-3xl px-5 py-4 text-white focus:ring-2 focus:ring-neon-cyan/20 outline-none resize-none"
              placeholder="Example: We'll respond within 24 hours."
            />
          </div>
        </div>
      </form>
    </div>
  );
};

const InputGroup = ({ label, icon: Icon, name, value, onChange, placeholder, required }) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.35em] text-gray-400">
      {Icon && <Icon size={14} className="text-neon-cyan" />}
      <span>{label}</span>
    </div>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full bg-black/20 border border-white/10 rounded-3xl px-5 py-4 text-white focus:ring-2 focus:ring-neon-cyan/20 outline-none"
    />
  </div>
);

export default ContactSettings;
