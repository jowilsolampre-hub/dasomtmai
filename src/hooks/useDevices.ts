import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

interface Device {
  id: string;
  user_id: string;
  device_name: string;
  device_type: string;
  platform: string | null;
  browser: string | null;
  last_active: string;
  is_current: boolean;
  created_at: string;
}

function detectDeviceInfo() {
  const ua = navigator.userAgent;
  let deviceType = "desktop";
  let platform = "Unknown";
  let browser = "Unknown";

  // Detect device type
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    deviceType = "tablet";
  } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
    deviceType = "mobile";
  }

  // Detect platform
  if (/windows/i.test(ua)) platform = "Windows";
  else if (/macintosh|mac os x/i.test(ua)) platform = "macOS";
  else if (/linux/i.test(ua)) platform = "Linux";
  else if (/android/i.test(ua)) platform = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) platform = "iOS";

  // Detect browser
  if (/chrome/i.test(ua) && !/edge|edg/i.test(ua)) browser = "Chrome";
  else if (/firefox/i.test(ua)) browser = "Firefox";
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = "Safari";
  else if (/edge|edg/i.test(ua)) browser = "Edge";
  else if (/opera|opr/i.test(ua)) browser = "Opera";

  // Generate device name
  const deviceName = `${platform} ${browser}`;

  return { deviceType, platform, browser, deviceName };
}

export function useDevices() {
  const { user, isAuthenticated } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all devices for the user
  const fetchDevices = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("user_devices")
      .select("*")
      .eq("user_id", user.id)
      .order("last_active", { ascending: false });

    if (!error && data) {
      setDevices(data);
    }
    setIsLoading(false);
  }, [user]);

  // Register or update current device
  const registerCurrentDevice = useCallback(async () => {
    if (!user) return;

    const { deviceType, platform, browser, deviceName } = detectDeviceInfo();
    const storedDeviceId = localStorage.getItem("dasom_device_id");

    if (storedDeviceId) {
      // Update existing device
      const { error } = await supabase
        .from("user_devices")
        .update({
          last_active: new Date().toISOString(),
          is_current: true,
        })
        .eq("id", storedDeviceId)
        .eq("user_id", user.id);

      if (!error) {
        setCurrentDeviceId(storedDeviceId);
        // Mark other devices as not current
        await supabase
          .from("user_devices")
          .update({ is_current: false })
          .eq("user_id", user.id)
          .neq("id", storedDeviceId);
      }
    } else {
      // Register new device
      const { data, error } = await supabase
        .from("user_devices")
        .insert({
          user_id: user.id,
          device_name: deviceName,
          device_type: deviceType,
          platform,
          browser,
          is_current: true,
        })
        .select()
        .single();

      if (!error && data) {
        localStorage.setItem("dasom_device_id", data.id);
        setCurrentDeviceId(data.id);
        // Mark other devices as not current
        await supabase
          .from("user_devices")
          .update({ is_current: false })
          .eq("user_id", user.id)
          .neq("id", data.id);
      }
    }

    fetchDevices();
  }, [user, fetchDevices]);

  // Remove a device
  const removeDevice = useCallback(async (deviceId: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("user_devices")
      .delete()
      .eq("id", deviceId)
      .eq("user_id", user.id);

    if (!error) {
      if (deviceId === currentDeviceId) {
        localStorage.removeItem("dasom_device_id");
        setCurrentDeviceId(null);
      }
      fetchDevices();
    }

    return { error };
  }, [user, currentDeviceId, fetchDevices]);

  // Set up realtime subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("user_devices_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_devices",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchDevices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchDevices]);

  // Initial registration and fetch
  useEffect(() => {
    if (isAuthenticated && user) {
      registerCurrentDevice();
    } else {
      setDevices([]);
      setIsLoading(false);
    }
  }, [isAuthenticated, user, registerCurrentDevice]);

  return {
    devices,
    currentDeviceId,
    isLoading,
    removeDevice,
    refreshDevices: fetchDevices,
  };
}
