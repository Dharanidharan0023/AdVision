import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import CustomCursor from './components/CustomCursor';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './pages/NotFound';
import { SocialProvider } from './context/SocialContext';
import { SiteProvider } from './context/SiteContext';
import Footer from './components/layout/Footer';

const Home = lazy(() => import('./pages/Home'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Posts = lazy(() => import('./pages/Posts'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectCategory = lazy(() => import('./pages/ProjectCategory'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Web3Landing = lazy(() => import('./pages/Web3Landing'));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/admin" element={<PageWrapper><AdminLogin /></PageWrapper>} />
        <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><AdminDashboard /></PageWrapper></ProtectedRoute>} />
        <Route path="/posts" element={<PageWrapper><Posts /></PageWrapper>} />
        <Route path="/projects" element={<PageWrapper><Projects /></PageWrapper>} />
        <Route path="/projects/:category" element={<PageWrapper><ProjectCategory /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/web3" element={<PageWrapper><Web3Landing /></PageWrapper>} />
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, filter: "blur(15px)", y: 20, scale: 0.98 }}
    animate={{ opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }}
    exit={{ opacity: 0, filter: "blur(15px)", y: -20, scale: 1.02 }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <SiteProvider>
            <SocialProvider>
              <BrowserRouter>
            <CustomCursor />
            <Toaster 
              position="bottom-right" 
              toastOptions={{
                style: {
                  background: 'rgba(10, 10, 15, 0.9)',
                  color: '#fff',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontFamily: "'Poppins', sans-serif"
                }
              }} 
            />
            <NavbarWrapper />
            <div className="bg-dark-bg min-h-screen text-gray-200 selection:bg-neon-cyan selection:text-black">
              <Suspense fallback={
                <div className="min-h-screen bg-[#050816] flex items-center justify-center">
                  <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                </div>
              }>
                <AnimatedRoutes />
              </Suspense>
            </div>
            <FooterWrapper />
            </BrowserRouter>
            </SocialProvider>
          </SiteProvider>
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

const NavbarWrapper = () => {
    const location = useLocation();
    const hidePaths = ['/web3', '/admin', '/dashboard'];
    const shouldHide = hidePaths.some((path) => location.pathname.startsWith(path));
    if (shouldHide) return null;
    return <Navbar />;
};

const FooterWrapper = () => {
    const location = useLocation();
    const hidePaths = ['/web3', '/admin', '/dashboard'];
    const shouldHide = hidePaths.some((path) => location.pathname.startsWith(path));
    if (shouldHide) return null;
    return <Footer />;
};

export default App;

