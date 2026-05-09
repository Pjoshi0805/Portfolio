/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Github, Linkedin, ArrowRight, Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// --- Magnetic Component ---
const Magnetic = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 15, stiffness: 150 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set(clientX - centerX);
    y.set(clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
    >
      {children}
    </motion.div>
  );
};

// --- Spotlight Text Component ---
const SpotlightText = ({ text }: { text: string }) => {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 30, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 30, stiffness: 200 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  // We use CSS variables to avoid re-rendering the component on every move
  const spotlightX = useTransform(springX, (v) => `${v}px`);
  const spotlightY = useTransform(springY, (v) => `${v}px`);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative cursor-none select-none group py-20 overflow-hidden"
    >
      {/* Background Text (Low Opacity) */}
      <h2 className="text-[10vw] font-serif leading-none opacity-5 text-brand-dark">
        {text}
      </h2>
      
      {/* Foreground Revealed Text (Masked) */}
      <motion.h2 
        className="text-[12vw] lg:text-[10vw] font-serif leading-none absolute inset-0 text-brand-yellow pointer-events-none flex items-center justify-center"
        style={{
          clipPath: useTransform(
            [spotlightX, spotlightY],
            ([x, y]) => isHovered ? `circle(150px at ${x} ${y})` : `circle(0px at ${x} ${y})`
          ),
          transition: 'clip-path 0.3s ease-out'
        }}
      >
        {text}
      </motion.h2>
    </div>
  );
};

// --- Components ---

