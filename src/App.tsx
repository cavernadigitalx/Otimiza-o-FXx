import React, { useState, useEffect } from 'react';
import {
  Zap,
  Cpu,
  HardDrive,
  Gamepad2,
  BatteryCharging,
  Sparkles,
  Signal,
  Terminal,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import { Header } from './components/Header';
import { TurboDashboard } from './components/TurboDashboard';
import { RamBoostSection } from './components/RamBoostSection';
import { StorageCleanerSection } from './components/StorageCleanerSection';
import { GametimeSection } from './components/GametimeSection';
import { BatteryTurboSection } from './components/BatteryTurboSection';
import { GesturesGuideSection } from './components/GesturesGuideSection';
import { NetworkOptimizerSection } from './components/NetworkOptimizerSection';
import { DeveloperTipsSection } from './components/DeveloperTipsSection';
import { ModelSelectorModal } from './components/ModelSelectorModal';
import { BoostModal } from './components/BoostModal';
import { MOTO_DEVICES } from './data/motoDevices';
import { MotoDevice, HardwareTelemetry, PerformanceMode } from './types';
import { detectRealHardware, measureRealPing } from './utils/hardware';
import { soundManager } from './utils/audio';

export default function App() {
  const [currentDevice, setCurrentDevice] = useState<MotoDevice>(MOTO_DEVICES[0]);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [isBoostModalOpen, setIsBoostModalOpen] = useState(false);
  const [systemHealthScore, setSystemHealthScore] = useState<number>(76);
  const [isBoosted, setIsBoosted] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [currentMode, setCurrentMode] = useState<PerformanceMode>('gametime');

  // Telemetry state
  const [telemetry, setTelemetry] = useState<HardwareTelemetry>({
    cores: 8,
    deviceMemoryGB: 8,
    batteryLevel: 86,
    isCharging: false,
    batteryTempC: 36.4,
    ramUsagePercent: 74,
    storageUsedGB: 68.4,
    storageTotalGB: 128,
    currentFps: 60,
    screenHz: 144,
    pingMs: 24,
  });

  // On mount: detect real hardware where possible
  useEffect(() => {
    setSoundEnabled(soundManager.isEnabled());

    const initHardware = async () => {
      const real = await detectRealHardware();
      const realPing = await measureRealPing();

      setTelemetry((prev) => ({
        ...prev,
        cores: real.cores ?? prev.cores,
        deviceMemoryGB: real.deviceMemoryGB ?? prev.deviceMemoryGB,
        batteryLevel: real.batteryLevel ?? prev.batteryLevel,
        isCharging: real.isCharging ?? prev.isCharging,
        storageTotalGB: real.storageTotalGB ?? prev.storageTotalGB,
        storageUsedGB: real.storageUsedGB ?? prev.storageUsedGB,
        pingMs: realPing,
      }));
    };

    initHardware();
  }, []);

  const handleToggleSound = () => {
    const newState = soundManager.toggleSound();
    setSoundEnabled(newState);
  };

  const handleTriggerBoost = () => {
    setIsBoostModalOpen(true);
  };

  const handleBoostComplete = () => {
    setIsBoosted(true);
    setSystemHealthScore(98);
    setTelemetry((prev) => ({
      ...prev,
      ramUsagePercent: Math.max(34, prev.ramUsagePercent - 28),
      batteryTempC: Math.max(29.8, prev.batteryTempC - 4.6),
      storageUsedGB: Math.max(40, prev.storageUsedGB - 2.8),
      pingMs: prev.pingMs ? Math.max(12, prev.pingMs - 10) : 16,
    }));
  };

  const handleStorageCleaned = (freedGB: number) => {
    setTelemetry((prev) => ({
      ...prev,
      storageUsedGB: Math.max(20, Math.round((prev.storageUsedGB - freedGB) * 10) / 10),
    }));
    setSystemHealthScore((prev) => Math.min(99, prev + 6));
  };

  const tabs = [
    { id: 'dashboard', label: 'Painel Turbo', icon: Zap },
    { id: 'ram', label: 'RAM Boost', icon: Cpu },
    { id: 'storage', label: 'Limpeza Profunda', icon: HardDrive },
    { id: 'gametime', label: 'Gametime & FPS', icon: Gamepad2 },
    { id: 'battery', label: 'TurboPower', icon: BatteryCharging },
    { id: 'gestures', label: 'Gestos Moto', icon: Sparkles },
    { id: 'network', label: 'Rede & Ping', icon: Signal },
    { id: 'dev-tips', label: 'Segredos Dev', icon: Terminal },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#080b12] text-slate-100 font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Header */}
      <Header
        currentDevice={currentDevice}
        onOpenDeviceModal={() => setIsDeviceModalOpen(true)}
        systemHealthScore={systemHealthScore}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-28 md:pb-12">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 scrollbar-none border-b border-slate-800/80">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Panes */}
        {activeTab === 'dashboard' && (
          <TurboDashboard
            device={currentDevice}
            telemetry={telemetry}
            systemScore={systemHealthScore}
            onTriggerBoost={handleTriggerBoost}
            onNavigateTab={(tabId) => setActiveTab(tabId)}
            isBoosted={isBoosted}
          />
        )}

        {activeTab === 'ram' && (
          <RamBoostSection
            device={currentDevice}
            ramUsagePercent={telemetry.ramUsagePercent}
            onUpdateRamUsage={(newPercent) =>
              setTelemetry((prev) => ({ ...prev, ramUsagePercent: newPercent }))
            }
          />
        )}

        {activeTab === 'storage' && (
          <StorageCleanerSection onStorageCleaned={handleStorageCleaned} />
        )}

        {activeTab === 'gametime' && (
          <GametimeSection
            device={currentDevice}
            currentMode={currentMode}
            onSelectMode={(mode) => setCurrentMode(mode)}
          />
        )}

        {activeTab === 'battery' && (
          <BatteryTurboSection
            device={currentDevice}
            telemetry={telemetry}
            onUpdateTemp={(newTemp) =>
              setTelemetry((prev) => ({ ...prev, batteryTempC: newTemp }))
            }
          />
        )}

        {activeTab === 'gestures' && <GesturesGuideSection />}

        {activeTab === 'network' && <NetworkOptimizerSection />}

        {activeTab === 'dev-tips' && <DeveloperTipsSection />}
      </main>

      {/* Floating Bottom Quick Boost Bar for Mobile */}
      <div className="fixed bottom-0 inset-x-0 z-30 p-3 bg-[#080d1a]/95 backdrop-blur-xl border-t border-cyan-900/40 md:hidden flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="text-left">
            <span className="text-xs font-bold text-white block truncate max-w-[150px]">
              {currentDevice.name}
            </span>
            <span className="text-[10px] text-cyan-400">Saúde: {systemHealthScore}%</span>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            handleTriggerBoost();
          }}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/30 active:scale-95"
        >
          <Zap className="w-4 h-4 fill-black" />
          <span>ACELERAR</span>
        </button>
      </div>

      {/* Modals */}
      <ModelSelectorModal
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
        selectedDevice={currentDevice}
        onSelectDevice={(device) => {
          setCurrentDevice(device);
          setTelemetry((prev) => ({
            ...prev,
            screenHz: device.refreshRate,
          }));
        }}
      />

      <BoostModal
        isOpen={isBoostModalOpen}
        onClose={() => setIsBoostModalOpen(false)}
        onBoostComplete={handleBoostComplete}
        deviceName={currentDevice.name}
      />
    </div>
  );
}
