import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";

// Projects Data
const projects = [
  {
    src: "i_project_one_main.png",
    title: "Astraluxe Ecom",
    desc: "Boutique E-com platform – web UI, logo, typography, branding, and components.",
  },
  {
    src: "i_project_two_main.png",
    title: "Bowl of Sunshine",
    desc: "Personal food blog – web UI, logo, typography, branding, and components.",
  },
  {
    src: "i_project_three_main.png",
    title: "FrogPAY Bank",
    desc: "Landing page with stylized UI for a modern credit card neo bank.",
  },
  {
    src: "i_project_four_main.png",
    title: "FrogWAN Clothing",
    desc: "Landing page with stylized UI for a minimal clothing brand.",
  },
  {
    src: "i_project_five_main.png",
    title: "NexStop",
    desc: "Ticket booking mobile app – UI, logo, typography, branding, and design system.",
  },
  {
    src: "i_project_six_main.png",
    title: "GOI Mausam",
    desc: "Modern UI redesign of a government-led weather app with a detailed case study.",
  },
];

// ShinyText Component
const ShinyText = ({ text, disabled = false, speed = 5, className = "" }) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`text-[#b5b5b5a4] over bg-clip-text inline-block ${
        disabled ? "" : "animate-shine"
      } ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0.8) 50%, rgba(255, 255, 255, 0) 60%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        animationDuration: animationDuration,
      }}
    >
      {text}
    </div>
  );
};

export default function Spacepage() {
  // Ref for detecting when component enters viewport
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if viewport is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Track scroll progress for the entire section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Transform the width as we scroll - expanding from 100% to 300%
  const width = useTransform(scrollYProgress, [0, 1], ["100vw", "300vw"]);

  // Calculate total scrollable width for horizontal scrolling
  const totalScrollX = isMobile
    ? projects.length * 300 - window.innerWidth
    : projects.length * 420 - window.innerWidth;

  // Transform horizontal position based on scroll progress
  const x = useTransform(scrollYProgress, [0, 1], [0, -totalScrollX]);

  // Initial animation states
  const [isInView, setIsInView] = useState(false);

  // Detect when section enters viewport
  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Scale and opacity transformations for the main container
  const containerScale = useTransform(
    scrollYProgress,
    [0, 0.2, 1],
    [0.5, 1, 1]
  );
  const containerOpacity = useTransform(scrollYProgress, [0, 0.15], [0.3, 1]);

  // Additional scale for cards within the container
  const cardScale = useTransform(scrollYProgress, [0, 0.2, 1], [0.8, 1, 1]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.2], [0.6, 1]);

  return (
    <section
      ref={(el) => {
        containerRef.current = el;
        sectionRef.current = el;
      }}
      className="h-[300vh] relative bg-gray-800" // Standard solid background color
      style={{ width }} // Apply dynamic width
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Title that fades out as you scroll */}
        <motion.h1
          className="absolute text-white text-5xl font-bold text-center w-full z-10"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]),
            y: useTransform(scrollYProgress, [0, 0.15], [0, -50]),
          }}
        >
          Featured Projects
        </motion.h1>

        {/* Main container with pop-up animation */}
        <motion.div
          className="w-full flex items-center justify-center origin-center"
          style={{
            scale: containerScale,
            opacity: containerOpacity,
          }}
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{
            scale: isInView ? [0.3, 1] : 0.3,
            opacity: isInView ? [0, 1] : 0,
          }}
          transition={{
            duration: 1.2,
            ease: [0.34, 1.56, 0.64, 1], // Spring-like effect
            delay: 0.2,
          }}
        >
          {/* Projects container with horizontal scroll effect */}
          <motion.div
            style={{ x, scale: cardScale, opacity: cardOpacity }}
            className="flex space-x-8 px-12 md:px-20 py-8"
          >
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                className="bg-white rounded-2xl shadow-2xl p-6 min-w-[280px] max-w-[280px] md:min-w-[380px] md:max-w-[380px] h-[400px] md:h-[500px] flex flex-col items-center justify-between shrink-0 backdrop-filter backdrop-blur-sm bg-opacity-90"
              >
                <div className="w-full h-2/3 overflow-hidden rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                  <img
                    src={`/Space/${project.src}`}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>

                <div className="flex flex-col space-y-2 w-full">
                  <h3 className="text-xl md:text-2xl font-bold text-center text-gray-800">
                    {project.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-600 text-center">
                    {project.desc}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 bg-red-700 hover:bg-red-800 text-white py-2 px-6 rounded-full text-sm md:text-base font-medium transition-colors duration-300"
                  >
                    View Project
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Progress indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2 h-1 bg-white rounded-full"
        style={{
          width: useTransform(scrollYProgress, [0, 1], ["5%", "30%"]),
          opacity: useTransform(
            scrollYProgress,
            [0, 0.1, 0.9, 1],
            [0, 1, 1, 0]
          ),
        }}
      />

      {/* Explore more projects button with shiny text */}
      <button className="mt-8 bg-transparent border-2 border-red-500 text-white px-6 py-2 rounded-full relative left-[300vh] overflow-hidden group ">
        <ShinyText
          text="Explore more projects"
          speed={3}
          className="group-hover:animate-shine"
        />
        <span className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
      </button>
    </section>
  );
}
