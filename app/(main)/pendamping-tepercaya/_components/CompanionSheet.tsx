"use client";

import { useState, useEffect, type FormEvent } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  COMPANION_ROLE_LABELS,
  MODULE_ACCESS_LABELS,
  type TrustedContact,
  type CompanionRole,
  type ModuleAccess,
} from "@/lib/companion-types";
import { useCompanion } from "@/lib/companion-context";

const ROLES: CompanionRole[] = ["friend", "sibling", "parent", "partner", "relative", "other"];
const MODULES: ModuleAccess[] = ["journal", "timeline", "evidence"];

interface CompanionSheetProps {
  mode: "add" | "edit";
  contact: TrustedContact | null;
  open: boolean;
  onClose: () => void;
}

export function CompanionSheet({ mode, contact, open, onClose }: CompanionSheetProps) {
  const { addContact, updateContact, deleteContact } = useCompanion();

  const [name, setName] = useState("");
  const [role, setRole] = useState<CompanionRole>("friend");
  const [roleCustom, setRoleCustom] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [permissions, setPermissions] = useState<ModuleAccess[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Populate fields in edit mode
  useEffect(() => {
    if (mode === "edit" && contact) {
      setName(contact.name);
      setRole(contact.role);
      setRoleCustom(contact.roleCustom ?? "");
      setPhone(contact.phone);
      setNotes(contact.notes);
      setPermissions(contact.permissions);
    } else {
      setName("");
      setRole("friend");
      setRoleCustom("");
      setPhone("");
      setNotes("");
      setPermissions([]);
    }
    setErrors({});
  }, [mode, contact, open]);

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = "Nama pendamping wajib diisi.";
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 8) {
      newErrors.phone = "Nomor tidak valid. Masukkan minimal 8 digit.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    const input = {
      name: name.trim(),
      role,
      roleCustom: role === "other" ? roleCustom.trim() : undefined,
      phone: phone.trim(),
      notes: notes.trim(),
      permissions,
    };

    if (mode === "add") {
      addContact(input);
    } else if (contact) {
      updateContact(contact.id, input);
    }

    onClose();
  }

  function handleDelete() {
    if (contact) {
      deleteContact(contact.id);
      onClose();
    }
  }

  function togglePermission(module: ModuleAccess) {
    setPermissions((prev) =>
      prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module]
    );
  }

  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{mode === "add" ? "Tambah Pendamping" : "Edit Pendamping"}</SheetTitle>
          <SheetDescription>
            {mode === "add"
              ? "Tambahkan orang yang kamu percaya sebagai pendamping."
              : "Perbarui data pendamping dan izin akses."}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-6">
          {/* Nama */}
          <div className="space-y-2">
            <Label htmlFor="comp-name">Nama</Label>
            <Input
              id="comp-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              placeholder="Nama pendamping"
              aria-invalid={!!errors.name}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="comp-role">Hubungan / Peran</Label>
            <select
              id="comp-role"
              value={role}
              onChange={(e) => setRole(e.target.value as CompanionRole)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1
                text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1
                focus-visible:ring-ring"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {COMPANION_ROLE_LABELS[r]}
                </option>
              ))}
            </select>
            {role === "other" && (
              <div className="mt-2">
                <Label htmlFor="comp-role-custom">Hubungan Lainnya</Label>
                <Input
                  id="comp-role-custom"
                  value={roleCustom}
                  onChange={(e) => setRoleCustom(e.target.value)}
                  placeholder="Misal: Tetangga, Rekan kerja"
                />
              </div>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="comp-phone">Nomor WA / Telepon</Label>
            <Input
              id="comp-phone"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
              }}
              placeholder="081234567890"
              inputMode="tel"
              aria-invalid={!!errors.phone}
              className={errors.phone ? "border-destructive" : ""}
            />
            {errors.phone && <p className="text-destructive text-sm">{errors.phone}</p>}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="comp-notes">Catatan (opsional)</Label>
            <Input
              id="comp-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan tambahan"
            />
          </div>

          {/* Izin Akses */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Izin Akses Data</Label>
            <p className="text-xs text-muted-foreground -mt-1">
              Modul mana yang boleh diakses oleh pendamping ini.
            </p>
            {MODULES.map((mod) => (
              <div key={mod} className="flex items-center gap-3">
                <Checkbox
                  id={`perm-${mod}`}
                  checked={permissions.includes(mod)}
                  onCheckedChange={() => togglePermission(mod)}
                />
                <Label htmlFor={`perm-${mod}`} className="cursor-pointer font-normal">
                  {MODULE_ACCESS_LABELS[mod]}
                </Label>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 pt-4 border-t border-border">
            <div className="flex gap-3 justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Batal
              </Button>
              <Button type="submit">Simpan</Button>
            </div>
            {mode === "edit" && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="w-full"
              >
                Hapus Pendamping
              </Button>
            )}
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
