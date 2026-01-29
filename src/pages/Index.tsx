import { useState, useEffect } from "react";
import { DasomApp } from "@/components/dasom/DasomApp";
import { FloatingOverlay } from "@/components/dasom/FloatingOverlay";
import { InitializationScreen } from "@/components/dasom/InitializationScreen";

const Index = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showInit, setShowInit] = useState(true);

  // Check if already initialized in this session
  useEffect(() => {
    const wasInitialized = sessionStorage.getItem("dasom-initialized");
    if (wasInitialized === "true") {
      setIsInitialized(true);
      setShowInit(false);
    }
  }, []);

  const handleInitComplete = () => {
    sessionStorage.setItem("dasom-initialized", "true");
    setIsInitialized(true);
    setShowInit(false);
  };

  return (
    <>
      {showInit && !isInitialized && (
        <InitializationScreen onComplete={handleInitComplete} />
      )}
      {isInitialized && (
        <>
          <DasomApp />
          <FloatingOverlay />
        </>
      )}
    </>
  );
};

export default Index;