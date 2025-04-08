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
  try {
    // Verify the webhook signature
    const stripeSignature = event.headers['stripe-signature'];
    
    if (!stripeSignature) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing Stripe signature' }),
      };
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('Stripe webhook secret is not set');
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Webhook secret not configured' }),
      };
    }

    // Verify and construct the event
    let stripeEvent;
    try {
      stripeEvent = stripe.webhooks.constructEvent(
        event.body || '',
        stripeSignature,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid signature' }),
      };
    }

    // Handle the event
    switch (stripeEvent.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(stripeEvent.data.object as Stripe.Subscription);
        break;
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(stripeEvent.data.object as Stripe.Subscription);
        break;
      
      case 'invoice.payment_succeeded':
        await handleSuccessfulPayment(stripeEvent.data.object as Stripe.Invoice);
        break;
      
      case 'invoice.payment_failed':
        await handleFailedPayment(stripeEvent.data.object as Stripe.Invoice);
        break;
      
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true }),
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to process webhook' }),
    };
  }
};

/**
 * Handle subscription creation or update
 */
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  try {
    // Get the customer
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    
    if (!customer || customer.deleted) {
      console.error('Customer not found or deleted');
      return;
    }

    // Get the user ID from customer metadata
    const userId = customer.metadata.userId;
    
    if (!userId) {
      console.error('User ID not found in customer metadata');
      return;
    }

    // Get the product details
    const expandedSubscription = await stripe.subscriptions.retrieve(subscription.id, {
      expand: ['items.data.price.product'],
    });
    
    const product = expandedSubscription.items.data[0].price.product as Stripe.Product;

    // Update user subscription in Supabase
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_id: subscription.id,
        subscription_status: subscription.status,
        is_subscribed: subscription.status === 'active',
        subscription_tier: product.name,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user subscription:', error);
    }
  } catch (error) {
    console.error('Error handling subscription change:', error);
  }
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  try {
    // Get the customer
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    
    if (!customer || customer.deleted) {
      console.error('Customer not found or deleted');
      return;
    }

    // Get the user ID from customer metadata
    const userId = customer.metadata.userId;
    
    if (!userId) {
      console.error('User ID not found in customer metadata');
      return;
    }

    // Update user subscription in Supabase
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'canceled',
        is_subscribed: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user subscription:', error);
    }
  } catch (error) {
    console.error('Error handling subscription cancellation:', error);
  }
}

/**
 * Handle successful payment
 */
async function handleSuccessfulPayment(invoice: Stripe.Invoice) {
  try {
    // Only process subscription invoices
    if (!invoice.subscription) {
      return;
    }

    // Get the subscription
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    
    // Get the customer
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    
    if (!customer || customer.deleted) {
      console.error('Customer not found or deleted');
      return;
    }

    // Get the user ID from customer metadata
    const userId = customer.metadata.userId;
    
    if (!userId) {
      console.error('User ID not found in customer metadata');
      return;
    }

    // Update user subscription in Supabase
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: subscription.status,
        is_subscribed: subscription.status === 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user subscription:', error);
    }
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

/**
 * Handle failed payment
 */
async function handleFailedPayment(invoice: Stripe.Invoice) {
  try {
    // Only process subscription invoices
    if (!invoice.subscription) {
      return;
    }

    // Get the subscription
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    
    // Get the customer
    const customer = await stripe.customers.retrieve(subscription.customer as string);
    
    if (!customer || customer.deleted) {
      console.error('Customer not found or deleted');
      return;
    }

    // Get the user ID from customer metadata
    const userId = customer.metadata.userId;
    
    if (!userId) {
      console.error('User ID not found in customer metadata');
      return;
    }

    // Update user subscription in Supabase
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: subscription.status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user subscription:', error);
    }
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}

export { handler };
