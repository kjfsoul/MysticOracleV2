import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    // Verify the event came from Stripe
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` })
    };
  }

  // Handle the event
  console.log(`Received event: ${stripeEvent.type}`);

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        const session = stripeEvent.data.object;
        await handleCheckoutSessionCompleted(session);
        break;
        
      case 'customer.subscription.created':
        const subscriptionCreated = stripeEvent.data.object;
        await handleSubscriptionCreated(subscriptionCreated);
        break;
        
      case 'customer.subscription.updated':
        const subscriptionUpdated = stripeEvent.data.object;
        await handleSubscriptionUpdated(subscriptionUpdated);
        break;
        
      case 'customer.subscription.deleted':
        const subscriptionDeleted = stripeEvent.data.object;
        await handleSubscriptionDeleted(subscriptionDeleted);
        break;
        
      case 'invoice.paid':
        const invoicePaid = stripeEvent.data.object;
        await handleInvoicePaid(invoicePaid);
        break;
        
      case 'invoice.payment_failed':
        const invoiceFailed = stripeEvent.data.object;
        await handleInvoicePaymentFailed(invoiceFailed);
        break;
        
      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook processing failed' })
    };
  }
};

// Handler functions for different event types

async function handleCheckoutSessionCompleted(session) {
  console.log(`Processing completed checkout: ${session.id}`);
  
  try {
    // Get customer details
    const customer = await stripe.customers.retrieve(session.customer);
    
    // Update user profile in Supabase
    const { error } = await supabase
      .from('profiles')
      .update({ 
        subscription_status: 'active',
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription
      })
      .eq('id', session.client_reference_id);
    
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    
    console.log(`Updated subscription for user: ${session.client_reference_id}`);
  } catch (error) {
    console.error(`Error in handleCheckoutSessionCompleted: ${error.message}`);
    throw error;
  }
}

async function handleSubscriptionCreated(subscription) {
  console.log(`New subscription created: ${subscription.id}`);
  
  try {
    // Find the user with this customer ID
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('stripe_customer_id', subscription.customer)
      .limit(1);
    
    if (fetchError) {
      console.error('Error fetching profile:', fetchError);
      throw fetchError;
    }
    
    if (profiles && profiles.length > 0) {
      const userId = profiles[0].id;
      
      // Update subscription details
      const { error } = await supabase
        .from('profiles')
        .update({
          subscription_status: subscription.status,
          stripe_subscription_id: subscription.id,
          subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          subscription_plan: subscription.items.data[0]?.price?.product || null
        })
        .eq('id', userId);
      
      if (error) {
        console.error('Error updating subscription:', error);
        throw error;
      }
      
      console.log(`Updated subscription for user: ${userId}`);
    } else {
      console.log(`No user found with customer ID: ${subscription.customer}`);
    }
  } catch (error) {
    console.error(`Error in handleSubscriptionCreated: ${error.message}`);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription) {
  console.log(`Subscription updated: ${subscription.id}`);
  
  try {
    // Update subscription in database
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: subscription.status,
        subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        subscription_plan: subscription.items.data[0]?.price?.product || null
      })
      .eq('stripe_subscription_id', subscription.id);
    
    if (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  } catch (error) {
    console.error(`Error in handleSubscriptionUpdated: ${error.message}`);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription) {
  console.log(`Subscription canceled: ${subscription.id}`);
  
  try {
    // Update subscription status in database
    const { error } = await supabase
      .from('profiles')
      .update({
        subscription_status: 'canceled'
      })
      .eq('stripe_subscription_id', subscription.id);
    
    if (error) {
      console.error('Error updating subscription status:', error);
      throw error;
    }
  } catch (error) {
    console.error(`Error in handleSubscriptionDeleted: ${error.message}`);
    throw error;
  }
}

async function handleInvoicePaid(invoice) {
  console.log(`Invoice paid: ${invoice.id}`);
  
  try {
    // Record payment in database
    const { error } = await supabase
      .from('payments')
      .insert({
        user_id: null, // Will be updated after finding the user
        stripe_customer_id: invoice.customer,
        stripe_invoice_id: invoice.id,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        status: 'paid',
        payment_date: new Date(invoice.created * 1000).toISOString()
      });
    
    if (error) {
      console.error('Error recording payment:', error);
      throw error;
    }
    
    // Find the user with this customer ID
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', invoice.customer)
      .limit(1);
    
    if (fetchError) {
      console.error('Error fetching profile:', fetchError);
      throw fetchError;
    }
    
    if (profiles && profiles.length > 0) {
      const userId = profiles[0].id;
      
      // Update the payment record with the user ID
      const { error: updateError } = await supabase
        .from('payments')
        .update({ user_id: userId })
        .eq('stripe_invoice_id', invoice.id);
      
      if (updateError) {
        console.error('Error updating payment with user ID:', updateError);
        throw updateError;
      }
    }
  } catch (error) {
    console.error(`Error in handleInvoicePaid: ${error.message}`);
    throw error;
  }
}

async function handleInvoicePaymentFailed(invoice) {
  console.log(`Invoice payment failed: ${invoice.id}`);
  
  try {
    // Record failed payment
    const { error } = await supabase
      .from('payments')
      .insert({
        user_id: null, // Will be updated after finding the user
        stripe_customer_id: invoice.customer,
        stripe_invoice_id: invoice.id,
        amount: invoice.amount_due,
        currency: invoice.currency,
        status: 'failed',
        payment_date: new Date(invoice.created * 1000).toISOString()
      });
    
    if (error) {
      console.error('Error recording failed payment:', error);
      throw error;
    }
    
    // Find the user with this customer ID
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('stripe_customer_id', invoice.customer)
      .limit(1);
    
    if (fetchError) {
      console.error('Error fetching profile:', fetchError);
      throw fetchError;
    }
    
    if (profiles && profiles.length > 0) {
      const userId = profiles[0].id;
      
      // Update the payment record with the user ID
      const { error: updateError } = await supabase
        .from('payments')
        .update({ user_id: userId })
        .eq('stripe_invoice_id', invoice.id);
      
      if (updateError) {
        console.error('Error updating payment with user ID:', updateError);
        throw updateError;
      }
      
      // TODO: Send email notification about failed payment
      // This would typically be handled by a separate email service
      console.log(`Payment failed for user: ${userId}, email: ${profiles[0].email}`);
    }
  } catch (error) {
    console.error(`Error in handleInvoicePaymentFailed: ${error.message}`);
    throw error;
  }
}
