"use client"

import type { Job } from "@/types"
import { useAppSelector } from "@/lib/hooks"
import JobCard from "./job-card"
import { Card } from "@/components/ui/card"
import { Inbox } from "lucide-react"

interface JobsWithRepliesProps {
  jobs: Job[]
  onJobSaved?: (hasReply: boolean) => void
}

export default function JobsWithReplies({ jobs, onJobSaved }: JobsWithRepliesProps) {
  const { selectedId: selectedAccountId, items: accounts = [] } = useAppSelector((state) => state.accounts ?? { items: [] })
  const accountName = accounts.find((acc) => acc.id === selectedAccountId)?.name

  if (jobs.length === 0) {
    return (
      <Card className="p-12 text-center border-border/50 bg-gradient-to-br from-card to-card/50">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-muted rounded-full">
            <Inbox className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No client replies yet</h3>
        <p className="text-muted-foreground max-w-xs mx-auto">Keep an eye on your inbox—clients might reach out soon</p>
      </Card>
    )
  }

  if (!selectedAccountId) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          showReplyBadge
          accountId={selectedAccountId}
          accountName={accountName}
          onJobSaved={onJobSaved}
        />
      ))}
    </div>
  )
}
