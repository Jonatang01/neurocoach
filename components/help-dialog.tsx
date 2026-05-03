"use client"

import { MessageSquare, FileSignature, Calendar, TrendingUp } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useI18n } from "@/lib/i18n"

interface HelpDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  const { t } = useI18n()

  const steps = [
    {
      icon: MessageSquare,
      title: t("helpStep1Title"),
      description: t("helpStep1Desc"),
      color: "bg-blue-500",
    },
    {
      icon: FileSignature,
      title: t("helpStep2Title"),
      description: t("helpStep2Desc"),
      color: "bg-purple-500",
    },
    {
      icon: Calendar,
      title: t("helpStep3Title"),
      description: t("helpStep3Desc"),
      color: "bg-green-500",
    },
    {
      icon: TrendingUp,
      title: t("helpStep4Title"),
      description: t("helpStep4Desc"),
      color: "bg-orange-500",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            {t("howItWorks")}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${step.color}`}>
                <step.icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
