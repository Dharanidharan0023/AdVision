import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
    return (
        <nav className="fixed top-0 w-full z-50 bg-dark-bg/80 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold neon-text tracking-tighter">
                    AdVision Studio
                </Link>
                <div className="flex gap-8">
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/posts">Posts</NavLink>
                    <NavLink to="/projects">Projects</NavLink>
                    <NavLink to="/about">About</NavLink>
                    <Link to="/admin" className="text-gray-600 hover:text-white transition-colors text-xs">Admin</Link>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ to, children }) => (
    <Link to={to} className="text-gray-400 hover:text-neon-cyan transition-colors text-sm font-medium uppercase tracking-wide">
        {children}
    </Link>
);

export default Navbar;
