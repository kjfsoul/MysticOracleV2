import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function SuperSimpleAuthForm() {
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [name, setName] = useState('kevin');
  const [email, setEmail] = useState('kjfsoul@gmail.com');
  const [password, setPassword] = useState('••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••');
  
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Registering with:', { email, name });
      await signup(email, password, name);
      console.log('Registration successful');
      alert('Registration successful!');
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, textAlign: 'center', padding: '10px' }}>
          Sign In
        </div>
        <div style={{ flex: 1, textAlign: 'center', padding: '10px', fontWeight: 'bold' }}>
          Sign Up
        </div>
      </div>
      
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ width: '100%', padding: '8px', marginBottom: '20px' }}
        />
        <button 
          type="submit" 
          style={{ 
            width: '100%', 
            padding: '8px', 
            backgroundColor: '#333', 
            color: 'white',
            border: 'none'
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
}
