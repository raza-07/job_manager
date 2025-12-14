export interface Job {
  id: number
  clientName: string
  clientCountry: string
  clientRating: number
  jobDescription: string
  paymentVerificationStatus: "verified" | "pending" | "not-verified"
  proposalWriting: string
  attachments: Array<{
    id: string
    name: string
    size: number
    type: string
    data: string
  }>
  hasReply?: boolean
  replyDate?: string
  replyMessage?: string
}

export interface Account {
  id: number
  name: string
  email: string
  jobs: Job[]
}
