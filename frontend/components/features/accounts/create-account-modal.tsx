"use client"

import type React from "react"
import { useState } from "react"
import { useAppDispatch } from "@/lib/hooks"
import { createAccount } from "@/lib/features/accounts/accountsSlice"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface CreateAccountModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function CreateAccountModal({ isOpen, onClose }: CreateAccountModalProps) {
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { [key: string]: string } = {}

    if (!formData.name.trim()) {
      newErrors.name = "Account name is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await dispatch(createAccount({
        name: formData.name,
        email: formData.email,
      })).unwrap()
      setFormData({ name: "", email: "" })
      setErrors({})
      onClose()
    } catch (error) {
      setErrors({ email: "Failed to create account. Try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({ name: "", email: "" })
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] border-border dark:border-white/20 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <Plus className="w-5 h-5 text-secondary" />
            </div>
            <div>
              <DialogTitle>Create New Account</DialogTitle>
              <DialogDescription>Add a new Upwork account to manage jobs and track opportunities</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2.5">
            <Label htmlFor="account-name" className="text-sm font-semibold">
              Account Name
            </Label>
            <Input
              id="account-name"
              placeholder="e.g., Main Account, Client Work"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value })
                if (errors.name) setErrors({ ...errors, name: "" })
              }}
              className={`${errors.name ? "border-destructive" : "border-border/50"}`}
            />
            {errors.name && <p className="text-xs text-destructive font-medium">{errors.name}</p>}
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="email" className="text-sm font-semibold">
              Upwork Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="you@upwork.com"
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value })
                if (errors.email) setErrors({ ...errors, email: "" })
              }}
              className={`${errors.email ? "border-destructive" : "border-border/50"}`}
            />
            {errors.email && <p className="text-xs text-destructive font-medium">{errors.email}</p>}
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-border/30">
            <Button
              variant="outline"
              onClick={handleClose}
              className="border-border/50 bg-muted/40 hover:bg-muted/60 text-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Plus className="w-4 h-4" />
              {isSubmitting ? "Creating..." : "Create Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
