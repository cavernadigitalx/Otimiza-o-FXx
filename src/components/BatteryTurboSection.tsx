import React, { useState } from 'react';
import { Zap, BatteryCharging, ShieldCheck, Thermometer, Snowflake, CheckCircle2, AlertOctagon, HeartHandshake } from 'lucide-react';
import { MotoDevice, HardwareTelemetry } from '../types';
import { soundManager } from '../utils/audio';

interface BatteryTurboSectionProps {
  device: MotoDevice;
  telemetry: HardwareTelemetry;
  onUpdateTemp: (newTemp: number) => void;
}

export const BatteryTurboSection: React.FC<BatteryTurboSectionProps> = ({
  device,
  telemetry,
  onUpdateTemp,
}) => {
  const [optimizedChargeEnabled, setOptimizedChargeEnabled] = useState(true);
  const [thermalGuardEnabled, setThermalGuardEnabled] = useState(true);
  const [isCooling, setIsCooling] = useState(false);
  const [cooledSuccess, setCooledSuccess] = useState(false);

  const batteryHealthPercent = 96; // Motorola healthy battery
  const estimatedCycles = 142;

  const handleCoolDown = () => {
    soundManager.playTurbo();
    setIsCooling(true);
    setCooledSuccess(false);

    setTimeout(() => {
      setIsCooling(false);
      setCooledSuccess(true);
      soundManager.playSuccess();
      const newTemp = Math.max(30.1, telemetry.batteryTempC - 4.5);
      onUpdateTemp(newTemp);
      setTimeout(() => setCooledSuccess(false), 5000);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Motorola TurboPower™ {device.chargingWattage}W</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Saúde da Bateria & Controle Térmico
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Monitore a temperatura da bateria durante o carregamento ultrarrápido TurboPower e previna a degradação acelerada das células de íons de lítio.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#080d1a] border border-emerald-600/50 min-w-[170px] text-center shadow-[0_0_20px_rgba(52,211,153,0.15)]">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Saúde da Bateria</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-black text-emerald-400">{batteryHealthPercent}%</span>
              <span className="text-xs font-bold text-white">Excelente</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1">
              {estimatedCycles} Ciclos de carga
            </span>
          </div>
        </div>
      </div>

      {cooledSuccess && (
        <div className="p-4 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Resfriamento do Celular Executado!</h4>
              <p className="text-xs text-cyan-200">
                Processos térmicos de fundo encerrados. A temperatura do processador caiu para{' '}
                <strong>{telemetry.batteryTempC.toFixed(1)}°C</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Battery Metrics & Thermal Cooling Action */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Temp & Cool button */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Temperatura do SoC</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Thermometer className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{telemetry.batteryTempC.toFixed(1)}°C</span>
              <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/20">
                Faixa Segura
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Limite térmico antes de thermal throttling: 45.0°C
            </p>
          </div>

          <button
            onClick={handleCoolDown}
            disabled={isCooling}
            className="w-full py-2.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-700/60 text-cyan-300 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
          >
            <Snowflake className={`w-4 h-4 ${isCooling ? 'animate-spin' : ''}`} />
            <span>{isCooling ? 'Resfriando Celular...' : 'Resfriamento Rápido'}</span>
          </button>
        </div>

        {/* Metric 2: Charging watt status */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Carregador TurboPower</span>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-400">{device.chargingWattage}W</span>
              <span className="text-xs text-slate-400">Potência Máxima</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Carregamento rápido inteligente compatível com padrão USB Power Delivery 3.0.
            </p>
          </div>

          <div className="text-[11px] text-slate-400 p-2 rounded-lg bg-slate-950 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>0 a 100% em aprox. 28 a 40 minutos</span>
          </div>
        </div>

        {/* Metric 3: Battery Level & Protection */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Nível Atual</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <BatteryCharging className="w-4 h-4" />
            </div>
          </div>

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{telemetry.batteryLevel ?? 84}%</span>
              <span className="text-xs text-slate-400">
                {telemetry.isCharging ? 'Carregando' : 'Descarregando'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Autonomia estimada: 18h 35m de uso moderado
            </p>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full"
              style={{ width: `${telemetry.batteryLevel ?? 84}%` }}
            />
          </div>
        </div>
      </div>

      {/* Motorola Exclusive Battery Toggles */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
        <h3 className="text-base font-bold text-white">Recursos de Proteção Hello UI</h3>

        <div className="space-y-3">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white text-sm block">Carga Otimizada Motorola</span>
                <p className="text-xs text-slate-400">
                  Aprende sua rotina e pausa o carregamento nos 80% durante a noite, completando os 100% minutos antes de você acordar.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={optimizedChargeEnabled}
              onChange={() => {
                soundManager.playToggle();
                setOptimizedChargeEnabled(!optimizedChargeEnabled);
              }}
              className="w-5 h-5 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-900 cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white text-sm block">Guarda Térmico TurboPower</span>
                <p className="text-xs text-slate-400">
                  Modula a amperagem do carregamento caso o celular esteja sob sol quente ou executando jogos enquanto carrega.
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={thermalGuardEnabled}
              onChange={() => {
                soundManager.playToggle();
                setThermalGuardEnabled(!thermalGuardEnabled);
              }}
              className="w-5 h-5 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 bg-slate-900 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
