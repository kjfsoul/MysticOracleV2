import BasicAuthForm from '../components/BasicAuthForm';

export default function BasicAuthPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #2a1a4a 0%, #4a2a8a 100%)'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '500px', 
        padding: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '8px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ 
          textAlign: 'center', 
          color: 'white', 
          marginBottom: '20px',
          fontSize: '24px'
        }}>
          Mystic Arcana
        </h1>
        <p style={{ 
          textAlign: 'center', 
          color: 'rgba(255, 255, 255, 0.7)', 
          marginBottom: '30px' 
        }}>
          Discover your cosmic destiny
        </p>
        
        <BasicAuthForm />
      </div>
    </div>
  );
}
