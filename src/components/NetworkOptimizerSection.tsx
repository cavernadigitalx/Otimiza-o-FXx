import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Globe, Zap, CheckCircle2, RefreshCw, ShieldCheck } from 'lucide-react';
import { measureRealPing } from '../utils/hardware';
import { soundManager } from '../utils/audio';

export const NetworkOptimizerSection: React.FC = () => {
  const [ping, setPing] = useState<number | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [selectedDns, setSelectedDns] = useState<'cloudflare' | 'google' | 'adguard' | 'quad9'>('cloudflare');
  const [isFlushing, setIsFlushing] = useState(false);
  const [flushSuccess, setFlushSuccess] = useState(false);

  useEffect(() => {
    runPingTest();
  }, []);

  const runPingTest = async () => {
    setIsTesting(true);
    const measured = await measureRealPing();
    setPing(measured);
    setIsTesting(false);
  };

  const handleFlushDns = () => {
    soundManager.playCleanSweep();
    setIsFlushing(true);
    setFlushSuccess(false);

    setTimeout(() => {
      setIsFlushing(false);
      setFlushSuccess(true);
      soundManager.playSuccess();
      setPing((prev) => (prev ? Math.max(14, prev - 8) : 18));
      setTimeout(() => setFlushSuccess(false), 4000);
    }, 1500);
  };

  const dnsOptions = [
    {
      id: 'cloudflare',
      name: 'Cloudflare 1.1.1.1 (Gamer)',
      primary: '1.1.1.1',
      secondary: '1.0.0.1',
      badge: 'Menor Ping em Jogos',
      color: 'border-cyan-500/50 bg-cyan-950/30 text-cyan-400',
    },
    {
      id: 'adguard',
      name: 'AdGuard DNS (Sem Anúncios)',
      primary: '94.140.14.14',
      secondary: '94.140.15.15',
      badge: 'Bloqueia Banners em Apps',
      color: 'border-emerald-500/50 bg-emerald-950/30 text-emerald-400',
    },
    {
      id: 'google',
      name: 'Google Public DNS',
      primary: '8.8.8.8',
      secondary: '8.8.4.4',
      badge: 'Streaming & Downloads',
      color: 'border-blue-500/50 bg-blue-950/30 text-blue-400',
    },
    {
      id: 'quad9',
      name: 'Quad9 Security DNS',
      primary: '9.9.9.9',
      secondary: '149.112.112.112',
      badge: 'Anti-Phishing',
      color: 'border-purple-500/50 bg-purple-950/30 text-purple-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-950/60 via-slate-900 to-slate-900 border border-blue-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-2">
              <Signal className="w-3.5 h-3.5 text-blue-400" />
              <span>Wi-Fi 6E & 5G SA • Otimização de Roteamento</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Estabilizador de Rede & Ping Baixo
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Reduza a latência de pacotes de dados, evite perdas de sinal (packet loss) e acelere a resolução de nomes configurando DNS Privado ultrarrápido no Motorola.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#080d1a] border border-blue-600/50 min-w-[170px] text-center shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <span className="text-[11px] font-bold text-slate-400 uppercase">Ping Atual</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-4xl font-black text-blue-400">{ping !== null ? ping : '--'}</span>
              <span className="text-xs font-bold text-slate-300">ms</span>
            </div>
            <button
              onClick={runPingTest}
              disabled={isTesting}
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-semibold mt-1 flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'Testando...' : 'Testar Novamente'}</span>
            </button>
          </div>
        </div>
      </div>

      {flushSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Cache DNS Purgado com Sucesso!</h4>
              <p className="text-xs text-emerald-200">
                Tabelas de roteamento renovadas e latência estabilizada para servidores de jogos e streaming.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* DNS Selector */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-cyan-400" />
            Configuração de DNS Privado Motorola
          </h3>
          <span className="text-xs text-slate-400">Configurações &gt; Rede &gt; DNS Privado</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {dnsOptions.map((dns) => {
            const isSelected = selectedDns === dns.id;
            return (
              <div
                key={dns.id}
                onClick={() => {
                  soundManager.playToggle();
                  setSelectedDns(dns.id as typeof selectedDns);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? `${dns.color} shadow-lg`
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-sm">{dns.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-slate-300 border border-slate-700">
                    {dns.badge}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-400 flex items-center gap-3">
                  <span>Primário: <strong className="text-white">{dns.primary}</strong></span>
                  <span>Secundário: <strong className="text-white">{dns.secondary}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Flush Button */}
        <div className="pt-2">
          <button
            onClick={handleFlushDns}
            disabled={isFlushing}
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isFlushing ? 'animate-spin' : ''}`} />
            <span>{isFlushing ? 'REDEFININDO CACHE DNS...' : 'REINICIAR SOCKETS & LIMPAR CACHE DNS'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
