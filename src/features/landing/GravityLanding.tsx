import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

interface GravityLandingProps {
  onEnter: () => void;
}

export const GravityLanding: React.FC<GravityLandingProps> = ({ onEnter }) => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    // 1. Setup Matter.js Engine
    const engine = Matter.Engine.create();
    engineRef.current = engine;
    const world = engine.world;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // 2. Render (Optional, for debugging, but we'll use it transparently to handle mouse)
    const render = Matter.Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        background: 'transparent',
        wireframes: false,
        hasBounds: false
      }
    });
    renderRef.current = render;
    // Hide the canvas since we are overlaying DOM elements
    render.canvas.style.opacity = '0';
    render.canvas.style.position = 'absolute';
    render.canvas.style.top = '0';
    render.canvas.style.left = '0';
    render.canvas.style.zIndex = '10';

    // 3. Boundaries (Floor, Walls)
    const ground = Matter.Bodies.rectangle(width / 2, height + 50, width * 2, 100, { isStatic: true });
    const wallLeft = Matter.Bodies.rectangle(-50, height / 2, 100, height * 2, { isStatic: true });
    const wallRight = Matter.Bodies.rectangle(width + 50, height / 2, 100, height * 2, { isStatic: true });
    
    Matter.World.add(world, [ground, wallLeft, wallRight]);

    // 4. Create Bodies for DOM Elements
    // Box 1: Logo
    const logoBody = Matter.Bodies.rectangle(width / 2, -100, 300, 80, {
      restitution: 0.8,
      render: { visible: false }
    });
    // Box 2: Button
    const btnBody = Matter.Bodies.rectangle(width / 2, -300, 200, 60, {
      restitution: 0.5,
      render: { visible: false }
    });
    // Box 3: Card
    const cardBody = Matter.Bodies.rectangle(width / 2 - 100, -500, 250, 100, {
      restitution: 0.6,
      angle: 0.2,
      render: { visible: false }
    });
    // Box 4: Card 2
    const card2Body = Matter.Bodies.rectangle(width / 2 + 100, -700, 250, 100, {
      restitution: 0.6,
      angle: -0.2,
      render: { visible: false }
    });

    Matter.World.add(world, [logoBody, btnBody, cardBody, card2Body]);

    // 5. Mouse Control
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false }
      }
    });
    Matter.World.add(world, mouseConstraint);
    render.mouse = mouse;

    // Detect click on button (using Matter.js events)
    Matter.Events.on(mouseConstraint, 'mouseup', (event) => {
      const mousePos = event.mouse.position;
      if (Matter.Bounds.contains(btnBody.bounds, mousePos)) {
        // Simple check if actually inside the body geometry
        if (Matter.Vertices.contains(btnBody.vertices, mousePos)) {
          onEnter();
        }
      }
    });

    // 6. Start Engine
    Matter.Render.run(render);
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // 7. Sync DOM with Physics
    const domLogo = document.getElementById('grav-logo');
    const domBtn = document.getElementById('grav-btn');
    const domCard1 = document.getElementById('grav-card1');
    const domCard2 = document.getElementById('grav-card2');

    const updateDOM = () => {
      if (domLogo) {
        domLogo.style.transform = `translate(${logoBody.position.x - 150}px, ${logoBody.position.y - 40}px) rotate(${logoBody.angle}rad)`;
      }
      if (domBtn) {
        domBtn.style.transform = `translate(${btnBody.position.x - 100}px, ${btnBody.position.y - 30}px) rotate(${btnBody.angle}rad)`;
      }
      if (domCard1) {
        domCard1.style.transform = `translate(${cardBody.position.x - 125}px, ${cardBody.position.y - 50}px) rotate(${cardBody.angle}rad)`;
      }
      if (domCard2) {
        domCard2.style.transform = `translate(${card2Body.position.x - 125}px, ${card2Body.position.y - 50}px) rotate(${card2Body.angle}rad)`;
      }
      requestAnimationFrame(updateDOM);
    };
    updateDOM();

    return () => {
      Matter.Render.stop(render);
      Matter.Runner.stop(runner);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
      render.canvas.remove();
    };
  }, [onEnter]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background" ref={sceneRef}>
      {/* DOM Elements overlay */}
      <div 
        id="grav-logo" 
        className="absolute top-0 left-0 w-[300px] h-[80px] flex items-center justify-center pointer-events-none"
      >
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground drop-shadow-lg">LevelingUp</h1>
      </div>

      <div 
        id="grav-btn" 
        className="absolute top-0 left-0 w-[200px] h-[60px] pointer-events-none"
      >
        <button 
          className="w-full h-full bg-primary text-primary-foreground font-bold text-lg rounded-xl shadow-xl border-2 border-primary-foreground/20 uppercase tracking-widest pointer-events-none"
        >
          ENTER APP
        </button>
      </div>

      <div 
        id="grav-card1" 
        className="absolute top-0 left-0 w-[250px] h-[100px] pointer-events-none"
      >
        <div className="w-full h-full bg-card border border-border/50 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-4">
          <div className="text-xl font-bold text-foreground">Slay Bosses</div>
          <div className="text-muted-foreground">Earn Epic Loot</div>
        </div>
      </div>

      <div 
        id="grav-card2" 
        className="absolute top-0 left-0 w-[250px] h-[100px] pointer-events-none"
      >
        <div className="w-full h-full bg-card border border-border/50 rounded-2xl shadow-2xl flex flex-col items-center justify-center p-4">
          <div className="text-xl font-bold text-foreground">Gamify Life</div>
          <div className="text-muted-foreground">Build real habits</div>
        </div>
      </div>
      
      <div className="absolute bottom-4 w-full text-center text-muted-foreground text-sm opacity-50 pointer-events-none">
        Drag elements around • Click "ENTER APP" to begin
      </div>
    </div>
  );
};
