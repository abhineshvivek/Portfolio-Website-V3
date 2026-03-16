import { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Preloader } from './components/Preloader';
import { AmbientLight } from './components/AmbientLight';
import { NoiseOverlay } from './components/NoiseOverlay';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { FreelanceGrid } from './components/FreelanceGrid';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { ProjectDetail } from './components/ProjectDetail';
import { CaseStudy } from './components/CaseStudy';
import { ProjectsPage } from './pages/ProjectsPage';
import { Photobook } from './components/Photobook';
import { SEO } from './components/SEO';
import { CursorProvider } from './context/CursorContext';
import { ModalProvider } from './context/ModalContext';
import { CustomCursor } from './components/CustomCursor';
import { ResumeModal } from './components/ResumeModal';

function App() {
  const [introActive, setIntroActive] = useState(true);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Default dark
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Handle smooth scrolling and native browser block
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // When returning to the homepage with a hash, wait a tick for components to mount and then scroll smoothly
    if (location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Clear the hash gracefully
          window.history.replaceState(null, '', location.pathname);
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  // Prevent scrolling while intro is active
  useEffect(() => {
    if (introActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [introActive]);

  return (
    <CursorProvider>
      <ModalProvider>
        <div className="bg-zinc-50 dark:bg-[#050505] min-h-screen text-zinc-900 dark:text-white font-sans selection:bg-brand selection:text-white pb-32 md:pb-0 transition-colors duration-300 overflow-x-hidden">
          <CustomCursor />
          <ResumeModal />
          {introActive && <Preloader onComplete={() => {
            setIntroActive(false);
            setHasPlayedIntro(true);
          }} />}

          <main className="w-full relative z-10">
            <AmbientLight />
            <NoiseOverlay />

            {!introActive && (
              <Navbar
                skipDelay={hasPlayedIntro}
                isDarkMode={isDarkMode}
                toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
              />
            )}
            <SEO />

            <AnimatePresence mode="wait">
              {!introActive && (
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.5, type: 'spring', damping: 20 }}
                    >
                      <Hero skipDelay={hasPlayedIntro} />
                      <Projects />
                      <FreelanceGrid />
                      <About />
                      <Contact />
                    </motion.div>
                  } />
                  <Route path="/project/:id" element={
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.5, type: 'spring', damping: 20 }}
                    >
                      <ProjectDetail />
                    </motion.div>
                  } />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/work/:slug" element={
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.5, type: 'spring', damping: 20 }}
                    >
                      <CaseStudy />
                    </motion.div>
                  } />
                  <Route path="/photobook" element={
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.5, type: 'spring', damping: 20 }}
                    >
                      <Photobook />
                    </motion.div>
                  } />
                </Routes>
              )}
            </AnimatePresence>
          </main>
        </div>
      </ModalProvider>
    </CursorProvider>
  );
}

export default App;
