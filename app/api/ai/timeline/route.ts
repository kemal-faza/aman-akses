import { NextRequest, NextResponse } from "next/server"
import { generateMockTimelineResponse } from "@/lib/mock-data"
import type { TimelineRequest } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const body: TimelineRequest = await request.json()

    // Validate request
    if (!body.notes || !Array.isArray(body.notes) || body.notes.length === 0) {
      return NextResponse.json(
        { error: "Minimal 1 catatan diperlukan" },
        { status: 400 },
      )
    }

    // Simulate processing delay (1.5-3 seconds)
    const delay = 1500 + Math.random() * 1500
    await new Promise((resolve) => setTimeout(resolve, delay))

    const response = generateMockTimelineResponse(body)

    return NextResponse.json(response, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: "Gagal memproses permintaan" },
      { status: 500 },
    )
  }
}
