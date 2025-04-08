import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const handler: Handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  // Handle OPTIONS request (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Get the path parameter
  const path = event.path.replace(/\\/netlify\\/functions\\/stripe/, '').replace(/^\\/+/, '');

  try {
    // Handle different API endpoints
    switch (path) {
      case 'create-checkout-session':
        return await createCheckoutSession(event, headers);
      case 'create-customer-portal-session':
        return await createCustomerPortalSession(event, headers);
      case 'webhook':
        return await handleWebhook(event, headers);
      case 'prices':
        return await getSubscriptionPrices(event, headers);
      case 'customer-subscription':
        return await getCustomerSubscription(event, headers);
      case 'create-customer':
        return await createCustomer(event, headers);
      case 'verify-session':
        return await verifySession(event, headers);
      default:
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Not found' }),
        };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

/**
 * Create a Stripe checkout session
 */
async function createCheckoutSession(event: any, headers: any) {
  try {
    const { priceId, successUrl, cancelUrl } = JSON.parse(event.body);

    if (!priceId || !successUrl || !cancelUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required parameters: priceId, successUrl, or cancelUrl',
        }),
      };
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
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ sessionId: session.id }),
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create checkout session' }),
    };
  }
}

/**
 * Create a Stripe customer portal session
 */
async function createCustomerPortalSession(event: any, headers: any) {
  try {
    const { customerId, returnUrl } = JSON.parse(event.body);

    if (!customerId || !returnUrl) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Missing required parameters: customerId or returnUrl',
        }),
      };
    }

    // Create a customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    // Return the portal URL
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create customer portal session' }),
    };
  }
}

/**
 * Handle Stripe webhook events
 */
async function handleWebhook(event: any, headers: any) {
  const signature = event.headers['stripe-signature'];

  if (!signature) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing Stripe signature' }),
    };
  }

  try {
    // Verify the webhook signature
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );

    // Handle different event types
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        // Payment is successful and the subscription is created
        const checkoutSession = stripeEvent.data.object as Stripe.Checkout.Session;
        
        // Update user's subscription status in your database
        if (checkoutSession.customer && checkoutSession.subscription) {
          await updateUserSubscription(
            checkoutSession.customer.toString(),
            checkoutSession.subscription.toString(),
            true
          );
        }
        break;
        
      case 'customer.subscription.updated':
        // Subscription is updated
        const subscription = stripeEvent.data.object as Stripe.Subscription;
        
        // Update subscription details in your database
        if (subscription.customer) {
          await updateUserSubscription(
            subscription.customer.toString(),
            subscription.id,
            subscription.status === 'active'
          );
        }
        break;
        
      case 'customer.subscription.deleted':
        // Subscription is canceled or expired
        const canceledSubscription = stripeEvent.data.object as Stripe.Subscription;
        
        // Update subscription status in your database
        if (canceledSubscription.customer) {
          await updateUserSubscription(
            canceledSubscription.customer.toString(),
            canceledSubscription.id,
            false
          );
        }
        break;
        
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Error handling webhook:', error);
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Webhook signature verification failed' }),
    };
  }
}

/**
 * Update user subscription in Supabase
 */
async function updateUserSubscription(
  stripeCustomerId: string,
  subscriptionId: string,
  isActive: boolean
) {
  try {
    // Find the user with the given Stripe customer ID
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('stripe_customer_id', stripeCustomerId)
      .limit(1);

    if (userError || !users || users.length === 0) {
      console.error('Error finding user:', userError);
      return;
    }

    const userId = users[0].id;

    // Update the user's subscription status
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        is_subscribed: isActive,
        subscription_id: subscriptionId,
        subscription_status: isActive ? 'active' : 'inactive',
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating user subscription:', updateError);
    }
  } catch (error) {
    console.error('Error updating user subscription:', error);
  }
}

/**
 * Get subscription prices
 */
async function getSubscriptionPrices(event: any, headers: any) {
  try {
    // Retrieve all active subscription prices
    const prices = await stripe.prices.list({
      active: true,
      type: 'recurring',
      expand: ['data.product'],
    });

    // Return the prices
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ prices: prices.data }),
    };
  } catch (error) {
    console.error('Error retrieving subscription prices:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to retrieve subscription prices' }),
    };
  }
}

/**
 * Get customer subscription
 */
async function getCustomerSubscription(event: any, headers: any) {
  try {
    const customerId = event.queryStringParameters?.customerId;

    if (!customerId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing customer ID' }),
      };
    }

    // Retrieve customer's subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      expand: ['data.default_payment_method'],
    });

    // Return the subscriptions
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ subscriptions: subscriptions.data }),
    };
  } catch (error) {
    console.error('Error retrieving customer subscription:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to retrieve customer subscription' }),
    };
  }
}

/**
 * Create a Stripe customer
 */
async function createCustomer(event: any, headers: any) {
  try {
    const { email, name, userId } = JSON.parse(event.body);

    if (!email || !userId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required parameters: email or userId' }),
      };
    }

    // Create a customer
    const customer = await stripe.customers.create({
      email,
      name: name || undefined,
    });

    // Update the user's Stripe customer ID in Supabase
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        stripe_customer_id: customer.id,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating user with Stripe customer ID:', updateError);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Failed to update user with Stripe customer ID' }),
      };
    }

    // Return the customer
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ customer }),
    };
  } catch (error) {
    console.error('Error creating customer:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to create customer' }),
    };
  }
}

/**
 * Verify a checkout session
 */
async function verifySession(event: any, headers: any) {
  try {
    const { sessionId } = JSON.parse(event.body);

    if (!sessionId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing session ID' }),
      };
    }

    // Retrieve the session
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Check if the session was successful
    if (session.payment_status !== 'paid') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Payment not completed' }),
      };
    }

    // Return success
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, session }),
    };
  } catch (error) {
    console.error('Error verifying session:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to verify session' }),
    };
  }
}

export { handler };
