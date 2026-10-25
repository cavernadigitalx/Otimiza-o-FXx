import React, { useEffect, useState } from 'react';
import { Zap, CheckCircle2, ShieldCheck, Flame, Cpu, HardDrive, RefreshCw } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface BoostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBoostComplete: () => void;
  deviceName: string;
}

const STAGES = [
  { label: 'Varrendo processos ociosos em segundo plano (Hello UI)', duration: 900 },
  { label: 'Purgando arquivos temporários e Dalvik/ART cache', duration: 1100 },
  { label: 'Calibrando zRAM e ativando alocação dinâmica RAM Boost', duration: 1000 },
  { label: 'Ajustando governador de frequência e refrigeração do SoC', duration: 900 },
  { label: 'Maximizando taxa de amostragem de toque e fluidez de FPS', duration: 800 },
];

export const BoostModal: React.FC<BoostModalProps> = ({
  isOpen,
  onClose,
  onBoostComplete,
  deviceName,
}) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentStageIndex(0);
      setProgress(0);
      setIsCompleted(false);
      setLogs([]);
      return;
    }

    soundManager.playTurbo();
    let currentP = 0;
    const interval = setInterval(() => {
      currentP += 2;
      if (currentP <= 100) {
        setProgress(currentP);

        // Stage transitions
        if (currentP >= 20 && currentP < 40) {
          setCurrentStageIndex(1);
        } else if (currentP >= 40 && currentP < 65) {
          setCurrentStageIndex(2);
        } else if (currentP >= 65 && currentP < 85) {
          setCurrentStageIndex(3);
        } else if (currentP >= 85 && currentP < 100) {
          setCurrentStageIndex(4);
        }
      } else {
        clearInterval(interval);
        setIsCompleted(true);
        soundManager.playSuccess();
        onBoostComplete();
      }
    }, 70);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0a0f1c] border border-cyan-500/50 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(6,182,212,0.25)] text-center overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/20 blur-3xl rounded-full pointer-events-none" />

        {!isCompleted ? (
          <div className="space-y-6 relative z-10">
            {/* Spinning Turbo Reactor */}
            <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 border-t-cyan-400 animate-spin" />
              <div
                className="absolute inset-2 rounded-full border-2 border-indigo-500/30 border-b-indigo-400 animate-spin"
                style={{ animationDirection: 'reverse', animationDuration: '3s' }}
              />
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-cyan-950 via-slate-900 to-cyan-900/60 flex items-center justify-center shadow-inner">
                <Zap className="w-10 h-10 text-cyan-400 animate-pulse fill-cyan-400/20" />
              </div>
              {/* Progress Percentage Badge */}
              <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-cyan-500 text-black font-extrabold text-xs tracking-wider shadow-lg">
                {progress}%
              </div>
            </div>

            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">
                Otimizando {deviceName}...
              </h3>
              <p className="text-xs text-cyan-400 font-mono mt-1 min-h-[32px] flex items-center justify-center">
                {STAGES[currentStageIndex]?.label || 'Concluindo ajustes finos...'}
              </p>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800 p-0.5">
              <div
                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-400 h-full rounded-full transition-all duration-100 ease-out shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Status ticker */}
            <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 text-left font-mono text-[11px] text-slate-400 space-y-1 max-h-24 overflow-y-auto">
              <div className="text-cyan-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>[MOTO-KERNEL] Sintonizando escalonador de CPU Snapdragon/Dimensity</span>
              </div>
              <div>[RAM-BOOST] Realocando páginas zRAM para compressão LZ4</div>
              <div>[DISPLAY] Calibrando sincronização vertical e latência de entrada</div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 relative z-10 animate-in zoom-in-95 duration-300">
            {/* Success icon */}
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border-2 border-emerald-400/80 flex items-center justify-center shadow-[0_0_30px_rgba(52,211,153,0.3)]">
              <CheckCircle2 className="w-11 h-11 text-emerald-400 stroke-[2.5]" />
            </div>

            <div>
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                TURBO ATIVADO COM SUCESSO
              </span>
              <h3 className="text-2xl font-black text-white mt-2">
                Motorola Otimizado ao Máximo!
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Seu aparelho está pronto para máxima fluidez, menor latência e resposta instantânea.
              </p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-2 gap-3 text-left">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-900/40">
                <span className="text-[10px] text-slate-400 block font-medium">MEMÓRIA RAM LIBERADA</span>
                <span className="text-lg font-black text-cyan-400">+2.4 GB</span>
                <span className="text-[10px] text-slate-500 block">zRAM Otimizado</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-900/40">
                <span className="text-[10px] text-slate-400 block font-medium">RESFRIAMENTO DO SOC</span>
                <span className="text-lg font-black text-emerald-400">-4.6°C</span>
                <span className="text-[10px] text-slate-500 block">Temperatura controlada</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-900/40">
                <span className="text-[10px] text-slate-400 block font-medium">CACHE PURGADO</span>
                <span className="text-lg font-black text-blue-400">1.82 GB</span>
                <span className="text-[10px] text-slate-500 block">Temporários limpos</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan-900/40">
                <span className="text-[10px] text-slate-400 block font-medium">RESPOSTA DE TOQUE</span>
                <span className="text-lg font-black text-amber-400">Instantânea</span>
                <span className="text-[10px] text-slate-500 block">Sem input lag</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm tracking-wide shadow-lg shadow-cyan-500/25 transition-all transform active:scale-95"
            >
              CONCLUIR E APROVEITAR
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
