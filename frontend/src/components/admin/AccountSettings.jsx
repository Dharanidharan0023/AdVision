import { useState } from 'react';
import { User, Lock, ShieldCheck } from 'lucide-react';
import api from '../../api/axios';

const AccountSettings = ({ user, onUpdated }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newUsername, setNewUsername] = useState(user?.username || '');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!currentPassword.trim()) {
            setStatusMessage('Enter current password first.');
            return;
        }
        if (newPassword && newPassword !== confirmPassword) {
            setStatusMessage('New passwords do not match.');
            return;
        }

        setIsSubmitting(true);
        setStatusMessage('Updating account...');

        try {
            const res = await api.put('/admin/account', {
                currentPassword: currentPassword.trim(),
                newUsername: newUsername.trim() || undefined,
                newPassword: newPassword.trim() || undefined
            });

            setStatusMessage('Account updated successfully.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            if (res.data.token) {
                localStorage.setItem('token', res.data.token);
            }
            if (res.data.user) {
                onUpdated?.(res.data.user);
            }
        } catch (err) {
            console.error('Account update failed:', err);
            const message = err.response?.data?.error || 'Unable to update account.';
            setStatusMessage(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="glass-modern rounded-[3rem] border border-white/10 p-10 shadow-[0_30px_80px_rgba(0,0,0,0.3)]">
            <div className="flex flex-col gap-6 mb-10">
                <div className="flex items-center gap-4 text-neon-cyan">
                    <div className="w-16 h-16 rounded-3xl bg-neon-cyan/10 flex items-center justify-center border border-neon-cyan/20">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter">Account Control</h2>
                        <p className="text-gray-400 text-sm">Change login credentials securely and keep access locked down.</p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl bg-white/5 border border-white/10 p-5">
                        <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-2">Current Username</p>
                        <p className="text-white font-black text-xl">{user?.username || 'admin'}</p>
                    </div>
                    <div className="rounded-3xl bg-white/5 border border-white/10 p-5">
                        <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-2">Current Role</p>
                        <p className="text-white font-black text-xl">{user?.role || 'ADMIN'}</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.35em] text-gray-500">Current Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Current password"
                            className="w-full bg-white/[0.05] border border-white/10 rounded-3xl px-14 py-4 text-white outline-none focus:border-neon-cyan/40 focus:bg-white/10 transition"
                        />
                    </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.35em] text-gray-500">New Username</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                placeholder="New username"
                                className="w-full bg-white/[0.05] border border-white/10 rounded-3xl px-14 py-4 text-white outline-none focus:border-neon-cyan/40 focus:bg-white/10 transition"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] uppercase tracking-[0.35em] text-gray-500">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New password"
                                className="w-full bg-white/[0.05] border border-white/10 rounded-3xl px-14 py-4 text-white outline-none focus:border-neon-cyan/40 focus:bg-white/10 transition"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-[10px] uppercase tracking-[0.35em] text-gray-500">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="w-full bg-white/[0.05] border border-white/10 rounded-3xl px-5 py-4 text-white outline-none focus:border-neon-cyan/40 focus:bg-white/10 transition"
                    />
                </div>

                {statusMessage && (
                    <p className="text-sm text-gray-300">{statusMessage}</p>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-5 uppercase tracking-[0.4em] font-black flex items-center justify-center gap-3 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <ShieldCheck size={18} /> Save Account
                </button>
            </form>
        </div>
    );
};

export default AccountSettings;
