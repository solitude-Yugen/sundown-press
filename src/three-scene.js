/* ╔══════════════════════════════════════════════════════════════════╗
   ║  SUNDOWN PRESS — Module: three-scene.js                        ║
   ║  Three.js background: particle field, wave mesh, sun sphere    ║
   ║  + hero card particle ring                                      ║
   ╚══════════════════════════════════════════════════════════════════╝ */

'use strict';

import { COLORS } from './brand.js';

/**
 * Initialises the Three.js background canvas scene.
 * Exports a `setScrollY(value)` helper so the scroll module
 * can push the current scroll position into the shader uniforms.
 *
 * Requires THREE to be available as a global (CDN script tag).
 */
export function initThreeScene() {
  const canvas = document.getElementById('three-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  camera.position.z = 5;

  // ── Gold particle field ──────────────────────────────────────
  const particleCount     = 800;
  const particlesGeometry = new THREE.BufferGeometry();
  const positions         = new Float32Array(particleCount * 3);
  const sizes             = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * 20;
    positions[i3 + 1] = (Math.random() - 0.5) * 20;
    positions[i3 + 2] = (Math.random() - 0.5) * 15;
    sizes[i]          = Math.random() * 3 + 0.5;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1));

  const particlesMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
    uniforms: {
      uTime:    { value: 0 },
      uColor1:  { value: new THREE.Color(COLORS.gold) },
      uColor2:  { value: new THREE.Color(COLORS.goldLight) },
      uScrollY: { value: 0 },
    },
    vertexShader: `
      attribute float aSize;
      uniform float uTime;
      uniform float uScrollY;
      varying float vAlpha;
      varying float vColorMix;

      void main() {
        vec3 pos = position;
        pos.y += sin(uTime * 0.5 + position.x * 0.3) * 0.3;
        pos.x += cos(uTime * 0.3 + position.y * 0.2) * 0.2;
        pos.y -= uScrollY * 0.0005;

        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPos;
        gl_PointSize = aSize * (300.0 / -mvPos.z);

        vAlpha    = smoothstep(0.0, 0.5, sin(uTime * 0.8 + position.x * 2.0 + position.z * 3.0) * 0.5 + 0.5);
        vColorMix = sin(uTime * 0.2 + position.y) * 0.5 + 0.5;
      }
    `,
    fragmentShader: `
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      varying float vAlpha;
      varying float vColorMix;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float glow  = pow(1.0 - smoothstep(0.0, 0.5, dist), 2.0);
        vec3  color = mix(uColor1, uColor2, vColorMix);
        gl_FragColor = vec4(color, glow * vAlpha * 0.4);
      }
    `,
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // ── Subtle wave mesh ─────────────────────────────────────────
  const waveGeometry = new THREE.PlaneGeometry(30, 15, 80, 40);
  const waveMaterial = new THREE.ShaderMaterial({
    transparent: true,
    side:        THREE.DoubleSide,
    depthWrite:  false,
    uniforms: {
      uTime:    { value: 0 },
      uColor:   { value: new THREE.Color(COLORS.tealMid) },
      uScrollY: { value: 0 },
    },
    vertexShader: `
      uniform float uTime;
      uniform float uScrollY;
      varying float vHeight;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec3 pos = position;
        pos.z  = sin(pos.x * 0.3 + uTime * 0.4) * 0.4
               + sin(pos.x * 0.5 + pos.y * 0.3 + uTime * 0.3) * 0.25
               + cos(pos.y * 0.4 + uTime * 0.5) * 0.15;
        pos.z -= uScrollY * 0.001;
        vHeight = pos.z;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vHeight;
      varying vec2 vUv;

      void main() {
        float alpha = smoothstep(-0.5, 0.8, vHeight) * 0.06;
        alpha *= smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
  });

  const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
  waveMesh.rotation.x = -Math.PI / 4;
  waveMesh.position.set(0, -2, -3);
  scene.add(waveMesh);

  // ── Glowing sun sphere ───────────────────────────────────────
  const sunMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime:   { value: 0 },
      uColor1: { value: new THREE.Color(COLORS.gold) },
      uColor2: { value: new THREE.Color(COLORS.goldLight) },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv    = uv;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      varying vec2 vUv;
      varying vec3 vNormal;

      void main() {
        vec3  color   = mix(uColor1, uColor2, vUv.y + sin(uTime * 0.5) * 0.1);
        float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        color += fresnel * 0.3;
        gl_FragColor = vec4(color, 0.15 + fresnel * 0.1);
      }
    `,
  });

  const sunMesh = new THREE.Mesh(new THREE.SphereGeometry(0.8, 64, 64), sunMaterial);
  sunMesh.position.set(3, 2, -5);
  scene.add(sunMesh);

  // Sun torus rings
  for (let i = 0; i < 3; i++) {
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(1.2 + i * 0.5, 0.02, 8, 64),
      new THREE.MeshBasicMaterial({ color: COLORS.gold, transparent: true, opacity: 0.04 - i * 0.01 })
    );
    ring.position.copy(sunMesh.position);
    ring.rotation.x = Math.PI / 2;
    ring.userData   = { speed: 0.2 + i * 0.1 };
    scene.add(ring);
  }

  // ── Hero card particle ring ──────────────────────────────────
  const cardRingCount    = 100;
  const cardRingGeo      = new THREE.BufferGeometry();
  const cardRingPos      = new Float32Array(cardRingCount * 3);
  const cardRingSizes    = new Float32Array(cardRingCount);

  for (let i = 0; i < cardRingCount; i++) {
    const angle = (i / cardRingCount) * Math.PI * 2;
    const radius = 2 + Math.random() * 0.5;
    const i3 = i * 3;
    cardRingPos[i3]     = Math.cos(angle) * radius + 2.5;
    cardRingPos[i3 + 1] = Math.sin(angle) * radius;
    cardRingPos[i3 + 2] = -2 + Math.random() * 0.5;
    cardRingSizes[i]    = Math.random() * 2 + 0.5;
  }

  cardRingGeo.setAttribute('position', new THREE.BufferAttribute(cardRingPos, 3));
  cardRingGeo.setAttribute('aSize',    new THREE.BufferAttribute(cardRingSizes, 1));

  const cardRingMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
    uniforms: {
      uTime:  { value: 0 },
      uColor: { value: new THREE.Color(COLORS.gold) },
    },
    vertexShader: `
      attribute float aSize;
      uniform float uTime;
      varying float vAlpha;

      void main() {
        vec3 pos    = position;
        float angle = atan(pos.y, pos.x - 2.5);
        float radius = length(vec2(pos.x - 2.5, pos.y));
        float newAngle = angle + uTime * 0.3;
        pos.x = cos(newAngle) * radius + 2.5;
        pos.y = sin(newAngle) * radius;
        pos.z += sin(uTime + angle * 3.0) * 0.2;

        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        gl_Position  = projectionMatrix * mvPos;
        gl_PointSize = aSize * (200.0 / -mvPos.z);
        vAlpha = 0.3 + 0.3 * sin(uTime * 2.0 + angle * 5.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      varying float vAlpha;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float glow = pow(1.0 - smoothstep(0.0, 0.5, dist), 2.5);
        gl_FragColor = vec4(uColor, glow * vAlpha * 0.5);
      }
    `,
  });

  const cardRingParticles = new THREE.Points(cardRingGeo, cardRingMat);
  scene.add(cardRingParticles);

  // ── Mouse parallax tracking ──────────────────────────────────
  let mouseX = 0, mouseY = 0, targetMouseX = 0, targetMouseY = 0;

  document.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Animation loop ───────────────────────────────────────────
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    particlesMaterial.uniforms.uTime.value = t;
    waveMaterial.uniforms.uTime.value      = t;
    sunMaterial.uniforms.uTime.value       = t;
    cardRingMat.uniforms.uTime.value       = t;

    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;
    camera.position.x = mouseX * 0.3;
    camera.position.y = mouseY * 0.2;
    camera.lookAt(0, 0, 0);

    particles.rotation.y = t * 0.02;
    particles.rotation.x = t * 0.01;

    sunMesh.position.y = 2 + Math.sin(t * 0.5) * 0.3;
    sunMesh.rotation.y = t * 0.1;

    scene.children.forEach((child) => {
      if (child.userData && child.userData.speed) {
        child.rotation.z = t * child.userData.speed;
        child.position.y = sunMesh.position.y;
      }
    });

    cardRingParticles.rotation.z = t * 0.05;
    cardRingParticles.position.y = Math.sin(t * 0.3) * 0.2;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // Expose a setter so the scroll module can push scrollY into shader uniforms
  return {
    setScrollY(value) {
      particlesMaterial.uniforms.uScrollY.value = value;
      waveMaterial.uniforms.uScrollY.value      = value;
    },
  };
}
