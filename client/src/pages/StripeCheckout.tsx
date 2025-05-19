import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

interface SubscriptionPlan {
  id: string;
  product: {
    id: string;
    name: string;
    description: string;
  };
  unit_amount: number;
  currency: string;
  recurring: {
    interval: string;
    interval_count: number;
  };
}

interface StripeCheckoutProps {
  userId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  userId,
  onSuccess,
  onCancel,
}) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscription plans on component mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/stripe/prices');
        setPlans(response.data.prices);
        setLoading(false);
      } catch (err) {
        setError('Failed to load subscription plans');
        setLoading(false);
        console.error('Error fetching subscription plans:', err);
      }
    };

    fetchPlans();
  }, []);

  // Handle subscription checkout
  const handleSubscribe = async () => {
    if (!selectedPlan) {
      setError('Please select a subscription plan');
      return;
    }

    try {
      setLoading(true);
      
      // Create a checkout session
      const response = await axios.post('/api/stripe/create-checkout-session', {
        priceId: selectedPlan,
        successUrl: `${window.location.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/subscription/cancel`,
      });

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.data.sessionId,
        });

        if (error) {
          setError(error.message || 'An error occurred');
          setLoading(false);
        }
      }
    } catch (err) {
      setError('Failed to initiate checkout');
      setLoading(false);
      console.error('Error creating checkout session:', err);
    }
  };

  // Format currency
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);
  };

  if (loading && plans.length === 0) {
    return <div className="text-center p-4">Loading subscription plans...</div>;
  }

  if (error && plans.length === 0) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Subscription Plan</h2>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`border rounded-lg p-6 transition-all ${
              selectedPlan === plan.id
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-purple-300'
            }`}
            onClick={() => setSelectedPlan(plan.id)}
          >
            <h3 className="text-xl font-semibold mb-2">{plan.product.name}</h3>
            <p className="text-gray-600 mb-4">{plan.product.description}</p>
            <div className="text-2xl font-bold mb-2">
              {formatCurrency(plan.unit_amount, plan.currency)}
              <span className="text-sm font-normal text-gray-500">
                /{plan.recurring.interval}
              </span>
            </div>
            <div className="mt-4">
              <input
                type="radio"
                id={plan.id}
                name="subscription-plan"
                checked={selectedPlan === plan.id}
                onChange={() => setSelectedPlan(plan.id)}
                className="mr-2"
              />
              <label htmlFor={plan.id}>Select</label>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
        <button
          onClick={handleSubscribe}
          disabled={!selectedPlan || loading}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Subscribe Now'}
        </button>
      </div>
    </div>
  );
};

export default StripeCheckout;
