import { Component } from 'react';
import { motion } from 'framer-motion';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error in React tree:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050816] flex flex-col items-center justify-center text-white px-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl max-w-lg w-full text-center"
          >
            <h1 className="text-3xl font-black text-red-500 mb-4 uppercase tracking-widest">System Failure</h1>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              A critical error occurred while rendering this interface. Our systems have logged the incident.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all text-xs"
            >
              Restart Node
            </button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
