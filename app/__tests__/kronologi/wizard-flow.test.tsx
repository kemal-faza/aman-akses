import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { WizardProvider } from "@/lib/wizard-context"
import { StepPilih } from "@/app/(main)/kronologi/_components/StepPilih"
import { StepSimpan } from "@/app/(main)/kronologi/_components/StepSimpan"

describe("Wizard integration", () => {
  it("StepPilih renders title and description", () => {
    render(
      <WizardProvider>
        <StepPilih />
      </WizardProvider>,
    )
    expect(screen.getByText("Pilih Catatan")).toBeDefined()
  })

  it("StepSimpan shows summary", () => {
    render(
      <WizardProvider>
        <StepSimpan />
      </WizardProvider>,
    )
    expect(screen.getByText("Ringkasan Kronologi")).toBeDefined()
  })
})
