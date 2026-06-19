import { motion, useScroll, useSpring } from 'framer-motion'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Marketing from './components/Marketing'
import MoreProjects from './components/MoreProjects'
import Skills from './components/Skills'
import Experience from './components/Experience'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FloatingActions from './components/FloatingActions'

export default function App() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 })

  return (
    <>
      {/* fixed backgrounds */}
      <div className="bg-aurora" />
      <div className="bg-grid" />

      {/* scroll progress bar */}
      <motion.div
        style={{
          scaleX,
          transformOrigin: '0%',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 2.5,
          zIndex: 60,
          background: 'linear-gradient(90deg, var(--cyan), var(--electric), var(--violet))',
        }}
      />

      <Nav />

      <main>
        <Hero />
        <About />
        <Projects />
        <Marketing />
        <MoreProjects />
        <Skills />
        <Experience />
        <Education />
        <Contact />
      </main>

      <Footer />
      <FloatingActions />
    </>
  )
}
