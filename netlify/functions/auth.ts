import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export const handler: Handler = async (event, context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    const path = event.path.replace('/.netlify/functions/auth/', '');
    const body = JSON.parse(event.body || '{}');

    switch (path) {
      case 'me':
        // Get current user
        const { user } = await supabase.auth.api.getUserByCookie(event);
        if (!user) {
          return {
            statusCode: 401,
            headers: corsHeaders,
            body: JSON.stringify({ error: 'Unauthorized' }),
          };
        }
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify(user),
        };

      default:
        return {
          statusCode: 404,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Not found' }),
        };
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};