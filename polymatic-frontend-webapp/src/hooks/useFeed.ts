import { useQuery } from '@tanstack/react-query';
import { getDataProvider } from '../services/dataProvider';
import { queryKeys } from '../services/queryKeys';
import type { FeedParams } from '../types/feed.types';

export function useFeed(params: FeedParams = {}) {
  const provider = getDataProvider();
  
  return useQuery({
    queryKey: queryKeys.feed.list(params),
    queryFn: () => provider.getFeed(params),
    // React Query defaults: refetch on window focus, stale time 0 
    // Usually WebSocket pushes take care of live updates, so we can cache longer
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useFeedClusters() {
  const provider = getDataProvider();
  
  return useQuery({
    queryKey: queryKeys.feed.clusters(),
    queryFn: () => provider.getFeedClusters(),
    staleTime: 1000 * 60 * 5,
  });
}
