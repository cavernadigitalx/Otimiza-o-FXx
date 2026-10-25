import React from 'react';
import { Smartphone, Zap, Volume2, VolumeX, ShieldCheck, Cpu } from 'lucide-react';
import { MotoDevice } from '../types';
import { soundManager } from '../utils/audio';

interface HeaderProps {
  currentDevice: MotoDevice;
  onOpenDeviceModal: () => void;
  systemHealthScore: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDevice,
  onOpenDeviceModal,
  systemHealthScore,
  soundEnabled,
  onToggleSound,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#080b12]/90 border-b border-cyan-950/60 px-4 py-3 sm:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-blue-600/30 to-indigo-950 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            {/* Motorola Batwing Style Emblem Icon */}
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-cyan-400 fill-current">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 2.5c2.1 0 4 .85 5.38 2.22l-3.38 5.78-2-3.5-2 3.5L6.62 6.72C8 5.35 9.9 4.5 12 4.5zm-5.7 3.9l2.7 4.6-2.7 4.6A7.47 7.47 0 0 1 4.5 12c0-1.57.48-3.03 1.8-4.6zm1.9 9.88l3.8-6.48 3.8 6.48A7.44 7.44 0 0 1 12 19.5c-1.42 0-2.74-.4-3.8-1.22zm7.6-1.68l-2.7-4.6 2.7-4.6c1.32 1.57 1.8 3.03 1.8 4.6 0 1.63-.52 3.12-1.8 4.6z"/>
            </svg>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                MotoTurbo
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                HELLO UI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <span>Otimização Máxima</span>
              <span className="text-cyan-500">•</span>
              <span className="text-slate-300 font-medium">Motorola Tuner</span>
            </p>
          </div>
        </div>

        {/* Device selector badge & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Health Score Pill */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-xs">
            <ShieldCheck className={`w-3.5 h-3.5 ${systemHealthScore >= 90 ? 'text-emerald-400' : systemHealthScore >= 70 ? 'text-yellow-400' : 'text-rose-400'}`} />
            <span className="text-slate-400">Saúde Moto:</span>
            <span className={`font-bold ${systemHealthScore >= 90 ? 'text-emerald-400' : systemHealthScore >= 70 ? 'text-yellow-400' : 'text-rose-400'}`}>
              {systemHealthScore}%
            </span>
          </div>

          {/* Model Switcher Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onOpenDeviceModal();
            }}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-700/40 hover:border-cyan-500 transition-all text-xs font-medium text-cyan-200 group shadow-sm active:scale-95"
            title="Alterar modelo do Motorola"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-6 transition-transform" />
            <span className="max-w-[110px] sm:max-w-[150px] truncate text-left font-semibold">
              {currentDevice.name}
            </span>
            <span className="text-[10px] px-1 py-0.2 rounded bg-cyan-500/20 text-cyan-300 hidden md:inline">
              Trocar
            </span>
          </button>

          {/* Sound Mute/Unmute */}
          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-all active:scale-90"
            title={soundEnabled ? 'Silenciar efeitos de áudio' : 'Ativar efeitos de áudio'}
            aria-label="Controle de som"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
