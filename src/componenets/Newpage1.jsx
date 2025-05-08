import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const cards = [
  {
    title: "UI/UX Design",
    desc: "We craft digital experiences that resonate...",
    src: "/i_service_card_1-removebg-preview-removebg-preview.png",
  },
  {
    title: "App & Web Development",
    desc: "Scalable solutions for web and mobile...",
    src: "/i_service_card_2-removebg-preview.png",
  },
  {
    title: "Brand Design",
    desc: "Consistent and striking brand visuals...",
    src: "/i_service_card_3-removebg-preview.png",
  },
  {
    title: "Design Consulting",
    desc: "Expert advice for design decisions...",
    src: "/i_service_card_4.png",
  },
  {
    title: "Content Strategy",
    desc: "Structured, impactful content plans...",
    src: "/i_service_card_5.png",
  },
];

const backgrounds = [
  "from-yellow-100 to-yellow-50",
  "from-blue-100 to-blue-50",
  "from-green-100 to-green-50",
  "from-sky-100 to-sky-50",
  "from-rose-100 to-rose-50",
];

export default function CardScrollSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showButton, setShowButton] = useState(true);
  const buttonRef = useRef(null);
  const isInView = useInView(buttonRef, { once: true, margin: "-100px" });

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const totalHeight = document.body.offsetHeight;

      // Detect bottom of the page/section
      setShowButton(scrollY + viewportHeight < totalHeight - 100);

      // Update active card
      const index = Math.min(Math.floor(scrollY / 500), cards.length - 1);
      setActiveIndex(index);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`relative h-[300vh] w-full transition-colors duration-700 over bg-gradient-to-br ${backgrounds[activeIndex]}`}
    >
      {/* Screws at corners */}
      {[
        "top-0 left-0",
        "top-0 right-0",
        "bottom-0 left-0",
        "bottom-0 right-0",
      ].map((pos, i) => (
        <div key={i} className={`absolute ${pos} p-4`}>
          <div className="w-8 h-8 bg-gray-600 rounded-full rotate-45 fixed shadow-xl" />
        </div>
      ))}

      {/* Sticky Content */}
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div className="flex w-full justify-around items-center px-12 space-x-10">
          {/* Card Stack */}
          <div className="relative w-[300px] h-[420px]">
            {cards.map((card, i) => {
              const isActive = i === activeIndex;
              const offset = i - activeIndex;

              return (
                <img
                  key={i}
                  src={card.src}
                  alt={card.title}
                  className={`absolute w-full h-full object-contain transition-all duration-700 ease-in-out cursor-pointer hover:scale-105 ${
                    isActive ? "shadow-xl" : "shadow-md"
                  }`}
                  style={{
                    zIndex: cards.length - i,
                    transform: `translateY(${offset * 20}px) rotate(${
                      isActive ? 0 : offset * 5
                    }deg) scale(${isActive ? 1 : 0.95})`,
                    opacity: isActive ? 1 : 0,
                  }}
                />
              );
            })}
          </div>

          {/* Right side text */}
          <div className="space-y-6 text-left text-gray-800">
            {cards.map((card, i) => {
              const isActive = i === activeIndex;
              return (
                <h2
                  key={i}
                  className={`text-4xl font-medium transition-all duration-500 ${
                    isActive
                      ? "font-bold text-black scale-110 opacity-100"
                      : "text-gray-500 opacity-50"
                  } hover:text-purple-600`}
                >
                  {card.title}
                </h2>
              );
            })}
          </div>
        </div>
      </div>

      {/* Animated Button - stays inside this section */}
      <div
        ref={buttonRef}
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-full flex justify-center"
      >
        <motion.button
          initial={{ opacity: 0, y: 50 }}
          animate={
            isInView && showButton
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: 50 }
          }
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-transparent text-black px-6 py-3 rounded-full shadow-lg hover:bg-purple-700 hover:text-white transition-all duration-300 border border-purple-700"
        >
          Our Services
        </motion.button>
      </div>
    </div>
  );
}
