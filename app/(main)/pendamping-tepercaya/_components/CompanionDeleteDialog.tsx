"use client";

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

interface CompanionDeleteDialogProps {
  contactName: string;
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function CompanionDeleteDialog({
  contactName,
  open,
  onConfirm,
  onCancel,
}: CompanionDeleteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Pendamping</AlertDialogTitle>
          <AlertDialogDescription>
            Hapus <strong>{contactName}</strong> dari daftar pendamping? Kontak ini
            tidak akan lagi memiliki akses ke data Anda.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Hapus, Lanjutkan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
