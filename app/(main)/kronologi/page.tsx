"use client"

import { WizardProvider, useWizard } from "@/lib/wizard-context"
import { Stepper } from "./_components/Stepper"
import { StepPilih } from "./_components/StepPilih"
import { StepProses } from "./_components/StepProses"
import { StepReview } from "./_components/StepReview"
import { StepSimpan } from "./_components/StepSimpan"
import type { WizardStep } from "@/lib/types"

function WizardContent() {
  const { state, dispatch } = useWizard()

  const handleStepClick = (step: WizardStep) => {
    // Only allow going back to select from processing/review
    if (step === "select" && (state.step === "processing" || state.step === "review")) {
      dispatch({ type: "GO_BACK", targetStep: "select" })
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-title-lg sm:text-display-md font-bold text-foreground">
        Kronologi Kejadian
      </h1>

      <Stepper currentStep={state.step} onStepClick={handleStepClick} />

      <div className="min-h-[400px]">
        {state.step === "select" && <StepPilih />}
        {state.step === "processing" && <StepProses />}
        {state.step === "review" && <StepReview />}
        {state.step === "done" && <StepSimpan />}
      </div>
    </div>
  )
}

export default function KronologiPage() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  )
}
