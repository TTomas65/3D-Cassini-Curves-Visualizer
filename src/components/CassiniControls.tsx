import React from 'react';
import { Sliders } from 'lucide-react';

interface ControlsProps {
  a: number;
  b: number;
  resolution: number;
  onAChange: (value: number) => void;
  onBChange: (value: number) => void;
  onResolutionChange: (value: number) => void;
}

export function CassiniControls({ 
  a, 
  b, 
  resolution, 
  onAChange, 
  onBChange, 
  onResolutionChange 
}: ControlsProps) {
  return (
    <div className="absolute top-4 right-4 bg-white/90 p-4 rounded-lg shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <Sliders className="w-5 h-5 text-indigo-600" />
        <h2 className="text-lg font-semibold text-gray-800">Parameters</h2>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Focal Distance (a) - Max: {b.toFixed(1)}
          </label>
          <input
            type="range"
            min="0.1"
            max={b}
            step="0.05"
            value={a}
            onChange={(e) => onAChange(Number(e.target.value))}
            className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-600">{a.toFixed(1)}</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Parameter (b) - Min: {a.toFixed(1)}
          </label>
          <input
            type="range"
            min={a}
            max="2"
            step="0.5"
            value={b}
            onChange={(e) => onBChange(Number(e.target.value))}
            className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-600">{b.toFixed(1)}</span>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Resolution
          </label>
          <input
            type="range"
            min="20"
            max="100"
            step="1"
            value={resolution}
            onChange={(e) => onResolutionChange(Number(e.target.value))}
            className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-600">{resolution}</span>
        </div>
      </div>
    </div>
  );
}