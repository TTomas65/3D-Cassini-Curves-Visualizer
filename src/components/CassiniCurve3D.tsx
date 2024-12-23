import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface CassiniCurve3DProps {
  a: number;
  b: number;
  resolution: number;
}

function CassiniMesh({ a, b, resolution }: CassiniCurve3DProps) {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const thetaSegments = resolution;
    const rotationSegments = resolution;
    const c = a; // Distance from origin to focus

    // Generate the complete 2D curve points
    const curve2DPoints: [number, number][] = [];
    for (let theta = 0; theta <= 2 * Math.PI; theta += (2 * Math.PI) / thetaSegments) {
      if (Math.abs(b - a) < 0.0001) {
        // Lemniscate case
        const r = Math.sqrt(2 * a * a * Math.cos(2 * theta));
        if (!isNaN(r)) {
          curve2DPoints.push([r * Math.cos(theta), r * Math.sin(theta)]);
        }
      } else {
        // General Cassini curve
        const cos2t = Math.cos(2 * theta);
        const term1 = Math.pow(c, 4) * cos2t * cos2t;
        const term2 = Math.pow(b, 4) - Math.pow(c, 4);
        const sqrtTerm = Math.sqrt(term1 + term2);

        if (!isNaN(sqrtTerm)) {
          const r = Math.sqrt(Math.pow(c, 2) * cos2t + sqrtTerm);
          curve2DPoints.push([r * Math.cos(theta), r * Math.sin(theta)]);

          if (Math.abs(b - a) > 0.0001) {
            const rNeg = Math.sqrt(Math.pow(c, 2) * cos2t - sqrtTerm);
            if (!isNaN(rNeg)) {
              curve2DPoints.push([rNeg * Math.cos(theta), rNeg * Math.sin(theta)]);
            }
          }
        }
      }
    }

    // Sort 2D points for smooth curve
    curve2DPoints.sort((p1, p2) => {
      const angle1 = Math.atan2(p1[1], p1[0]);
      const angle2 = Math.atan2(p2[1], p2[0]);
      return angle1 - angle2;
    });

    // Rotate the complete 2D curve around the y-axis for full 360-degree rotation
    for (let phi = 0; phi <= 2 * Math.PI; phi += (2 * Math.PI) / rotationSegments) {
      for (const [x, y] of curve2DPoints) {
        const rotX = x * Math.cos(phi);
        const rotZ = x * Math.sin(phi);
        points.push(new THREE.Vector3(rotX, y, rotZ));
      }
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const indices: number[] = [];
    const rows = rotationSegments + 1;
    const cols = curve2DPoints.length;

    // Create faces between points
    for (let i = 0; i < rows - 1; i++) {
      for (let j = 0; j < cols - 1; j++) {
        const current = i * cols + j;
        const next = current + cols;
        const nextJ = current + 1;
        const nextBoth = next + 1;

        indices.push(current, next, nextJ);
        indices.push(next, nextBoth, nextJ);
      }
    }

    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    return geometry;
  }, [a, b, resolution]);

  return (
    <mesh>
      <primitive object={geometry} />
      <meshPhongMaterial
        color="#4f46e5"
        transparent
        opacity={0.5}
        wireframe
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export function CassiniCurve3D(props: CassiniCurve3DProps) {
  return (
    <Canvas
      camera={{ position: [3, 3, 3], fov: 50 }}
      className="bg-gray-50 rounded-lg shadow-lg"
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <CassiniMesh {...props} />
      <OrbitControls enableZoom enablePan enableRotate />
      <gridHelper args={[10, 10, '#e5e7eb', '#e5e7eb']} />
      <axesHelper args={[5]} />
    </Canvas>
  );
}