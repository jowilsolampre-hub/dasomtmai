import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
    timeZone?: string;
  };
  status: string;
  htmlLink: string;
}

interface EventPreview {
  id: string;
  title: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  link: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accessToken, maxResults = 10, timeMin, timeMax } = await req.json();

    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: "Google access token is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Default to today and next 7 days
    const now = new Date();
    const defaultTimeMin = timeMin || now.toISOString();
    const defaultTimeMax = timeMax || new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const params = new URLSearchParams({
      maxResults: maxResults.toString(),
      timeMin: defaultTimeMin,
      timeMax: defaultTimeMax,
      singleEvents: "true",
      orderBy: "startTime",
    });

    const response = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?${params}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Calendar API error:", response.status, errorText);
      
      if (response.status === 401) {
        return new Response(
          JSON.stringify({ error: "Google token expired. Please re-authenticate." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to fetch calendar events" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const events: EventPreview[] = (data.items || []).map((event: CalendarEvent) => ({
      id: event.id,
      title: event.summary || "(No Title)",
      description: event.description,
      location: event.location,
      startTime: event.start.dateTime || event.start.date || "",
      endTime: event.end.dateTime || event.end.date || "",
      isAllDay: !event.start.dateTime,
      link: event.htmlLink,
    }));

    return new Response(
      JSON.stringify({ events, count: events.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Calendar error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
