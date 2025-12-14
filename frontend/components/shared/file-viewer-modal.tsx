"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface FileViewerModalProps {
  isOpen: boolean
  onClose: () => void
  file: {
    id: string
    name: string
    size: number
    type: string
    data: string
  } | null
}

export default function FileViewerModal({ isOpen, onClose, file }: FileViewerModalProps) {
  if (!file) return null

  const downloadFile = () => {
    const element = document.createElement("a")
    element.setAttribute("href", file.data)
    element.setAttribute("download", file.name)
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const isImage = file.type.startsWith("image/")
  const isPdf = file.type === "application/pdf"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] border-border/50">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{file.name}</DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            {formatFileSize(file.size)} • {file.type}
          </p>
        </DialogHeader>

        <div className="min-h-[400px] bg-muted/30 rounded-lg flex items-center justify-center p-6">
          {isImage ? (
            <img
              src={file.data || "/placeholder.svg"}
              alt={file.name}
              className="max-w-full max-h-[400px] rounded-lg"
            />
          ) : isPdf ? (
            <embed src={file.data} type="application/pdf" className="w-full h-[400px] rounded-lg" />
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Preview not available for this file type</p>
              <p className="text-sm text-muted-foreground mb-6">{file.name}</p>
              <Button onClick={downloadFile} className="gap-2 bg-primary hover:bg-primary/90">
                <Download className="w-4 h-4" />
                Download File
              </Button>
            </div>
          )}
        </div>

        <div className="flex gap-2 justify-end pt-4 border-t border-border/30">
          <Button variant="outline" onClick={onClose} className="border-border/50 bg-muted/40 hover:bg-muted/60">
            Close
          </Button>
          <Button onClick={downloadFile} className="gap-2 bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
