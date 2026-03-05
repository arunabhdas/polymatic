import { useQuery } from '@tanstack/react-query';
import { getDataProvider } from '../services/dataProvider';
import { queryKeys } from '../services/queryKeys';
import type { SentimentParams } from '../types/sentiment.types';

export function useSentiments(params: SentimentParams = {}) {
  const provider = getDataProvider();
  
  return useQuery({
    queryKey: queryKeys.sentiments.list(params),
    queryFn: () => provider.getSentiments(params),
    staleTime: 1000 * 60 * 1, // 1 minute stale time since prediction drift is frequent
  });
}

export function useSentimentDetail(id: string) {
  const provider = getDataProvider();
  
  return useQuery({
    queryKey: queryKeys.sentiments.detail(id),
    queryFn: () => provider.getSentimentDetail(id),
    staleTime: 1000 * 60 * 1,
    enabled: !!id,
  });
}

export function usePredictionBrief(id: string) {
  const provider = getDataProvider();

  return useQuery({
    queryKey: queryKeys.sentiments.prediction(id),
    queryFn: () => provider.getPredictionBrief(id),
    staleTime: Infinity, // LLM prediction summaries don't change until specifically re-generated
    enabled: !!id,
  });
}
