import React, { useState, useEffect } from 'react';
import { Flashcard } from '../types';
import { X, Save, Plus } from 'lucide-react';

interface FlashcardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (flashcard: Omit<Flashcard, 'id' | 'createdAt'>) => void;
  editingCard?: Flashcard | null;
  categories: string[];
}

export const FlashcardForm: React.FC<FlashcardFormProps> = ({
  isOpen,
  onClose,
  onSave,
  editingCard,
  categories
}) => {
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [useNewCategory, setUseNewCategory] = useState(false);

  useEffect(() => {
    if (editingCard) {
      setFront(editingCard.front);
      setBack(editingCard.back);
      setCategory(editingCard.category);
      setDifficulty(editingCard.difficulty);
      setUseNewCategory(false);
      setNewCategory('');
    } else {
      resetForm();
    }
  }, [editingCard, isOpen]);

  const resetForm = () => {
    setFront('');
    setBack('');
    setCategory(categories[0] || '');
    setNewCategory('');
    setDifficulty('medium');
    setUseNewCategory(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalCategory = useNewCategory ? newCategory : category;
    if (!front.trim() || !back.trim() || !finalCategory.trim()) return;

    onSave({
      front: front.trim(),
      back: back.trim(),
      category: finalCategory.trim(),
      difficulty,
      correctCount: editingCard?.correctCount || 0,
      incorrectCount: editingCard?.incorrectCount || 0,
      lastReviewed: editingCard?.lastReviewed
    });

    onClose();
    if (!editingCard) resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {editingCard ? 'Edit Flashcard' : 'Add New Flashcard'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Front (Question)
            </label>
            <textarea
              value={front}
              onChange={(e) => setFront(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={2}
              placeholder="Enter the question or term..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Back (Answer)
            </label>
            <textarea
              value={back}
              onChange={(e) => setBack(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={2}
              placeholder="Enter the answer or translation..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="existing-category"
                  checked={!useNewCategory}
                  onChange={() => setUseNewCategory(false)}
                  className="text-blue-500"
                />
                <label htmlFor="existing-category" className="text-sm">Use existing category</label>
              </div>
              
              {!useNewCategory && (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required={!useNewCategory}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="new-category"
                  checked={useNewCategory}
                  onChange={() => setUseNewCategory(true)}
                  className="text-blue-500"
                />
                <label htmlFor="new-category" className="text-sm">Create new category</label>
              </div>

              {useNewCategory && (
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new category name..."
                  required={useNewCategory}
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'medium', 'hard'] as const).map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`p-2 text-sm font-medium rounded-lg border-2 transition-colors ${
                    difficulty === level
                      ? level === 'easy'
                        ? 'bg-green-100 border-green-500 text-green-800'
                        : level === 'medium'
                        ? 'bg-yellow-100 border-yellow-500 text-yellow-800'
                        : 'bg-red-100 border-red-500 text-red-800'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              {editingCard ? <Save size={16} /> : <Plus size={16} />}
              {editingCard ? 'Update' : 'Add'} Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};