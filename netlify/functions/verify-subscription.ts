import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Initialize Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const handler: Handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle OPTIONS request (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const { sessionId, userId } = JSON.parse(event.body || '{}');

    if (!sessionId || !userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters: sessionId or userId' }),
      };
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });

    if (!session || session.metadata?.userId !== userId) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ error: 'Invalid session or user mismatch' }),
      };
    }

    const subscription = session.subscription as Stripe.Subscription;
    
    if (!subscription) {
      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: 'Subscription not found' }),
      };
    }

    // Get the subscription details
    const expandedSubscription = await stripe.subscriptions.retrieve(subscription.id, {
      expand: ['items.data.price.product'],
    });

    // Get the product details
    const product = expandedSubscription.items.data[0].price.product as Stripe.Product;

    // Update user subscription in Supabase
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        subscription_id: subscription.id,
        subscription_status: subscription.status,
        is_subscribed: subscription.status === 'active',
        subscription_tier: product.name,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating user subscription:', updateError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to update user subscription' }),
      };
    }

    // Format subscription for response
    const formattedSubscription = {
      id: subscription.id,
      status: subscription.status,
      plan: product.name,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString().split('T')[0],
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ subscription: formattedSubscription }),
    };
  } catch (error) {
    console.error('Error verifying subscription:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to verify subscription' }),
    };
  }
};

export { handler };
