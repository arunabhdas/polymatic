import { SentimentsPanel } from '@/sentiments/SentimentsPanel'
import { AddQuestionFlow } from '@/sentiments/AddQuestionFlow'

export default function SentimentsView() {
  return (
    <div className="flex flex-col h-full p-4 gap-3">
      <div className="flex items-center justify-between">
        <h1 className="text-sm font-medium text-[var(--color-text-primary)]">
          Sentiments Engine
        </h1>
      </div>
      <SentimentsPanel className="flex-1 min-h-0" />
      <AddQuestionFlow />
    </div>
  )
}
