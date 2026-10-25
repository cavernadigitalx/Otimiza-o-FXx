import React, { useState } from 'react';
import { X, Check, Smartphone, Cpu, Zap, Gauge, Search } from 'lucide-react';
import { MotoDevice } from '../types';
import { MOTO_DEVICES } from '../data/motoDevices';
import { soundManager } from '../utils/audio';

interface ModelSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDevice: MotoDevice;
  onSelectDevice: (device: MotoDevice) => void;
}

export const ModelSelectorModal: React.FC<ModelSelectorModalProps> = ({
  isOpen,
  onClose,
  selectedDevice,
  onSelectDevice,
}) => {
  const [search, setSearch] = useState('');
  const [selectedSeries, setSelectedSeries] = useState<string>('all');

  if (!isOpen) return null;

  const filteredDevices = MOTO_DEVICES.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(search.toLowerCase()) ||
      device.chipset.toLowerCase().includes(search.toLowerCase()) ||
      device.series.toLowerCase().includes(search.toLowerCase());
    const matchesSeries = selectedSeries === 'all' || device.series === selectedSeries;
    return matchesSearch && matchesSeries;
  });

  const seriesList = ['all', 'Edge', 'Moto G', 'Razr', 'ThinkPhone'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0c121e] border border-cyan-800/40 rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.15)] flex flex-col max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Selecione seu Smartphone Motorola</h2>
              <p className="text-xs text-slate-400">
                Os parâmetros de zRAM, taxa de tela e Gametime serão calibrados para seu hardware
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="p-4 border-b border-slate-800/80 space-y-3 bg-[#0a0f19]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar modelo (ex: Edge 50, Moto G84, Razr)..."
              className="w-full bg-slate-900 border border-slate-700/60 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
            />
          </div>

          {/* Series Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {seriesList.map((series) => (
              <button
                key={series}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedSeries(series);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap ${
                  selectedSeries === series
                    ? 'bg-cyan-500 text-black font-semibold shadow-sm shadow-cyan-500/30'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {series === 'all' ? 'Todos os Modelos' : `Linha ${series}`}
              </button>
            ))}
          </div>
        </div>

        {/* Device List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredDevices.map((device) => {
            const isSelected = selectedDevice.id === device.id;
            return (
              <div
                key={device.id}
                onClick={() => {
                  soundManager.playSuccess();
                  onSelectDevice(device);
                  onClose();
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500/80 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white text-sm">{device.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-800 text-cyan-400 border border-cyan-800/40">
                      {device.series}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-cyan-500 text-black">
                        Ativo
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                      {device.chipset}
                    </span>
                    <span className="flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-blue-400" />
                      {device.refreshRate}Hz Display
                    </span>
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      {device.chargingWattage}W TurboPower
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>RAM Base: {device.defaultRam} GB</span>
                    <span>•</span>
                    <span className="text-cyan-400/90 font-medium">
                      Suporte a RAM Boost até +{device.maxRamBoost} GB
                    </span>
                  </div>
                </div>

                <div className="flex items-center">
                  {isSelected ? (
                    <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-black">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full border border-slate-700 hover:border-cyan-500 flex items-center justify-center text-transparent" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[#0a0f19] border-t border-slate-800 text-center text-xs text-slate-400">
          Não encontrou seu modelo específico? Selecione o mais próximo ou use <strong className="text-cyan-400">Modelo Personalizado</strong>.
        </div>
      </div>
    </div>
  );
};
