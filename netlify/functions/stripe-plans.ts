import { Handler } from '@netlify/functions';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

const handler: Handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
    // Fetch all active subscription products
    const products = await stripe.products.list({
      active: true,
      expand: ['data.default_price'],
    });

    // Format the products for the frontend
    const plans = products
      .data
      .filter(product => product.metadata.type === 'subscription')
      .map(product => {
        const price = product.default_price as Stripe.Price;
        return {
          id: price.id,
          name: product.name,
          description: product.description,
          price: price.unit_amount ? price.unit_amount / 100 : 0,
          interval: price.recurring?.interval,
          features: product.features?.map(feature => feature.name) || 
                   product.metadata.features?.split(',') || [],
        };
      });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ plans }),
    };
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch subscription plans' }),
    };
  }
};

export { handler };
