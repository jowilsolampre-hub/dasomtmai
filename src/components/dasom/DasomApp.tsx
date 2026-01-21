import { useState } from "react";
import { Header } from "./Header";
import { Navigation } from "./Navigation";
import { HomeScreen } from "./screens/HomeScreen";
import { DiagnosticsScreen } from "./screens/DiagnosticsScreen";
import { SecurityScreen } from "./screens/SecurityScreen";
import { OptimizerScreen } from "./screens/OptimizerScreen";
import { ScheduleScreen } from "./screens/ScheduleScreen";
import { SettingsScreen } from "./screens/SettingsScreen";
import { VoiceScreen } from "./screens/VoiceScreen";

export function DasomApp() {
  const [currentScreen, setCurrentScreen] = useState("home");

  const renderScreen = () => {
    switch (currentScreen) {
      case "home":
        return <HomeScreen />;
      case "diagnostics":
        return <DiagnosticsScreen />;
      case "security":
        return <SecurityScreen />;
      case "optimizer":
        return <OptimizerScreen />;
      case "schedule":
        return <ScheduleScreen />;
      case "voice":
        return <VoiceScreen />;
      case "settings":
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[300px] bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header 
          showStatus={true}
          onSettingsClick={() => setCurrentScreen("settings")}
        />
        
        <main className="flex-1 overflow-y-auto pb-20">
          {renderScreen()}
        </main>

        <Navigation 
          currentScreen={currentScreen} 
          onNavigate={setCurrentScreen} 
        />
      </div>
    </div>
  );
}
