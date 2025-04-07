import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function PlainAuthForm() {
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
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <div>
        <div>Sign In</div>
        <div>Sign Up</div>
      </div>
      
      <form onSubmit={handleRegister}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
