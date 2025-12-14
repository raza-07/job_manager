"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { fetchAccounts } from "@/lib/features/accounts/accountsSlice"
import { fetchJobs } from "@/lib/features/jobs/jobsSlice"
import LoginScreen from "../auth/login-screen"
import AccountSelector from "../accounts/account-selector"
import JobsWithReplies from "../jobs/jobs-with-replies"
import AllJobsView from "../jobs/all-jobs-view"
import Header from "../../layout/header"
import CreateAccountModal from "../accounts/create-account-modal"
import CreateJobModal from "../jobs/create-job-modal"
import { Skeleton } from "@/components/ui/skeleton"
import { Inbox, FileText } from "lucide-react"

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Header Skeleton */}
      <div className="border-b bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
            <div className="flex items-center gap-2">
                <Skeleton className="w-8 h-8 rounded-lg" />
                <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-9 w-24 rounded-md" />
                <Skeleton className="h-9 w-24 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-full" />
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col gap-8">
            {/* Account Selector Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-[180px] rounded-xl" />
                ))}
            </div>

            <div className="space-y-4">
                {/* Tabs Skeleton */}
                <div className="flex gap-4 border-b border-border/50 pb-2">
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-8 w-24" />
                </div>

                {/* Job Cards Skeleton */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-[280px] rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const dispatch = useAppDispatch()
  const { user, isLoading: authLoading, isInitialized } = useAppSelector((state) => state.auth)
  const { items: jobs = [], isLoading: jobsLoading } = useAppSelector((state) => state.jobs ?? { items: [], isLoading: false })
  const { selectedId: selectedAccountId, isLoading: accountsLoading } = useAppSelector((state) => state.accounts)
  const userId = user?.id
  const isLoading = authLoading || jobsLoading || accountsLoading

  const router = useRouter()
  const [activeTab, setActiveTab] = useState("replies")
  const [showCreateAccount, setShowCreateAccount] = useState(false)
  const [showCreateJob, setShowCreateJob] = useState(false)

  const jobsWithReplies = Array.isArray(jobs) ? jobs.filter((job) => job.hasReply) : []
  const handleJobSaved = (hasReply: boolean) => {
    setActiveTab(hasReply ? "replies" : "all")
  }

  useEffect(() => {
      if (userId) {
          dispatch(fetchAccounts())
      }
  }, [userId, dispatch])

  useEffect(() => {
      if (selectedAccountId) {
          dispatch(fetchJobs(selectedAccountId))
      }
  }, [selectedAccountId, dispatch])

  useEffect(() => {
      if (isInitialized && !authLoading && !userId) {
          router.replace('/login')
      }
  }, [isInitialized, authLoading, userId, router])

  if (!isInitialized) {
      return null // Or a minimal full-page loader if preferred, but null prevents flash
  }

  if (isLoading) {
    return <DashboardSkeleton />
  }

  if (!userId) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <Header onCreateAccount={() => setShowCreateAccount(true)} onCreateJob={() => setShowCreateJob(true)} />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex flex-col gap-8">
          <AccountSelector />

          <div className="space-y-4">
            <div className="flex gap-1 border-b border-border/50">
              <button
                onClick={() => setActiveTab("replies")}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all relative group ${
                  activeTab === "replies" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Inbox className="w-4 h-4" />
                Replies ({jobsWithReplies.length})
                {activeTab === "replies" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent"></div>
                )}
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all relative group ${
                  activeTab === "all" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="w-4 h-4" />
                All Jobs ({jobs.length})
                {activeTab === "all" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent"></div>
                )}
              </button>
            </div>

            {activeTab === "replies" ? (
              <JobsWithReplies jobs={jobsWithReplies} onJobSaved={handleJobSaved} />
            ) : (
              <AllJobsView jobs={jobs} onJobSaved={handleJobSaved} />
            )}
          </div>
        </div>
      </div>

      <CreateAccountModal isOpen={showCreateAccount} onClose={() => setShowCreateAccount(false)} />
      <CreateJobModal
        isOpen={showCreateJob}
        onClose={() => setShowCreateJob(false)}
        accountId={selectedAccountId}
        onJobSaved={handleJobSaved}
      />
    </div>
  )
}
