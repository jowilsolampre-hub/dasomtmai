import { useState, useEffect } from "react";

export interface DeviceConnection {
  isNativeApp: boolean;
  platform: string;
  browser: string;
  deviceType: "mobile" | "tablet" | "desktop";
  isOnline: boolean;
  batteryLevel: number | null;
  batteryCharging: boolean | null;
  screenWidth: number;
  screenHeight: number;
  connectionType: string | null;
}

function detectPlatform(): string {
  const ua = navigator.userAgent;
  if (/windows/i.test(ua)) return "Windows";
  if (/macintosh|mac os x/i.test(ua)) return "macOS";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Unknown";
}

function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (/edge|edg/i.test(ua)) return "Edge";
  if (/chrome/i.test(ua) && !/edge|edg/i.test(ua)) return "Chrome";
  if (/firefox/i.test(ua)) return "Firefox";
  if (/safari/i.test(ua) && !/chrome/i.test(ua)) return "Safari";
  if (/opera|opr/i.test(ua)) return "Opera";
  return "Unknown";
}

function detectDeviceType(): "mobile" | "tablet" | "desktop" {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) return "mobile";
  return "desktop";
}

export function useDeviceConnection() {
  const [connection, setConnection] = useState<DeviceConnection>({
    isNativeApp: !!(window as any).Capacitor?.isNativePlatform?.(),
    platform: detectPlatform(),
    browser: detectBrowser(),
    deviceType: detectDeviceType(),
    isOnline: navigator.onLine,
    batteryLevel: null,
    batteryCharging: null,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    connectionType: null,
  });

  useEffect(() => {
    // Online/offline
    const onOnline = () => setConnection(c => ({ ...c, isOnline: true }));
    const onOffline = () => setConnection(c => ({ ...c, isOnline: false }));
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);

    // Battery API
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setConnection(c => ({
          ...c,
          batteryLevel: Math.round(battery.level * 100),
          batteryCharging: battery.charging,
        }));
        battery.addEventListener("levelchange", () => {
          setConnection(c => ({ ...c, batteryLevel: Math.round(battery.level * 100) }));
        });
        battery.addEventListener("chargingchange", () => {
          setConnection(c => ({ ...c, batteryCharging: battery.charging }));
        });
      }).catch(() => {});
    }

    // Network Information API
    const nav = navigator as any;
    if (nav.connection) {
      setConnection(c => ({ ...c, connectionType: nav.connection.effectiveType || null }));
      nav.connection.addEventListener?.("change", () => {
        setConnection(c => ({ ...c, connectionType: nav.connection.effectiveType || null }));
      });
    }

    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  return connection;
}
