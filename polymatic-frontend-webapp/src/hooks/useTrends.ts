import { useQuery } from '@tanstack/react-query';
import { getDataProvider } from '../services/dataProvider';
import { queryKeys } from '../services/queryKeys';

export function useTrends() {
  const provider = getDataProvider();
  
  return useQuery({
    queryKey: queryKeys.trends.list(),
    queryFn: () => provider.getTrends(),
    staleTime: 1000 * 60 * 5,
  });
}
