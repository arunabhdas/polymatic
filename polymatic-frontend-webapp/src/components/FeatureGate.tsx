import { useFeatureFlag } from '@/hooks/useFeatureFlag'
import type { FeatureFlag } from '@/types'

interface FeatureGateProps {
  flag: FeatureFlag
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function FeatureGate({ flag, children, fallback = null }: FeatureGateProps) {
  const enabled = useFeatureFlag(flag)

  if (!enabled) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
