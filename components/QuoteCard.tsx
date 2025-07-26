
import React from 'react';

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

export default QuoteCard;