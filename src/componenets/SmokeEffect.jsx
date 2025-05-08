// // import React, { useEffect, useState } from "react";

// // // Function to generate random RGB color
// // const getRandomColor = () => {
// //   const r = Math.floor(Math.random() * 256);
// //   const g = Math.floor(Math.random() * 256);
// //   const b = Math.floor(Math.random() * 256);
// //   return `rgb(${r}, ${g}, ${b})`;
// // };

// // const Sparkle = ({ x, y }) => {
// //   const [color] = useState(getRandomColor());
// //   const [movement] = useState({
// //     translateX: Math.random() * 20 - 10, // Random horizontal movement (-10 to 10px)
// //     translateY: Math.random() * 20 - 10, // Random vertical movement (-10 to 10px)
// //     opacity: Math.random() * 0.3 + 0.7, // Random opacity (between 0.7 and 1)
// //     scale: Math.random() * 0.4 + 0.6, // Random scale (between 0.6 and 1)
// //   });

// //   // Animation for floating effect
// //   useEffect(() => {
// //     const timeout = setTimeout(() => {
// //       // After a brief period, remove the sparkle (particle disappears)
// //     }, 1500); // Duration of the float effect

// //     return () => clearTimeout(timeout);
// //   }, []);

// //   return (
// //     <div
// //       className="sparkle"
// //       style={{
// //         position: "absolute",
// //         left: `${x - 2}px`, // Position the sparkle at the mouse position
// //         top: `${y - 2}px`, // Position the sparkle at the mouse position
// //         background: color,
// //         width: `${Math.random() * 4 + 2}px`, // Random width and height
// //         height: `${Math.random() * 4 + 2}px`,
// //         borderRadius: "50%",
// //         opacity: movement.opacity, // Random opacity for fading effect
// //         transform: `translate(${movement.translateX}px, ${movement.translateY}px) scale(${movement.scale})`,
// //         pointerEvents: "none",
// //         animation: "floatEffect 1.5s ease-in-out infinite",
// //       }}
// //     />
// //   );
// // };

// // export default Sparkle;
// // import React, { useEffect, useState } from "react";

// // // Function to generate random RGB color
// // const getRandomColor = () => {
// //   const r = Math.floor(Math.random() * 256);
// //   const g = Math.floor(Math.random() * 256);
// //   const b = Math.floor(Math.random() * 256);
// //   return `rgb(${r}, ${g}, ${b})`;
// // };

// // const Sparkl = ({ x, y }) => {
// //   const [color] = useState(getRandomColor());
// //   const [movement] = useState({
// //     translateX: Math.random() * 20 - 10, // Random horizontal movement (-10 to 10px)
// //     translateY: Math.random() * 20 - 10, // Random vertical movement (-10 to 10px)
// //     opacity: Math.random() * 0.3 + 0.7, // Random opacity (between 0.7 and 1)
// //     scale: Math.random() * 0.4 + 0.6, // Random scale (between 0.6 and 1)
// //   });

// //   // Animation for floating effect
// //   useEffect(() => {
// //     const timeout = setTimeout(() => {
// //       // After a brief period, remove the sparkle (particle disappears)
// //     }, 1500); // Duration of the float effect

// //     return () => clearTimeout(timeout);
// //   }, []);

// //   return (
// //     <div
// //       className="sparkl"
// //       style={{
// //         position: "absolute",
// //         left: `${x - 2}px`, // Position the sparkle at the mouse position
// //         top: `${y - 2}px`, // Position the sparkle at the mouse position
// //         background: color,
// //         width: `${Math.random() * 4 + 2}px`, // Random width and height
// //         height: `${Math.random() * 4 + 2}px`,
// //         borderRadius: "50%",
// //         opacity: movement.opacity, // Random opacity for fading effect
// //         transform: `translate(${movement.translateX}px, ${movement.translateY}px) scale(${movement.scale})`,
// //         pointerEvents: "none",
// //         animation: "floatEffect 1.5s ease-in-out infinite",
// //       }}
// //     />
// //   );
// // };

