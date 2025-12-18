import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAppSelector } from "@/lib/hooks"
import { User, Mail, Calendar } from "lucide-react"

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileModal({ open, onOpenChange }: ProfileModalProps) {
  const { user } = useAppSelector((state) => state.auth)

  if (!user) return null

  // Helper to generate initials
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-6">
          {/* Avatar / Initials */}
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-3xl font-bold text-primary ring-4 ring-background shadow-xl">
              {initials}
            </div>
            <div className="absolute bottom-0 right-0 rounded-full bg-green-500 p-1.5 ring-4 ring-background">
              <span className="sr-only">Online</span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 text-center">
            <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
            <p className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              Free Plan
            </p>
          </div>

          <div className="w-full space-y-4">
            <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-sm font-medium leading-none text-muted-foreground">
                    Full Name
                  </p>
                  <p className="text-sm font-semibold">{user.name}</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/10 text-violet-500">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-0.5">
                  <p className="text-sm font-medium leading-none text-muted-foreground">
                    Email Address
                  </p>
                  <p className="text-sm font-semibold">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}




