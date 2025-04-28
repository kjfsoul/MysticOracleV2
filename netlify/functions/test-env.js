// netlify/functions/test-env.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: "Environment variables check",
      supabaseUrlExists: !!process.env.SUPABASE_URL,
      supabaseKeyExists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      envKeys: Object.keys(process.env).filter(k => !k.includes("KEY")).join(", ")
    })
  };
};
