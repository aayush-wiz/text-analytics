import { useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes';
import { Spinner } from './components/common/Spinner';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate resource loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-notion-default">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-notion-text-gray">
            Loading resources...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
