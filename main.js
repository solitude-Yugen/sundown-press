/* ╔══════════════════════════════════════════════════════════════════╗
   ║  SUNDOWN PRESS — Landing Page JavaScript                      ║
   ║  Three.js Background · GSAP Animations · Parallax · Counters  ║
   ╚══════════════════════════════════════════════════════════════════╝ */

(function () {
  'use strict';

  // ─── BRAND COLORS ──────────────────────────────────────────
  const COLORS = {
    gold:       0xD4A03C,
    goldLight:  0xE8C547,
    teal:       0x0F3D3E,
    tealMid:    0x1A5E5F,
    cream:      0xF5F0E1,
    creamLight: 0xFAF6EC,
  };

  // ═══════════════════════════════════════════════════════════
  //  1. PRELOADER
  // ═══════════════════════════════════════════════════════════
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    setTimeout(() => {
      preloader.classList.add('hide');
      setTimeout(() => {
        preloader.style.display = 'none';
        initGSAPAnimations();
      }, 800);
    }, 2400);
  });

  // ═══════════════════════════════════════════════════════════
  //  2. THREE.JS — Floating Gold Particle Field
  // ═══════════════════════════════════════════════════════════
  const canvas = document.getElementById('three-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  camera.position.z = 5;

  // — Create floating particles —
  const particleCount = 800;
  const particlesGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * 20;
    positions[i3 + 1] = (Math.random() - 0.5) * 20;
    positions[i3 + 2] = (Math.random() - 0.5) * 15;

    velocities[i3]     = (Math.random() - 0.5) * 0.002;
    velocities[i3 + 1] = Math.random() * 0.003 + 0.001;
    velocities[i3 + 2] = (Math.random() - 0.5) * 0.001;

    sizes[i] = Math.random() * 3 + 0.5;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

  // Custom shader material for gold sparkle particles
  const particlesMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(COLORS.gold) },
      uColor2: { value: new THREE.Color(COLORS.goldLight) },
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

        vAlpha = smoothstep(0.0, 0.5, sin(uTime * 0.8 + position.x * 2.0 + position.z * 3.0) * 0.5 + 0.5);
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

        float glow = 1.0 - smoothstep(0.0, 0.5, dist);
        glow = pow(glow, 2.0);

        vec3 color = mix(uColor1, uColor2, vColorMix);
        float alpha = glow * vAlpha * 0.4;

        gl_FragColor = vec4(color, alpha);
      }
    `,
  });

  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // — Create subtle wave mesh (representing ocean/waves from logo) —
  const waveGeometry = new THREE.PlaneGeometry(30, 15, 80, 40);
  const waveMaterial = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(COLORS.tealMid) },
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

        float wave1 = sin(pos.x * 0.3 + uTime * 0.4) * 0.4;
        float wave2 = sin(pos.x * 0.5 + pos.y * 0.3 + uTime * 0.3) * 0.25;
        float wave3 = cos(pos.y * 0.4 + uTime * 0.5) * 0.15;
        pos.z = wave1 + wave2 + wave3;
        pos.z -= uScrollY * 0.001;

        vHeight = pos.z;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uTime;
      varying float vHeight;
      varying vec2 vUv;

      void main() {
        float alpha = smoothstep(-0.5, 0.8, vHeight) * 0.06;
        alpha *= smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
        vec3 col = uColor;
        gl_FragColor = vec4(col, alpha);
      }
    `,
  });

  const waveMesh = new THREE.Mesh(waveGeometry, waveMaterial);
  waveMesh.rotation.x = -Math.PI / 4;
  waveMesh.position.y = -2;
  waveMesh.position.z = -3;
  scene.add(waveMesh);

  // — Floating sun sphere (like the logo) —
  const sunGeometry = new THREE.SphereGeometry(0.8, 64, 64);
  const sunMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(COLORS.gold) },
      uColor2: { value: new THREE.Color(COLORS.goldLight) },
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
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
        vec3 color = mix(uColor1, uColor2, vUv.y + sin(uTime * 0.5) * 0.1);

        // Fresnel glow
        float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        color += fresnel * 0.3;

        float alpha = 0.15 + fresnel * 0.1;
        gl_FragColor = vec4(color, alpha);
      }
    `,
  });

  const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
  sunMesh.position.set(3, 2, -5);
  scene.add(sunMesh);

  // — Sun rays (torus rings) —
  for (let i = 0; i < 3; i++) {
    const ringGeometry = new THREE.TorusGeometry(1.2 + i * 0.5, 0.02, 8, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: COLORS.gold,
      transparent: true,
      opacity: 0.04 - i * 0.01,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.copy(sunMesh.position);
    ring.rotation.x = Math.PI / 2;
    ring.userData = { speed: 0.2 + i * 0.1, index: i };
    scene.add(ring);
  }

  // — Mouse tracking for parallax camera movement —
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  document.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // — Animation loop —
  let scrollY = 0;
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Update uniforms
    particlesMaterial.uniforms.uTime.value = elapsed;
    particlesMaterial.uniforms.uScrollY.value = scrollY;
    waveMaterial.uniforms.uTime.value = elapsed;
    waveMaterial.uniforms.uScrollY.value = scrollY;
    sunMaterial.uniforms.uTime.value = elapsed;

    // Smooth mouse follow
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    camera.position.x = mouseX * 0.3;
    camera.position.y = mouseY * 0.2;
    camera.lookAt(0, 0, 0);

    // Rotate particles group slightly
    particles.rotation.y = elapsed * 0.02;
    particles.rotation.x = elapsed * 0.01;

    // Sun floating
    sunMesh.position.y = 2 + Math.sin(elapsed * 0.5) * 0.3;
    sunMesh.rotation.y = elapsed * 0.1;

    // Rotate rings
    scene.children.forEach((child) => {
      if (child.userData && child.userData.speed) {
        child.rotation.z = elapsed * child.userData.speed;
        child.position.y = sunMesh.position.y;
      }
    });

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  // ═══════════════════════════════════════════════════════════
  //  3. SCROLL TRACKING
  // ═══════════════════════════════════════════════════════════
  window.addEventListener('scroll', () => {
    scrollY = window.pageYOffset;
  });

  // ═══════════════════════════════════════════════════════════
  //  4. GSAP ANIMATIONS
  // ═══════════════════════════════════════════════════════════
  function initGSAPAnimations() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // — Hero title lines —
    gsap.to('.title-line', {
      opacity: 1,
      y: 0,
      duration: 1.0,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.3,
    });

    // — Generic fade-up —
    document.querySelectorAll('[data-animate="fade-up"]').forEach((el) => {
      const delay = parseFloat(el.dataset.delay) || 0;
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay: delay,
        ease: 'power3.out',
      });
    });

    // — Fade right —
    document.querySelectorAll('[data-animate="fade-right"]').forEach((el) => {
      const delay = parseFloat(el.dataset.delay) || 0;
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: delay,
        ease: 'power3.out',
      });
    });

    // — Fade left —
    document.querySelectorAll('[data-animate="fade-left"]').forEach((el) => {
      const delay = parseFloat(el.dataset.delay) || 0;
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        x: 0,
        duration: 0.8,
        delay: delay,
        ease: 'power3.out',
      });
    });

    // — Stagger up (card grids) —
    document.querySelectorAll('[data-animate="stagger-up"]').forEach((container) => {
      const children = container.children;
      gsap.to(children, {
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'power3.out',
      });
    });

    // — Parallax sections —
    gsap.utils.toArray('.parallax-divider').forEach((section) => {
      const content = section.querySelector('.parallax-content');
      gsap.fromTo(
        content,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // — Parallax depth on greeting cards —
    gsap.utils.toArray('.visual-card').forEach((card, i) => {
      gsap.to(card, {
        y: -20 - i * 10,
        scrollTrigger: {
          trigger: card.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
        },
      });
    });

    // — Nav scroll behavior (only logo in center when scrolled) —
    const nav = document.getElementById('main-nav');
    const updateNavScroll = () => {
      if (!nav) return;
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', updateNavScroll, { passive: true });
    updateNavScroll();

    // — Floating CTA bar —
    ScrollTrigger.create({
      start: () => window.innerHeight * 0.8,
      onEnter: () => document.getElementById('floating-cta').classList.add('show'),
      onLeaveBack: () => document.getElementById('floating-cta').classList.remove('show'),
    });

    // — Marquee parallax speed change —
    gsap.to('.marquee-content', {
      x: '-50%',
      scrollTrigger: {
        trigger: '.marquee-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    });

    // (Hero text/card parallax moved to new split layout section below)



    gsap.to('.hero-decor', {
      y: -150,
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 2,
      },
    });

    // — Hero 3D Card entrance animation —
    const hero3dCard = document.getElementById('hero3dCard');
    if (hero3dCard) {
      // Fly in the card from below with a rotation
      gsap.fromTo(hero3dCard,
        { y: 120, opacity: 0, rotateX: 15, rotateY: -10, scale: 0.8 },
        {
          y: 0, opacity: 1, rotateX: 0, rotateY: 0, scale: 1,
          duration: 1.6,
          delay: 0.5,
          ease: 'power3.out',
        }
      );

      // Subtle continuous floating
      gsap.to(hero3dCard, {
        y: '-=10',
        duration: 3.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2.2,
      });

      // NO AUTO-OPEN: the card remains gracefully closed until the user interacts with it!
      const badgeText = document.getElementById('suiteBadgeText');

      // Click to toggle open/close
      hero3dCard.addEventListener('click', () => {
        const isOpening = !hero3dCard.classList.contains('opened');
        hero3dCard.classList.toggle('opened');
        if (badgeText) {
          badgeText.textContent = isOpening ? 'Click to Close' : 'Click to Open Invitation';
        }
      });

      // Keyboard accessibility
      hero3dCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          hero3dCard.click();
        }
      });

      // Subtle 3D mouse tilt tracking on the envelope suite using CSS variables
      const suiteElem = hero3dCard.querySelector('.envelope-suite');
      if (suiteElem) {
        hero3dCard.addEventListener('mousemove', (e) => {
          const rect = hero3dCard.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          suiteElem.style.setProperty('--tilt-x', `${-y * 12}deg`);
          suiteElem.style.setProperty('--tilt-y', `${x * 12}deg`);
        });

        hero3dCard.addEventListener('mouseleave', () => {
          suiteElem.style.setProperty('--tilt-x', '0deg');
          suiteElem.style.setProperty('--tilt-y', '0deg');
        });
      }

      // Generate subtle floating gold sparkles around the envelope
      const sparklesContainer = document.getElementById('cardSparkles');
      if (sparklesContainer && sparklesContainer.children.length === 0) {
        for (let i = 0; i < 14; i++) {
          const sparkle = document.createElement('div');
          sparkle.className = 'card-sparkle';
          sparkle.style.top = `${Math.random() * 90 + 5}%`;
          sparkle.style.left = `${Math.random() * 90 + 5}%`;
          sparkle.style.setProperty('--tx', `${(Math.random() - 0.5) * 40}px`);
          sparkle.style.setProperty('--ty', `${(Math.random() - 0.5) * 40 - 20}px`);
          sparkle.style.setProperty('--dur', `${2.5 + Math.random() * 2.5}s`);
          sparkle.style.setProperty('--delay', `${Math.random() * 3}s`);
          sparklesContainer.appendChild(sparkle);
        }
      }
    }

    // — Carousel card entrance stagger —
    const carouselCards = document.querySelectorAll('.carousel-card');
    if (carouselCards.length) {
      gsap.fromTo(carouselCards,
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: (i) => {
            const stagger = carouselCards[i].style.getPropertyValue('--stagger-y');
            return stagger ? parseInt(stagger) : 0;
          },
          scale: 1,
          duration: 0.8,
          stagger: 0.04,
          delay: 1.2,
          ease: 'power3.out',
        }
      );
    }

    // — Hero text side parallax on scroll —
    gsap.to('.hero-text-side', {
      y: -80,
      opacity: 0.3,
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
    });

    gsap.to('.hero-card-side', {
      y: -40,
      opacity: 0.5,
      scrollTrigger: {
        trigger: '.hero-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 2,
      },
    });
  }

  // ═══════════════════════════════════════════════════════════
  //  5. COUNTER ANIMATION
  // ═══════════════════════════════════════════════════════════
  function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach((counter) => {
      const target = parseInt(counter.dataset.count, 10);
      const duration = 2000;
      const start = 0;
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (target - start) * eased);

        counter.textContent = current.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    });
  }

  // Trigger counters when hero stats come into view
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  const parallaxStats = document.querySelector('.parallax-stats-row');
  if (parallaxStats) {
    const psObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('[data-count]');
            counters.forEach((counter) => {
              const target = parseInt(counter.dataset.count, 10);
              const duration = 2000;
              const startTime = performance.now();

              function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(target * eased).toLocaleString();
                if (progress < 1) requestAnimationFrame(update);
              }

              requestAnimationFrame(update);
            });
            psObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    psObserver.observe(parallaxStats);
  }

  // ═══════════════════════════════════════════════════════════
  //  6. NAVIGATION
  // ═══════════════════════════════════════════════════════════
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-link').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ═══════════════════════════════════════════════════════════
  //  7. CARD TILT EFFECT
  // ═══════════════════════════════════════════════════════════
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / centerY * -5;
      const rotateY = (x - centerX) / centerX * 5;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;

      // Move the glow effect
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.left = `${x - rect.width}px`;
        glow.style.top = `${y - rect.height}px`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ═══════════════════════════════════════════════════════════
  //  8. FLOATING GOLD PARTICLES (HTML Overlay)
  // ═══════════════════════════════════════════════════════════
  const particleOverlay = document.getElementById('particles-overlay');

  function createFloatingParticle() {
    const particle = document.createElement('div');
    const size = Math.random() * 4 + 1;
    const startX = Math.random() * 100;
    const duration = Math.random() * 8 + 6;
    const delay = Math.random() * 5;

    particle.style.cssText = `
      position: absolute;
      bottom: -10px;
      left: ${startX}%;
      width: ${size}px;
      height: ${size}px;
      background: radial-gradient(circle, rgba(212, 160, 60, 0.8), rgba(212, 160, 60, 0));
      border-radius: 50%;
      animation: floatUp ${duration}s ${delay}s linear infinite;
      pointer-events: none;
    `;

    particleOverlay.appendChild(particle);
  }

  // Add the floatUp keyframe
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes floatUp {
      0% {
        transform: translateY(0) translateX(0) scale(0);
        opacity: 0;
      }
      10% {
        opacity: 0.6;
        transform: translateY(-10vh) translateX(10px) scale(1);
      }
      50% {
        opacity: 0.4;
      }
      90% {
        opacity: 0.1;
      }
      100% {
        transform: translateY(-105vh) translateX(${Math.random() > 0.5 ? '' : '-'}${Math.random() * 60}px) scale(0.3);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(styleSheet);

  // Create a handful of floating particles
  for (let i = 0; i < 25; i++) {
    createFloatingParticle();
  }

  // ═══════════════════════════════════════════════════════════
  //  9. CARD HOVER CONFETTI BURST (micro-interaction)
  // ═══════════════════════════════════════════════════════════
  document.querySelectorAll('.greeting-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      const confetti = card.querySelector('.card-confetti');
      if (!confetti) return;

      // Create a few small confetti particles
      for (let i = 0; i < 8; i++) {
        const particle = document.createElement('span');
        const colors = ['#D4A03C', '#E8C547', '#0F3D3E', '#FF6B6B', '#4ECDC4'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = (Math.PI * 2 / 8) * i;
        const distance = 30 + Math.random() * 30;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;

        particle.style.cssText = `
          position: absolute;
          width: 6px;
          height: 6px;
          background: ${color};
          border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
          top: 50%;
          left: 50%;
          pointer-events: none;
          z-index: 10;
          animation: confettiBurst 0.8s ease-out forwards;
          --tx: ${x}px;
          --ty: ${y}px;
        `;

        confetti.appendChild(particle);
        setTimeout(() => particle.remove(), 800);
      }
    });
  });

  // Add confetti keyframe
  const confettiStyle = document.createElement('style');
  confettiStyle.textContent = `
    @keyframes confettiBurst {
      0% {
        transform: translate(0, 0) scale(1) rotate(0deg);
        opacity: 1;
      }
      100% {
        transform: translate(var(--tx), var(--ty)) scale(0.3) rotate(${360 + Math.random() * 360}deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(confettiStyle);

  // ═══════════════════════════════════════════════════════════
  //  10. CUSTOM CURSOR GLOW (desktop only)
  // ═══════════════════════════════════════════════════════════
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(212, 160, 60, 0.06), transparent 70%);
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      transition: transform 0.15s ease;
    `;
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top = e.clientY + 'px';
    });
  }

  // ═══════════════════════════════════════════════════════════
  //  11. CARD SPARKLE GENERATOR
  // ═══════════════════════════════════════════════════════════
  const cardSparklesContainer = document.getElementById('cardSparkles');
  if (cardSparklesContainer) {
    for (let i = 0; i < 20; i++) {
      const sparkle = document.createElement('div');
      sparkle.classList.add('card-sparkle');

      const angle = Math.random() * Math.PI * 2;
      const distance = 30 + Math.random() * 80;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance;

      sparkle.style.cssText = `
        left: ${40 + Math.random() * 20}%;
        top: ${40 + Math.random() * 20}%;
        --tx: ${tx}px;
        --ty: ${ty}px;
        --dur: ${3 + Math.random() * 4}s;
        --delay: ${Math.random() * 3}s;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
      `;

      cardSparklesContainer.appendChild(sparkle);
    }
  }

  // ═══════════════════════════════════════════════════════════
  //  12. THREE.JS HERO CARD PARTICLE RING
  // ═══════════════════════════════════════════════════════════
  // Create a ring of particles around where the card is for extra magic
  const cardRingCount = 100;
  const cardRingGeometry = new THREE.BufferGeometry();
  const cardRingPositions = new Float32Array(cardRingCount * 3);
  const cardRingSizes = new Float32Array(cardRingCount);

  for (let i = 0; i < cardRingCount; i++) {
    const angle = (i / cardRingCount) * Math.PI * 2;
    const radius = 2 + Math.random() * 0.5;
    const i3 = i * 3;
    cardRingPositions[i3] = Math.cos(angle) * radius + 2.5; // offset to right side where card is
    cardRingPositions[i3 + 1] = Math.sin(angle) * radius;
    cardRingPositions[i3 + 2] = -2 + Math.random() * 0.5;
    cardRingSizes[i] = Math.random() * 2 + 0.5;
  }

  cardRingGeometry.setAttribute('position', new THREE.BufferAttribute(cardRingPositions, 3));
  cardRingGeometry.setAttribute('aSize', new THREE.BufferAttribute(cardRingSizes, 1));

  const cardRingMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(COLORS.gold) },
    },
    vertexShader: `
      attribute float aSize;
      uniform float uTime;
      varying float vAlpha;

      void main() {
        vec3 pos = position;
        float angle = atan(pos.y, pos.x - 2.5);
        float radius = length(vec2(pos.x - 2.5, pos.y));
        float newAngle = angle + uTime * 0.3;
        pos.x = cos(newAngle) * radius + 2.5;
        pos.y = sin(newAngle) * radius;
        pos.z += sin(uTime + angle * 3.0) * 0.2;

        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPos;
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

        float glow = 1.0 - smoothstep(0.0, 0.5, dist);
        glow = pow(glow, 2.5);

        gl_FragColor = vec4(uColor, glow * vAlpha * 0.5);
      }
    `,
  });

  const cardRingParticles = new THREE.Points(cardRingGeometry, cardRingMaterial);
  scene.add(cardRingParticles);

  // Update the animate loop to include the card ring
  const originalAnimate = animate;
  // We need to patch the time uniform into the render loop
  // Since animate is already running, we'll add a secondary loop
  function animateCardRing() {
    requestAnimationFrame(animateCardRing);
    const elapsed = clock.getElapsedTime();
    cardRingMaterial.uniforms.uTime.value = elapsed;

    // Subtle rotation of the ring group
    cardRingParticles.rotation.z = elapsed * 0.05;
    cardRingParticles.position.y = Math.sin(elapsed * 0.3) * 0.2;
  }
  animateCardRing();

  // ═══════════════════════════════════════════════════════════
  //  13. HOW IT WORKS — INTERACTIVE 3-STEP EXPERIENCE & ANIMATIONS
  // ═══════════════════════════════════════════════════════════
  (function initHowItWorks() {
    const section = document.getElementById('how-it-works') || document.getElementById('howItWorksSection');
    if (!section) return;

    const tabs = document.querySelectorAll('.hiw-tab');
    const glider = document.getElementById('hiwTabsGlider');
    const panels = document.querySelectorAll('.hiw-panel');
    const contentItems = document.querySelectorAll('.hiw-content-item');
    const fpTiers = document.querySelectorAll('.fp-tier');

    let isStep2Active = false;
    let isStep3Active = false;
    let isStep2Running = false;
    let isStep3Running = false;

    // Elements for Step 2
    const briefingState = document.getElementById('briefingState');
    const draftState = document.getElementById('draftState');
    const briefingNames = document.getElementById('briefingNames');
    const briefingDate = document.getElementById('briefingDate');
    const briefingVenue = document.getElementById('briefingVenue');
    const briefingSavedPill = document.getElementById('briefingSavedPill');
    const draftProgBarFill = document.getElementById('draftProgBarFill');
    const draftReadyFill = document.getElementById('draftReadyFill');
    const progStepReady = document.getElementById('progStepReady');

    // Elements for Step 3
    const waMsg1 = document.getElementById('waMsg1');
    const waMsg2 = document.getElementById('waMsg2');
    const waTypingBubble = document.getElementById('waTypingBubble');
    const liveRsvpsCard = document.getElementById('liveRsvpsCard');
    const rsvpAcceptsMetric = document.getElementById('rsvpAcceptsMetric');
    const rsvpDietMetric = document.getElementById('rsvpDietMetric');

    // ── STEP 1: Hover & 3D dynamic fan response ──
    const fanCardsStack = document.getElementById('fanCardsStack');
    if (fanCardsStack) {
      fanCardsStack.addEventListener('mousemove', (e) => {
        const rect = fanCardsStack.getBoundingClientRect();
        const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
        const normY = ((e.clientY - rect.top) / rect.height) * 2 - 1;

        const cards = fanCardsStack.querySelectorAll('.fan-card');
        cards.forEach((card) => {
          const baseRot = parseFloat(card.style.getPropertyValue('--rot')) || 0;
          const baseTx = parseFloat(card.style.getPropertyValue('--tx')) || 0;
          const dynamicRot = baseRot + normX * 4;
          const dynamicTx = baseTx + normX * 8;
          const dynamicTy = normY * -8;
          card.style.transform = `translateX(${dynamicTx}px) translateY(${dynamicTy}px) rotate(${dynamicRot}deg)`;
        });
      });

      fanCardsStack.addEventListener('mouseleave', () => {
        const cards = fanCardsStack.querySelectorAll('.fan-card');
        cards.forEach((card) => {
          const baseRot = card.style.getPropertyValue('--rot') || '0deg';
          const baseTx = card.style.getPropertyValue('--tx') || '0px';
          card.style.transform = `translateX(${baseTx}) rotate(${baseRot})`;
        });
      });
    }

    // Tiers click toggle
    fpTiers.forEach((tier) => {
      tier.addEventListener('click', () => {
        fpTiers.forEach((t) => t.classList.remove('active'));
        tier.classList.add('active');
      });
    });

    // Helper: Async sleep
    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Helper: Typewriter text simulation
    async function typeText(element, text, speed = 32) {
      if (!element) return false;
      element.innerHTML = '<span class="typing-cursor"></span>';
      for (let i = 0; i < text.length; i++) {
        if (!isStep2Active) return false;
        element.textContent = text.slice(0, i + 1);
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        element.appendChild(cursor);
        await sleep(speed);
      }
      const cursor = element.querySelector('.typing-cursor');
      if (cursor) cursor.remove();
      return true;
    }

    // ── STEP 2: Looping Briefing -> Draft ──
    async function runStep2Loop() {
      if (isStep2Running) return;
      isStep2Running = true;

      while (isStep2Active) {
        // --- PART A: Briefing Details Filling Out ---
        if (draftState) draftState.classList.remove('active');
        if (briefingState) briefingState.classList.add('active');

        if (briefingSavedPill) {
          briefingSavedPill.style.opacity = '0';
          briefingSavedPill.style.transform = 'translateY(-4px) scale(0.9)';
          briefingSavedPill.classList.remove('pill-saved');
        }

        if (briefingNames) briefingNames.innerHTML = '';
        if (briefingDate) briefingDate.innerHTML = '';
        if (briefingVenue) briefingVenue.innerHTML = '';

        await sleep(350);
        if (!isStep2Active) break;

        // Type Names
        const ok1 = await typeText(briefingNames, 'Priya & Arjun', 35);
        if (!ok1 || !isStep2Active) break;
        await sleep(150);

        // Type Date
        const ok2 = await typeText(briefingDate, '14 December 2024', 30);
        if (!ok2 || !isStep2Active) break;
        await sleep(150);

        // Type Venue
        const ok3 = await typeText(briefingVenue, 'The Jeypore Palace, Jaipur', 25);
        if (!ok3 || !isStep2Active) break;
        await sleep(200);

        // Show Saved Automatically with green pulse
        if (briefingSavedPill) {
          briefingSavedPill.style.opacity = '1';
          briefingSavedPill.style.transform = 'translateY(0) scale(1)';
          briefingSavedPill.classList.add('pill-saved');
        }

        // Pause on saved state
        await sleep(2400);
        if (!isStep2Active) break;

        // --- PART B: Your Draft Is Ready with Loading Progress Bar ---
        if (briefingState) briefingState.classList.remove('active');
        if (draftState) draftState.classList.add('active');

        // Reset progress bar
        if (draftProgBarFill) {
          draftProgBarFill.style.transition = 'none';
          draftProgBarFill.style.width = '0%';
        }
        if (draftReadyFill) {
          draftReadyFill.style.transition = 'none';
          draftReadyFill.style.width = '0%';
        }
        if (progStepReady) {
          progStepReady.classList.remove('step-complete');
          progStepReady.classList.add('step-pending');
        }

        // Force reflow
        if (draftProgBarFill) void draftProgBarFill.offsetWidth;
        await sleep(350);
        if (!isStep2Active) break;

        // Animate loading bar to completion
        if (draftProgBarFill) {
          draftProgBarFill.style.transition = 'width 2.4s cubic-bezier(0.4, 0, 0.2, 1)';
          draftProgBarFill.style.width = '100%';
        }

        await sleep(2400);
        if (!isStep2Active) break;

        // Complete the "Ready" step
        if (progStepReady) {
          progStepReady.classList.remove('step-pending');
          progStepReady.classList.add('step-complete');
        }
        if (draftReadyFill) {
          draftReadyFill.style.transition = 'width 0.4s ease';
          draftReadyFill.style.width = '100%';
        }

        // Celebrate draft ready state with button highlight
        const approveBtn = document.querySelector('.btn-approve');
        if (approveBtn) {
          approveBtn.style.transform = 'scale(1.05)';
          approveBtn.style.boxShadow = '0 0 16px rgba(212, 160, 60, 0.6)';
          setTimeout(() => {
            approveBtn.style.transform = '';
            approveBtn.style.boxShadow = '';
          }, 800);
        }

        await sleep(2800);
      }

      isStep2Running = false;
    }

    // ── STEP 3: Mock WhatsApp UI & Live RSVPs ──
    async function runStep3Sequence() {
      if (isStep3Running) return;
      isStep3Running = true;

      while (isStep3Active) {
        // Reset state
        if (waMsg1) {
          waMsg1.classList.remove('wa-visible');
          waMsg1.classList.add('wa-hidden');
          const blueTicks = waMsg1.querySelector('.blue-ticks');
          if (blueTicks) {
            blueTicks.style.color = '#888';
            blueTicks.textContent = '✓';
          }
        }
        if (waTypingBubble) waTypingBubble.style.display = 'none';
        if (waMsg2) {
          waMsg2.classList.remove('wa-visible');
          waMsg2.classList.add('wa-hidden');
        }
        if (liveRsvpsCard) {
          liveRsvpsCard.classList.remove('card-visible');
          liveRsvpsCard.classList.add('card-hidden');
        }
        if (rsvpAcceptsMetric) {
          rsvpAcceptsMetric.textContent = '0 guests';
          rsvpAcceptsMetric.classList.remove('metric-bump');
        }
        if (rsvpDietMetric) {
          rsvpDietMetric.textContent = '0 guests';
          rsvpDietMetric.classList.remove('metric-bump');
        }

        await sleep(350);
        if (!isStep3Active) break;

        // 1. Host shares link
        if (waMsg1) {
          waMsg1.classList.remove('wa-hidden');
          waMsg1.classList.add('wa-visible');
        }

        await sleep(800);
        if (!isStep3Active) break;

        // Double ticks turn blue (read receipt)
        if (waMsg1) {
          const blueTicks = waMsg1.querySelector('.blue-ticks');
          if (blueTicks) {
            blueTicks.textContent = '✓✓';
            blueTicks.style.color = '#34B7F1';
          }
        }

        await sleep(600);
        if (!isStep3Active) break;

        // 2. Typing indicator appears
        if (waTypingBubble) {
          waTypingBubble.style.display = 'inline-flex';
        }

        await sleep(1400);
        if (!isStep3Active) break;

        // 3. Guest excited message pops in
        if (waTypingBubble) waTypingBubble.style.display = 'none';
        if (waMsg2) {
          waMsg2.classList.remove('wa-hidden');
          waMsg2.classList.add('wa-visible');
        }

        await sleep(800);
        if (!isStep3Active) break;

        // 4. Live RSVPs Card elevates in
        if (liveRsvpsCard) {
          liveRsvpsCard.classList.remove('card-hidden');
          liveRsvpsCard.classList.add('card-visible');
        }

        await sleep(700);
        if (!isStep3Active) break;

        // 5. RSVP numbers count up with joyful bump
        if (rsvpAcceptsMetric) {
          rsvpAcceptsMetric.textContent = '2 guests';
          rsvpAcceptsMetric.classList.add('metric-bump');
          setTimeout(() => rsvpAcceptsMetric.classList.remove('metric-bump'), 600);
        }

        await sleep(500);
        if (!isStep3Active) break;

        if (rsvpDietMetric) {
          rsvpDietMetric.textContent = '1 guest';
          rsvpDietMetric.classList.add('metric-bump');
          setTimeout(() => rsvpDietMetric.classList.remove('metric-bump'), 600);
        }

        // Hold display for reading
        await sleep(6500);
      }

      isStep3Running = false;
    }

    // ── Observe when Step 2 and Step 3 scroll into view to trigger their live loops ──
    if ('IntersectionObserver' in window) {
      const stepObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.target.id === 'hiwStep2') {
            if (entry.isIntersecting) {
              isStep2Active = true;
              runStep2Loop();
            } else {
              isStep2Active = false;
            }
          } else if (entry.target.id === 'hiwStep3') {
            if (entry.isIntersecting) {
              isStep3Active = true;
              runStep3Sequence();
            } else {
              isStep3Active = false;
            }
          }
        });
      }, { threshold: 0.15 });

      const step2El = document.getElementById('hiwStep2');
      const step3El = document.getElementById('hiwStep3');
      if (step2El) stepObserver.observe(step2El);
      if (step3El) stepObserver.observe(step3El);
    } else {
      // Fallback: start loops directly
      isStep2Active = true;
      isStep3Active = true;
      runStep2Loop();
      runStep3Sequence();
    }

    // Smooth scroll for all HIW intra-section links (tabs & top track)
    document.querySelectorAll('.hiw-flow-section a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const offset = 80;
          const targetY = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({
            top: targetY,
            behavior: 'smooth'
          });
        }
      });
    });
  })();

  // ═══════════════════════════════════════════════════════════
  //  14. PERSISTENT CTA BAR & WHATSAPP BUTTON INTERACTION
  // ═══════════════════════════════════════════════════════════
  (function initPersistentCtas() {
    const ctaBar = document.getElementById('persistentCtaBar');
    const waBtn = document.getElementById('floatingWhatsappBtn');

    if (!ctaBar && !waBtn) return;

    // Show persistent bar only after scrolling past top of hero
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollY > 300) {
        if (ctaBar) ctaBar.style.transform = 'translateX(-50%) translateY(0)';
        if (ctaBar) ctaBar.style.opacity = '1';
        if (waBtn) waBtn.style.transform = 'scale(1)';
        if (waBtn) waBtn.style.opacity = '1';
      } else {
        if (ctaBar) ctaBar.style.transform = 'translateX(-50%) translateY(80px)';
        if (ctaBar) ctaBar.style.opacity = '0';
        if (waBtn) waBtn.style.transform = 'scale(0.8)';
        if (waBtn) waBtn.style.opacity = '0.7';
      }
    });

    // Trigger initial check
    if (ctaBar) {
      ctaBar.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease';
      ctaBar.style.transform = 'translateX(-50%) translateY(0)';
      ctaBar.style.opacity = '1';
    }
  })();

})();
