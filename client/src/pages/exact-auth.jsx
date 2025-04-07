import React from 'react';
import ExactAuthForm from '../components/ExactAuthForm';
import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'wouter';

export default function ExactAuthPage() {
  const { user, isLoading } = useAuth();

  // Redirect if already logged in
  if (!isLoading && user) {
    return <Redirect to="/" />;
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      backgroundColor: '#2a1a4a'
    }}>
      <ExactAuthForm />
    </div>
  );
}
