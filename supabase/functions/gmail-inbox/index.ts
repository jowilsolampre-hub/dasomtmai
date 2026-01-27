import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  payload?: {
    headers: Array<{ name: string; value: string }>;
  };
  internalDate: string;
}

interface EmailPreview {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string;
  isUnread: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { accessToken, maxResults = 10 } = await req.json();

    if (!accessToken) {
      return new Response(
        JSON.stringify({ error: "Google access token is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch messages list
    const listResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}&labelIds=INBOX`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      console.error("Gmail API error:", listResponse.status, errorText);
      
      if (listResponse.status === 401) {
        return new Response(
          JSON.stringify({ error: "Google token expired. Please re-authenticate." }),
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "Failed to fetch emails" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const listData = await listResponse.json();
    const messageIds = listData.messages || [];

    // Fetch each message's details in parallel
    const emailPromises = messageIds.slice(0, maxResults).map(async (msg: { id: string }) => {
      const messageResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=From&metadataHeaders=Subject`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!messageResponse.ok) {
        return null;
      }

      const messageData: GmailMessage = await messageResponse.json();
      
      const getHeader = (name: string) => 
        messageData.payload?.headers?.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || "";

      const email: EmailPreview = {
        id: messageData.id,
        from: getHeader("From"),
        subject: getHeader("Subject") || "(No Subject)",
        snippet: messageData.snippet,
        date: new Date(parseInt(messageData.internalDate)).toISOString(),
        isUnread: true, // Could check labelIds for UNREAD
      };

      return email;
    });

    const emails = (await Promise.all(emailPromises)).filter(Boolean);

    return new Response(
      JSON.stringify({ emails, count: emails.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Gmail inbox error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
