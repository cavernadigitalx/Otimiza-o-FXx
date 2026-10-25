import React, { useState } from 'react';
import { HardDrive, Trash2, CheckCircle2, ShieldCheck, Layers, MessageSquare, Image, Package, FileText, FolderArchive, Sparkles } from 'lucide-react';
import { INITIAL_STORAGE_CATEGORIES } from '../data/motoDevices';
import { StorageCategory } from '../types';
import { soundManager } from '../utils/audio';

interface StorageCleanerSectionProps {
  onStorageCleaned: (freedGB: number) => void;
}

export const StorageCleanerSection: React.FC<StorageCleanerSectionProps> = ({ onStorageCleaned }) => {
  const [categories, setCategories] = useState<StorageCategory[]>(INITIAL_STORAGE_CATEGORIES);
  const [isCleaning, setIsCleaning] = useState(false);
  const [cleanFinished, setCleanFinished] = useState(false);
  const [lastFreedMB, setLastFreedMB] = useState(0);

  const toggleSelectCategory = (id: string) => {
    soundManager.playToggle();
    setCategories((prev) =>
      prev.map((cat) => (cat.id === id ? { ...cat, selected: !cat.selected } : cat))
    );
  };

  const totalSelectedMB = categories
    .filter((c) => c.selected)
    .reduce((acc, curr) => acc + curr.sizeMB, 0);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers':
        return <Layers className="w-5 h-5 text-cyan-400" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5 text-emerald-400" />;
      case 'Image':
        return <Image className="w-5 h-5 text-blue-400" />;
      case 'Package':
        return <Package className="w-5 h-5 text-amber-400" />;
      case 'FileText':
        return <FileText className="w-5 h-5 text-purple-400" />;
      case 'FolderArchive':
        return <FolderArchive className="w-5 h-5 text-rose-400" />;
      default:
        return <HardDrive className="w-5 h-5 text-cyan-400" />;
    }
  };

  const handleClean = () => {
    if (totalSelectedMB === 0) return;

    soundManager.playCleanSweep();
    setIsCleaning(true);
    setCleanFinished(false);

    setTimeout(() => {
      const freed = totalSelectedMB;
      setLastFreedMB(freed);
      setIsCleaning(false);
      setCleanFinished(true);
      soundManager.playSuccess();

      // Zero out selected categories
      setCategories((prev) =>
        prev.map((c) => (c.selected ? { ...c, sizeMB: 0, selected: false } : c))
      );

      const freedGB = Math.round((freed / 1024) * 10) / 10;
      onStorageCleaned(freedGB);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border border-blue-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Limpeza Segura • 100% Livre de Risco</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Limpador Profundo de Armazenamento Motorola
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Elimina resíduos ocultos, lixo de redes sociais, caches zumbis e miniaturas órfãs sem tocar em fotos pessoais, conversas ou senhas.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#080d1a] border border-blue-700/50 min-w-[170px] text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Lixo Selecionado</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-black text-blue-400">
                {(totalSelectedMB / 1024).toFixed(2)}
              </span>
              <span className="text-xs font-bold text-white">GB</span>
            </div>
            <span className="text-[10px] text-slate-500 mt-1">Pronto para remoção</span>
          </div>
        </div>
      </div>

      {cleanFinished && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Limpeza Concluída com Sucesso!</h4>
              <p className="text-xs text-emerald-200">
                Você recuperou <strong>{(lastFreedMB / 1024).toFixed(2)} GB</strong> de espaço livre no seu Motorola.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white">Categorias de Arquivos Residuais</h3>
          <button
            onClick={() => {
              soundManager.playClick();
              const allSelected = categories.every((c) => c.selected);
              setCategories((prev) => prev.map((c) => ({ ...c, selected: !allSelected })));
            }}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300"
          >
            {categories.every((c) => c.selected) ? 'Desmarcar Todos' : 'Marcar Todos'}
          </button>
        </div>

        <div className="space-y-2.5">
          {categories.map((cat) => {
            const isZero = cat.sizeMB === 0;
            return (
              <div
                key={cat.id}
                onClick={() => !isZero && toggleSelectCategory(cat.id)}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                  isZero
                    ? 'opacity-40 bg-slate-950/40 border-slate-800 cursor-not-allowed'
                    : cat.selected
                    ? 'bg-blue-950/30 border-blue-500/60 shadow-[0_0_15px_rgba(59,130,246,0.15)] cursor-pointer'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 cursor-pointer'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    {getIcon(cat.icon)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{cat.name}</span>
                      {cat.recommended && (
                        <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Recomendado
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{cat.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <span className="font-mono text-sm font-bold text-white">
                    {isZero ? 'Limpo' : `${(cat.sizeMB / 1024).toFixed(2)} GB`}
                  </span>

                  <input
                    type="checkbox"
                    checked={cat.selected}
                    disabled={isZero}
                    onChange={() => {}} // handled by parent onClick
                    className="w-5 h-5 rounded border-slate-700 text-blue-500 focus:ring-blue-500 bg-slate-900 cursor-pointer"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Master Clean Button */}
        <div className="pt-3">
          <button
            onClick={handleClean}
            disabled={isCleaning || totalSelectedMB === 0}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 hover:from-blue-500 hover:to-teal-300 disabled:opacity-40 disabled:cursor-not-allowed text-black font-black text-sm tracking-wide shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2.5 active:scale-98"
          >
            {isCleaning ? (
              <>
                <Trash2 className="w-5 h-5 animate-bounce text-black" />
                <span>EXPURGANDO RESÍDUOS DO MOTOROLA...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-5 h-5 fill-black text-black" />
                <span>
                  LIMPAR {(totalSelectedMB / 1024).toFixed(2)} GB DE ARMAZENAMENTO AGORA
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
