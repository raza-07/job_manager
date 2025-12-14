import { CheckCircle2, Clock, AlertCircle } from "lucide-react"

interface PaymentBadgeProps {
  status: "verified" | "pending" | "not-verified"
}

export default function PaymentBadge({ status }: PaymentBadgeProps) {
  const config = {
    verified: {
      icon: CheckCircle2,
      styles: "bg-success/10 text-success border border-success/20",
      label: "Verified",
    },
    pending: {
      icon: Clock,
      styles: "bg-warning/10 text-warning border border-warning/20",
      label: "Pending",
    },
    "not-verified": {
      icon: AlertCircle,
      styles: "bg-destructive/10 text-destructive border border-destructive/20",
      label: "Not Verified",
    },
  }

  const { icon: Icon, styles, label } = config[status]

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${styles}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  )
}
