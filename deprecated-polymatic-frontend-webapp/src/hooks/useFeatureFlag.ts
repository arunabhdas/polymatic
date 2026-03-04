import { useFlagsStore } from '@/state/flagsStore'
import type { FeatureFlag } from '@/types'

export function useFeatureFlag(flag: FeatureFlag): boolean {
  return useFlagsStore((s) => s[flag])
}
