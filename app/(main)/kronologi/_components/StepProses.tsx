"use client"

import { useEffect, useRef, useState } from "react"
import { useWizard } from "@/lib/wizard-context"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle } from "lucide-react"
import type { TimelineRequest, TimelineResponse } from "@/lib/types"

export function StepProses() {
  const { state, dispatch } = useWizard()
  const [isTimeout, setIsTimeout] = useState(false)
  const calledRef = useRef(false)

  useEffect(() => {
    if (calledRef.current) return
    calledRef.current = true

    const abortController = new AbortController()
    const timeoutId = setTimeout(() => {
      setIsTimeout(true)
    }, 10000)

    const requestBody: TimelineRequest = {
      notes: state.selectedNoteIds.map((id) => ({
        id,
        date: "",
        title: "",
        content: "",
        tags: [],
      })),
    }

    fetch("/api/ai/timeline", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
      signal: abortController.signal,
    })
      .then(async (res) => {
        clearTimeout(timeoutId)
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || "Gagal memproses permintaan")
        }
        return res.json() as Promise<TimelineResponse>
      })
      .then((data) => {
        dispatch({ type: "PROCESSING_SUCCESS", response: data })
      })
      .catch((err) => {
        if (err instanceof DOMException && err.name === "AbortError") return
        clearTimeout(timeoutId)
        dispatch({
          type: "PROCESSING_ERROR",
          error: err instanceof Error ? err.message : "Terjadi kesalahan",
        })
      })

    return () => {
      clearTimeout(timeoutId)
      abortController.abort()
    }
    // Only fetch once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRetry = () => {
    dispatch({ type: "GO_BACK", targetStep: "select" })
  }

  const handleGoBack = () => {
    dispatch({ type: "GO_BACK", targetStep: "select" })
  }

  if (state.error) {
    return (
      <div className="space-y-6 max-w-lg mx-auto">
        <div className="text-center">
          <h2 className="text-title-md font-semibold text-destructive">
            Gagal Memproses
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Terjadi kendala saat menyusun kronologi
          </p>
        </div>

        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={handleRetry}>
            Coba Lagi
          </Button>
          <Button variant="ghost" onClick={handleGoBack}>
            Kembali
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-lg mx-auto" aria-busy="true">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div
            className="size-12 rounded-full border-4 border-primary border-t-transparent animate-spin"
            role="status"
            aria-label="Memproses kronologi"
          />
        </div>
        <h2 className="text-title-md font-semibold">Menyusun Kronologi</h2>
        <p className="text-sm text-muted-foreground">
          AI sedang menyusun kronologi dari catatan yang Anda pilih...
        </p>
      </div>

      {/* Loading skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {isTimeout && (
        <p className="text-sm text-muted-foreground text-center">
          Masih memproses, harap tunggu...
        </p>
      )}
    </div>
  )
}
