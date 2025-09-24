import React, { useState, useEffect } from 'react';
import { Flashcard, QuizQuestion } from '../types';
import { Clock, CheckCircle, XCircle, Award } from 'lucide-react';

interface QuizProps {
  flashcards: Flashcard[];
  onBack: () => void;
  onUpdateFlashcard: (flashcard: Flashcard) => void;
}

export const Quiz: React.FC<QuizProps> = ({ flashcards, onBack, onUpdateFlashcard }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    generateQuizQuestions();
  }, [flashcards]);

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleTimeout();
    }
  }, [timeLeft, timerActive, showResult]);

  const generateQuizQuestions = () => {
    const quizCards = [...flashcards].sort(() => Math.random() - 0.5).slice(0, 5);
    const quizQuestions: QuizQuestion[] = quizCards.map(card => {
      const wrongAnswers = flashcards
        .filter(c => c.id !== card.id && c.category === card.category)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(c => c.back);
      
      const options = [card.back, ...wrongAnswers].sort(() => Math.random() - 0.5);
      
      return {
        flashcard: card,
        options
      };
    });
    
    setQuestions(quizQuestions);
    setCurrentQuestionIndex(0);
    setTimerActive(true);
    setTimeLeft(30);
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setTimerActive(false);
    
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.flashcard.back;
    
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      userAnswer: answer,
      isCorrect
    };
    setQuestions(updatedQuestions);
    
    // Update flashcard stats
    const updatedCard = {
      ...currentQuestion.flashcard,
      correctCount: isCorrect ? currentQuestion.flashcard.correctCount + 1 : currentQuestion.flashcard.correctCount,
      incorrectCount: !isCorrect ? currentQuestion.flashcard.incorrectCount + 1 : currentQuestion.flashcard.incorrectCount,
      lastReviewed: new Date()
    };
    onUpdateFlashcard(updatedCard);
    
    setShowResult(true);
  };

  const handleTimeout = () => {
    handleAnswer('');
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
      setShowResult(false);
      setTimeLeft(30);
      setTimerActive(true);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    generateQuizQuestions();
    setQuizCompleted(false);
    setShowResult(false);
    setSelectedAnswer('');
  };

  if (flashcards.length < 4) {
    return (
      <div className="text-center py-12">
        <Award size={64} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">Not enough flashcards</h3>
        <p className="text-gray-500">You need at least 4 flashcards to take a quiz.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (quizCompleted) {
    const correctAnswers = questions.filter(q => q.isCorrect).length;
    const accuracy = Math.round((correctAnswers / questions.length) * 100);
    
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="mb-8">
          <Award size={80} className="mx-auto text-yellow-500 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h2>
          <p className="text-xl text-gray-600">You scored {correctAnswers} out of {questions.length}</p>
          <div className="text-2xl font-bold text-blue-600 mt-2">{accuracy}% Accuracy</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Results Breakdown</h3>
          <div className="space-y-3">
            {questions.map((question, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="text-left">
                  <div className="font-medium">{question.flashcard.front}</div>
                  <div className="text-sm text-gray-600">
                    Correct: {question.flashcard.back}
                  </div>
                  {question.userAnswer && question.userAnswer !== question.flashcard.back && (
                    <div className="text-sm text-red-600">
                      Your answer: {question.userAnswer}
                    </div>
                  )}
                </div>
                <div>
                  {question.isCorrect ? (
                    <CheckCircle className="text-green-500" size={24} />
                  ) : (
                    <XCircle className="text-red-500" size={24} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <button
            onClick={restartQuiz}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Take Quiz Again
          </button>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) return null;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="text-sm text-gray-600">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${
          timeLeft <= 10 ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
        }`}>
          <Clock size={16} />
          {timeLeft}s
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="text-center mb-8">
          <div className="text-sm text-blue-600 font-medium mb-2">
            {currentQuestion.flashcard.category}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            What does this mean?
          </h2>
          <div className="text-3xl font-bold text-blue-600 mb-4">
            {currentQuestion.flashcard.front}
          </div>
        </div>

        {!showResult ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="p-4 text-left bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-300 rounded-lg transition-all duration-200 font-medium"
              >
                {option}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
              questions[currentQuestionIndex].isCorrect
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {questions[currentQuestionIndex].isCorrect ? (
                <CheckCircle size={20} />
              ) : (
                <XCircle size={20} />
              )}
              {questions[currentQuestionIndex].isCorrect ? 'Correct!' : 'Incorrect'}
            </div>
            
            <div className="text-lg mb-4">
              <strong>Correct answer:</strong> {currentQuestion.flashcard.back}
            </div>
            
            {selectedAnswer && selectedAnswer !== currentQuestion.flashcard.back && (
              <div className="text-gray-600 mb-4">
                You selected: <strong>{selectedAnswer}</strong>
              </div>
            )}

            <button
              onClick={nextQuestion}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'See Results'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};