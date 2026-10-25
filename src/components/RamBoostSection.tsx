import React, { useState } from 'react';
import { Cpu, Zap, Snowflake, Check, AlertTriangle, Sparkles, RefreshCw } from 'lucide-react';
import { MotoDevice } from '../types';
import { soundManager } from '../utils/audio';

interface RamBoostSectionProps {
  device: MotoDevice;
  ramUsagePercent: number;
  onUpdateRamUsage: (newPercent: number) => void;
}

const APPS_IN_MEMORY = [
  { id: 'instagram', name: 'Instagram', memoryMB: 780, frozen: false },
  { id: 'tiktok', name: 'TikTok', memoryMB: 940, frozen: false },
  { id: 'whatsapp', name: 'WhatsApp', memoryMB: 480, frozen: true },
  { id: 'chrome', name: 'Google Chrome (14 abas)', memoryMB: 1120, frozen: false },
  { id: 'games', name: 'Garena Free Fire / CoD Mobile', memoryMB: 1850, frozen: false },
  { id: 'shopee', name: 'Shopee & Mercado Livre', memoryMB: 390, frozen: false },
];

export const RamBoostSection: React.FC<RamBoostSectionProps> = ({
  device,
  ramUsagePercent,
  onUpdateRamUsage,
}) => {
  const [ramBoostValue, setRamBoostValue] = useState<number>(Math.min(device.maxRamBoost, 8));
  const [apps, setApps] = useState(APPS_IN_MEMORY);
  const [isDefragging, setIsDefragging] = useState(false);
  const [defragSuccess, setDefragSuccess] = useState(false);

  // Available RAM Boost options based on device
  const options = [0, 2, 4, 6, 8, 12, 16].filter((val) => val <= device.maxRamBoost);

  const toggleFreezeApp = (appId: string) => {
    soundManager.playToggle();
    setApps((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, frozen: !app.frozen } : app))
    );
  };

  const freezeAllBackgroundApps = () => {
    soundManager.playCleanSweep();
    setApps((prev) => prev.map((app) => ({ ...app, frozen: true })));
    onUpdateRamUsage(Math.max(38, ramUsagePercent - 22));
  };

  const handleDefragRam = () => {
    soundManager.playTurbo();
    setIsDefragging(true);
    setDefragSuccess(false);

    setTimeout(() => {
      setIsDefragging(false);
      setDefragSuccess(true);
      soundManager.playSuccess();
      onUpdateRamUsage(Math.max(42, ramUsagePercent - 18));
      setTimeout(() => setDefragSuccess(false), 4000);
    }, 1800);
  };

  const totalEffectiveRam = device.defaultRam + ramBoostValue;

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-slate-900 border border-cyan-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Hello UI Memory Optimizer</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Motorola RAM Boost (Memória Virtual)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              O RAM Boost transforma parte do veloz armazenamento UFS do seu {device.name} em memória zRAM compactada, impedindo que apps em segundo plano fechem ou reiniciem sozinhos.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#080d1a] border border-cyan-700/50 min-w-[170px] text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Capacidade Total</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-black text-cyan-400">{totalEffectiveRam}</span>
              <span className="text-xs font-bold text-white">GB RAM</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1">
              ({device.defaultRam} GB Físico + {ramBoostValue} GB Boost)
            </span>
          </div>
        </div>
      </div>

      {/* RAM Boost Level Selector */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              Selecione o Nível de RAM Boost para seu {device.name}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Recomendado para jogos pesados e multitarefas sem engasgos
            </p>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            +{ramBoostValue} GB Ativo
          </span>
        </div>

        {/* Option Pills */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {options.map((val) => {
            const isCurrent = ramBoostValue === val;
            return (
              <button
                key={val}
                onClick={() => {
                  soundManager.playToggle();
                  setRamBoostValue(val);
                }}
                className={`py-3 px-2 rounded-xl text-center border transition-all flex flex-col items-center justify-center gap-1 ${
                  isCurrent
                    ? 'bg-gradient-to-b from-cyan-500/30 to-blue-600/30 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span className="text-sm sm:text-base font-black">
                  {val === 0 ? 'Desligado' : `+${val} GB`}
                </span>
                <span className="text-[10px] text-slate-500">
                  {val === 0 ? '0 GB zRAM' : `Total ${device.defaultRam + val} GB`}
                </span>
              </button>
            );
          })}
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-400">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-white">Dica Motorola Oficial:</strong> O RAM Boost do Hello UI utiliza compressão em memória RAM ZRAM (LZ4) que reduz a pressão no processador e não degrada a vida útil do chip de memória do celular.
          </span>
        </div>
      </div>

      {/* Deep RAM Defrag & Cleaner Button */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 text-cyan-400 ${isDefragging ? 'animate-spin' : ''}`} />
              Desfragmentação Profunda da Memória RAM
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Libera páginas de memória fragmentadas deixadas por apps já fechados
            </p>
          </div>

          <button
            onClick={handleDefragRam}
            disabled={isDefragging}
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-extrabold text-xs tracking-wide shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {isDefragging ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-black" />
                <span>Desfragmentando zRAM...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-black text-black" />
                <span>DESFRAGMENTAR RAM AGORA</span>
              </>
            )}
          </button>
        </div>

        {defragSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Memória desfragmentada com sucesso! 1.4 GB de memória recuperados instantaneamente.</span>
          </div>
        )}

        {/* Background Hogs List */}
        <div className="pt-3 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Apps em Segundo Plano Detectados
            </h4>
            <button
              onClick={freezeAllBackgroundApps}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <Snowflake className="w-3.5 h-3.5" />
              Congelar Todos os Apps
            </button>
          </div>

          <div className="space-y-2">
            {apps.map((app) => (
              <div
                key={app.id}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      app.frozen ? 'bg-blue-400' : 'bg-emerald-400 animate-pulse'
                    }`}
                  />
                  <div>
                    <span className="font-semibold text-white block">{app.name}</span>
                    <span className="text-[11px] text-slate-400">
                      Consumo: <strong className="text-cyan-400">{app.memoryMB} MB</strong> de RAM
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      app.frozen
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {app.frozen ? 'Congelado' : 'Ativo'}
                  </span>
                  <button
                    onClick={() => toggleFreezeApp(app.id)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      app.frozen
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        : 'bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800/50 text-cyan-300'
                    }`}
                  >
                    {app.frozen ? 'Descongelar' : 'Congelar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
