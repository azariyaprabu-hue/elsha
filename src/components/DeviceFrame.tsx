import React from 'react';
import { Smartphone, Monitor, Tablet, Wifi, Battery, Signal } from 'lucide-react';

export type DeviceMode = 'responsive' | 'ios' | 'android';

interface DeviceFrameProps {
  deviceMode: DeviceMode;
  onSelectDeviceMode: (mode: DeviceMode) => void;
  children: React.ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  deviceMode,
  onSelectDeviceMode,
  children,
}) => {
  if (deviceMode === 'responsive') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FAF7FD] py-4 px-2 flex flex-col items-center justify-start overflow-x-hidden">
      {/* Device Mode Switcher Floating Bar */}
      <div className="mb-4 bg-white border-2 border-[#7E22CE] rounded-full px-4 py-1.5 flex items-center gap-3 shadow-lg z-30">
        <span className="text-[11px] uppercase tracking-wider text-purple-900 font-mono font-bold">
          Mobile Preview:
        </span>
        <button
          type="button"
          onClick={() => onSelectDeviceMode('responsive')}
          className="text-xs px-2.5 py-1 rounded-full text-gray-600 hover:text-[#7E22CE] flex items-center gap-1 transition-colors font-medium"
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Full Width</span>
        </button>
        <button
          type="button"
          onClick={() => onSelectDeviceMode('ios')}
          className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
            deviceMode === 'ios'
              ? 'bg-[#7E22CE] text-white font-bold shadow-sm'
              : 'text-gray-600 hover:text-[#7E22CE]'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>iOS Phone</span>
        </button>
        <button
          type="button"
          onClick={() => onSelectDeviceMode('android')}
          className={`text-xs px-2.5 py-1 rounded-full flex items-center gap-1 transition-all ${
            deviceMode === 'android'
              ? 'bg-[#7E22CE] text-white font-bold shadow-sm'
              : 'text-gray-600 hover:text-[#7E22CE]'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Android Phone</span>
        </button>
      </div>

      {/* Simulated Device Chassis */}
      <div
        className={`w-full max-w-[420px] bg-white rounded-[48px] border-4 ${
          deviceMode === 'ios'
            ? 'border-purple-300 shadow-[0_20px_60px_rgba(126,34,206,0.15)]'
            : 'border-purple-300 shadow-[0_20px_60px_rgba(126,34,206,0.15)]'
        } overflow-hidden flex flex-col h-[860px] relative`}
      >
        {/* iOS Dynamic Island / Android Camera Punch-hole */}
        {deviceMode === 'ios' ? (
          <div className="bg-purple-950 pt-2 pb-1 px-6 flex items-center justify-between text-white text-[11px] shrink-0 select-none z-20">
            <span className="font-semibold">9:41</span>
            <div className="w-24 h-5 bg-black rounded-full border border-purple-800 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-700" />
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        ) : (
          <div className="bg-purple-950 pt-2 pb-1 px-6 flex items-center justify-between text-white text-[11px] shrink-0 select-none z-20">
            <span className="font-mono">10:00</span>
            <div className="w-3.5 h-3.5 rounded-full bg-black border-2 border-purple-800" />
            <div className="flex items-center gap-1.5 text-xs">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>
        )}

        {/* Device Screen Body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {children}
        </div>

        {/* iOS Home Indicator Bar / Android Navigation Bar */}
        {deviceMode === 'ios' ? (
          <div className="h-6 bg-purple-950 flex items-center justify-center shrink-0">
            <div className="w-32 h-1 bg-white/60 rounded-full" />
          </div>
        ) : (
          <div className="h-6 bg-purple-950 flex items-center justify-around shrink-0 px-12 text-purple-300">
            <span className="w-3 h-3 border-2 border-current rounded-sm" />
            <span className="w-3 h-3 border-2 border-current rounded-full" />
            <span className="text-xs">◁</span>
          </div>
        )}
      </div>
    </div>
  );
};
