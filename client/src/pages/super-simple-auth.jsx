import React from 'react';
import SuperSimpleAuthForm from '../components/SuperSimpleAuthForm';

export default function SuperSimpleAuthPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#2a1a4a'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '500px', 
        padding: '20px',
        backgroundColor: '#fff'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#2a1a4a', 
          marginBottom: '20px'
        }}>
          Mystic Arcana
        </h1>
        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          marginBottom: '30px' 
        }}>
          Discover your cosmic destiny
        </p>
        
        <SuperSimpleAuthForm />
      </div>
    </div>
  );
}
