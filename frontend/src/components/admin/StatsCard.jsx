const StatsCard = ({ title, value, icon: Icon, color = "text-neon-purple" }) => {
    return (
        <div className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
                    <p className="text-3xl font-bold text-white">{value}</p>
                </div>
                {Icon && (
                    <div className={`p-3 rounded-xl bg-white/5 ${color}`}>
                        <Icon size={24} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
