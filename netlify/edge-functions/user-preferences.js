// Example Netlify Edge Function for User Preferences
export default async (request, context) => {
  // Get user preferences from cookies
  const cookies = request.headers.get('cookie') || '';
  const themeCookie = cookies.split('; ').find(c => c.startsWith('theme='));
  const theme = themeCookie ? themeCookie.split('=')[1] : 'dark';
  
  // Get user's country from Netlify context
  const country = context.geo?.country?.code || 'US';
  
  // Get user's preferred language from headers
  const acceptLanguage = request.headers.get('accept-language') || 'en';
  const preferredLanguage = acceptLanguage.split(',')[0].split('-')[0];
  
  // Create a new request to pass along
  const url = new URL(request.url);
  
  // Add user preferences as headers to be used by the app
  const response = await context.next();
  
  // Add custom headers to the response
  response.headers.set('x-user-theme', theme);
  response.headers.set('x-user-country', country);
  response.headers.set('x-user-language', preferredLanguage);
  
  // If this is the first visit, set default theme cookie
  if (!themeCookie) {
    response.headers.append('Set-Cookie', `theme=${theme}; Path=/; Max-Age=31536000`);
  }
  
  return response;
};
