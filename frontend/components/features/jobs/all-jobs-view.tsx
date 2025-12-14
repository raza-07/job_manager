"use client"

import type { Job } from "@/types"
import { useAppSelector } from "@/lib/hooks"
import JobCard from "./job-card"
import { Card } from "@/components/ui/card"
import { Briefcase } from "lucide-react"

interface AllJobsViewProps {
  jobs: Job[]
  onJobSaved?: (hasReply: boolean) => void
}

export default function AllJobsView({ jobs, onJobSaved }: AllJobsViewProps) {
  const { selectedId: selectedAccountId, items: accounts = [] } = useAppSelector((state) => state.accounts ?? { items: [] })
  const accountName = accounts.find((acc) => acc.id === selectedAccountId)?.name

  if (jobs.length === 0) {
    return (
      <Card className="p-12 text-center border-border/50 bg-gradient-to-br from-card to-card/50">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-muted rounded-full">
            <Briefcase className="w-8 h-8 text-muted-foreground" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No jobs yet</h3>
        <p className="text-muted-foreground max-w-xs mx-auto">Create your first job to start tracking opportunities</p>
      </Card>
    )
  }

  if (!selectedAccountId) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} accountId={selectedAccountId} accountName={accountName} onJobSaved={onJobSaved} />
      ))}
    </div>
  )
}