const Navigation = ({ onNavClick }: { onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void }) => {
  const navItems = [
    { label: 'ABOUT', href: '#about' },
    { label: 'SKILLS', href: '#skills' },
    { label: 'PROJECTS', href: '#projects' },
    { label: 'CONTACT', href: '#contact' },
  ];

  const socialItems = [
    { label: 'GITHUB', href: 'https://github.com/Pjoshi0805' },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full p-6 lg:p-8 flex justify-center lg:justify-end items-start z-50 mix-blend-difference pointer-events-none">
      <div className="flex flex-wrap justify-center lg:justify-end gap-x-6 lg:gap-x-12 gap-y-4 pointer-events-auto max-w-xl">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={(e) => onNavClick(e, item.href)}
            className="text-[9px] lg:text-[10px] tracking-[0.2em] font-medium transition-all duration-500 relative group cursor-pointer text-white"
          >
            {item.label}
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-500 group-hover:w-full" />
          </a>
        ))}
        <div className="hidden lg:flex gap-x-12">
          {socialItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-[10px] tracking-[0.2em] font-medium text-white/60 hover:text-white transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

const SectionHero = () => {
  const letters = ['P', 'a', 'r', 'a', 's'];

  return (
    <motion.section
      id="about"
      initial={{ backgroundColor: '#D1A740' }}
      animate={{ backgroundColor: '#D1A740' }}
      className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden py-32"
    >
      <div className="relative flex flex-col items-center text-center px-8 z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <span className="absolute -top-12 right-0 text-[10px] tracking-[0.2em] font-medium opacity-50 hidden md:block">(2026)</span>
          <h1 className="text-7xl md:text-[12vw] lg:text-[18vw] leading-[0.8] font-serif font-black tracking-tighter text-brand-dark flex items-baseline justify-center select-text">
            {letters.map((letter, i) => (
              <span
                key={i}
                className={`relative inline-block hover:text-white transition-colors duration-500 ${letter === 'a' && i === 1 ? 'italic' : ''}`}
              >
                {letter}
              </span>
            ))}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-12 inline-flex items-center gap-4 px-6 py-2 rounded-full border border-brand-dark/10 bg-brand-dark/5 backdrop-blur-sm"
        >
          <span className="w-2 h-2 rounded-full bg-brand-dark animate-pulse" />
          <p className="text-[11px] tracking-[0.3em] font-bold uppercase text-brand-dark">
            Full Stack Developer
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 max-w-[600px] w-full"
        >
          <p className="text-[13px] lg:text-[15px] leading-relaxed tracking-wide font-medium serif italic text-brand-dark/80 flex flex-wrap justify-center">
            {`"I'm Paras Joshi. A pre-final year CSE student and a full stack developer who just really likes building stuff. Not much more to it than that. I get an idea, I open a blank file, and I don't stop until something's running on a screen. Most of my projects start at midnight and live on GitHub. I'm into open source, I'm into clean code, and I'm definitely not into writing about myself in third person but here we are."`
              .split(" ")
              .map((word, i) => (
                <motion.span
                  key={i}
                  initial={{
                    opacity: 0,
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 200 - 100,
                    rotate: Math.random() * 90 - 45,
                    scale: 1.5,
                    filter: 'blur(8px)'
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    y: 0,
                    rotate: 0,
                    scale: 1,
                    filter: 'blur(0px)'
                  }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 1 + i * 0.02,
                    duration: 1.2,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-block mr-[0.3em] py-1"
                >
                  {word}
                </motion.span>
              ))}
          </p>
        </motion.div>
      </div>

      <div className="absolute top-12 left-12">
        <Star className="w-6 h-6 opacity-40 shrink-0" strokeWidth={1} />
      </div>
    </motion.section>
  );
};

const SectionSkills = () => {
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springX = useSpring(cursorX, { stiffness: 100, damping: 20 });
  const springY = useSpring(cursorY, { stiffness: 100, damping: 20 });

  const skills = [
    { name: "HTML", logo: "/skill-logos/html.svg" },
    { name: "CSS", logo: "/skill-logos/css.svg" },
    { name: "Tailwind CSS", logo: "/skill-logos/tailwindcss.svg" },
    { name: "GSAP", logo: "/skill-logos/gsap.svg" },
    { name: "Javascript", logo: "/skill-logos/javascript.svg" },
    { name: "React", logo: "/skill-logos/react.svg" },
    { name: "Next", logo: "/skill-logos/nextjs.svg" },
    { name: "Node JS", logo: "/skill-logos/nodejs.svg" },
    { name: "Express JS", logo: "/skill-logos/expressjs.svg" },
    { name: "Mongo DB", logo: "/skill-logos/mongodb.svg" },
    { name: "Prisma", logo: "/skill-logos/prisma.svg" }
  ];

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    cursorX.set(clientX);
    cursorY.set(clientY);
  };

  return (
    <section 
      id="skills" 
      className="bg-brand-cream px-12 lg:px-32 py-48 relative border-t border-brand-dark/10 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="text-[8vw] leading-none mb-32 font-serif"
        >
          Skills
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-8">
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.8 }}
              onMouseEnter={() => setHoveredSkill(skill.logo)}
              onMouseLeave={() => setHoveredSkill(null)}
              className="group relative py-8 border-b border-brand-yellow/30 flex items-baseline gap-6 cursor-none"
            >
              <span className="text-[10px] tracking-widest font-bold opacity-30">
                {index < 9 ? `0${index + 1}` : index + 1}
              </span>
              <h3 className="text-3xl lg:text-5xl font-serif transition-all duration-500 group-hover:italic group-hover:translate-x-4">
                {skill.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {hoveredSkill && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="fixed pointer-events-none z-[100] w-20 h-20 lg:w-32 lg:h-32"
            style={{
              left: springX,
              top: springY,
              translateX: '-50%',
              translateY: '-50%'
            }}
          >
            <img 
              src={hoveredSkill} 
              alt="Skill Logo" 
              className="w-full h-full object-contain filter drop-shadow-2xl brightness-110"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const SectionProjects = () => {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);

  const projects = [
    {
      title: "DevRoom",
      category: "01 / Collaborative Tool",
      description: "A browser-based code editor where multiple people can write and run code together in real time. Think Google Docs but for code. Built with React on the front, Node + Socket.io on the back, and Monaco Editor for the actual coding experience.",
      img: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2062&auto=format&fit=crop"
    },
    {
      title: "Linkify",
      category: "02 / Analytics Platform",
      description: "A full stack URL shortener that actually does more than just shorten links. Every link gets its own dashboard showing clicks, locations, devices, and referral sources. Built with Next.js, Express, and MongoDB.",
      img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "OpenTask",
      category: "03 / Productivity",
      description: "A clean, no-fluff task and project tracker built for small teams or solo devs. Drag and drop boards, deadlines, assignees, and a real-time activity feed. Built with React, Node, Prisma, and PostgreSQL.",
      img: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=2076&auto=format&fit=crop"
    }
  ];

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const sections = gsap.utils.toArray('.project-card');

      gsap.to(sections, {
        xPercent: -100 * (sections.length - 1),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (sections.length - 1),
          end: () => "+=" + containerRef.current.offsetWidth
        }
      });

      // Parallax background text
      gsap.to(".projects-bg-text", {
        x: -500,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2
        }
      });
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section id="projects" ref={sectionRef} className="bg-brand-dark overflow-hidden lg:min-h-screen border-t border-white/10">
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none whitespace-nowrap overflow-hidden">
        <h2 className="projects-bg-text text-[40vw] font-serif text-white font-black leading-none uppercase">
          Work Work Work
        </h2>
      </div>

      <div ref={containerRef} className="flex flex-col lg:flex-row h-auto lg:h-screen lg:w-[300vw]">
        {projects.map((project, index) => (
          <div key={index} className="project-card w-full lg:w-screen min-h-screen lg:h-full flex items-center justify-center p-8 lg:p-32 relative border-b lg:border-none border-white/5">
            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center z-10">
              <div className="relative group overflow-hidden rounded-2xl aspect-video">
                <img
                  src={project.img}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-brand-dark/40 group-hover:bg-brand-dark/20 transition-colors duration-500" />
              </div>

              <div className="text-white">
                <span className="text-brand-yellow text-[10px] tracking-[0.4em] uppercase mb-4 lg:mb-6 block">
                  {project.category}
                </span>
                <h3 className="text-4xl lg:text-9xl font-serif mb-6 lg:mb-8 leading-none italic lg:group-hover:not-italic transition-all duration-700">
                  {project.title}
                </h3>
                <p className="text-sm lg:text-lg opacity-60 leading-relaxed mb-8 lg:mb-12 max-w-xl">
                  {project.description}
                </p>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-6 text-brand-yellow border-b border-brand-yellow pb-4 group"
                >
                  <span className="text-[10px] tracking-[0.4em] uppercase font-bold">Explore Project</span>
                  <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-2" />
                </motion.button>
              </div>
            </div>

            <div className="absolute bottom-12 lg:bottom-24 left-8 lg:left-32 text-white/20 font-serif italic text-xl lg:text-2xl">
              0{index + 1}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const SectionContact = () => {
  return (
    <section id="contact" className="min-h-screen w-full flex flex-col items-center justify-center bg-brand-cream py-32 px-12 lg:px-32 relative border-t border-brand-dark/10">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-7xl w-full text-center"
      >
        <div className="mb-12">
          <SpotlightText text="Let's Build Something." />
        </div>

        <Magnetic>
          <motion.a
            whileHover={{ scale: 1.05 }}
            href="mailto:paras521851@gmail.com"
            className="text-2xl lg:text-5xl font-serif text-brand-yellow hover:text-brand-dark transition-colors inline-flex items-center gap-4 border-b-2 border-brand-yellow pb-4 relative group"
          >
            paras521851@gmail.com
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight className="w-8 h-8 lg:w-12 lg:h-12" />
            </motion.div>
          </motion.a>
        </Magnetic>

        <div className="mt-24 flex justify-center gap-16">
          <a href="https://github.com/Pjoshi0805" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-4">
            <Github className="w-10 h-10 group-hover:text-brand-yellow transition-colors" strokeWidth={1} />
            <span className="text-[10px] tracking-widest opacity-40 uppercase">GitHub</span>
          </a>
          <a href="#" className="group flex flex-col items-center gap-4">
            <Linkedin className="w-10 h-10 group-hover:text-brand-yellow transition-colors" strokeWidth={1} />
            <span className="text-[10px] tracking-widest opacity-40 uppercase">LinkedIn</span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}

const CustomCursor = () => {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 150 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };
    
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden lg:flex items-center gap-6 text-brand-yellow font-mono text-2xl font-bold"
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.5,
      }}
      transition={{ duration: 0.3 }}
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <span className="drop-shadow-[0_0_12px_rgba(209,167,64,0.8)]">{"<"}</span>
      <span className="drop-shadow-[0_0_12px_rgba(209,167,64,0.8)]">{">"}</span>
    </motion.div>
  );
};

const FloatingPetal = ({ delay = 0, style = {} }: { delay?: number, style?: any }) => (
  <motion.div
    initial={{ y: -20, x: -20, rotate: 0, opacity: 0 }}
    animate={{
      y: [0, 200, 400, 600, 800],
      x: [0, 40, -40, 60, -60],
      rotate: [0, 90, -90, 180, 0],
      opacity: [0, 0.4, 0.4, 0.4, 0]
    }}
    transition={{
      duration: 15,
      repeat: Infinity,
      delay: delay,
      ease: "easeInOut"
    }}
    className="fixed pointer-events-none z-0"
    style={style}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
      <path d="M12 2C12 2 15 8 18 10C21 12 22 15 20 18C18 21 14 22 12 20C10 22 6 21 4 18C2 15 3 12 6 10C9 8 12 2 12 2Z" fill="currentColor" />
    </svg>
  </motion.div>
);

// --- Main App ---

const PageTransition = ({ isActive }: { isActive: boolean }) => (
  <motion.div
    initial={{ scaleY: 0 }}
    animate={{ scaleY: isActive ? 1 : 0 }}
    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
    className="fixed inset-0 bg-brand-dark z-[100] origin-bottom pointer-events-none"
  />
);

export default function App() {
  const scrollRef = useRef(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Animate transition, then scroll, then hide transition
    setTimeout(() => {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'auto' });
      }

      setTimeout(() => {
        setIsTransitioning(false);
      }, 400);
    }, 800);
  };

  return (
    <main className="relative bg-brand-cream overflow-x-hidden scroll-smooth selection:bg-brand-yellow selection:text-brand-dark" ref={scrollRef}>
      <PageTransition isActive={isTransitioning} />
      <CustomCursor />
      <Navigation onNavClick={handleNavClick} />

      {/* Background Floating Elements */}
      <FloatingPetal delay={0} style={{ top: '10%', left: '10%' }} />
      <FloatingPetal delay={4} style={{ top: '30%', left: '80%' }} />
      <FloatingPetal delay={8} style={{ top: '60%', left: '15%' }} />
      <FloatingPetal delay={2} style={{ top: '80%', left: '70%' }} />

      <div className={isTransitioning ? 'opacity-0 transition-opacity duration-500' : 'opacity-100 transition-opacity duration-500'}>
        <motion.div animate={{ opacity: 1 }}>
          <SectionHero />
          <SectionSkills />
          <SectionProjects />
          <SectionContact />
        </motion.div>
      </div>

      <footer className="p-12 text-center border-t border-brand-dark/10 bg-brand-cream relative z-10">
        <p className="text-[10px] tracking-[0.4em] uppercase opacity-40">
          © 2026 Paras — paras521851@gmail.com
        </p>
      </footer>
    </main>
  );
}


