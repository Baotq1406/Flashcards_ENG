import { Flashcard, StudySession } from '../types';

const FLASHCARDS_KEY = 'flashcards';
const SESSIONS_KEY = 'study_sessions';

export const saveFlashcards = (flashcards: Flashcard[]): void => {
  localStorage.setItem(FLASHCARDS_KEY, JSON.stringify(flashcards));
};

export const loadFlashcards = (): Flashcard[] => {
  const stored = localStorage.getItem(FLASHCARDS_KEY);
  if (!stored) return getDefaultFlashcards();
  
  try {
    const flashcards = JSON.parse(stored);
    return flashcards.map((card: any) => ({
      ...card,
      createdAt: new Date(card.createdAt),
      lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : undefined
    }));
  } catch {
    return getDefaultFlashcards();
  }
};

export const saveSessions = (sessions: StudySession[]): void => {
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};

export const loadSessions = (): StudySession[] => {
  const stored = localStorage.getItem(SESSIONS_KEY);
  if (!stored) return [];
  
  try {
    const sessions = JSON.parse(stored);
    return sessions.map((session: any) => ({
      ...session,
      startTime: new Date(session.startTime),
      endTime: session.endTime ? new Date(session.endTime) : undefined
    }));
  } catch {
    return [];
  }
};

const getDefaultFlashcards = (): Flashcard[] => [
  {
    id: '1',
    front: 'Hello',
    back: 'Xin chào',
    category: 'English-Vietnamese',
    difficulty: 'easy',
    correctCount: 0,
    incorrectCount: 0,
    createdAt: new Date()
  },
  {
    id: '2',
    front: 'Thank you',
    back: 'Cám ơn',
    category: 'English-Vietnamese',
    difficulty: 'easy',
    correctCount: 0,
    incorrectCount: 0,
    createdAt: new Date()
  },
  {
    id: '3',
    front: 'Goodbye',
    back: 'Tạm biệt',
    category: 'English-Vietnamese',
    difficulty: 'easy',
    correctCount: 0,
    incorrectCount: 0,
    createdAt: new Date()
  },
  {
    id: '4',
    front: 'Beautiful',
    back: 'Đẹp',
    category: 'English-Vietnamese',
    difficulty: 'medium',
    correctCount: 0,
    incorrectCount: 0,
    createdAt: new Date()
  },
  {
    id: '5',
    front: 'Delicious',
    back: 'Ngon',
    category: 'English-Vietnamese',
    difficulty: 'medium',
    correctCount: 0,
    incorrectCount: 0,
    createdAt: new Date()
  }
];

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};