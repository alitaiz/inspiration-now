import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

// --- Types ---
interface InspirationData {
  quote: string;
  author: string;
  imageUrl: string;
}

// --- Data ---
const localQuotes = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { quote: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
  { quote: "The mind is everything. What you think you become.", author: "Buddha" },
  { quote: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { quote: "The best way to predict the future is to create it.", author: "Peter Drucker" },
  { quote: "An unexamined life is not worth living.", author: "Socrates" },
  { quote: "The only source of knowledge is experience.", author: "Albert Einstein" },
  { quote: "Everything you can imagine is real.", author: "Pablo Picasso" },
];

const localImages = [
  "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80",
  "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80",
  "https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=800&q=80",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80",
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800&q=80",
  "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80"
];

// --- Utils ---
const generateRandomHslColor = (minLightness: number, maxLightness: number): string => {
  const hue = Math.floor(Math.random() * 361);
  const saturation = Math.floor(40 + Math.random() * 41);
  const lightness = Math.floor(minLightness + Math.random() * (maxLightness - minLightness + 1));
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

const generateRandomGradient = (): string => {
  const color1 = generateRandomHslColor(88, 95); 
  const color2 = generateRandomHslColor(88, 95);
  const angle = Math.floor(Math.random() * 361);
  return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
};

// --- Services ---
const fetchNewInspiration = async (): Promise<InspirationData> => {
  try {
    const randomQuoteIndex = Math.floor(Math.random() * localQuotes.length);
    const { quote, author } = localQuotes[randomQuoteIndex];
    const randomImageIndex = Math.floor(Math.random() * localImages.length);
    const imageUrl = localImages[randomImageIndex];
    return { quote, author, imageUrl };
  } catch (error) {
    console.error("Failed to get inspiration from local data:", error);
    return {
      quote: "Strive not to be a success, but rather to be of value.",
      author: "Albert Einstein",
      imageUrl: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&q=80",
    };
  }
};

// --- Components ---
const ExternalLinkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        {...props}
    >
        <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5M15 3.75L20.25 9M20.25 9V3.75M20.25 9H15" 
        />
    </svg>
);

interface ErrorDisplayProps {
  message: string;
}
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-red-50 border-2 border-red-300 rounded-3xl p-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      <h3 className="text-xl font-bold text-red-800">Oops! Something went wrong.</h3>
      <p className="mt-2 text-red-600">{message}</p>
    </div>
  );
};

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-lg font-semibold text-gray-700">Finding your inspiration...</p>
    </div>
  );
};

interface QuoteCardProps {
  quote: string;
  author: string;
  imageUrl: string;
}
const getFontSizeClass = (textLength: number): string => {
  if (textLength > 220) return 'text-xl';
  if (textLength > 150) return 'text-2xl';
  return 'text-3xl';
};
const QuoteCard: React.FC<QuoteCardProps> = ({ quote, author, imageUrl }) => {
  const fontSizeClass = getFontSizeClass(quote.length);
  return (
    <div
      className="relative w-full h-full rounded-3xl shadow-2xl overflow-hidden bg-cover bg-center transition-all duration-700 ease-in-out animate-fade-in"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center transition-all duration-300">
        <p className={`text-white ${fontSizeClass} font-serif leading-relaxed drop-shadow-lg transition-all duration-300`}>
          "{quote}"
        </p>
        <p className="text-white text-lg font-sans mt-4 opacity-80 drop-shadow-md">
          - {author}
        </p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [inspiration, setInspiration] = useState<InspirationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [backgroundStyle, setBackgroundStyle] = useState<string>('');
  
  useEffect(() => {
    setBackgroundStyle(generateRandomGradient());
    const loadInspiration = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchNewInspiration();
        setInspiration(data);
      } catch (err) {
        console.error("An unexpected error occurred while loading inspiration:", err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setInspiration(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadInspiration();
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
          key={inspiration.imageUrl}
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

// --- App Mount ---
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
