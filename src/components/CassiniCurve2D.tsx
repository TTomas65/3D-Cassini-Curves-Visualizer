import React, { useEffect, useRef } from 'react';

interface CassiniCurve2DProps {
  a: number;
  b: number;
  resolution: number;
}

export function CassiniCurve2D({ a, b, resolution }: CassiniCurve2DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const scale = Math.min(width, height) / 4;

    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.scale(scale, -scale);

    // Draw axes
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1 / scale;
    ctx.beginPath();
    ctx.moveTo(-2, 0);
    ctx.lineTo(2, 0);
    ctx.moveTo(0, -2);
    ctx.lineTo(0, 2);
    ctx.stroke();

    // Draw focal points
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(a, 0, 0.05, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(-a, 0, 0.05, 0, 2 * Math.PI);
    ctx.fill();

    const c = a; // Distance from origin to focus
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 2 / scale;

    if (Math.abs(b - a) < 0.0001) {
      // Lemniscate case: (x² + y²)² = 2a²(x² - y²)
      const points: [number, number][] = [];
      for (let t = 0; t <= 2 * Math.PI; t += (2 * Math.PI) / resolution) {
        const r = Math.sqrt(2 * a * a * Math.cos(2 * t));
        if (!isNaN(r)) {
          points.push([r * Math.cos(t), r * Math.sin(t)]);
        }
      }

      ctx.beginPath();
      if (points.length > 0) {
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i][0], points[i][1]);
        }
        ctx.lineTo(points[0][0], points[0][1]);
      }
      ctx.stroke();
    } else if (b > a) {
      // Single curve case (b > a)
      const points: [number, number][] = [];
      for (let t = 0; t <= 2 * Math.PI; t += (2 * Math.PI) / resolution) {
        const cos2t = Math.cos(2 * t);
        const r = Math.sqrt(
          Math.sqrt(Math.pow(b, 4) + Math.pow(a, 4) * (cos2t * cos2t - 1)) +
          a * a * cos2t
        );
        points.push([r * Math.cos(t), r * Math.sin(t)]);
      }

      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (const [x, y] of points) {
        ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    } else {
      // Two separate curves case (a > b)
      const leftPoints: [number, number][] = [];
      const rightPoints: [number, number][] = [];

      for (let t = 0; t <= 2 * Math.PI; t += (2 * Math.PI) / resolution) {
        const cos2t = Math.cos(2 * t);
        const discriminant = Math.pow(b, 4) + Math.pow(a, 4) * (cos2t * cos2t - 1);
        
        if (discriminant >= 0) {
          const r = Math.sqrt(Math.sqrt(discriminant) + a * a * cos2t);
          const x = r * Math.cos(t);
          const y = r * Math.sin(t);
          
          if (x < 0) {
            leftPoints.push([x, y]);
          } else {
            rightPoints.push([x, y]);
          }
        }
      }

      // Draw left curve
      if (leftPoints.length > 0) {
        ctx.beginPath();
        ctx.moveTo(leftPoints[0][0], leftPoints[0][1]);
        for (const [x, y] of leftPoints) {
          ctx.lineTo(x, y);
        }
        if (leftPoints.length > 2) {
          ctx.lineTo(leftPoints[0][0], leftPoints[0][1]);
        }
        ctx.stroke();
      }

      // Draw right curve
      if (rightPoints.length > 0) {
        ctx.beginPath();
        ctx.moveTo(rightPoints[0][0], rightPoints[0][1]);
        for (const [x, y] of rightPoints) {
          ctx.lineTo(x, y);
        }
        if (rightPoints.length > 2) {
          ctx.lineTo(rightPoints[0][0], rightPoints[0][1]);
        }
        ctx.stroke();
      }
    }

    ctx.restore();
  }, [a, b, resolution]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      className="bg-white rounded-lg shadow-lg"
    />
  );
}