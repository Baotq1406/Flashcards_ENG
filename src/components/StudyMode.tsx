import React, { useState, useEffect } from 'react';
import { Flashcard as FlashcardType } from '../types';
import { Flashcard } from './Flashcard';
import { ChevronLeft, ChevronRight, BarChart3, BookOpen } from 'lucide-react';

interface StudyModeProps {
  flashcards: FlashcardType[];
  onUpdateFlashcard: (flashcard: FlashcardType) => void;
  onBack: () => void;
}

export const StudyMode: React.FC<StudyModeProps> = ({
  flashcards,
  onUpdateFlashcard,
  onBack
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [studiedCards, setStudiedCards] = useState(new Set<string>());
  
  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  const handleMarkCorrect = (id: string) => {
    const card = flashcards.find(c => c.id === id);
    if (card) {
      onUpdateFlashcard({
        ...card,
        correctCount: card.correctCount + 1,
        lastReviewed: new Date()
      });
      setStudiedCards(prev => new Set([...prev, id]));
      nextCard();
    }
  };

  const handleMarkIncorrect = (id: string) => {
    const card = flashcards.find(c => c.id === id);
    if (card) {
      onUpdateFlashcard({
        ...card,
        incorrectCount: card.incorrectCount + 1,
        lastReviewed: new Date()
      });
      setStudiedCards(prev => new Set([...prev, id]));
      nextCard();
    }
  };

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const previousCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowLeft') previousCard();
    if (e.key === 'ArrowRight') nextCard();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex]);

  if (flashcards.length === 0) {
    return (
      <div className="text-center py-12">
        <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No flashcards to study</h3>
        <p className="text-gray-500">Add some flashcards to get started!</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft size={20} />
          Back to Menu
        </button>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <BarChart3 size={16} />
            <span>{studiedCards.size} studied</span>
          </div>
          <div className="text-sm text-gray-600">
            Card {currentIndex + 1} of {flashcards.length}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Flashcard */}
      <div className="mb-8">
        <Flashcard
          flashcard={currentCard}
          onMarkCorrect={handleMarkCorrect}
          onMarkIncorrect={handleMarkIncorrect}
          showStats={true}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={previousCard}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        
        <div className="text-sm text-gray-500">
          Use arrow keys to navigate
        </div>
        
        <button
          onClick={nextCard}
          disabled={currentIndex === flashcards.length - 1}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Completion Message */}
      {currentIndex === flashcards.length - 1 && studiedCards.has(currentCard.id) && (
        <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-xl text-center">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            🎉 Congratulations!
          </h3>
          <p className="text-green-700">
            You've completed studying all {flashcards.length} flashcards!
          </p>
          <button
            onClick={onBack}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Return to Menu
          </button>
        </div>
      )}
    </div>
  );
};