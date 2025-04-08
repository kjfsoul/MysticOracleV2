import React from 'react';
import { Link } from 'wouter';

const SubscriptionCancel: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-8 mb-8">
        <div className="w-20 h-20 bg-yellow-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold mb-4">Subscription Cancelled</h1>
        <p className="text-gray-300 mb-6">
          Your subscription process was cancelled or interrupted.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/subscription"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
          >
            Try Again
          </Link>
          
          <Link 
            to="/readings"
            className="px-6 py-3 bg-purple-800/50 hover:bg-purple-700/50 text-white font-semibold rounded-lg transition-colors"
          >
            Continue with Free Plan
          </Link>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-6">Why Subscribe to Premium?</h2>
      
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 text-left">
          <h3 className="font-semibold mb-3 flex items-center">
            <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Advanced Tarot Readings
          </h3>
          <p className="text-sm text-gray-400">
            Access exclusive spreads and personalized interpretations tailored to your spiritual journey.
          </p>
        </div>
        
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 text-left">
          <h3 className="font-semibold mb-3 flex items-center">
            <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Detailed Astrological Insights
          </h3>
          <p className="text-sm text-gray-400">
            Dive deep into your birth chart with professional-level analysis and transit forecasts.
          </p>
        </div>
        
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 text-left">
          <h3 className="font-semibold mb-3 flex items-center">
            <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            AI-Powered Journal Analysis
          </h3>
          <p className="text-sm text-gray-400">
            Get insights into your spiritual growth patterns with our advanced journaling tools.
          </p>
        </div>
        
        <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-6 text-left">
          <h3 className="font-semibold mb-3 flex items-center">
            <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            Priority Support
          </h3>
          <p className="text-sm text-gray-400">
            Get answers to your spiritual questions from our team of experienced practitioners.
          </p>
        </div>
      </div>
      
      <div className="bg-purple-900/30 rounded-lg p-6">
        <h3 className="font-semibold mb-3">Still have questions?</h3>
        <p className="text-gray-400 mb-4">
          We're here to help you on your spiritual journey. Reach out to our support team for assistance.
        </p>
        <Link 
          to="/contact"
          className="text-purple-400 hover:text-purple-300 underline"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default SubscriptionCancel;
