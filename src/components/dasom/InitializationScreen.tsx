import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Smartphone, Globe, Shield, Cpu, Wifi, Battery, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import dasomLogo from "@/assets/dasom-logo.png";

interface InitializationScreenProps {
  onComplete: () => void;
}

type InitPhase = "idle" | "initializing" | "logo-reveal" | "scanning" | "complete";

const initializationSteps = [
  { id: 1, label: "Neural Core", icon: Cpu, duration: 600 },
  { id: 2, label: "Device Bridge", icon: Smartphone, duration: 500 },
  { id: 3, label: "Network Sync", icon: Wifi, duration: 400 },
  { id: 4, label: "Power Systems", icon: Battery, duration: 300 },
  { id: 5, label: "Security Matrix", icon: Shield, duration: 500 },
];

export function InitializationScreen({ onComplete }: InitializationScreenProps) {
  const [phase, setPhase] = useState<InitPhase>("idle");
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [deviceType, setDeviceType] = useState<"mobile" | "web" | null>(null);

  // Detect device type
  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    setDeviceType(isMobile ? "mobile" : "web");
  }, []);

  const startInitialization = () => {
    setPhase("initializing");
    
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Step through initialization
    let stepIndex = 0;
    const runStep = () => {
      if (stepIndex < initializationSteps.length) {
        setCurrentStep(stepIndex);
        setTimeout(() => {
          setCompletedSteps(prev => [...prev, initializationSteps[stepIndex].id]);
          stepIndex++;
          runStep();
        }, initializationSteps[stepIndex].duration);
      } else {
        setTimeout(() => setPhase("logo-reveal"), 300);
      }
    };
    
    setTimeout(runStep, 500);
  };

  const handleLogoReveal = () => {
    setTimeout(() => {
      setPhase("scanning");
      setTimeout(() => {
        setPhase("complete");
        setTimeout(onComplete, 1000);
      }, 2000);
    }, 2500);
  };

  useEffect(() => {
    if (phase === "logo-reveal") {
      handleLogoReveal();
    }
  }, [phase]);

  return (
    <div className="fixed inset-0 bg-[#0a0f14] z-50 flex items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Ambient glow */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      />

      <AnimatePresence mode="wait">
        {/* IDLE STATE - AI INITIATE Button */}
        {phase === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-8"
          >
            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary/50 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}

            {/* Central orb */}
            <motion.div 
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-40 h-40 rounded-full border border-primary/30 flex items-center justify-center">
                <div className="w-32 h-32 rounded-full border border-primary/50 flex items-center justify-center">
                  <motion.div 
                    className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Zap className="w-10 h-10 text-primary" />
                  </motion.div>
                </div>
              </div>
              
              {/* Orbital dots */}
              {[0, 90, 180, 270].map((deg, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${deg}deg) translateX(80px) translateY(-50%)`
                  }}
                />
              ))}
            </motion.div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h1 className="font-orbitron text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                DASOM
              </h1>
              <p className="text-sm font-tech text-muted-foreground">Advanced AI Assistant</p>
            </div>

            {/* Device detection badge */}
            <motion.div 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-primary/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {deviceType === "mobile" ? (
                <>
                  <Smartphone className="w-4 h-4 text-primary" />
                  <span className="text-xs font-tech text-muted-foreground">Mobile Device Detected</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 text-accent" />
                  <span className="text-xs font-tech text-muted-foreground">Web Browser Detected</span>
                </>
              )}
            </motion.div>

            {/* AI INITIATE Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                onClick={startInitialization}
                className="relative px-12 py-6 text-lg font-orbitron bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-primary-foreground rounded-xl overflow-hidden group"
              >
                {/* Button glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/50 to-accent/50"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ filter: 'blur(20px)' }}
                />
                
                <span className="relative flex items-center gap-3">
                  <Zap className="w-5 h-5" />
                  AI INITIATE
                </span>
              </Button>
            </motion.div>
          </motion.div>
        )}

        {/* INITIALIZING STATE */}
        {phase === "initializing" && (
          <motion.div
            key="initializing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center gap-8 w-full max-w-md px-6"
          >
            {/* Progress ring */}
            <motion.div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-secondary"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={283}
                  strokeDashoffset={283 - (283 * progress) / 100}
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-orbitron text-2xl font-bold text-primary">{progress}%</span>
              </div>
            </motion.div>

            {/* Status text */}
            <div className="text-center">
              <h2 className="font-orbitron text-xl font-bold text-foreground">INITIALIZING</h2>
              <p className="text-sm font-tech text-muted-foreground mt-1">Establishing neural connection...</p>
            </div>

            {/* Initialization steps */}
            <div className="w-full space-y-3">
              {initializationSteps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === index;
                const isComplete = completedSteps.includes(step.id);
                
                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      isComplete 
                        ? 'bg-primary/10 border-primary/30' 
                        : isActive 
                          ? 'bg-secondary/50 border-accent/30' 
                          : 'bg-secondary/20 border-border/30'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${
                      isComplete ? 'bg-primary/20' : isActive ? 'bg-accent/20' : 'bg-secondary/50'
                    }`}>
                      {isComplete ? (
                        <Check className="w-4 h-4 text-primary" />
                      ) : (
                        <Icon className={`w-4 h-4 ${isActive ? 'text-accent animate-pulse' : 'text-muted-foreground'}`} />
                      )}
                    </div>
                    <span className={`font-tech text-sm ${
                      isComplete ? 'text-primary' : isActive ? 'text-accent' : 'text-muted-foreground'
                    }`}>
                      {step.label}
                    </span>
                    {isActive && !isComplete && (
                      <motion.div
                        className="ml-auto w-4 h-4 border-2 border-accent border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                    {isComplete && (
                      <span className="ml-auto text-xs font-tech text-primary">ONLINE</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* LOGO REVEAL STATE */}
        {(phase === "logo-reveal" || phase === "scanning") && (
          <motion.div
            key="logo"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center"
          >
            {/* Logo with glow */}
            <motion.div
              className="relative"
              animate={phase === "scanning" ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {/* Outer glow rings */}
              <motion.div
                className="absolute inset-0 -m-8 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(0, 212, 255, 0.3) 0%, transparent 70%)'
                }}
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Scanning lines */}
              {phase === "scanning" && (
                <>
                  <motion.div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                    initial={{ top: 0 }}
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.div
                    className="absolute inset-y-0 w-1 bg-gradient-to-b from-transparent via-accent to-transparent"
                    initial={{ left: 0 }}
                    animate={{ left: ['0%', '100%', '0%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear", delay: 0.5 }}
                  />
                </>
              )}

              {/* Main logo */}
              <motion.img
                src={dasomLogo}
                alt="DASOM AI Assistant"
                className="w-80 md:w-96 h-auto relative z-10"
                initial={{ filter: 'brightness(0)' }}
                animate={{ filter: 'brightness(1)' }}
                transition={{ duration: 1 }}
              />
            </motion.div>

            {/* Status text */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {phase === "logo-reveal" && (
                <p className="font-tech text-primary animate-pulse">AI CORE ACTIVATED</p>
              )}
              {phase === "scanning" && (
                <div className="space-y-2">
                  <p className="font-tech text-accent">SCANNING DEVICE CAPABILITIES</p>
                  <p className="text-xs text-muted-foreground">
                    {deviceType === "mobile" ? "Mobile optimization enabled" : "Web interface ready"}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* COMPLETE STATE - Quick fade out */}
        {phase === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0, scale: 1.2 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <motion.img
              src={dasomLogo}
              alt="DASOM"
              className="w-80 md:w-96 h-auto"
            />
            <motion.p 
              className="mt-4 font-orbitron text-xl text-primary"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5 }}
            >
              SYSTEM READY
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}