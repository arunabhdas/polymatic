import { useQuery } from '@tanstack/react-query'
import { useDataProvider } from './useDataProvider'
import { useSentimentsStore } from '@/state/sentimentsStore'
import { queryKeys } from '@/services/queryKeys'

// ─── useSentimentQuestions ────────────────────────────────────

export function useSentimentQuestions() {
  const provider = useDataProvider()

  return useQuery({
    queryKey: queryKeys.sentiments.list(),
    queryFn: async () => {
      if (!provider) throw new Error('Provider not ready')
      return provider.getSentimentQuestions({ page: 1, limit: 50 })
    },
    enabled: !!provider,
    refetchInterval: 10_000,
    staleTime: 5_000,
  })
}

// ─── useSentimentDetail ──────────────────────────────────────

export function useSentimentDetail(questionId: string | null) {
  const provider = useDataProvider()

  return useQuery({
    queryKey: queryKeys.sentiments.detail(questionId ?? ''),
    queryFn: async () => {
      if (!provider || !questionId) throw new Error('Provider not ready')
      return provider.getSentimentDetail(questionId)
    },
    enabled: !!provider && !!questionId,
    refetchInterval: 5_000,
    staleTime: 3_000,
  })
}

// ─── useTrackQuestion ────────────────────────────────────────

export function useTrackQuestion() {
  const trackQuestion = useSentimentsStore((s) => s.trackQuestion)
  const untrackQuestion = useSentimentsStore((s) => s.untrackQuestion)
  const trackedIds = useSentimentsStore((s) => s.trackedQuestionIds)

  return {
    trackedIds,
    track: trackQuestion,
    untrack: untrackQuestion,
    isTracked: (id: string) => trackedIds.has(id),
  }
}
