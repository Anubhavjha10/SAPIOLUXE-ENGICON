import React, { useEffect, useRef } from 'react';

interface BackgroundShaderProps {
  className?: string;
}

export const BackgroundShader: React.FC<BackgroundShaderProps> = ({
  className = "absolute inset-0 w-full h-full object-cover -z-20",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationFrameId: number;

    const syncSize = () => {
      const w = canvas.clientWidth || window.innerWidth || 1280;
      const h = canvas.clientHeight || window.innerHeight || 720;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    syncSize();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(syncSize);
      resizeObserver.observe(canvas);
    }

    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = a_position * 0.5 + 0.5;
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision highp float;
      varying vec2 v_texCoord;
      uniform float u_time;
      uniform vec2 u_resolution;

      void main() {
        vec2 uv = v_texCoord;
        
        // Architectural structural beam movement
        float grid = 0.0;
        grid += smoothstep(0.48, 0.5, abs(sin(uv.x * 10.0 + u_time * 0.1)));
        grid *= smoothstep(0.48, 0.5, abs(sin(uv.y * 10.0 + u_time * 0.1)));
        
        // Gradient movement
        vec3 color1 = vec3(0.1, 0.1, 0.1); // Deep Charcoal
        vec3 color2 = vec3(0.05, 0.05, 0.05); // Darker
        
        vec3 finalColor = mix(color1, color2, uv.y + sin(u_time * 0.2) * 0.5);
        
        // Subtle structural drafting lines
        float line = smoothstep(0.002, 0.0, abs(uv.x - 0.5 + sin(u_time * 0.1) * 0.2));
        finalColor += line * 0.02;
        
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    function createShader(type: number, source: string) {
      const shader = gl!.createShader(type)!;
      gl!.shaderSource(shader, source);
      gl!.compileShader(shader);
      return shader;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, createShader(gl.VERTEX_SHADER, vs));
    gl.attachShader(program, createShader(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uRes = gl.getUniformLocation(program, 'u_resolution');

    const render = (time: number) => {
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, time * 0.001);
      if (uRes) gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className={className} style={{ display: 'block' }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
    </div>
  );
};
