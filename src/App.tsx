import React, { useState } from 'react';
import { CassiniControls } from './components/CassiniControls';
import { CassiniCurve2D } from './components/CassiniCurve2D';
import { CassiniCurve3D } from './components/CassiniCurve3D';

function App() {
  const [a, setA] = useState(1);
  const [b, setB] = useState(1);
  const [resolution3D, setResolution3D] = useState(56);
  const resolution2D = resolution3D * 4; // 2D resolution is 4x finer

  const handleAChange = (newA: number) => {
    setA(Math.min(newA, b));
  };

  const handleBChange = (newB: number) => {
    setB(Math.max(newB, a));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Mandu-Cassini görbe felület vizualizálás
          </h1>
          <p className="text-lg text-gray-600">
            Mandu felszín átalakulása eseményhorizonttá 2D és 3D
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">2D View</h2>
            <CassiniCurve2D a={a} b={b} resolution={resolution2D} />
          </div>

          <div className="relative bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">3D View</h2>
            <div className="h-[600px]">
              <CassiniCurve3D a={a} b={b} resolution={resolution3D} />
            </div>
          </div>
        </div>

        <CassiniControls
          a={a}
          b={b}
          resolution={resolution3D}
          onAChange={handleAChange}
          onBChange={handleBChange}
          onResolutionChange={setResolution3D}
        />
      </div>
    </div>
  );
}

export default App;