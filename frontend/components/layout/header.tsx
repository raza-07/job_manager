"use client"

import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { logout as logoutAction } from "@/lib/features/auth/authSlice"
import { ThemeToggle } from "./theme-toggle"
import { Briefcase, Plus, LogOut } from "lucide-react"

interface HeaderProps {
  onCreateAccount: () => void
  onCreateJob: () => void
}

export default function Header({ onCreateAccount, onCreateJob }: HeaderProps) {
  const dispatch = useAppDispatch()
  const { items: accounts } = useAppSelector((state) => state.accounts)

  const handleLogout = () => {
    dispatch(logoutAction())
    // Router push will handle redirect in Dashboard or LoginScreen effect
  }

  return (
    <div className="sticky top-0 z-50 bg-card border-b border-border/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-sm">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-foreground">Upwork Manager</h1>
              <p className="text-xs text-muted-foreground">Manage your freelance jobs</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className="p-2.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <button
              onClick={onCreateAccount}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Account</span>
            </button>
            {accounts.length > 0 && (
              <button
                onClick={onCreateJob}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Job</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
