"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function EmergencyCard() {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <section
        className="flex flex-col items-start gap-4 rounded-xl border-2 border-emergency bg-red-50 p-8 sm:flex-row sm:items-center sm:justify-between"
        aria-labelledby="emergency-heading"
      >
        <div>
          <h2 id="emergency-heading" className="text-title-md font-semibold text-foreground">
            Butuh bantuan segera?
          </h2>
          <p className="mt-1 text-body-sm text-muted-foreground">
            Anda tidak sendirian. Bantuan selalu tersedia.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <a
            href="#"
            className="text-sm font-medium text-emergency hover:underline"
          >
            Lihat layanan darurat lainnya
          </a>
          <button
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center rounded-lg bg-emergency px-7 py-3 text-sm font-semibold text-white hover:bg-emergency-hover focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
          >
            Telepon Darurat 112
          </button>
        </div>
      </section>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hubungi darurat?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda akan menghubungi layanan darurat 112. Pastikan Anda berada dalam situasi yang aman untuk menelepon.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-emergency hover:bg-emergency-hover"
              onClick={() => {
                window.location.href = "tel:112";
              }}
            >
              Ya, Hubungi 112
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
