import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function VeryBasicAuthForm() {
  const { login, signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Tab state
  const [activeTab, setActiveTab] = useState('signin');
  
  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Signing in with:', { email });
      await login(email, password);
      console.log('Sign in successful');
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Registering with:', { email, username });
      await signup(email, password, username);
      console.log('Registration successful');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <div style={{ display: 'flex' }}>
        <div 
          style={{ 
            flex: 1, 
            padding: '10px', 
            textAlign: 'center',
            cursor: 'pointer',
            borderBottom: activeTab === 'signin' ? '2px solid #6b46c1' : 'none'
          }}
          onClick={() => setActiveTab('signin')}
        >
          Sign In
        </div>
        <div 
          style={{ 
            flex: 1, 
            padding: '10px', 
            textAlign: 'center',
            cursor: 'pointer',
            borderBottom: activeTab === 'signup' ? '2px solid #6b46c1' : 'none'
          }}
          onClick={() => setActiveTab('signup')}
        >
          Sign Up
        </div>
      </div>
      
      {activeTab === 'signin' ? (
        <form onSubmit={handleSignIn} style={{ padding: '20px 0' }}>
          <input
            type="text"
            placeholder="kevin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <input
            type="email"
            placeholder="kjfsoul@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <input
            type="password"
            placeholder="••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <input
            type="password"
            placeholder="••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginBottom: '20px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '8px', 
              backgroundColor: '#6b46c1', 
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Register
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister} style={{ padding: '20px 0' }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginBottom: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginBottom: '20px',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '8px', 
              backgroundColor: '#6b46c1', 
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Register
          </button>
        </form>
      )}
    </div>
  );
}
