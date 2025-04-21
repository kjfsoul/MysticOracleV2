import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import posthog from 'posthog-js';
import './index.css';

// Initialize PostHog simply
posthog.init('phc_EvL5mq2oWgqS7cPhtb5RupbfQbNQkUwYyF05pv9Itym', {
  api_host: 'https://us.i.posthog.com',
  person_profiles: 'identified_only',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
