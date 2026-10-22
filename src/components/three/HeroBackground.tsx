import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createCombustionScene, type FrameState } from './combustionScene';

const FOV = 45;
const CAMERA_Z = 14;

// Isolated so three.js can be code-split out of the main chunk and loaded lazily
// after the hero's first paint. The scene is plain three.js, so this owns the
// renderer, camera and render loop directly (no react-three-fiber): React never
// re-renders while it runs.
const HeroBackground = ({ copyTop }: { copyTop?: number }) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ReturnType<typeof createCombustionScene>>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // Tune the renderer for the device: phones skip MSAA, cap the pixel ratio
    // lower and ask for the battery-friendly GPU.
    const mq = (query: string) => !!window.matchMedia?.(query).matches;
    const small = mq('(max-width: 768px)');
    const reducedMotion = mq('(prefers-reduced-motion: reduce)');
    const maxDpr = small ? 1.5 : 1.75;

    const renderer = new THREE.WebGLRenderer({
      antialias: !small,
      powerPreference: small ? 'low-power' : 'high-performance',
      alpha: false,
      stencil: false,
    });
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    wrapper.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 60);
    camera.position.set(0, 0, CAMERA_Z);

    const combustion = createCombustionScene({
      small,
      reducedMotion,
      labels: !small && !reducedMotion,
    });
    sceneRef.current = combustion;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(combustion.background);
    scene.add(combustion.root);

    const state: FrameState = {
      camera,
      pointer: new THREE.Vector2(),
      size: { width: 1, height: 1 },
      viewport: { width: 1, height: 1, dpr: 1 },
      elapsed: 0,
    };
    const timer = new THREE.Timer();
    const frame = (dt: number) => {
      combustion.update(state, dt);
      renderer.render(scene, camera);
    };

    // --- Render loop: only while the hero is on screen; reduced motion renders
    // a single still frame (re-drawn on resize). ---
    let raf = 0;
    let running = false;
    let visible = true;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      timer.update(now);
      state.elapsed = timer.getElapsed();
      // Clamp large gaps (tab switch, loop resuming) so nothing teleports.
      frame(Math.min(timer.getDelta(), 0.05));
    };
    const start = () => {
      if (running || reducedMotion || !visible) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    const resize = () => {
      const { clientWidth: width, clientHeight: height } = wrapper;
      if (!width || !height) return;
      const { size, viewport } = state;
      viewport.dpr = Math.min(Math.max(window.devicePixelRatio || 1, 1), maxDpr);
      renderer.setPixelRatio(viewport.dpr);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      size.width = width;
      size.height = height;
      // World size of the z = 0 plane, where the molecules live.
      viewport.height = 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAMERA_Z;
      viewport.width = viewport.height * camera.aspect;
      if (!running) frame(0);
    };
    resize();
    start();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(wrapper);
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    visibilityObserver.observe(wrapper);

    // Parallax input. The canvas sits under the copy with pointer-events off, so
    // listen on the window and map into canvas space (touch input is ignored).
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const rect = wrapper.getBoundingClientRect();
      state.pointer.set(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1,
      );
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    return () => {
      stop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      sceneRef.current = null;
      combustion.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    };
  }, []);

  // Portrait framing: tell the scene where the hero copy starts.
  useEffect(() => {
    if (copyTop !== undefined) sceneRef.current?.setCopyTop(copyTop);
  }, [copyTop]);

  return <div ref={wrapperRef} className="w-full h-full" />;
};

export default HeroBackground;
