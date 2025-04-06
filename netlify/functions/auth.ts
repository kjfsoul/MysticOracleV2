// Import types for Netlify functions
type NetlifyEvent = {
  httpMethod: string;
  path: string;
  headers: Record<string, string>;
  body?: string;
};

type NetlifyContext = {
  clientContext: any;
};

type Handler = (
  event: NetlifyEvent,
  context: NetlifyContext
) => Promise<{
  statusCode: number;
  headers: Record<string, string>;
  body: string;
}>;

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export const handler: Handler = async (event) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  try {
    const path = event.path.replace("/.netlify/functions/auth/", "");
    // Parse body if needed for other endpoints
    // const body = JSON.parse(event.body || "{}");

    switch (path) {
      case "me":
        // Get current user
        // Extract the auth token from the Authorization header
        const authHeader =
          event.headers.authorization || event.headers.Authorization;
        if (!authHeader) {
          return {
            statusCode: 401,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Unauthorized - No auth header" }),
          };
        }

        // The header format should be "Bearer <token>"
        const token = authHeader.replace("Bearer ", "");

        try {
          // Get user from the token
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser(token);

          if (error || !user) {
            return {
              statusCode: 401,
              headers: corsHeaders,
              body: JSON.stringify({ error: "Unauthorized - Invalid token" }),
            };
          }

          return {
            statusCode: 200,
            headers: corsHeaders,
            body: JSON.stringify(user),
          };
        } catch (authError) {
          console.error("Auth error:", authError);
          return {
            statusCode: 401,
            headers: corsHeaders,
            body: JSON.stringify({ error: "Unauthorized - Auth error" }),
          };
        }

      default:
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ error: "Not found" }),
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
};
