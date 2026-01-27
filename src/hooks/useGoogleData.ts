import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

export interface EmailPreview {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
  isUnread: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  link: string;
}

export function useGoogleData() {
  const { session, isAuthenticated } = useAuth();
  const [emails, setEmails] = useState<EmailPreview[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [calendarError, setCalendarError] = useState<string | null>(null);

  const getAccessToken = useCallback(() => {
    return session?.provider_token || null;
  }, [session]);

  const fetchEmails = useCallback(async (maxResults = 10) => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      setEmailError("No Google access token. Please sign in with Google.");
      return;
    }

    setIsLoadingEmails(true);
    setEmailError(null);

    try {
      const { data, error } = await supabase.functions.invoke("gmail-inbox", {
        body: { accessToken, maxResults },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setEmails(data.emails || []);
    } catch (err) {
      console.error("Failed to fetch emails:", err);
      setEmailError(err instanceof Error ? err.message : "Failed to fetch emails");
      setEmails([]);
    } finally {
      setIsLoadingEmails(false);
    }
  }, [getAccessToken]);

  const fetchCalendarEvents = useCallback(async (maxResults = 10) => {
    const accessToken = getAccessToken();
    if (!accessToken) {
      setCalendarError("No Google access token. Please sign in with Google.");
      return;
    }

    setIsLoadingEvents(true);
    setCalendarError(null);

    try {
      const { data, error } = await supabase.functions.invoke("google-calendar", {
        body: { accessToken, maxResults },
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setEvents(data.events || []);
    } catch (err) {
      console.error("Failed to fetch calendar events:", err);
      setCalendarError(err instanceof Error ? err.message : "Failed to fetch events");
      setEvents([]);
    } finally {
      setIsLoadingEvents(false);
    }
  }, [getAccessToken]);

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchEmails(), fetchCalendarEvents()]);
  }, [fetchEmails, fetchCalendarEvents]);

  // Auto-fetch on auth
  useEffect(() => {
    if (isAuthenticated && session?.provider_token) {
      refreshAll();
    }
  }, [isAuthenticated, session?.provider_token]);

  return {
    emails,
    events,
    isLoadingEmails,
    isLoadingEvents,
    emailError,
    calendarError,
    fetchEmails,
    fetchCalendarEvents,
    refreshAll,
    hasGoogleToken: !!session?.provider_token,
  };
}
