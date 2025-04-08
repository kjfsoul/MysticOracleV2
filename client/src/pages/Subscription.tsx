import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../hooks/use-auth';

const Subscription: React.FC = () => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      setLocation('/auth?redirect=/subscription');
      return;
    }

    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await fetch('/.netlify/functions/stripe-plans');
        
        if (!response.ok) {
          throw new Error('Failed to fetch subscription plans');
        }
        
        const data = await response.json();
        setPlans(data.plans);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to load subscription plans. Please try again later.');
        setLoading(false);
      }
    };

    fetchPlans();
  }, [user, setLocation]);

  const handleSubscribe = async (priceId: string) => {
    try {
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (err) {
      console.error('Error creating checkout session:', err);
      setError('Failed to initiate checkout. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Placeholder plans if API fails
  const displayPlans = plans.length > 0 ? plans : [
    {
      id: 'price_monthly',
      name: 'Monthly',
      description: 'Full access to all features',
      price: 9.99,
      interval: 'month',
      features: [
        'Daily personalized tarot readings',
        'Advanced astrological insights',
        'Journal with AI analysis',
        'Custom tarot spreads',
        'Priority customer support'
      ]
    },
    {
      id: 'price_yearly',
      name: 'Yearly',
      description: 'Save 20% with annual billing',
      price: 95.88,
      interval: 'year',
      features: [
        'All monthly features',
        '20% discount',
        'Exclusive seasonal rituals',
        'Early access to new features',
        'Free custom tarot deck design'
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Upgrade Your Spiritual Journey</h1>
      <p className="text-center text-gray-400 mb-12">Choose the plan that best fits your path</p>
      
      <div className="grid md:grid-cols-2 gap-8">
        {displayPlans.map((plan) => (
          <div 
            key={plan.id} 
            className="border border-purple-500 rounded-xl overflow-hidden bg-gradient-to-b from-purple-900/30 to-indigo-900/30 backdrop-blur-sm"
          >
            <div className="p-6 border-b border-purple-500/30">
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <p className="text-gray-300 mb-4">{plan.description}</p>
              <div className="flex items-end">
                <span className="text-4xl font-bold">${typeof plan.price === 'number' ? plan.price.toFixed(2) : plan.price}</span>
                <span className="text-gray-400 ml-2">/{plan.interval}</span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="font-semibold mb-4">What's included:</h3>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={() => handleSubscribe(plan.id)}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
              >
                Subscribe Now
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-gray-400">
          All plans include a 7-day free trial. Cancel anytime.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          By subscribing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Subscription;
