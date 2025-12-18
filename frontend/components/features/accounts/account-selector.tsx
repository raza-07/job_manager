"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { deleteAccount as deleteAccountThunk, selectAccount } from "@/lib/features/accounts/accountsSlice"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Card } from "@/components/ui/card"
import { Mail, Trash2, CheckCircle2, Clock, Briefcase } from "lucide-react"

export default function AccountSelector() {
  const dispatch = useAppDispatch()
  const { items: accounts = [], selectedId: selectedAccountId } = useAppSelector((state) => state.accounts ?? { items: [] })
  const { items: jobs = [] } = useAppSelector((state) => state.jobs ?? { items: [] })
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null)

  const handleAccountChange = (accountId: number) => {
    dispatch(selectAccount(accountId))
  }

  const handleDeleteAccount = async () => {
    if (pendingDeleteId === null) return
    setDeletingId(pendingDeleteId)
    await dispatch(deleteAccountThunk(pendingDeleteId))
    setDeletingId(null)
    setPendingDeleteId(null)
  }

  const selectedAccount = accounts.find((acc) => acc.id === selectedAccountId)
  // Use jobs from the jobs slice which is the source of truth for the selected account
  const jobsWithReplies = jobs.filter((job) => job.hasReply)
  const totalJobs = jobs.length
  const pendingDeleteAccount = accounts.find((acc) => acc.id === pendingDeleteId)
  const hasAccounts = accounts.length > 0
  const currentAccountLabel = selectedAccount
    ? `${selectedAccount.name} (${selectedAccount.email})`
    : hasAccounts
      ? "Select an account to view its jobs"
      : "No accounts. Please create one."

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          Currently viewing:{" "}
          <span className="font-semibold text-foreground">{currentAccountLabel}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-1 p-6">
          <div className="mb-4">
            <h2 className="text-xs font-bold text-muted-foreground mb-4 uppercase tracking-widest">Your Accounts</h2>
            <div className="text-2xl font-bold text-foreground">{accounts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Connected accounts</p>
          </div>

          <div className="space-y-2 mt-6 max-h-[160px] overflow-y-auto pr-2">
            {accounts.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6">No accounts. Please create one.</p>
            ) : (
              accounts.map((account) => {
                const isSelected = selectedAccountId === account.id
                return (
                <div
                  key={account.id}
                  className={`group relative p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? "border-primary/70 bg-primary/10 shadow-md ring-1 ring-primary/40"
                      : "border-border hover:border-primary/40 hover:bg-primary/5"
                  }`}
                  onClick={() => handleAccountChange(account.id)}
                  aria-current={isSelected ? "true" : undefined}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium text-sm line-clamp-1 ${isSelected ? "text-primary font-semibold" : "text-foreground"}`}>
                        {account.name}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                        <Mail className="w-3 h-3" />
                        <span className="line-clamp-1">{account.email}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPendingDeleteId(account.id)
                      }}
                      className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                      disabled={deletingId === account.id}
                      aria-label={`Delete account ${account.name}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )
            })
            )}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-primary/5 via-primary/2 to-transparent border border-primary/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Total Jobs</p>
              <div className="text-3xl font-bold text-primary">{totalJobs}</div>
            </div>
            <div className="p-2 bg-primary/10 rounded-lg">
              <Briefcase className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">in {selectedAccount?.name || "selected account"}</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent/5 via-accent/2 to-transparent border border-accent/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">With Replies</p>
              <div className="text-3xl font-bold text-accent">{jobsWithReplies.length}</div>
            </div>
            <div className="p-2 bg-accent/10 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-accent" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">awaiting action</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-warning/5 via-warning/2 to-transparent border border-warning/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">Without Replies</p>
              <div className="text-3xl font-bold text-warning">{totalJobs - jobsWithReplies.length}</div>
            </div>
            <div className="p-2 bg-warning/10 rounded-lg">
              <Clock className="w-5 h-5 text-warning" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground">pending client response</p>
        </Card>
      </div>
      <AlertDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDeleteId(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete account?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {pendingDeleteAccount?.name || "this account"} and all its jobs?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deletingId !== null}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
