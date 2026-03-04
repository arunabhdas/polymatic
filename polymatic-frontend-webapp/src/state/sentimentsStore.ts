import { create } from 'zustand'
import type { SentimentQuestion } from '@/types'
import type { SentimentSortBy } from '@/sentiments/sentiments.utils'

interface SentimentsState {
  questions: SentimentQuestion[]
  trackedQuestionIds: Set<string>
  expandedQuestionId: string | null
  sortBy: SentimentSortBy

  addQuestion: (question: SentimentQuestion) => void
  updateQuestions: (questions: SentimentQuestion[]) => void
  trackQuestion: (id: string) => void
  untrackQuestion: (id: string) => void
  expandQuestion: (id: string | null) => void
  setSortBy: (sortBy: SentimentSortBy) => void
}

export const useSentimentsStore = create<SentimentsState>()((set) => ({
  questions: [],
  trackedQuestionIds: new Set(),
  expandedQuestionId: null,
  sortBy: 'delta',

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
  setSortBy: (sortBy) => set({ sortBy }),
}))
