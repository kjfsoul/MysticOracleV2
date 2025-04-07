import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function BasicAuthForm() {
  const { login, signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Tab state
  const [activeTab, setActiveTab] = useState('signin');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log('Logging in with:', { email });
      await login(email, password);
      console.log('Login successful');
    } catch (error) {
      console.error('Login error:', error);
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
      console.log('Registering with:', { email, name });
      await signup(email, password, name);
      console.log('Registration successful');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
        <div 
          style={{ 
            flex: 1, 
            padding: '10px', 
            textAlign: 'center',
            backgroundColor: activeTab === 'signin' ? '#f0f0f0' : 'transparent',
            cursor: 'pointer'
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
            backgroundColor: activeTab === 'signup' ? '#f0f0f0' : 'transparent',
            cursor: 'pointer'
          }}
          onClick={() => setActiveTab('signup')}
        >
          Sign Up
        </div>
      </div>
      
      {activeTab === 'signin' ? (
        <form onSubmit={handleLogin} style={{ padding: '20px 0' }}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '8px', 
              backgroundColor: '#6b46c1', 
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {isLoading ? 'Loading...' : 'Login'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister} style={{ padding: '20px 0' }}>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ width: '100%', padding: '8px', marginBottom: '20px' }}
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '8px', 
              backgroundColor: '#6b46c1', 
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {isLoading ? 'Loading...' : 'Register'}
          </button>
        </form>
      )}
    </div>
  );
}
