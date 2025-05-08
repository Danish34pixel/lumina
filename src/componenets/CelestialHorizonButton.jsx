import { useEffect, useRef } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

export default function SunScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      30,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    camera.position.y = 2;

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let spherical = new THREE.Spherical(7.5, Math.PI / 2, 0);

    const updateCameraPosition = () => {
      camera.position.setFromSpherical(spherical);
      camera.lookAt(0, 3, 0);
    };

    updateCameraPosition();

    // Mouse drag to rotate
    const onMouseDown = () => (isDragging = true);
    const onMouseUp = () => (isDragging = false);
    const onMouseMove = (event) => {
      if (isDragging) {
        const deltaMove = {
          x:
            event.movementX || event.mozMovementX || event.webkitMovementX || 0,
          y:
            event.movementY || event.mozMovementY || event.webkitMovementY || 0,
        };
        spherical.theta -= deltaMove.x * 0.005;
        spherical.phi -= deltaMove.y * 0.005;
        spherical.phi = Math.max(0.1, Math.min(Math.PI - 0.1, spherical.phi));
        updateCameraPosition();
      }
    };

    containerRef.current.addEventListener("mousedown", onMouseDown);
    containerRef.current.addEventListener("mouseup", onMouseUp);
    containerRef.current.addEventListener("mousemove", onMouseMove);

    // Resize handler
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    // Shader Material Helper
    const shaderUniforms = { time: { value: 0 } };

    // Sun
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(2.5, 64, 64),
      new THREE.ShaderMaterial({
        uniforms: shaderUniforms,
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          varying vec3 vPosition;
          varying vec3 vNormal;
          void main() {
            vUv = uv;
            vPosition = position;
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `/* INSERT YOUR SUN FRAGMENT SHADER HERE */`,
      })
    );
    sun.castShadow = true;
    scene.add(sun);

    // Corona
    const corona = new THREE.Mesh(
      new THREE.SphereGeometry(2.6, 64, 64),
      new THREE.ShaderMaterial({
        uniforms: shaderUniforms,
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec2 vUv;
          void main() {
            vNormal = normal;
            vPosition = position;
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          varying vec3 vNormal;
          varying vec3 vPosition;
          varying vec2 vUv;

          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

          float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

            vec3 i  = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);

            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);

            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;

            i = mod289(i);
            vec4 p = permute(permute(permute(
                      i.z + vec4(0.0, i1.z, i2.z, 1.0))
                    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

            float n_ = 0.142857142857;
            vec3 ns = n_ * D.wyz - D.xzx;

            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);

            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);

            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);

            vec4 s0 = floor(b0) * 2.0 + 1.0;
            vec4 s1 = floor(b1) * 2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));

            vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);

            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
            p0 *= norm.x;
            p1 *= norm.y;
            p2 *= norm.z;
            p3 *= norm.w;

            vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
          }

          void main() {
            vec3 viewDir = normalize(-vPosition);
            float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
            rim = pow(rim, 2.0);

            float speed = time * 0.5;
            float noise1 = snoise(vec3(vUv * 3.0, speed)) * 0.5 + 0.5;
            float noise2 = snoise(vec3(vUv * 8.0, speed * 0.7 + 100.0)) * 0.5 + 0.5;

            float wave1 = sin(vUv.x * 20.0 + time * 0.3) * 0.5 + 0.5;
            float wave2 = sin(vUv.y * 15.0 + time * 0.4 + noise1 * 5.0) * 0.5 + 0.5;

            float coronaIntensity = rim * (noise1 * 0.7 + 0.3) * (wave1 * 0.3 + 0.7) * (wave2 * 0.3 + 0.7);
            vec3 coronaColor = mix(vec3(1.0, 0.6, 0.1), vec3(1.0, 0.9, 0.6), noise2);
            coronaIntensity = pow(coronaIntensity, 1.5);

            gl_FragColor = vec4(coronaColor, coronaIntensity * 1.6);
          }
        `,
        transparent: true,
        side: THREE.FrontSide,
      })
    );
    scene.add(corona);

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      shaderUniforms.time.value = clock.getElapsedTime();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      // Cleanup
      containerRef.current.removeChild(renderer.domElement);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      className="overflow-x-hidden"
      ref={containerRef}
      style={{
        width: "100%",
        height: "100vh",
        position: "relative", // Make sure the shadow is visible
        backgroundColor: "white", // Add a background color to the container
        boxShadow: "0 4px 20px rgba(255, 165, 0, 0.7)", // Increase the shadow size and blur
      }}
    >
      <motion.h1
        initial={{ opacity: 0, scale: 1.2, rotate: 12, y: -50 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: 12,
          y: [0, -20, 0, -10, 0], // bounce path
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          times: [0, 0.3, 0.6, 0.85, 1],
        }}
        className="absolute z-[50] text-9xl text-white left-[30vh] top-[40vh] fire-burn"
      >
        Design . Your . Story
      </motion.h1>
    </div>
  );
}
