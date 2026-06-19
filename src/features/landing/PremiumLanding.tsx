import React, { useEffect, useRef } from 'react';

interface PremiumLandingProps {
  onEnter: () => void;
}

export const PremiumLanding: React.FC<PremiumLandingProps> = ({ onEnter }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    function syncSize() {
      if (!canvas) return;
      const w = canvas.clientWidth || 1280;
      const h = canvas.clientHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }
    
    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(syncSize);
      observer.observe(canvas);
    }
    syncSize();

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;
    const fs = `precision highp float;
varying vec2 v_texCoord;
uniform float u_time;
uniform vec2 u_resolution;

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

void main() {
    vec2 uv = v_texCoord;
    vec2 pos = uv * u_resolution;
    
    // Very sparse particles
    float n = hash(floor(pos * 0.05 + u_time * 0.001));
    float particle = 0.0;
    
    if (n > 0.9992) {
        vec2 center = fract(pos * 0.05 + u_time * 0.001) - 0.5;
        float dist = length(center);
        particle = smoothstep(0.1, 0.0, dist) * 0.3;
    }
    
    // Off-white background #FAFAFA
    vec3 bgColor = vec3(0.98, 0.98, 0.98);
    // Subtle dark particles
    vec3 particleColor = vec3(0.067, 0.067, 0.067); 
    
    vec3 color = mix(bgColor, particleColor, particle);
    
    gl_FragColor = vec4(color, 1.0);
}`;
    function cs(type: number, src: string) {
      if (!gl) return null;
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }
    const prog = gl.createProgram();
    if (!prog) return;
    
    const vertexShader = cs(gl.VERTEX_SHADER, vs);
    const fragmentShader = cs(gl.FRAGMENT_SHADER, fs);
    if (!vertexShader || !fragmentShader) return;
    
    gl.attachShader(prog, vertexShader);
    gl.attachShader(prog, fragmentShader);
    gl.linkProgram(prog);
    gl.useProgram(prog);
    
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    
    const pos = gl.getAttribLocation(prog, 'a_position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);
    
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_resolution');
    
    let animationFrameId: number;

    function render(t: number) {
      if (!gl || !canvas) return;
      if (typeof ResizeObserver === 'undefined') syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, t * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    }
    
    render(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="bg-[#faf8ff] text-[#191b23] antialiased relative min-h-screen flex flex-col font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Background Shader */}
      <div className="fixed inset-0 w-full h-full -z-10 opacity-30">
        <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
      </div>

      {/* Top Navbar */}
      <nav className="bg-[#faf8ff] border-b border-[#c3c6d7] fixed top-0 left-0 w-full z-50 flex justify-between items-center px-10 h-24 max-w-[1440px] mx-auto">
        <div className="text-3xl font-bold tracking-tighter text-[#191b23]">
          LEVELING UP
        </div>
        <div className="hidden md:flex gap-6 items-center">
          <a className="text-[13px] uppercase tracking-widest font-semibold border-b border-[#191b23] pb-1 opacity-80" href="#">
            Product
          </a>
          <a className="text-[13px] uppercase tracking-widest font-semibold text-[#434655] hover:text-[#004ac6] transition-colors" href="#">
            Features
          </a>
          <a className="text-[13px] uppercase tracking-widest font-semibold text-[#434655] hover:text-[#004ac6] transition-colors" href="#">
            Architecture
          </a>
        </div>
        <button onClick={onEnter} className="bg-[#191b23] text-white px-6 py-2 text-[13px] font-semibold uppercase tracking-widest rounded hover:opacity-90 transition-opacity">
          Launch App
        </button>
      </nav>

      {/* Main Content */}
      <main className="flex-grow pt-[120px] max-w-[1440px] mx-auto w-full px-10 pb-24">
        
        {/* Hero Section */}
        <section className="min-h-[716px] flex flex-col justify-center items-start md:items-center md:text-center max-w-4xl mx-auto py-24">
          <h1 className="text-5xl md:text-7xl font-bold text-[#191b23] mb-6 tracking-tighter leading-tight">
            Gamify your life with precision.
          </h1>
          <p className="text-lg text-[#434655] mb-12 max-w-2xl">
            Offline-first habit tracking, predictive stat analysis, and real-time operational intelligence for personal development.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 items-center">
            <button onClick={onEnter} className="bg-[#191b23] text-white px-12 py-4 text-[13px] font-semibold uppercase tracking-widest rounded hover:bg-[#004ac6] transition-colors w-full sm:w-auto">
              Launch App
            </button>
          </div>
        </section>

        {/* Built With Section */}
        <section className="py-12 border-t border-b border-[#c3c6d7]/30 flex flex-col md:flex-row justify-center items-center gap-12 text-[#434655] text-[13px] font-semibold uppercase tracking-widest mb-24">
          <span className="opacity-60">Built with precision using</span>
          <div className="flex flex-wrap justify-center gap-6 opacity-80 font-mono">
            <span>React</span>
            <span>•</span>
            <span>TailwindCSS</span>
            <span>•</span>
            <span>Dexie (IndexedDB)</span>
            <span>•</span>
            <span>Capacitor</span>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-24 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">
          <div className="border-t border-[#c3c6d7] pt-6">
            <h3 className="text-3xl font-medium text-[#191b23] mb-4">Railway Digital Twin</h3>
            <p className="text-base text-[#434655]">
              A real-time operational view of your habits, stats, and network status mapped with mathematical precision.
            </p>
          </div>
          <div className="border-t border-[#c3c6d7] pt-6">
            <h3 className="text-3xl font-medium text-[#191b23] mb-4">Epic Loot Drops</h3>
            <p className="text-base text-[#434655]">
              Defeat bosses using focused Pomodoro sessions. Coordinate responses and equip rare items dropped from the void.
            </p>
          </div>
          <div className="border-t border-[#c3c6d7] pt-6">
            <h3 className="text-3xl font-medium text-[#191b23] mb-4">Predictive Analytics</h3>
            <p className="text-base text-[#434655]">
              Forecast your XP curve over a 14-day trailing period. Simulate mitigation strategies in a personal sandbox.
            </p>
          </div>
          <div className="border-t border-[#c3c6d7] pt-6">
            <h3 className="text-3xl font-medium text-[#191b23] mb-4">Offline First</h3>
            <p className="text-base text-[#434655]">
              All operational intelligence runs securely on your local device. The system advises; you control the data.
            </p>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 flex flex-col items-center text-center max-w-3xl mx-auto mt-24 border-t border-[#c3c6d7]/30 pt-24">
          <h2 className="text-4xl md:text-5xl font-bold text-[#191b23] mb-6 tracking-tighter">
            From initial setup to daily execution in seconds.
          </h2>
          <div className="flex flex-col sm:flex-row gap-6 mt-6 w-full sm:w-auto justify-center">
            <button onClick={onEnter} className="bg-[#191b23] text-white px-12 py-4 text-[13px] font-semibold uppercase tracking-widest rounded hover:bg-[#004ac6] transition-colors">
              Launch App
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#faf8ff] border-t border-[#c3c6d7] w-full py-12 px-10 flex flex-col md:flex-row justify-between items-center max-w-[1440px] mx-auto mt-auto">
        <div className="text-3xl font-bold text-[#191b23] mb-6 md:mb-0">
          LEVELING UP
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-[13px] uppercase tracking-widest font-semibold text-[#434655] mb-6 md:mb-0">
          <a className="hover:text-[#191b23] transition-colors" href="#">Privacy Policy</a>
          <a className="hover:text-[#191b23] transition-colors" href="#">Terms of Service</a>
          <a className="hover:text-[#191b23] transition-colors" href="#">Documentation</a>
        </div>
        <div className="text-base text-[#434655] text-center md:text-right">
          © 2026 LevelingUp. Precision Intelligence.
        </div>
      </footer>
    </div>
  );
};
