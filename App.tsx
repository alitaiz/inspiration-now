
import React, { useState, useEffect, useRef } from 'react';
import { fetchNewInspiration } from './services/geminiService';
import type { InspirationData } from './types';
import QuoteCard from './components/QuoteCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';
import { ExternalLinkIcon } from './components/Icons';
import { generateRandomGradient } from './utils/backgroundUtils';

const App: React.FC = () => {
  const [inspiration, setInspiration] = useState<InspirationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [backgroundStyle, setBackgroundStyle] = useState<string>('');
  
  const inspirationRef = useRef<InspirationData | null>(inspiration);
  inspirationRef.current = inspiration;

  useEffect(() => {
    setBackgroundStyle(generateRandomGradient());

    const loadInspiration = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchNewInspiration();
        if (inspirationRef.current?.imageUrl.startsWith('blob:')) {
          URL.revokeObjectURL(inspirationRef.current.imageUrl);
        }
        setInspiration(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setInspiration(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInspiration();
    
    return () => {
      if (inspirationRef.current?.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(inspirationRef.current.imageUrl);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <ErrorDisplay message={error} />;
    }

    if (inspiration) {
      return (
        <QuoteCard
          key={inspiration.imageUrl} // Add key to re-trigger animation
          quote={inspiration.quote}
          author={inspiration.author}
          imageUrl={inspiration.imageUrl}
        />
      );
    }
    
    return null;
  };

  return (
    <div 
      className="relative min-h-screen text-slate-800 flex flex-col items-center justify-center p-4 sm:p-6 font-sans transition-colors duration-1000 ease-in-out"
      style={{ background: backgroundStyle }}
    >
      <div className="w-full flex-grow flex flex-col items-center justify-center">
        <header className="text-center mb-6 z-10">
            <p className="text-lg text-slate-600">
            Your daily dose of motivation.
            </p>
        </header>
        
        <main className="w-full max-w-sm mx-auto flex flex-col items-center z-10">
          {/* Aspect ratio container for the card */}
          <div className="w-full" style={{ aspectRatio: '9 / 16' }}>
            {renderContent()}
          </div>
        </main>
      </div>
      
      <footer className="w-full text-center py-4 z-10">
          <a
            href="https://bobicare.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 border border-slate-500/20 text-slate-600 bg-white/40 backdrop-blur-sm font-semibold rounded-lg hover:bg-white/60 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75 transition-colors duration-300 ease-in-out inline-flex items-center gap-2 text-sm"
          >
            <ExternalLinkIcon className="w-4 h-4" />
            <span>Visit Our Store on Amazon</span>
          </a>
      </footer>
    </div>
  );
};

export default App;
