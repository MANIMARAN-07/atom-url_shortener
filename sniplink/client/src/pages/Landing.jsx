import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Link2, 
  BarChart3, 
  QrCode, 
  Zap, 
  Shield, 
  ArrowRight, 
  Globe,
  Sparkles
} from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Create short links in milliseconds. No rate limits, no wait times.',
    color: 'from-amber-400 to-orange-500',
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    description: 'Track clicks, devices, browsers, countries, and referrers in real-time.',
    color: 'from-indigo-400 to-purple-500',
  },
  {
    icon: QrCode,
    title: 'QR Codes',
    description: 'Generate beautiful QR codes for any link. Download as PNG instantly.',
    color: 'from-emerald-400 to-teal-500',
  },
  {
    icon: Shield,
    title: 'Custom Aliases',
    description: 'Brand your links with custom aliases like sniplink.io/my-brand.',
    color: 'from-rose-400 to-pink-500',
  },
  {
    icon: Globe,
    title: 'Geo Tracking',
    description: 'See exactly where your visitors are coming from around the world.',
    color: 'from-cyan-400 to-blue-500',
  },
  {
    icon: Sparkles,
    title: 'Bulk Shortening',
    description: 'Upload a CSV and shorten hundreds of URLs at once. Download results.',
    color: 'from-violet-400 to-purple-500',
  },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-navy text-white overflow-hidden">
      {/* Nav */}
      <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Link2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-2xl font-bold">
            Snip<span className="text-indigo-400">link</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Log in
          </Link>
          <Link
            to="/signup"
            className="px-5 py-2.5 text-sm font-medium bg-indigo-500 hover:bg-indigo-600 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative max-w-7xl mx-auto px-6 pt-20 pb-32">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative text-center max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-300 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Smart URL shortening with analytics
          </motion.div>

          <motion.h1 variants={fadeUp} className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Shorten URLs.
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Amplify reach.
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Transform unwieldy URLs into clean, branded short links with powerful analytics.
            Track every click, device, and location — all in one beautiful dashboard.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/30 group"
            >
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold rounded-xl transition-all duration-200"
            >
              Sign in
            </Link>
          </motion.div>

          {/* Animated demo */}
          <motion.div
            variants={fadeUp}
            className="mt-16 bg-white/5 border border-white/10 rounded-2xl p-6 max-w-xl mx-auto"
          >
            <div className="flex items-center gap-2 text-left mb-3">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-sm shrink-0">Input:</span>
                <div className="bg-white/5 rounded-lg px-4 py-2 text-sm text-slate-300 font-mono truncate flex-1">
                  https://www.example.com/very/long/url/that/nobody/wants-to-share?ref=campaign&utm_source=marketing
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="flex items-center gap-3"
              >
                <span className="text-emerald-400 text-sm shrink-0">Output:</span>
                <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-4 py-2 text-sm text-indigo-300 font-mono flex-1 text-left">
                  sniplink.io/<span className="text-indigo-400 font-semibold">xK9mQ2</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="relative max-w-7xl mx-auto px-6 pb-32">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeUp} className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Everything you need to manage links
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 text-lg max-w-xl mx-auto">
            From simple shortening to enterprise analytics — all packed into one clean interface.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={fadeUp}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] transition-all duration-300 group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="relative max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-12 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Ready to shorten your first link?
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of marketers and developers who trust Sniplink for their link management.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/30 group"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Link2 className="w-4 h-4" />
            <span>© {new Date().getFullYear()} Sniplink. All rights reserved.</span>
          </div>
          <p className="text-slate-600 text-xs">
            This project is a part of a hackathon run by{' '}
            <a href="https://katomaran.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
              katomaran.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
