import React from 'react';
import { Zap, Cpu, HardDrive, Thermometer, Gauge, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { MotoDevice, HardwareTelemetry } from '../types';
import { soundManager } from '../utils/audio';

interface TurboDashboardProps {
  device: MotoDevice;
  telemetry: HardwareTelemetry;
  systemScore: number;
  onTriggerBoost: () => void;
  onNavigateTab: (tabId: string) => void;
  isBoosted: boolean;
}

export const TurboDashboard: React.FC<TurboDashboardProps> = ({
  device,
  telemetry,
  systemScore,
  onTriggerBoost,
  onNavigateTab,
  isBoosted,
}) => {
  // SVG Gauge calculations
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (systemScore / 100) * circumference * 0.75; // 270 degree arc

  return (
    <div className="space-y-6">
      {/* Hero Card with Speedometer Gauge */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0a0f1c] to-[#080d18] border border-cyan-800/40 p-6 sm:p-8 shadow-2xl">
        {/* Ambient background rays */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Motorola Performance Engine • {device.series} Tuner</span>
          </div>

          {/* Central Circular Gauge */}
          <div className="relative w-64 h-64 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-135 transform" viewBox="0 0 220 220">
              {/* Background Arc */}
              <circle
                cx="110"
                cy="110"
                r={radius}
                className="text-slate-800/80"
                strokeWidth="14"
                strokeDasharray={`${circumference * 0.75} ${circumference}`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
              {/* Active Animated Arc */}
              <circle
                cx="110"
                cy="110"
                r={radius}
                className="text-cyan-400 transition-all duration-1000 ease-out"
                strokeWidth="14"
                strokeDasharray={`${circumference * 0.75} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                style={{
                  filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.7))',
                }}
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
              <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">
                Pontuação Turbo
              </span>
              <div className="flex items-baseline">
                <span className="text-5xl sm:text-6xl font-black text-white tracking-tighter">
                  {systemScore}
                </span>
                <span className="text-cyan-400 font-bold text-lg">/100</span>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 ${
                  systemScore >= 90
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : systemScore >= 70
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}
              >
                {systemScore >= 90 ? '⚡ Desempenho Máximo' : systemScore >= 70 ? '⚠️ Otimização Recomendada' : '🚨 Sistema Lento'}
              </span>
            </div>
          </div>

          {/* Device Model & Chipset Info */}
          <div className="text-slate-300 text-xs sm:text-sm font-medium mt-1 mb-6 flex items-center gap-2">
            <span className="text-white font-bold">{device.name}</span>
            <span className="text-slate-600">•</span>
            <span className="text-cyan-400 font-mono">{device.chipset}</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">{device.uiVersion}</span>
          </div>

          {/* Master One-Click Turbo Boost Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              onTriggerBoost();
            }}
            className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-12 py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-black font-black text-base sm:text-lg tracking-wide shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_45px_rgba(6,182,212,0.7)] transition-all duration-300 active:scale-95 cursor-pointer"
          >
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Zap className="w-6 h-6 fill-black animate-bounce group-hover:scale-110 transition-transform" />
            <span>{isBoosted ? 'RE-OTIMIZAR MOTOROLA' : 'ACELERAR MOTOROLA AGORA'}</span>
          </button>
          
          <p className="text-[11px] text-slate-500 mt-3">
            Libera RAM zRAM, purga cache profundo, resfria a CPU e reduz o input lag com 1 toque
          </p>
        </div>
      </div>

      {/* 4 Core Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* RAM Status */}
        <div
          onClick={() => {
            soundManager.playClick();
            onNavigateTab('ram');
          }}
          className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Memória RAM</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{telemetry.ramUsagePercent}%</span>
            <span className="text-xs text-slate-500">ocupada</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                telemetry.ramUsagePercent > 80 ? 'bg-rose-500' : 'bg-cyan-400'
              }`}
              style={{ width: `${telemetry.ramUsagePercent}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
            <span>Base: {device.defaultRam} GB</span>
            <span className="text-cyan-400 font-medium">+RAM Boost</span>
          </div>
        </div>

        {/* Armazenamento & Lixo */}
        <div
          onClick={() => {
            soundManager.playClick();
            onNavigateTab('storage');
          }}
          className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Armazenamento</span>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{telemetry.storageUsedGB}</span>
            <span className="text-xs text-slate-500">/ {telemetry.storageTotalGB} GB</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${(telemetry.storageUsedGB / telemetry.storageTotalGB) * 100}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
            <span className="text-amber-400 font-medium">~6.6 GB lixo</span>
            <span className="text-slate-500">Limpar &gt;</span>
          </div>
        </div>

        {/* Temperatura Térmica SoC */}
        <div
          onClick={() => {
            soundManager.playClick();
            onNavigateTab('battery');
          }}
          className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Térmica / Bateria</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{telemetry.batteryTempC.toFixed(1)}°C</span>
            <span className="text-xs text-emerald-400 font-medium">Resfriado</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-400"
              style={{ width: `${Math.min(100, (telemetry.batteryTempC / 50) * 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
            <span>TurboPower {device.chargingWattage}W</span>
            <span className="text-emerald-400">Normal</span>
          </div>
        </div>

        {/* Tela & Gametime Hz */}
        <div
          onClick={() => {
            soundManager.playClick();
            onNavigateTab('gametime');
          }}
          className="p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-slate-400 font-medium">Taxa de Atualização</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white">{device.refreshRate} Hz</span>
            <span className="text-xs text-amber-400 font-medium">Gametime</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-400"
              style={{ width: `${(device.refreshRate / 165) * 100}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
            <span>Amostragem: 360Hz</span>
            <span className="text-amber-400">Ajustar &gt;</span>
          </div>
        </div>
      </div>

      {/* Motorola Exclusive Quick Optimizations Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Pronto para Jogos & Multitarefas Pesadas?</h4>
            <p className="text-xs text-slate-400">
              Ative o modo Gametime Pro ou configure o RAM Boost para até +{device.maxRamBoost} GB virtuais.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigateTab('ram');
            }}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-slate-700 transition-colors"
          >
            Ajustar RAM Boost
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              onNavigateTab('gametime');
            }}
            className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-xs font-semibold text-cyan-400 border border-cyan-500/40 transition-colors"
          >
            Ativar Gametime
          </button>
        </div>
      </div>
    </div>
  );
};
