import SimpleAuthForm from '@/components/SimpleAuthForm';
import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'wouter';

export default function SimpleAuthPage() {
  const { user, isLoading } = useAuth();

  // Redirect if already logged in
  if (!isLoading && user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-900">
      <div className="bg-purple-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Mystic Arcana</h1>
        <p className="text-center text-purple-200 mb-8">Discover your cosmic destiny</p>
        
        <SimpleAuthForm />
      </div>
    </div>
  );
}
