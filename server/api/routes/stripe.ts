import express from 'express';
import {
  createCheckoutSession,
  createCustomerPortalSession,
  handleWebhook,
  getSubscriptionPrices,
  getCustomerSubscription,
  createCustomer
} from '../stripe';

const router = express.Router();

// Create a checkout session
router.post('/create-checkout-session', createCheckoutSession);

// Create a customer portal session
router.post('/create-customer-portal-session', createCustomerPortalSession);

// Handle Stripe webhook events
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Get subscription prices
router.get('/prices', getSubscriptionPrices);

// Get customer subscription
router.get('/customer-subscription/:customerId', getCustomerSubscription);

// Create a customer
router.post('/create-customer', createCustomer);

export default router;
