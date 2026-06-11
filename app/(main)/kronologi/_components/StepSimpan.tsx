"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useWizard } from "@/lib/wizard-context"
import { CheckCircle } from "lucide-react"

export function StepSimpan() {
  const { state } = useWizard()

  const acceptedCount = Object.values(state.cardStates).filter(
    (c) => c.status === "accepted",
  ).length
  const rejectedCount = Object.values(state.cardStates).filter(
    (c) => c.status === "rejected",
  ).length

  return (
    <div className="space-y-6 max-w-lg mx-auto text-center">
      <div className="flex justify-center">
        <CheckCircle className="size-16 text-success" />
      </div>

      <div>
        <h2 className="text-title-md font-semibold">
          Kronologi Tersimpan
        </h2>
        <p className="text-sm text-muted-foreground mt-2">
          Kronologi Anda telah disimpan dan siap digunakan untuk laporan awal
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 text-center space-y-2">
          <h3 className="text-sm text-muted-foreground font-medium">
            Ringkasan Kronologi
          </h3>
          <p className="text-sm">
            <span className="font-semibold text-success">{acceptedCount} item</span>{" "}
            diterima dari kronologi
            {rejectedCount > 0 && (
              <>
                ,{" "}
                <span className="font-semibold text-muted-foreground">
                  {rejectedCount} item
                </span>{" "}
                ditolak
              </>
            )}
          </p>
          <p className="text-sm text-muted-foreground">
            Total {state.timeline.length} item dalam kronologi
          </p>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">
        Gunakan kronologi ini untuk menyusun laporan awal di halaman{" "}
        <span className="text-primary-text font-medium">Laporan Awal</span>
      </p>
    </div>
  )
}
