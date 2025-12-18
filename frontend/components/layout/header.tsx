"use client"

import { useState } from "react"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { logout as logoutAction } from "@/lib/features/auth/authSlice"
import { ThemeToggle } from "./theme-toggle"
import { Briefcase, Plus, LogOut, User } from "lucide-react"
import { ProfileModal } from "@/components/features/auth/profile-modal"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface HeaderProps {
  onCreateAccount: () => void
  onCreateJob: () => void
}

export default function Header({ onCreateAccount, onCreateJob }: HeaderProps) {
  const dispatch = useAppDispatch()
  const { items: accounts } = useAppSelector((state) => state.accounts)
  const { user } = useAppSelector((state) => state.auth)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logoutAction())
  }

  return (
    <>
      <div className="sticky top-0 z-50 bg-card border-b border-border/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14">
                 <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-bold text-foreground">Upwork Manager</h1>
                <p className="text-xs text-muted-foreground">Manage your freelance jobs</p>
              </div>
            </div>

            {/* Actions Section */}
            <div className="flex items-center gap-2">
              {/* Primary Actions Group */}
              <div className="flex items-center gap-2 mr-2">
                {accounts.length > 0 && (
                  <button
                    onClick={onCreateJob}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Job</span>
                  </button>
                )}
                <button
                  onClick={onCreateAccount}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">New Account</span>
                </button>
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-border/50 mx-1 hidden sm:block" />

              {/* User Actions Group */}
              <div className="flex items-center gap-1">
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <ThemeToggle />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Toggle theme</p>
                    </TooltipContent>
                  </Tooltip>

                  {user && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => setIsProfileOpen(true)}
                          className="p-2.5 text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                        >
                          <User className="w-5 h-5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Profile</p>
                      </TooltipContent>
                    </Tooltip>
                  )}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleLogout}
                        className="p-2.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
                      >
                        <LogOut className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Logout</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProfileModal open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    </>
  )
}
