import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { Stepper } from "@/app/(main)/kronologi/_components/Stepper"

describe("Stepper", () => {
  it("renders 4 steps", () => {
    render(<Stepper currentStep="select" onStepClick={() => {}} />)
    expect(screen.getByText("Pilih")).toBeDefined()
    expect(screen.getByText("Proses")).toBeDefined()
    expect(screen.getByText("Review")).toBeDefined()
    expect(screen.getByText("Simpan")).toBeDefined()
  })

  it("highlights current step with aria-current", () => {
    render(<Stepper currentStep="processing" onStepClick={() => {}} />)
    const activeStep = screen.getByRole("button", { name: /Langkah 2.*aktif/ })
    expect(activeStep).toHaveAttribute("aria-current", "step")
  })

  it("allows clicking past steps", () => {
    const handleClick = vi.fn()
    render(<Stepper currentStep="review" onStepClick={handleClick} />)
    screen.getByRole("button", { name: /Langkah 1.*selesai/ }).click()
    expect(handleClick).toHaveBeenCalledWith("select")
  })

  it("disables clicking future steps", () => {
    const handleClick = vi.fn()
    render(<Stepper currentStep="processing" onStepClick={handleClick} />)
    const reviewBtn = screen.getByRole("button", { name: /Langkah 3/ })
    expect(reviewBtn).toBeDisabled()
  })
})
