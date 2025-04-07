import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

export default function ExactAuthForm() {
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Form state
  const [name, setName] = useState('kevin');
  const [email, setEmail] = useState('kjfsoul@gmail.com');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('password123');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);
    setMessage({ type: 'info', text: 'Processing registration...' });

    try {
      console.log('Registering with:', { email, name });

      // Step 1: Log the Supabase URL being used
      console.log('Using Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
      setMessage({ type: 'info', text: 'Connecting to Supabase...' });

      // Step 2: Call the signup function
      setMessage({ type: 'info', text: 'Creating account...' });
      const user = await signup(email, password, name);
      console.log('Signup successful, user:', user);

      // Step 3: Show success message
      setMessage({ type: 'success', text: 'Registration successful! Redirecting to home page...' });

      // Redirect to home page after successful registration
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);

      // Provide more detailed error messages
      let errorMessage = 'Registration failed';

      if (error.message) {
        errorMessage = error.message;
      }

      if (error.message && error.message.includes('fetch')) {
        errorMessage = 'Could not connect to the authentication server. Please check your internet connection and try again.';
      }

      if (error.message && error.message.includes('already registered')) {
        errorMessage = 'This email is already registered. Please use a different email or try logging in.';
      }

      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '500px', backgroundColor: 'white' }}>
      <h1 style={{ textAlign: 'center', color: '#2a1a4a', marginTop: '20px', marginBottom: '5px' }}>
        Mystic Arcana
      </h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '20px' }}>
        Discover your cosmic destiny
      </p>

      <div style={{ display: 'flex', borderBottom: '1px solid #ccc' }}>
        <div style={{ flex: 1, textAlign: 'center', padding: '10px' }}>
          Sign In
        </div>
        <div style={{ flex: 1, textAlign: 'center', padding: '10px', fontWeight: 'bold' }}>
          Sign Up
        </div>
      </div>

      <form onSubmit={handleRegister} style={{ padding: '20px' }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="kevin"
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            boxSizing: 'border-box'
          }}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="kjfsoul@gmail.com"
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            boxSizing: 'border-box'
          }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••"
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            boxSizing: 'border-box'
          }}
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••"
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            border: '1px solid #ccc',
            boxSizing: 'border-box'
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer'
          }}
        >
          {isLoading ? 'Processing...' : 'Register'}
        </button>

        {message && (
          <div
            style={{
              padding: '10px',
              marginTop: '10px',
              borderRadius: '4px',
              backgroundColor:
                message.type === 'error' ? '#f8d7da' :
                message.type === 'info' ? '#e2f3fd' : '#d4edda',
              color:
                message.type === 'error' ? '#721c24' :
                message.type === 'info' ? '#0c5460' : '#155724'
            }}
          >
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
}
