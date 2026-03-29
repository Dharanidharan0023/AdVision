import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Posts from './pages/Posts';
import Projects from './pages/Projects';
import About from './pages/About';
import StoryLibrary from './pages/StoryLibrary';
import StoryDetail from './pages/StoryDetail';
import StoryReader from './pages/StoryReader';
import Web3Landing from './pages/Web3Landing';
import CustomCursor from './components/CustomCursor';
import { AuthProvider } from './context/AuthContext';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><AdminLogin /></PageWrapper>} />
        <Route path="/dashboard" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
        <Route path="/posts" element={<PageWrapper><Posts /></PageWrapper>} />
        <Route path="/projects" element={<PageWrapper><Projects /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/stories" element={<PageWrapper><StoryLibrary /></PageWrapper>} />
        <Route path="/stories/:id" element={<PageWrapper><StoryDetail /></PageWrapper>} />
        <Route path="/stories/:id/chapters/:chapterId" element={<PageWrapper><StoryReader /></PageWrapper>} />
        <Route path="/web3" element={<PageWrapper><Web3Landing /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, filter: "blur(10px)", scale: 1.02 }}
    animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
    exit={{ opacity: 0, filter: "blur(10px)", scale: 0.98 }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CustomCursor />
        <NavbarWrapper />
        <div className="bg-dark-bg min-h-screen text-gray-200 selection:bg-neon-cyan selection:text-black">
          <AnimatedRoutes />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

const NavbarWrapper = () => {
    const location = useLocation();
    const isWeb3 = location.pathname === '/web3';
    if (isWeb3) return null;
    return <Navbar />;
};

export default App;

