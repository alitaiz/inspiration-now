
import React from 'react';

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

export default ErrorDisplay;
