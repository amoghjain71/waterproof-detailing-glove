"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/reduced-motion";

/**
 * Lightweight canvas water-ripple over the hero. Degrades to nothing when
 * WebGL/canvas or reduced-motion is unavailable (video/poster remains).
 */
export function WaterRipple({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vs = `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() {
        v_uv = a_pos * 0.5 + 0.5;
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `;
    const fs = `
      precision mediump float;
      varying vec2 v_uv;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec2 u_res;
      void main() {
        vec2 uv = v_uv;
        vec2 m = u_mouse;
        float d = distance(uv, m);
        float ripple = sin(d * 40.0 - u_time * 3.5) * exp(-d * 8.0) * 0.02;
        vec2 distorted = uv + normalize(uv - m + 0.0001) * ripple;
        float glow = exp(-d * 12.0) * 0.25;
        vec3 blue = vec3(0.12, 0.48, 1.0);
        vec3 cyan = vec3(0.5, 0.84, 1.0);
        float band = 0.5 + 0.5 * sin((distorted.x + distorted.y) * 12.0 + u_time);
        vec3 col = mix(blue, cyan, band) * glow;
        float alpha = glow * 0.55 + abs(ripple) * 8.0;
        gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.45));
      }
    `;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src);
      gl!.compileShader(s);
      return s;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      return;
    }
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uRes = gl.getUniformLocation(prog, "u_res");

    let mouse = { x: 0.5, y: 0.5 };
    let raf = 0;
    const start = performance.now();

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse = {
        x: (e.clientX - rect.left) / rect.width,
        y: 1 - (e.clientY - rect.top) / rect.height,
      };
    };

    const draw = (t: number) => {
      const time = (t - start) / 1000;
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-[1] ${className}`}
      aria-hidden
    />
  );
}
