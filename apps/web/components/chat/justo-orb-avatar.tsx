import AgentAvatar from "@/components/smoothui/agent-avatar"

export function JustoOrbAvatar({ cc }: { cc: string }) {
  return (
    <div className="mr-1.5 shrink-0 overflow-hidden rounded-full sm:mr-2">
      <AgentAvatar seed={cc} size={28} className="rounded-full" />
    </div>
  )
}
