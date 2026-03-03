import { create } from 'zustand'
import type { SentimentQuestion } from '@/types'

interface SentimentsState {
  questions: SentimentQuestion[]
  trackedQuestionIds: Set<string>
  expandedQuestionId: string | null

  addQuestion: (question: SentimentQuestion) => void
  updateQuestions: (questions: SentimentQuestion[]) => void
  trackQuestion: (id: string) => void
  untrackQuestion: (id: string) => void
  expandQuestion: (id: string | null) => void
}

export const useSentimentsStore = create<SentimentsState>()((set) => ({
  questions: [],
  trackedQuestionIds: new Set(),
  expandedQuestionId: null,

  addQuestion: (question) => set((s) => ({ questions: [...s.questions, question] })),
  updateQuestions: (questions) => set({ questions }),
  trackQuestion: (id) =>
    set((s) => ({ trackedQuestionIds: new Set([...s.trackedQuestionIds, id]) })),
  untrackQuestion: (id) =>
    set((s) => {
      const next = new Set(s.trackedQuestionIds)
      next.delete(id)
      return { trackedQuestionIds: next }
    }),
  expandQuestion: (id) => set({ expandedQuestionId: id }),
}))