// // const Sparkle = () => {
// //   const [particles, setParticles] = useState([]);

// //   const handleMouseMove = (e) => {
// //     // When mouse moves, create a new sparkle at cursor position
// //     const { clientX, clientY } = e;
// //     setParticles((prevParticles) => [
// //       ...prevParticles,
// //       { x: clientX, y: clientY },
// //     ]);
// //   };

// //   useEffect(() => {
// //     // Add event listener for mouse move
// //     window.addEventListener("mousemove", handleMouseMove);

// //     // Clean up the event listener
// //     return () => {
// //       window.removeEventListener("mousemove", handleMouseMove);
// //     };
// //   }, []);

// //   return (
// //     <div style={{ position: "relative", height: "100vh", width: "100%" }}>
// //       {particles.map((particle, index) => (
// //         <Sparkle key={index} x={particle.x} y={particle.y} />
// //       ))}
// //     </div>
// //   );
// // };

// // export default Sparkle;
// import React, { useEffect, useState } from "react";

// // Generate random RGB color
// const getRandomColor = () => {
//   const r = Math.floor(Math.random() * 256);
//   const g = Math.floor(Math.random() * 256);
//   const b = Math.floor(Math.random() * 256);
//   return `rgb(${r}, ${g}, ${b})`;
// };

// const Sparkle = ({ x, y, id, remove }) => {
//   const [style, setStyle] = useState({
//     left: x,
//     top: y,
//     opacity: 1,
//     transform: `scale(${Math.random() * 0.5 + 0.5})`,
//     background: getRandomColor(),
//     blur: Math.random() * 2 + 2,
//   });

//   useEffect(() => {
//     const timeout = setTimeout(() => {
//       setStyle((prev) => ({
//         ...prev,
//         opacity: 0,
//         top: prev.top - 30,
//         transform: `scale(${Math.random() * 0.5 + 0.8})`,
//       }));
//     }, 10);

//     const removeTimeout = setTimeout(() => {
//       remove(id);
//     }, 1200); // Particle disappears after fade

//     return () => {
//       clearTimeout(timeout);
//       clearTimeout(removeTimeout);
//     };
//   }, [id, remove]);

//   return (
//     <div
//       className="sparkle"
//       style={{
//         position: "absolute",
//         left: style.left,
//         top: style.top,
//         width: "8px",
//         height: "8px",
//         background: style.background,
//         borderRadius: "50%",
//         pointerEvents: "none",
//         opacity: style.opacity,
//         transform: style.transform,
//         filter: `blur(${style.blur}px)`,
//         transition: "all 1.2s ease-out",
//         zIndex: 9999,
//       }}
//     />
//   );
// };

// const SmokeEffect = () => {
//   const [particles, setParticles] = useState([]);

//   useEffect(() => {
//     const handleMouseMove = (e) => {
//       const newParticle = {
//         id: Math.random(),
//         x: e.clientX,
//         y: e.clientY,
//       };
//       setParticles((prev) => [...prev, newParticle]);
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     return () => window.removeEventListener("mousemove", handleMouseMove);
//   }, []);

//   const removeParticle = (id) => {
//     setParticles((prev) => prev.filter((p) => p.id !== id));
//   };

//   return (
//     <div
//       style={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         height: "100vh",
//         width: "100vw",
//         overflow: "hidden",
//         pointerEvents: "none",
//       }}
//     >
//       {particles.map((p) => (
//         <Sparkle key={p.id} x={p.x} y={p.y} id={p.id} remove={removeParticle} />
//       ))}
//     </div>
//   );
// };

// export default SmokeEffect;

import React from "react";
import SplashCursor from "./SplashCursor/SplashCursor";

const SmokeEffect = () => {
  return <SplashCursor />;
};

export default SmokeEffect;
