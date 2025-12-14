"use client"

import type { Job } from "@/types"
import { useState } from "react"
import { useAppDispatch } from "@/lib/hooks"
import { deleteJob as deleteJobThunk } from "@/lib/features/jobs/jobsSlice"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import PaymentBadge from "../../shared/payment-badge"
import RatingStars from "../../shared/rating-stars"
import EditJobModal from "./edit-job-modal"
import FileViewerModal from "../../shared/file-viewer-modal"
import { Trash2, Edit3, FileCheck, MessageCircle, MapPin, Paperclip } from "lucide-react"
import { toast } from "sonner"

interface JobCardProps {
  job: Job
  showReplyBadge?: boolean
  accountId: number
  accountName?: string
  onJobSaved?: (hasReply: boolean) => void
}

export default function JobCard({ job, showReplyBadge, accountId, accountName, onJobSaved }: JobCardProps) {
  const dispatch = useAppDispatch()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<any>(null)
  const [isFileViewerOpen, setIsFileViewerOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await dispatch(deleteJobThunk({ accountId, jobId: job.id })).unwrap()
      toast.success("Job deleted successfully")
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast.error("Failed to delete job")
    } finally {
      setIsDeleting(false)
    }
  }

  const openFileViewer = (file: any) => {
    setSelectedFile(file)
    setIsFileViewerOpen(true)
  }

  return (
    <>
      <Card 
        className={`overflow-hidden border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 bg-gradient-to-br from-card to-card/50 flex flex-col h-full group ${
          job.hasReply ? "border-success/40 ring-1 ring-success/10" : ""
        }`}
      >
        <div className="p-6 space-y-4 flex-1">
          {/* Header with Client Info and Reply Badge */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground line-clamp-2 text-base">{job.clientName}</h3>
                {showReplyBadge && job.hasReply && (
                  /* Updated reply badge with green accent color */
                  <div className="flex items-center gap-1 px-2 py-1 bg-success/15 text-success rounded-full text-xs font-semibold whitespace-nowrap animate-pulse">
                    <MessageCircle className="w-3 h-3" />
                    Reply
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {job.clientCountry}
                </div>
                <RatingStars rating={job.clientRating} />
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <p className="text-sm text-card-foreground line-clamp-3 leading-relaxed">{job.jobDescription}</p>
          </div>

          {/* Payment Status Badge */}
          <div className="flex items-center gap-2 pt-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <FileCheck className="w-3.5 h-3.5" />
              Payment:
            </div>
            <PaymentBadge status={job.paymentVerificationStatus} />
          </div>

          {/* Proposal Content - styled subtly */}
          <div className="bg-muted/20 border border-border/40 rounded-lg p-3 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Proposal Content
            </p>
            <p className="text-sm text-foreground line-clamp-2">{job.proposalWriting}</p>
          </div>

          {/* Attachments */}
          {job.attachments && job.attachments.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <Paperclip className="w-3.5 h-3.5" />
                {job.attachments.length} file{job.attachments.length !== 1 ? "s" : ""}
              </p>
              <div className="space-y-2">
                {job.attachments.map((file: any) => (
                  <button
                    key={file.id}
                    onClick={() => openFileViewer(file)}
                    className="w-full text-left flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-primary/10 border border-border/50 hover:border-primary/30 transition-all group/file"
                  >
                    <Paperclip className="w-4 h-4 text-muted-foreground group-hover/file:text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate group-hover/file:text-primary transition-colors">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Client Reply Message */}
          {job.hasReply && job.replyMessage && (
            /* Updated client message styling with green accent */
            <div className="border-l-4 border-success bg-success/8 rounded-r-lg p-4 space-y-2">
              <p className="text-xs font-bold text-success uppercase tracking-wide">Client Message</p>
              <p className="text-sm text-foreground leading-relaxed line-clamp-3">{job.replyMessage}</p>
              {job.replyDate && (
                <p className="text-xs text-muted-foreground pt-1">
                  {new Date(job.replyDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t border-border/50 flex gap-2 bg-gradient-to-r from-transparent via-card/50 to-transparent">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            className="flex-1 text-primary hover:text-primary hover:bg-primary/5 border-primary/20 gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isDeleting}
            className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/5 gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </Card>

      <FileViewerModal isOpen={isFileViewerOpen} onClose={() => setIsFileViewerOpen(false)} file={selectedFile} />

      <EditJobModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        accountId={accountId}
        job={job}
        onJobSaved={onJobSaved}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete job?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this job{accountName ? ` from ${accountName}` : ""}? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
