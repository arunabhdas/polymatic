import { useQuery } from '@tanstack/react-query';
import { getDataProvider } from '../services/dataProvider';
import { queryKeys } from '../services/queryKeys';
import type { MarketParams } from '../types/market.types';

export function useMarkets(params: MarketParams = {}) {
  const provider = getDataProvider();
  
  return useQuery({
    queryKey: queryKeys.markets.list(params),
    queryFn: () => provider.getMarkets(params),
    staleTime: 1000 * 60 * 1, 
  });
}

export function useMarketDetail(id: string) {
  const provider = getDataProvider();
  
  return useQuery({
    queryKey: queryKeys.markets.detail(id),
    queryFn: () => provider.getMarketDetail(id),
    staleTime: 1000 * 60 * 1,
    enabled: !!id,
  });
}
