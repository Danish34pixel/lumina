import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import SplashCursor from "./SplashCursor/SplashCursor";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegCircleDot } from "react-icons/fa6";
import Newpage1 from "./Newpage1";
import Spacepage from "./Spacepage";

import CelestialHorizonButton from "./CelestialHorizonButton";

const menuItems = [
  { tag: "h1", text: "HOME" },
  { tag: "h2", text: "SERVICES" },
  { tag: "h3", text: "PROJECT" },
  { tag: "h4", text: "CONTACT" },
];

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.BoxGeometry(0.1, 0.8, 0.3);

    const baseMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(1.0, 0.3, 0.6),
      metalness: 0.5,
      roughness: 0.2,
      emissive: new THREE.Color(0.5, 0.05, 0.2),
      emissiveIntensity: 0.8,
    });

    const count = 40;
    const radius = 1.5;
    const twist = 0.2;

    const shaderMaterial = baseMaterial.clone();
    shaderMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.time = { value: 0 };
      shader.vertexShader = `uniform float time;\n` + shader.vertexShader;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `vec3 transformed = vec3(position);
         transformed.x += 0.05 * sin(position.y * 10.0 + time * 2.0);
         transformed.z += 0.05 * cos(position.y * 10.0 + time * 2.0);`
      );
      shaderMaterial.userData.shader = shader;
    };

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(geometry, shaderMaterial);
      const angle = (i / count) * Math.PI * 2;
      mesh.position.x = Math.cos(angle) * radius;
      mesh.position.z = Math.sin(angle) * radius;
      mesh.rotation.y = angle + i * twist;
      mesh.rotation.x = 0.3;
      mesh.lookAt(0, 0, 0);
      group.add(mesh);
    }

    scene.add(new THREE.AmbientLight(0xffd700, 0.4));

    const topLight = new THREE.DirectionalLight(0xffd700, 1.5);
    topLight.position.set(0, 5, 2);
    scene.add(topLight);

    const bottomLight = new THREE.PointLight(0xffd700, 0.8, 10);
    bottomLight.position.set(0, -3, 3);
    scene.add(bottomLight);

    const centerGlow = new THREE.PointLight(0xffd700, 2, 5);
    centerGlow.position.set(0, 0, 1);
    scene.add(centerGlow);

    const sideLight = new THREE.PointLight(0xffd700, 1.5, 20);
    sideLight.position.set(3, 2, 2);
    scene.add(sideLight);

    let resizeTimeout;
    const onWindowResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, 100);
    };
    window.addEventListener("resize", onWindowResize);

    let pulse = 0;
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      pulse += 0.03;
      const intensity = 1.2 + Math.sin(pulse) * 0.3;

      if (shaderMaterial.userData?.shader) {
        shaderMaterial.userData.shader.uniforms.time.value = pulse;
        shaderMaterial.emissiveIntensity = intensity;
      }

      group.rotation.y = 15.5;
      group.rotation.x = 0.8;
      group.rotation.z = 0.1;

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", onWindowResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      shaderMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div
        style={{
          fontFamily: '"Bonheur Royale", cursive',
          width: "100%",
          height: "100vh",
          position: "relative",
          overflowX: "hidden", // Added overflow-x-hidden here
        }}
      >
        <img
          className="h-[15vh] w-[15vh] absolute left-0 top-0 z-40"
          src="/mylogo.png"
          alt="Logo"
        />

        <motion.p
          className="text-white absolute left-[8vh] top-[30vh] text-8xl z-[99999999]"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Illuminate Your <br /> Digital Presence <br /> With Dk
        </motion.p>

        <motion.button
          className="btn absolute z-[9999999] text-white top-[80vh] left-[30vh] text-4xl"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
        >
          Scroll to know more
          <motion.div
            className="text-4xl mt-2"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "loop" }}
          >
            ↓
          </motion.div>
        </motion.button>

        <motion.h1
          className="text-white absolute right-10 top-100 text-5xl z-[99999]"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          Transform Your Business <br /> With our Expert Design <br /> Solution
        </motion.h1>

        <div className="relative">
          <h1
            className={`text-white absolute z-[999999] right-15 flex gap-4 text-4xl top-5 cursor-pointer transition-opacity duration-300 ${
              menuOpen ? "opacity-0" : "opacity-100"
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            Menu <FaRegCircleDot className="text-orange-500" />
          </h1>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, translateX: 100 }}
                animate={{ opacity: 1, translateX: 0 }}
                exit={{ opacity: 0, translateX: 100 }}
                transition={{ duration: 0.4 }}
                className="w-[50vh] h-[55vh] rounded-2xl bg-gray-300 absolute z-[99999] right-0 shadow-lg p-6"
              >
                <button
                  onClick={() => setMenuOpen(false)}
                  className="absolute top-2 right-3 text-2xl text-black hover:text-orange-500 transition-colors"
                >
                  ✕
                </button>

                <div className="flex flex-col gap-4 text-black mt-8">
                  {menuItems.map((item, index) => {
                    const Tag = motion[item.tag];
                    return (
                      <Tag
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        className="hover:text-orange-400 transition-colors cursor-pointer"
                      >
                        {item.text}
                      </Tag>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          ref={mountRef}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 0,
          }}
        />

        <SplashCursor />
      </div>

      <Newpage1 />
      <Spacepage />
      <div className="flex justify-center items-center min-h-screen bg-black">
        <CelestialHorizonButton />
      </div>
    </>
  );
};

export default Landing;
