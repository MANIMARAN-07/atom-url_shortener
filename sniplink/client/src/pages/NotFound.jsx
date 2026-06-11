import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Unlink, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center"
      >
        <div className="w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Unlink className="w-10 h-10 text-rose-400" />
        </div>

        <h1 className="font-display text-5xl font-bold text-white mb-3">404</h1>
        <h2 className="font-display text-xl text-slate-300 mb-2">Link not found</h2>
        <p className="text-slate-500 text-sm max-w-sm mx-auto mb-8">
          This short link doesn't exist, has expired, or has been deactivated by its owner.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
