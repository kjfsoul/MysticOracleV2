import { Request, Response } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

/**
 * Create a Stripe checkout session
 * 
 * @param req Express request object
 * @param res Express response object
 */
export async function createCheckoutSession(req: Request, res: Response) {
  try {
    const { priceId, successUrl, cancelUrl } = req.body;

    if (!priceId || !successUrl || !cancelUrl) {
      return res.status(400).json({
        error: 'Missing required parameters: priceId, successUrl, or cancelUrl',
      });
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    // Return the session ID
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
}

/**
 * Create a Stripe customer portal session
 * 
 * @param req Express request object
 * @param res Express response object
 */
export async function createCustomerPortalSession(req: Request, res: Response) {
  try {
    const { customerId, returnUrl } = req.body;

    if (!customerId || !returnUrl) {
      return res.status(400).json({
        error: 'Missing required parameters: customerId or returnUrl',
      });
    }

    // Create a customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    // Return the portal URL
    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    res.status(500).json({ error: 'Failed to create customer portal session' });
  }
}

/**
 * Handle Stripe webhook events
 * 
 * @param req Express request object
 * @param res Express response object
 */
export async function handleWebhook(req: Request, res: Response) {
  const signature = req.headers['stripe-signature'] as string;

  if (!signature) {
    return res.status(400).json({ error: 'Missing Stripe signature' });
  }

  try {
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        // Payment is successful and the subscription is created
        const checkoutSession = event.data.object as Stripe.Checkout.Session;
        
        // Update user's subscription status in your database
        // This is where you would update the user's subscription status
        console.log('Checkout session completed:', checkoutSession);
        break;
        
      case 'customer.subscription.updated':
        // Subscription is updated
        const subscription = event.data.object as Stripe.Subscription;
        
        // Update subscription details in your database
        console.log('Subscription updated:', subscription);
        break;
        
      case 'customer.subscription.deleted':
        // Subscription is canceled or expired
        const canceledSubscription = event.data.object as Stripe.Subscription;
        
        // Update subscription status in your database
        console.log('Subscription canceled:', canceledSubscription);
        break;
        
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(400).json({ error: 'Webhook signature verification failed' });
  }
}

/**
 * Get subscription prices
 * 
 * @param req Express request object
 * @param res Express response object
 */
export async function getSubscriptionPrices(req: Request, res: Response) {
  try {
    // Retrieve all active subscription prices
    const prices = await stripe.prices.list({
      active: true,
      type: 'recurring',
      expand: ['data.product'],
    });

    // Return the prices
    res.status(200).json({ prices: prices.data });
  } catch (error) {
    console.error('Error retrieving subscription prices:', error);
    res.status(500).json({ error: 'Failed to retrieve subscription prices' });
  }
}

/**
 * Get customer subscription
 * 
 * @param req Express request object
 * @param res Express response object
 */
export async function getCustomerSubscription(req: Request, res: Response) {
  try {
    const { customerId } = req.params;

    if (!customerId) {
      return res.status(400).json({ error: 'Missing customer ID' });
    }

    // Retrieve customer's subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      expand: ['data.default_payment_method'],
    });

    // Return the subscriptions
    res.status(200).json({ subscriptions: subscriptions.data });
  } catch (error) {
    console.error('Error retrieving customer subscription:', error);
    res.status(500).json({ error: 'Failed to retrieve customer subscription' });
  }
}

/**
 * Create a Stripe customer
 * 
 * @param req Express request object
 * @param res Express response object
 */
export async function createCustomer(req: Request, res: Response) {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing required parameter: email' });
    }

    // Create a customer
    const customer = await stripe.customers.create({
      email,
      name: name || undefined,
    });

    // Return the customer
    res.status(200).json({ customer });
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'Failed to create customer' });
  }
}
