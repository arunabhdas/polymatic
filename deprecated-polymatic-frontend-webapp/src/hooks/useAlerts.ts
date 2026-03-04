import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDataProvider } from './useDataProvider'
import { queryKeys } from '@/services/queryKeys'
import type { AlertConfig } from '@/types'

// ─── useAlertConfigs ─────────────────────────────────────────

export function useAlertConfigs() {
  const provider = useDataProvider()

  return useQuery({
    queryKey: queryKeys.alerts.configs(),
    queryFn: async () => {
      if (!provider) throw new Error('Provider not ready')
      return provider.getAlertConfigs()
    },
    enabled: !!provider,
    staleTime: 30_000,
  })
}

// ─── useActiveAlerts ─────────────────────────────────────────

export function useActiveAlerts() {
  const provider = useDataProvider()

  return useQuery({
    queryKey: queryKeys.alerts.active(),
    queryFn: async () => {
      if (!provider) throw new Error('Provider not ready')
      return provider.getActiveAlerts()
    },
    enabled: !!provider,
    refetchInterval: 10_000,
    staleTime: 5_000,
  })
}

// ─── useCreateAlert ──────────────────────────────────────────

export function useCreateAlert() {
  const provider = useDataProvider()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (config: Omit<AlertConfig, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!provider) throw new Error('Provider not ready')
      return provider.createAlertConfig(config)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.configs() })
    },
  })
}

// ─── useDismissAlert ─────────────────────────────────────────

export function useDismissAlert() {
  const provider = useDataProvider()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (alertId: string) => {
      if (!provider) throw new Error('Provider not ready')
      return provider.dismissAlert(alertId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.alerts.active() })
    },
  })
}
