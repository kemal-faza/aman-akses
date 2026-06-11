"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TimelineCard } from "./TimelineCard"
import { useWizard } from "@/lib/wizard-context"
import { AlertTriangle } from "lucide-react"

export function StepReview() {
  const { state, dispatch } = useWizard()

  const allResolved = Object.values(state.cardStates).every(
    (c) => c.status === "accepted" || c.status === "rejected",
  )

  const acceptedCount = Object.values(state.cardStates).filter(
    (c) => c.status === "accepted",
  ).length
  const rejectedCount = Object.values(state.cardStates).filter(
    (c) => c.status === "rejected",
  ).length

  return (
    <div className="space-y-8">
      {/* AI Summary */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm text-muted-foreground font-medium mb-2">
            Ringkasan AI
          </h3>
          <p className="text-sm">{state.summary}</p>
        </CardContent>
      </Card>

      {/* AI Warnings */}
      {state.aiWarnings.length > 0 && (
        <Alert variant="warning">
          <AlertTriangle className="size-4" />
          <AlertDescription>
            <ul className="list-disc pl-4 space-y-1">
              {state.aiWarnings.map((warning, i) => (
                <li key={i}>{warning}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* Timeline Items */}
      <div>
        <h2 className="text-title-md font-semibold mb-4">
          Kronologi ({state.timeline.length} item)
        </h2>

        <div className="space-y-4">
          {state.timeline.map((item) => {
            const cardState = state.cardStates[item.id]
            const status = cardState?.status ?? "draft"
            return (
              <TimelineCard
                key={item.id}
                item={item}
                status={status}
                editedData={cardState?.editedData ?? null}
                onAccept={(id) => dispatch({ type: "ACCEPT_ITEM", itemId: id })}
                onReject={(id) => dispatch({ type: "REJECT_ITEM", itemId: id })}
                onEdit={(id) => dispatch({ type: "START_EDIT", itemId: id })}
                onUndo={(id) => dispatch({ type: "UNDO_ITEM", itemId: id })}
                onSaveEdit={(id, data) =>
                  dispatch({ type: "SAVE_EDIT", itemId: id, data })
                }
                onCancelEdit={(id) =>
                  dispatch({ type: "CANCEL_EDIT", itemId: id })
                }
              />
            )
          })}
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-between items-center pt-4 border-t border-border">
        <p className="text-sm text-muted-foreground">
          {acceptedCount} diterima, {rejectedCount} ditolak
        </p>
        <Button
          size="xl"
          disabled={!allResolved}
          onClick={() => dispatch({ type: "SAVE_DONE" })}
          title={
            allResolved
              ? "Simpan kronologi"
              : "Review semua item terlebih dahulu"
          }
        >
          Simpan Kronologi
        </Button>
      </div>
    </div>
  )
}
