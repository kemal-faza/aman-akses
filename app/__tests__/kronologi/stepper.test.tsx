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

  it("highlights current step with primary color", () => {
    render(<Stepper currentStep="processing" onStepClick={() => {}} />)
    const prosesStep = screen.getByText("Proses")
    expect(prosesStep.className).toContain("text-primary")
  })

  it("allows clicking past steps", () => {
    const handleClick = vi.fn()
    render(<Stepper currentStep="review" onStepClick={handleClick} />)
    screen.getByText("Pilih").click()
    expect(handleClick).toHaveBeenCalledWith("select")
  })

  it("disables clicking future steps", () => {
    const handleClick = vi.fn()
    render(<Stepper currentStep="processing" onStepClick={handleClick} />)
    screen.getByText("Review").click()
    expect(handleClick).not.toHaveBeenCalled()
  })
})
