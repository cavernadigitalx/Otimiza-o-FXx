import React, { useState, useEffect } from 'react';
import { Sparkles, Flashlight, Camera, Smartphone, Monitor, Moon, CheckCircle2, RotateCw } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const GesturesGuideSection: React.FC = () => {
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [shakeCount, setShakeCount] = useState(0);
  const [threeFingerScreenshot, setThreeFingerScreenshot] = useState(false);

  const toggleFlashlight = () => {
    soundManager.playToggle();
    setFlashlightOn(!flashlightOn);
  };

  const triggerCameraGesture = () => {
    soundManager.playClick();
    setCameraActive(true);
    setTimeout(() => setCameraActive(false), 2500);
  };

  const triggerScreenshot = () => {
    soundManager.playCleanSweep();
    setThreeFingerScreenshot(true);
    setTimeout(() => setThreeFingerScreenshot(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-800/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Moto Ações & Sensores • Hello UI</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Calibração de Gestos Motorola (Moto Actions)
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Teste os sensores do giroscópio e acelerômetro do seu Motorola para garantir que os famosos atalhos de lanterna, câmera e toque respondam sem falhas ou falsos positivos.
            </p>
          </div>
        </div>
      </div>

      {threeFingerScreenshot && (
        <div className="p-4 rounded-2xl bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 flex items-center justify-center gap-2 animate-in zoom-in-95">
          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          <span className="font-bold text-sm">📸 Captura de Tela Efetuada com Sucesso!</span>
        </div>
      )}

      {/* Interactive Gestures Simulator Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Gesture 1: Flashlight (Agitar duas vezes) */}
        <div className={`p-5 rounded-3xl border transition-all ${
          flashlightOn
            ? 'bg-amber-950/30 border-amber-500/60 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${flashlightOn ? 'bg-amber-500 text-black' : 'bg-slate-950 text-amber-400'} border border-slate-800`}>
                <Flashlight className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Agitar para Lanterna Rápida</h3>
                <span className="text-[11px] text-slate-400">Fast Flashlight (Dois cortes no ar)</span>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              flashlightOn ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              {flashlightOn ? 'Ligada' : 'Desligada'}
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Faça dois movimentos firmes de corte para baixo para ligar ou desligar a lanterna traseira instantaneamente.
          </p>

          <button
            onClick={toggleFlashlight}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 ${
              flashlightOn
                ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-md shadow-amber-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
          >
            <Flashlight className="w-4 h-4" />
            <span>{flashlightOn ? 'Apagar Lanterna' : 'Testar Gesto de Lanterna'}</span>
          </button>
        </div>

        {/* Gesture 2: Camera (Girar o pulso duas vezes) */}
        <div className={`p-5 rounded-3xl border transition-all ${
          cameraActive
            ? 'bg-cyan-950/40 border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.3)]'
            : 'bg-slate-900/60 border-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${cameraActive ? 'bg-cyan-500 text-black' : 'bg-slate-950 text-cyan-400'} border border-slate-800`}>
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Girar Pulso para Câmera</h3>
                <span className="text-[11px] text-slate-400">Quick Capture (Giro duplo 180°)</span>
              </div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
              cameraActive ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-800 text-slate-400'
            }`}>
              {cameraActive ? 'Câmera Ativada' : 'Pronto'}
            </span>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Gire o pulso duas vezes rapidamente para abrir a câmera mesmo com o celular bloqueado ou alternar entre lente frontal/traseira.
          </p>

          <button
            onClick={triggerCameraGesture}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <RotateCw className="w-4 h-4 text-cyan-400" />
            <span>Simular Giro de Pulso</span>
          </button>
        </div>

        {/* Gesture 3: Three finger screenshot */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-950 text-purple-400 border border-slate-800">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Captura com 3 Dedos</h3>
                <span className="text-[11px] text-slate-400">Toque prolongado com 3 pontas</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Toque e segure a tela com três dedos em qualquer aplicativo para tirar um print screen instantâneo sem precisar apertar botões físicos.
          </p>

          <button
            onClick={triggerScreenshot}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span>Testar Captura com 3 Dedos</span>
          </button>
        </div>

        {/* Gesture 4: Smart Connect / Ready For */}
        <div className="p-5 rounded-3xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-950 text-blue-400 border border-slate-800">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">Smart Connect & Ready For</h3>
                <span className="text-[11px] text-slate-400">Modo Desktop & Compartilhamento</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Transforme seu celular Motorola em um computador completo conectando via cabo USB-C DisplayPort ou sem fio no Windows, Mac e TVs inteligentes.
          </p>

          <div className="text-[11px] text-cyan-400 p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/40 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>Compatível nativamente com as linhas Moto Edge, ThinkPhone e Razr</span>
          </div>
        </div>
      </div>
    </div>
  );
};
