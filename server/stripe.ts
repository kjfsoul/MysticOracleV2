import Stripe from 'stripe';
import { userDB } from './supabase-mock';
import { log } from './vite';

// Initialize Stripe with API key
const stripeKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16', // Use the latest stable API version
});

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

/**
 * Create a Stripe checkout session for subscription
 */
export async function createCheckoutSession(
  userId: number,
  email: string,
  planId: string
) {
  try {
    // Check if user exists
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (!user) {
      throw new Error('User not found');
    }

    // Set up success and cancel URLs
    const successUrl = `${process.env.APP_URL || 'http://localhost:5000'}/account/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.APP_URL || 'http://localhost:5000'}/pricing`;

    // Create the checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      client_reference_id: userId.toString(),
      payment_method_types: ['card'],
      line_items: [
        {
          price: planId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      subscription_data: {
        metadata: {
          userId: userId.toString(),
        },
      },
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return { sessionId: session.id, url: session.url };
  } catch (error) {
    log(`Error creating checkout session: ${error}`, 'stripe');
    throw error;
  }
}

/**
 * Handle successful subscription
 */
export async function handleSuccessfulSubscription(sessionId: string) {
  try {
    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });

    if (!session.client_reference_id) {
      throw new Error('No client reference ID found in session');
    }

    const userId = parseInt(session.client_reference_id);
    const subscription = session.subscription as Stripe.Subscription;
    const subscriptionId = subscription.id;
    const customerId = subscription.customer as string;
    const planId = (subscription.items.data[0].plan as Stripe.Plan).id;
    const status = subscription.status;
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();

    // Store subscription in database
    const { data, error } = await supabase
      .from('subscriptions')
      .insert([
        {
          user_id: userId,
          stripe_customer_id: customerId,
          stripe_subscription_id: subscriptionId,
          plan_id: planId,
          status: status,
          current_period_end: currentPeriodEnd,
        },
      ])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Update user's subscription level
    const planLevel = planId === SUBSCRIPTION_PLANS.PRO ? 'pro' : 'basic';
    await supabase
      .from('users')
      .update({ subscription_level: planLevel })
      .eq('id', userId);

    return data;
  } catch (error) {
    log(`Error handling successful subscription: ${error}`, 'stripe');
    throw error;
  }
}

/**
 * Cancel a subscription
 */
export async function cancelSubscription(subscriptionId: string) {
  try {
    // Cancel the subscription in Stripe
    const canceledSubscription = await stripe.subscriptions.cancel(subscriptionId);

    // Update the subscription in the database
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ status: canceledSubscription.status })
      .eq('stripe_subscription_id', subscriptionId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Get the user ID from the subscription
    const userId = data.user_id;

    // Update the user's subscription level back to free
    await supabase
      .from('users')
      .update({ subscription_level: 'free' })
      .eq('id', userId);

    return data;
  } catch (error) {
    log(`Error canceling subscription: ${error}`, 'stripe');
    throw error;
  }
}

/**
 * Check if a user has an active subscription
 */
export async function checkSubscriptionStatus(userId: number) {
  try {
    // Get the user's subscription from the database
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // If no subscription found, user is on free tier
    if (!data) {
      return { 
        isActive: false, 
        isPro: false, 
        plan: 'free' 
      };
    }

    // Check if subscription is active
    const isActive = data.status === 'active' || data.status === 'trialing';
    const isPro = isActive && data.plan_id === SUBSCRIPTION_PLANS.PRO;
    const plan = isActive 
      ? (isPro ? 'pro' : 'basic') 
      : 'free';

    return { isActive, isPro, plan };
  } catch (error) {
    log(`Error checking subscription status: ${error}`, 'stripe');
    throw error;
  }
}