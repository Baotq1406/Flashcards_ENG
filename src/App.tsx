import React, { useState, useEffect } from 'react';
import { Flashcard, StudySession } from './types';
import { saveFlashcards, loadFlashcards, generateId } from './utils/storage';
import { StudyMode } from './components/StudyMode';
import { Quiz } from './components/Quiz';
import { FlashcardForm } from './components/FlashcardForm';
import { 
  BookOpen, 
  Brain, 
  Plus, 
  Edit, 
  Trash2, 
  BarChart3,
  Settings,
  Search,
  Filter
} from 'lucide-react';

type AppMode = 'menu' | 'study' | 'quiz';

function App() {
  const [mode, setMode] = useState<AppMode>('menu');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [filteredCards, setFilteredCards] = useState<Flashcard[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);

  useEffect(() => {
    const cards = loadFlashcards();
    setFlashcards(cards);
    setFilteredCards(cards);
  }, []);

  useEffect(() => {
    let filtered = flashcards;
    
    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.back.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(card => card.category === selectedCategory);
    }
    
    setFilteredCards(filtered);
  }, [flashcards, searchTerm, selectedCategory]);

  const categories = Array.from(new Set(flashcards.map(card => card.category)));

  const updateFlashcard = (updatedCard: Flashcard) => {
    const updatedCards = flashcards.map(card =>
      card.id === updatedCard.id ? updatedCard : card
    );
    setFlashcards(updatedCards);
    saveFlashcards(updatedCards);
  };

  const addFlashcard = (cardData: Omit<Flashcard, 'id' | 'createdAt'>) => {
    const newCard: Flashcard = {
      ...cardData,
      id: generateId(),
      createdAt: new Date()
    };
    const updatedCards = [...flashcards, newCard];
    setFlashcards(updatedCards);
    saveFlashcards(updatedCards);
  };

  const deleteFlashcard = (id: string) => {
    const updatedCards = flashcards.filter(card => card.id !== id);
    setFlashcards(updatedCards);
    saveFlashcards(updatedCards);
  };

  const handleEdit = (card: Flashcard) => {
    setEditingCard(card);
    setShowForm(true);
  };

  const handleSave = (cardData: Omit<Flashcard, 'id' | 'createdAt'>) => {
    if (editingCard) {
      updateFlashcard({
        ...editingCard,
        ...cardData
      });
    } else {
      addFlashcard(cardData);
    }
    setEditingCard(null);
  };

  const getStats = () => {
    const totalCards = flashcards.length;
    const studiedCards = flashcards.filter(card => 
      card.correctCount > 0 || card.incorrectCount > 0
    ).length;
    const totalAttempts = flashcards.reduce((sum, card) => 
      sum + card.correctCount + card.incorrectCount, 0
    );
    const correctAttempts = flashcards.reduce((sum, card) => 
      sum + card.correctCount, 0
    );
    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
    
    return { totalCards, studiedCards, accuracy };
  };

  if (mode === 'study') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <StudyMode
          flashcards={filteredCards.length > 0 ? filteredCards : flashcards}
          onUpdateFlashcard={updateFlashcard}
          onBack={() => setMode('menu')}
        />
      </div>
    );
  }

  if (mode === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
        <Quiz
          flashcards={filteredCards.length > 0 ? filteredCards : flashcards}
          onBack={() => setMode('menu')}
          onUpdateFlashcard={updateFlashcard}
        />
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Flashcards</h1>
              <p className="text-gray-600 mt-1">Master any subject with smart flashcards</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <BookOpen size={16} />
                  <span>{stats.totalCards} cards</span>
                </div>
                <div className="flex items-center gap-1">
                  <BarChart3 size={16} />
                  <span>{stats.accuracy}% accuracy</span>
                </div>
              </div>
              
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus size={16} />
                Add Card
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => setMode('study')}
            className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-left border-2 border-transparent hover:border-blue-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <BookOpen size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Study Mode</h3>
                <p className="text-gray-600">Review flashcards at your own pace</p>
              </div>
            </div>
            <div className="text-sm text-blue-600 font-medium">
              {filteredCards.length} cards available →
            </div>
          </button>

          <button
            onClick={() => setMode('quiz')}
            className="group p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-left border-2 border-transparent hover:border-purple-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Brain size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Quiz Mode</h3>
                <p className="text-gray-600">Test your knowledge with timed questions</p>
              </div>
            </div>
            <div className="text-sm text-purple-600 font-medium">
              {Math.min(filteredCards.length, 5)} questions ready →
            </div>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search flashcards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Flashcards Grid */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Flashcards ({filteredCards.length})
            </h2>
          </div>
          
          {filteredCards.length === 0 ? (
            <div className="p-12 text-center">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {flashcards.length === 0 ? 'No flashcards yet' : 'No cards match your search'}
              </h3>
              <p className="text-gray-500 mb-4">
                {flashcards.length === 0 
                  ? 'Create your first flashcard to get started learning!'
                  : 'Try adjusting your search or filter criteria'
                }
              </p>
              {flashcards.length === 0 && (
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Create First Card
                </button>
              )}
            </div>
          ) : (
            <div className="p-6">
              <div className="grid gap-4">
                {filteredCards.map((card) => {
                  const totalAttempts = card.correctCount + card.incorrectCount;
                  const accuracy = totalAttempts > 0 ? Math.round((card.correctCount / totalAttempts) * 100) : 0;
                  
                  return (
                    <div key={card.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                              card.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                              card.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {card.difficulty}
                            </span>
                            <span className="text-xs text-gray-500">{card.category}</span>
                            {totalAttempts > 0 && (
                              <span className="text-xs text-gray-600">{accuracy}% accuracy</span>
                            )}
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 mb-2">
                            <div>
                              <div className="text-sm font-medium text-gray-600 mb-1">Front</div>
                              <div className="text-gray-900">{card.front}</div>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-600 mb-1">Back</div>
                              <div className="text-gray-900">{card.back}</div>
                            </div>
                          </div>
                          
                          {totalAttempts > 0 && (
                            <div className="text-xs text-gray-500">
                              Studied {totalAttempts} times • {card.correctCount} correct • {card.incorrectCount} incorrect
                            </div>
                          )}
                        </div>
                        
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(card)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this flashcard?')) {
                                deleteFlashcard(card.id);
                              }
                            }}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Flashcard Form Modal */}
      <FlashcardForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingCard(null);
        }}
        onSave={handleSave}
        editingCard={editingCard}
        categories={categories}
      />
    </div>
  );
}

export default App;