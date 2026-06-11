"use client"

import type { WizardStep } from "@/lib/types"
import { cn } from "@/lib/utils"

const steps: { key: WizardStep; label: string }[] = [
  { key: "select", label: "Pilih" },
  { key: "processing", label: "Proses" },
  { key: "review", label: "Review" },
  { key: "done", label: "Simpan" },
]

const stepOrder: WizardStep[] = ["select", "processing", "review", "done"]

interface StepperProps {
  currentStep: WizardStep
  onStepClick: (step: WizardStep) => void
}

export function Stepper({ currentStep, onStepClick }: StepperProps) {
  const currentIndex = stepOrder.indexOf(currentStep)

  return (
    <nav aria-label="Langkah wizard" className="flex items-center justify-center gap-0">
      {steps.map((step, index) => {
        const isActive = step.key === currentStep
        const isPast = index < currentIndex
        const isFuture = index > currentIndex
        const isClickable = isPast

        return (
          <div key={step.key} className="flex items-center">
            {/* Step circle + label */}
            <button
              type="button"
              disabled={!isClickable && !isActive}
              onClick={() => isClickable && onStepClick(step.key)}
              className={cn(
                "flex items-center gap-2 px-2 py-1 rounded-md transition-colors",
                "focus-visible:outline-2 focus-visible:outline-ring",
                isClickable && "cursor-pointer hover:bg-muted/50",
                !isClickable && !isActive && "cursor-default",
              )}
              aria-current={isActive ? "step" : undefined}
              aria-label={`Langkah ${index + 1}: ${step.label}${isActive ? " (aktif)" : isPast ? " (selesai)" : ""}`}
            >
              {/* Circle */}
              <span
                className={cn(
                  "flex items-center justify-center size-8 rounded-full text-sm font-medium border-2 transition-colors",
                  isActive && "border-primary bg-primary text-primary-foreground",
                  isPast && "border-primary bg-primary text-primary-foreground",
                  isFuture && "border-muted text-muted-foreground",
                )}
              >
                {isPast ? (
                  <svg
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-caption">{index + 1}</span>
                )}
              </span>

              {/* Label (hidden on mobile) */}
              <span
                className={cn(
                  "hidden sm:inline text-sm font-medium",
                  isActive && "text-primary",
                  isPast && "text-muted-foreground",
                  isFuture && "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </button>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "w-8 sm:w-12 h-0.5 -mx-1",
                  index < currentIndex ? "bg-primary" : "bg-muted",
                )}
                aria-hidden="true"
              />
            )}
          </div>
        )
      })}
    </nav>
  )
}
