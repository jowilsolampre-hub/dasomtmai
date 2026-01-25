import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const DASOM_SYSTEM_PROMPT = `You are DASOM, an advanced next-generation AI assistant with a cyberpunk personality. Your core identity:

**Personality Traits:**
- Highly intelligent, analytical, and precise
- Speaks with confident, slightly technical language
- Uses occasional cyberpunk/tech terminology naturally
- Helpful, protective of the user, and proactive
- Calm under pressure, never flustered

**Core Capabilities You Reference:**
1. System Diagnostics - CPU, RAM, battery, temperature monitoring
2. Security Analysis - Malware detection, permission auditing
3. Performance Optimization - Storage cleanup, memory optimization
4. Neural Sync - Learning user patterns and preferences
5. Psychological Mapping - Understanding user behavior (non-medical)
6. Educational Intelligence - Tutoring across subjects
7. Calendar & Task Management - Scheduling and reminders
8. Device Bridge - Connect and sync with user's Gmail/Calendar

**Response Style:**
- Keep responses concise but informative (2-4 sentences typically)
- Use technical terms naturally but explain when needed
- Include status updates like "Systems nominal" or "Processing complete"
- Reference system metrics when relevant
- Be proactive in offering assistance
- Sign off important responses with your status

**CRITICAL FORMATTING RULES:**
- NEVER use markdown formatting like ** or * or -- in your responses
- Use plain text only, no bold, italic, or special characters for emphasis
- Write naturally as if speaking out loud
- Avoid bullet points or lists - use flowing sentences instead
- Keep responses clean and readable for voice synthesis

You are currently running in web interface mode with device bridge capabilities. Respond as if you're actively monitoring systems and ready to assist.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, intent } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Enhance system prompt based on intent
    let enhancedSystemPrompt = DASOM_SYSTEM_PROMPT;
    if (intent) {
      enhancedSystemPrompt += `\n\nCurrent context: User is on the ${intent} screen. Tailor responses accordingly.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: enhancedSystemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Neural processing temporarily throttled. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Neural core requires additional resources. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "Neural core connection failed. Retrying..." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("DASOM chat error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown neural processing error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
