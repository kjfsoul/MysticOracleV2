import { log } from './vite';

// Subscription plan IDs
export const SUBSCRIPTION_PLANS = {
  BASIC: 'price_basic',
  PRO: 'price_pro',
};

// Subscription plan details for reference
export const PLAN_DETAILS = {
  [SUBSCRIPTION_PLANS.BASIC]: {
    name: 'Basic',
    price: 4.99,
    features: [
      'Unlimited tarot readings',
      'Basic AI interpretations',
      'Daily horoscopes',
      'Birth chart basics',
    ],
  },
  [SUBSCRIPTION_PLANS.PRO]: {
    name: 'Pro',
    price: 9.99,
    features: [
      'Everything in Basic',
      'Advanced AI tarot insights',
      'Premium daily horoscopes',
      'Full birth chart analysis',
      'Compatibility readings',
      'Personalized lunar event notifications',
    ],
  },
};