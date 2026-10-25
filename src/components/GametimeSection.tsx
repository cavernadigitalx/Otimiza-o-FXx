import React, { useState, useEffect } from 'react';
import { Gamepad2, Gauge, Zap, Flame, BatteryCharging, ShieldAlert, Sliders, BellOff, Crosshair } from 'lucide-react';
import { MotoDevice, PerformanceMode } from '../types';
import { soundManager } from '../utils/audio';

interface GametimeSectionProps {
  device: MotoDevice;
  currentMode: PerformanceMode;
  onSelectMode: (mode: PerformanceMode) => void;
}

export const GametimeSection: React.FC<GametimeSectionProps> = ({
  device,
  currentMode,
  onSelectMode,
}) => {
  const [selectedHz, setSelectedHz] = useState<number>(device.refreshRate);
  const [touchSamplingRate, setTouchSamplingRate] = useState<number>(360);
  const [dndEnabled, setDndEnabled] = useState<boolean>(true);
  const [gpuBoostEnabled, setGpuBoostEnabled] = useState<boolean>(true);
  const [currentFps, setCurrentFps] = useState<number>(60);

  // Live FPS Counter simulation based on requestAnimationFrame
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const loop = (now: number) => {
      frameCount++;
      if (now - lastTime >= 500) {
        const measured = Math.round((frameCount * 1000) / (now - lastTime));
        // Clamp to selected refresh rate
        const targetFps = Math.min(selectedHz, Math.max(55, measured));
        setCurrentFps(targetFps);
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [selectedHz]);

  const profiles: {
    id: PerformanceMode;
    title: string;
    description: string;
    hz: number;
    icon: typeof Zap;
    color: string;
    border: string;
  }[] = [
    {
      id: 'battery',
      title: 'Economia Turbo',
      description: 'Trava em 60Hz e reduz clock de fundo para máxima autonomia da bateria.',
      hz: 60,
      icon: BatteryCharging,
      color: 'text-emerald-400',
      border: 'hover:border-emerald-500/50',
    },
    {
      id: 'balanced',
      title: 'Hello UI Balanceado',
      description: 'Taxa dinâmica inteligente de 60 a 120Hz conforme o conteúdo exibido.',
      hz: Math.min(120, device.refreshRate),
      icon: Gauge,
      color: 'text-cyan-400',
      border: 'hover:border-cyan-500/50',
    },
    {
      id: 'gametime',
      title: 'Moto Gametime Pro',
      description: 'Prioridade total para a GPU Adreno/Mali, zero quedas de FPS e DND ativado.',
      hz: device.refreshRate,
      icon: Gamepad2,
      color: 'text-purple-400',
      border: 'hover:border-purple-500/50',
    },
    {
      id: 'ultra',
      title: 'Overclock Fera Edge',
      description: 'Ignora limites térmicos moderados para alcançar os FPS mais altos possíveis.',
      hz: device.refreshRate,
      icon: Flame,
      color: 'text-rose-400',
      border: 'hover:border-rose-500/50',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
              <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
              <span>Moto Gametime Suite • {device.chipset}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Otimização de FPS & Taxa de Atualização
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Configure os perfis de desempenho e taxas de amostragem de toque da tela do seu Motorola para eliminar stutters e engasgos em Free Fire, PUBG, COD e emuladores.
            </p>
          </div>

          {/* Live FPS Counter Card */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#090b16] border border-purple-500/50 min-w-[170px] text-center shadow-[0_0_20px_rgba(168,85,247,0.15)]">
            <span className="text-[11px] font-bold text-slate-400 uppercase">FPS em Tempo Real</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-4xl font-black text-purple-400">{currentFps}</span>
              <span className="text-xs font-bold text-slate-300">FPS</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Display calibrado {selectedHz}Hz
            </span>
          </div>
        </div>
      </div>

      {/* Profiles Selection */}
      <div className="space-y-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-400" />
          Perfis de Desempenho Motorola
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {profiles.map((p) => {
            const isSelected = currentMode === p.id;
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                onClick={() => {
                  soundManager.playTurbo();
                  onSelectMode(p.id);
                  setSelectedHz(p.hz);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
                    : `bg-slate-900/60 border-slate-800 ${p.border} hover:bg-slate-900`
                }`}
              >
                {isSelected && (
                  <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                    <div className="absolute transform rotate-45 bg-purple-500 text-black text-[9px] font-black py-0.5 right-[-35px] top-[14px] w-[120px] text-center uppercase tracking-wider">
                      Ativo
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl bg-slate-950 border border-slate-800 ${p.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-white">{p.title}</h4>
                    <p className="text-xs text-slate-400 mt-1">{p.description}</p>
                    <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-500 font-mono">
                      <span>Taxa: {p.hz}Hz</span>
                      <span>•</span>
                      <span className={p.color}>Perfil Oficial My UX</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Display Refresh Rate Manual Tuning */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-cyan-400" />
              Taxa de Atualização da Tela (Refresh Rate)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Escolha a taxa nativa suportada pelo painel OLED/pOLED do {device.name}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-800/50">
            {selectedHz} Hz
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[60, 90, 120, 144].map((hz) => {
            const isSupported = hz <= device.refreshRate;
            const isCurrent = selectedHz === hz;
            return (
              <button
                key={hz}
                disabled={!isSupported}
                onClick={() => {
                  soundManager.playToggle();
                  setSelectedHz(hz);
                }}
                className={`p-3.5 rounded-xl text-center border transition-all ${
                  !isSupported
                    ? 'opacity-30 border-slate-800 bg-slate-950 cursor-not-allowed text-slate-600'
                    : isCurrent
                    ? 'bg-cyan-500 text-black font-extrabold border-cyan-400 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-lg font-black block">{hz} Hz</span>
                <span className="text-[10px] block opacity-80">
                  {!isSupported ? 'Não suportado' : hz === 60 ? 'Econômico' : hz === 120 ? 'Ultra Fluido' : 'Máximo Moto'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Touch Sampling Rate & Gametime toggles */}
        <div className="pt-4 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Crosshair className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-white block">Amostragem de Toque</span>
                <span className="text-[11px] text-slate-400">Resposta tátil para mira precisa</span>
              </div>
            </div>
            <select
              value={touchSamplingRate}
              onChange={(e) => {
                soundManager.playToggle();
                setTouchSamplingRate(Number(e.target.value));
              }}
              className="bg-slate-900 border border-slate-700 rounded-lg text-xs font-bold text-amber-400 px-2 py-1 focus:outline-none"
            >
              <option value={240}>240 Hz</option>
              <option value={360}>360 Hz (Turbo)</option>
              <option value={720}>720 Hz (Extremo)</option>
            </select>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <BellOff className="w-4 h-4 text-purple-400" />
              <div>
                <span className="text-xs font-bold text-white block">Bloquear Chamadas & Avisos</span>
                <span className="text-[11px] text-slate-400">Modo Não Perturbe do Gametime</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={dndEnabled}
              onChange={() => {
                soundManager.playToggle();
                setDndEnabled(!dndEnabled);
              }}
              className="w-5 h-5 rounded border-slate-700 text-purple-600 focus:ring-purple-500 bg-slate-900 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
