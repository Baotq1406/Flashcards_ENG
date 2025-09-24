import React, { useState } from 'react';
import { Flashcard as FlashcardType } from '../types';
import { RotateCcw, CheckCircle, XCircle } from 'lucide-react';

interface FlashcardProps {
  flashcard: FlashcardType;
  onMarkCorrect: (id: string) => void;
  onMarkIncorrect: (id: string) => void;
  showStats?: boolean;
}

export const Flashcard: React.FC<FlashcardProps> = ({
  flashcard,
  onMarkCorrect,
  onMarkIncorrect,
  showStats = false
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  const difficultyColors = {
    easy: 'bg-green-100 text-green-800 border-green-300',
    medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    hard: 'bg-red-100 text-red-800 border-red-300'
  };

  const totalAttempts = flashcard.correctCount + flashcard.incorrectCount;
  const accuracy = totalAttempts > 0 ? Math.round((flashcard.correctCount / totalAttempts) * 100) : 0;

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div 
        className={`relative w-full h-64 cursor-pointer transition-transform duration-700 transform-gpu ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front */}
        <div 
          className="absolute inset-0 w-full h-full bg-white border-2 border-gray-200 rounded-xl shadow-lg flex flex-col justify-center items-center p-6 backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className={`px-3 py-1 rounded-full text-xs font-medium mb-4 border ${difficultyColors[flashcard.difficulty]}`}>
            {flashcard.difficulty.toUpperCase()}
          </div>
          
          <p className="text-2xl font-bold text-gray-800 text-center mb-4">
            {flashcard.front}
          </p>
          
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <RotateCcw size={14} />
            Click to flip
          </div>

          {showStats && totalAttempts > 0 && (
            <div className="absolute bottom-4 right-4 text-xs text-gray-600">
              {accuracy}% accuracy
            </div>
          )}
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-200 rounded-xl shadow-lg flex flex-col justify-center items-center p-6 rotate-y-180"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <span className="text-sm text-blue-600 font-medium mb-2">
            {flashcard.category}
          </span>
          
          <p className="text-2xl font-bold text-gray-800 text-center mb-6">
            {flashcard.back}
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkIncorrect(flashcard.id);
                setIsFlipped(false);
              }}
              className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm font-medium"
            >
              <XCircle size={16} />
              Incorrect
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkCorrect(flashcard.id);
                setIsFlipped(false);
              }}
              className="flex items-center gap-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm font-medium"
            >
              <CheckCircle size={16} />
              Correct
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};