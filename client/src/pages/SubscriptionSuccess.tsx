import React, { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { useAuth } from '../hooks/use-auth';

const SubscriptionSuccess: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    const verifySubscription = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        // Get the session ID from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const sessionId = urlParams.get('session_id');

        if (!sessionId) {
          setError('Invalid session ID');
          setLoading(false);
          return;
        }

        // Verify the subscription with the server
        const response = await fetch('/.netlify/functions/verify-subscription', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sessionId,
            userId: user.id,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to verify subscription');
        }

        const data = await response.json();
        setSubscription(data.subscription);
        setLoading(false);
      } catch (err) {
        console.error('Error verifying subscription:', err);
        setError('Failed to verify your subscription. Please contact support.');
        setLoading(false);
      }
    };

    verifySubscription();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-500/20 border border-red-500 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Subscription Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <Link 
            to="/subscription"
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
          >
            Try Again
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="bg-green-500/20 border border-green-500 rounded-lg p-8 mb-8">
        <div className="w-20 h-20 bg-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Subscription Successful!</h1>
        <p className="text-gray-300 mb-2">
          Thank you for subscribing to Mystic Arcana Premium.
        </p>
        <p className="text-gray-400 mb-6">
          Your spiritual journey just got a major upgrade.
        </p>
        
        {subscription && (
          <div className="bg-purple-900/30 rounded-lg p-4 mb-6 inline-block">
            <p className="text-sm text-gray-300">
              <span className="font-semibold">Plan:</span> {subscription.plan}
            </p>
            <p className="text-sm text-gray-300">
              <span className="font-semibold">Status:</span> {subscription.status}
            </p>
            <p className="text-sm text-gray-300">
              <span className="font-semibold">Next billing date:</span> {subscription.currentPeriodEnd}
            </p>
          </div>
        )}
      </div>
      
      <h2 className="text-2xl font-bold mb-6">What's Next?</h2>
      
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">Explore Premium Features</h3>
          <p className="text-sm text-gray-400">
            Unlock advanced tarot spreads, personalized astrological insights, and more.
          </p>
        </div>
        
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">Complete Your Profile</h3>
          <p className="text-sm text-gray-400">
            Add your birth details for more accurate astrological readings.
          </p>
        </div>
        
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6">
          <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2">Daily Readings</h3>
          <p className="text-sm text-gray-400">
            Start your daily tarot practice with personalized insights.
          </p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link 
          to="/readings"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
        >
          Start Exploring
        </Link>
        
        <Link 
          to="/profile"
          className="px-6 py-3 bg-purple-800/50 hover:bg-purple-700/50 text-white font-semibold rounded-lg transition-colors"
        >
          View Account
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;
