import React from 'react';
import VeryBasicAuthForm from '../components/VeryBasicAuthForm';

export default function VeryBasicAuthPage() {
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
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: '#2a1a4a', 
          marginBottom: '20px',
          fontSize: '24px'
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
        
        <VeryBasicAuthForm />
      </div>
    </div>
  );
}
