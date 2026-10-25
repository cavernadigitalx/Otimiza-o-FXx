import React, { useState } from 'react';
import { Terminal, Copy, Check, Sparkles, ChevronRight, Sliders, Smartphone, ShieldCheck } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const DeveloperTipsSection: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const tips = [
    {
      title: '1. Escala de Animações em 0.5x (Sensação de Celular 2x Mais Rápido)',
      description:
        'Reduz pela metade o tempo que o Motorola gasta abrindo pastas, trocando de janelas e renderizando transições do Hello UI.',
      steps: [
        'Abra Configurar > Sistema > Opções do desenvolvedor',
        'Role até a seção "Desenho"',
        'Altere "Escala de animação da janela" de 1x para 0.5x',
        'Altere "Escala de transição da animação" de 1x para 0.5x',
        'Altere "Escala de duração do animator" de 1x para 0.5x',
      ],
      impact: 'Fluidez Instantânea',
    },
    {
      title: '2. Suspender Execução de Apps em Cache',
      description:
        'Recurso nativo do Android 14/15 que congela 100% dos apps em segundo plano, impedindo que consumam CPU e bateria enquanto você não os usa.',
      steps: [
        'Em Opções do desenvolvedor, procure por "Suspender execução de apps em cache"',
        'Selecione "Ativado" ou "Padrão do dispositivo"',
        'Reinicie o seu Motorola para aplicar a alteração',
      ],
      impact: '+25% de Bateria',
    },
    {
      title: '3. Desativar Rastreamento do Sistema (System Tracing)',
      description:
        'Por padrão, o Android grava constantemente buffers de diagnóstico no processador, desperdiçando ciclos de clock.',
      steps: [
        'Vá em Opções do desenvolvedor > Rastreamento do sistema',
        'Desmarque "Gravar rastreamento"',
        'Toque em "Limpar rastreamentos salvos"',
        'Defina "Tamanho do buffer por CPU" para o mínimo (8192 KB)',
      ],
      impact: 'Menos Uso de CPU',
    },
    {
      title: '4. Limite de Processos em Segundo Plano (Para Moto G com 4GB/6GB)',
      description:
        'Evita que celulares com menos memória engasguem com excesso de processos abertos ao mesmo tempo.',
      steps: [
        'Em Opções do desenvolvedor, role até a seção "Apps"',
        'Toque em "Limite de processamento em segundo plano"',
        'Escolha "No máximo 3 processos" ou "No máximo 4 processos"',
      ],
      impact: 'Fim dos Travamentos',
    },
  ];

  const adbScript = `# Comandos ADB para desinstalar bloatware com segurança no Motorola (Sem Root)
adb shell pm uninstall -k --user 0 com.facebook.katana
adb shell pm uninstall -k --user 0 com.facebook.system
adb shell pm uninstall -k --user 0 com.facebook.appmanager
adb shell pm uninstall -k --user 0 com.motorola.ccc.ota
adb shell pm uninstall -k --user 0 com.google.android.apps.tachyon`;

  const copyToClipboard = (text: string, index: number) => {
    soundManager.playClick();
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Configurações Ocultas Oficiais do Android</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Segredos das Opções do Desenvolvedor Motorola
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Configurações avançadas testadas por especialistas para extrair 100% da velocidade do processador sem precisar fazer root.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#090e1a] border border-cyan-700/40 max-w-xs text-xs text-slate-300 space-y-1">
            <span className="font-bold text-cyan-400 block">Como ativar no Motorola:</span>
            <p className="text-[11px] text-slate-400">
              Vá em <strong>Configurar</strong> &gt; <strong>Sobre o telefone</strong> &gt; Toque 7 vezes seguidas em <strong>"Número da versão"</strong> até surgir a mensagem de desenvolvedor.
            </p>
          </div>
        </div>
      </div>

      {/* Tips Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, idx) => (
          <div key={idx} className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-white text-sm">{tip.title}</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                {tip.impact}
              </span>
            </div>

            <p className="text-xs text-slate-400">{tip.description}</p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-300 block">Passo a passo:</span>
              {tip.steps.map((step, sIdx) => (
                <div key={sIdx} className="flex items-start gap-2 text-xs text-slate-400">
                  <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ADB Debloat Script Box */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              Comandos ADB para Desinstalar Lixo Sem Root
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Copie e cole no Prompt de Comando do seu PC com o Motorola conectado no modo Depuração USB
            </p>
          </div>

          <button
            onClick={() => copyToClipboard(adbScript, 99)}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            {copiedIndex === 99 ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Script ADB</span>
              </>
            )}
          </button>
        </div>

        <pre className="p-4 rounded-2xl bg-black/80 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed">
          {adbScript}
        </pre>
      </div>
    </div>
  );
};
