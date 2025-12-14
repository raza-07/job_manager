"use client"

import React, { useState, useEffect } from "react"
import { useAppDispatch } from "@/lib/hooks"
import { updateJob as updateJobThunk } from "@/lib/features/jobs/jobsSlice"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Combobox } from "@/components/ui/combobox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit3, X, UploadCloud, FileText, Eye } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import FileViewerModal from "../../shared/file-viewer-modal"
import RatingStars from "../../shared/rating-stars"
import { toast } from "sonner"

interface EditJobModalProps {
  isOpen: boolean
  onClose: () => void
  accountId: number
  job: Job | null
  onJobSaved?: (hasReply: boolean) => void
}

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany", 
  "France", "India", "Pakistan", "Philippines", "Ukraine", 
  "Bangladesh", "Russia", "Brazil", "Egypt", "China", 
  "Spain", "Italy", "Netherlands", "Poland", "Sweden",
  "United Arab Emirates", "Saudi Arabia", "South Africa", "Japan", "South Korea"
].sort()

export default function EditJobModal({ isOpen, onClose, accountId, job, onJobSaved }: EditJobModalProps) {
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState({
    clientName: "",
    clientCountry: "",
    clientRating: "0",
    jobDescription: "",
    paymentVerificationStatus: "verified" as "verified" | "pending" | "not-verified",
    proposalWriting: "",
    attachments: [] as Array<{ id: string; name: string; size: number; type: string; data: string }>,
    hasReply: false,
    replyDate: "",
    replyMessage: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [activeTab, setActiveTab] = useState("details")
  const [viewFile, setViewFile] = useState<{ id: string; name: string; size: number; type: string; data: string } | null>(
    null,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (job && isOpen) {
      setFormData({
        clientName: job.clientName,
        clientCountry: job.clientCountry,
        clientRating: job.clientRating.toString(),
        jobDescription: job.jobDescription,
        paymentVerificationStatus: job.paymentVerificationStatus,
        proposalWriting: job.proposalWriting,
        attachments: job.attachments || [],
        hasReply: job.hasReply || false,
        replyDate: job.replyDate || "",
        replyMessage: job.replyMessage || "",
      })
      setErrors({})
      setActiveTab("reply")
    }
  }, [job, isOpen])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files
    if (!files) return

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      const reader = new FileReader()

      reader.onload = (event) => {
        if (event.target?.result) {
          const newAttachment = {
            id: Date.now().toString() + i,
            name: file.name,
            size: file.size,
            type: file.type,
            data: event.target.result as string,
          }
          setFormData((prev) => ({
            ...prev,
            attachments: [...prev.attachments, newAttachment],
          }))
        }
      }
      reader.readAsDataURL(file)
    }
    e.currentTarget.value = ""
  }

  const removeAttachment = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((att) => att.id !== id),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: { [key: string]: string } = {}

    if (!formData.clientName.trim()) newErrors.clientName = "Client name is required"
    if (!formData.clientCountry.trim()) newErrors.clientCountry = "Country is required"
    if (!formData.jobDescription.trim()) newErrors.jobDescription = "Job description is required"
    if (!formData.proposalWriting.trim()) newErrors.proposalWriting = "Proposal status is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      if (newErrors.clientName || newErrors.clientCountry || newErrors.jobDescription) {
        setActiveTab("details")
      } else if (newErrors.proposalWriting) {
        setActiveTab("proposal")
      }
      toast.error("Please fill in all required fields", {
        description: "Check the form for errors."
      })
      return
    }

    if (!job) return

    setIsSubmitting(true)
    const updatedJob = {
      clientName: formData.clientName,
      clientCountry: formData.clientCountry,
      clientRating: Number.parseFloat(formData.clientRating),
      jobDescription: formData.jobDescription,
      paymentVerificationStatus: formData.paymentVerificationStatus,
      proposalWriting: formData.proposalWriting,
      attachments: formData.attachments,
      hasReply: formData.hasReply,
      replyDate: formData.hasReply && formData.replyDate ? formData.replyDate : undefined,
      replyMessage: formData.hasReply && formData.replyMessage ? formData.replyMessage : undefined,
    }

    try {
        await dispatch(updateJobThunk({ accountId, jobId: job.id, job: updatedJob })).unwrap()
        toast.success("Job updated successfully")
        onJobSaved?.(formData.hasReply)
        handleClose()
    } catch (error) {
        console.error(error)
        toast.error("Failed to update job")
    } finally {
        setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    // Reset form or just close? Usually safer to just close and let useEffect reset on open
    setErrors({})
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-hidden border-border dark:border-white/20 shadow-2xl flex flex-col p-0 gap-0">
        <div className="p-6 pb-2">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/15 rounded-lg">
              <Edit3 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle>Edit Job Details</DialogTitle>
                <DialogDescription>
                  Update client information, proposal status, and replies
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
            <div className="px-6 border-b border-border/40">
              <TabsList className="grid w-full grid-cols-3 bg-muted/50">
                <TabsTrigger value="details">Client & Job</TabsTrigger>
                <TabsTrigger value="proposal">Proposal & Files</TabsTrigger>
                <TabsTrigger value="reply">Client Reply</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <TabsContent value="details" className="mt-0 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                    <Label htmlFor="client-name">Client Name *</Label>
                <Input
                  id="client-name"
                  placeholder="Tech Startup Inc"
                  value={formData.clientName}
                  onChange={(e) => {
                    setFormData({ ...formData, clientName: e.target.value })
                    if (errors.clientName) setErrors({ ...errors, clientName: "" })
                  }}
                      className={errors.clientName ? "border-destructive" : ""}
                />
                {errors.clientName && <p className="text-xs text-destructive">{errors.clientName}</p>}
              </div>
              <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Combobox
                      items={COUNTRIES.map(c => ({ label: c, value: c }))}
                      value={formData.clientCountry}
                      onChange={(value) => {
                        setFormData({ ...formData, clientCountry: value })
                        if (errors.clientCountry) setErrors({ ...errors, clientCountry: "" })
                      }}
                      placeholder="Select or type country"
                      className={errors.clientCountry ? "border-destructive" : ""}
                    />
                {errors.clientCountry && <p className="text-xs text-destructive">{errors.clientCountry}</p>}
              </div>
            </div>

                <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                    <Label>Client Rating</Label>
                    <div className="pt-2">
                      <RatingStars 
                        rating={parseFloat(formData.clientRating)} 
                        onChange={(val) => setFormData({ ...formData, clientRating: val.toString() })}
                        interactive
                      />
                    </div>
            </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="payment">Payment Verification</Label>
                    <Select
                      value={formData.paymentVerificationStatus}
                      onValueChange={(value: any) => setFormData({ ...formData, paymentVerificationStatus: value })}
                    >
                      <SelectTrigger id="payment">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="verified">✓ Verified</SelectItem>
                        <SelectItem value="pending">⏳ Pending</SelectItem>
                        <SelectItem value="not-verified">✗ Not Verified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
          </div>

            <div className="space-y-2">
                  <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the job scope, requirements, and deliverables..."
                value={formData.jobDescription}
                onChange={(e) => {
                  setFormData({ ...formData, jobDescription: e.target.value })
                  if (errors.jobDescription) setErrors({ ...errors, jobDescription: "" })
                }}
                    className={`min-h-[120px] resize-none ${errors.jobDescription ? "border-destructive" : ""}`}
              />
              {errors.jobDescription && <p className="text-xs text-destructive">{errors.jobDescription}</p>}
            </div>
              </TabsContent>

              <TabsContent value="proposal" className="mt-0 space-y-6">
            <div className="space-y-2">
                  <Label htmlFor="proposal">Proposal Content *</Label>
              <Textarea
                id="proposal"
                    placeholder="Paste your proposal content here..."
                value={formData.proposalWriting}
                onChange={(e) => {
                  setFormData({ ...formData, proposalWriting: e.target.value })
                  if (errors.proposalWriting) setErrors({ ...errors, proposalWriting: "" })
                }}
                    className={`min-h-[200px] resize-none font-mono text-sm ${errors.proposalWriting ? "border-destructive" : ""}`}
              />
              {errors.proposalWriting && <p className="text-xs text-destructive">{errors.proposalWriting}</p>}
            </div>

            <div className="space-y-3">
                  <Label>Attachments</Label>
                  <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer relative group">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="flex flex-col items-center gap-2">
                      <div className="p-3 bg-muted rounded-full group-hover:bg-background transition-colors">
                        <UploadCloud className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                        <p className="text-xs text-muted-foreground">PDF, images, documents (max 10MB)</p>
                      </div>
                </div>
              </div>

              {formData.attachments.length > 0 && (
                    <div className="grid grid-cols-1 gap-2 mt-4">
                    {formData.attachments.map((file) => (
                      <div
                        key={file.id}
                          className="flex items-center justify-between p-3 bg-card border rounded-lg shadow-sm"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="p-2 bg-primary/10 rounded">
                              <FileText className="w-4 h-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate cursor-pointer hover:underline" onClick={() => setViewFile(file)}>{file.name}</p>
                            <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                          </div>
                        </div>
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => setViewFile(file)}
                              className="text-muted-foreground hover:text-primary h-8 w-8"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                        <Button
                          type="button"
                          variant="ghost"
                              size="icon"
                          onClick={() => removeAttachment(file.id)}
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                          </div>
                      </div>
                    ))}
                  </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reply" className="mt-0 space-y-6">
                <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-lg border border-secondary/20">
                  <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="has-reply"
                checked={formData.hasReply}
                onChange={(e) => setFormData({ ...formData, hasReply: e.target.checked })}
                      className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
              />
                  </div>
                  <Label htmlFor="has-reply" className="text-base font-medium cursor-pointer">
                    Client has replied to this proposal
              </Label>
            </div>

            {formData.hasReply && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="space-y-2">
                      <Label htmlFor="reply-date">Reply Date</Label>
                  <Input
                    id="reply-date"
                    type="date"
                    value={formData.replyDate}
                    onChange={(e) => setFormData({ ...formData, replyDate: e.target.value })}
                        className="w-full sm:w-1/2"
                  />
                </div>

                <div className="space-y-2">
                      <Label htmlFor="reply-message">Client's Message</Label>
                  <Textarea
                    id="reply-message"
                    placeholder="What did the client say?"
                    value={formData.replyMessage}
                    onChange={(e) => setFormData({ ...formData, replyMessage: e.target.value })}
                        className="min-h-[150px] resize-none"
                  />
                </div>
                  </div>
                )}
                
                {!formData.hasReply && (
                  <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <div className="p-4 bg-muted/50 rounded-full mb-4">
                      <FileText className="w-8 h-8 opacity-50" />
                    </div>
                    <p>Enable the checkbox above if you received a reply.</p>
                  </div>
                )}
              </TabsContent>
          </div>

            <div className="p-6 border-t border-border/40 bg-muted/10 flex justify-end gap-3">
            <Button
                type="button"
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px]">
              <Edit3 className="w-4 h-4" />
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
          </Tabs>
        </form>
      </DialogContent>
      <FileViewerModal isOpen={!!viewFile} onClose={() => setViewFile(null)} file={viewFile} />
    </Dialog>
  )
}
