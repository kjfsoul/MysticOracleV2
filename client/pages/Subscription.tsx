import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';
import StripeCheckout from '../components/StripeCheckout';

const Subscription: React.FC = () => {
  const { user } = useAuth();
  const [hasSubscription, setHasSubscription] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login?redirect=/subscription');
      return;
    }

    // Check if user already has a subscription
    const checkSubscription = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/stripe/customer-subscription/${user.id}`);
        setHasSubscription(response.data.subscriptions.length > 0);
        setLoading(false);
      } catch (err) {
        console.error('Error checking subscription:', err);
        setError('Failed to check subscription status');
        setLoading(false);
      }
    };

    checkSubscription();
  }, [user, navigate]);

  const handleManageSubscription = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/stripe/create-customer-portal-session', {
        customerId: user?.stripeCustomerId,
        returnUrl: `${window.location.origin}/subscription`,
      });
      
      // Redirect to the customer portal
      window.location.href = response.data.url;
    } catch (err) {
      console.error('Error creating customer portal session:', err);
      setError('Failed to open subscription management portal');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <h2 className="mt-4 text-xl font-semibold">Loading subscription details...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Mystic Arcana Premium</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {hasSubscription ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">You're a Premium Member!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for subscribing to Mystic Arcana Premium. You have access to all premium features.
            </p>
            <button
              onClick={handleManageSubscription}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded-lg"
            >
              Manage Subscription
            </button>
          </div>
        ) : (
          <div>
            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold mb-4">Unlock the Full Mystical Experience</h2>
              <p className="text-gray-600 mb-6">
                Subscribe to Mystic Arcana Premium and gain access to exclusive features:
              </p>
              <ul className="list-disc pl-6 mb-6 space-y-2">
                <li>Unlimited daily tarot readings</li>
                <li>Detailed astrological charts and interpretations</li>
                <li>Personalized spiritual guidance</li>
                <li>Advanced journal features with AI insights</li>
                <li>Priority access to new features</li>
                <li>Ad-free experience</li>
              </ul>
            </div>
            
            <StripeCheckout
              userId={user?.id || ''}
              onSuccess={() => navigate('/subscription/success')}
              onCancel={() => navigate('/subscription/cancel')}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscription;
