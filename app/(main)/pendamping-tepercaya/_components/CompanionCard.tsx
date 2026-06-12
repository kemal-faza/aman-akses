"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANION_ROLE_LABELS, MODULE_ACCESS_LABELS, type TrustedContact } from "@/lib/companion-types";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getRoleColor(role: string): string {
  const colors: Record<string, string> = {
    friend: "bg-badge-teal",
    sibling: "bg-badge-violet",
    parent: "bg-badge-orange",
    partner: "bg-badge-pink",
    relative: "bg-badge-blue",
    other: "bg-badge-emerald",
  };
  return colors[role] ?? "bg-muted";
}

function getWhatsAppUrl(phone: string): string {
  const cleaned = phone.replace(/^0/, "62").replace(/[^0-9]/g, "");
  return `https://wa.me/${cleaned}`;
}

interface CompanionCardProps {
  contact: TrustedContact;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CompanionCard({ contact, onClick, onDelete }: CompanionCardProps) {
  const initials = getInitials(contact.name);
  const roleLabel =
    contact.role === "other" && contact.roleCustom
      ? contact.roleCustom
      : COMPANION_ROLE_LABELS[contact.role];

  const handleHubungi = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(getWhatsAppUrl(contact.phone), "_blank");
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(contact.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Edit ${contact.name}`}
      onClick={() => onClick(contact.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(contact.id);
        }
      }}
      className="bg-background border border-border rounded-lg p-5 cursor-pointer
        hover:border-primary/30 transition-colors focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-ring relative group"
    >
      {/* Delete button */}
      <button
        type="button"
        aria-label={`Hapus ${contact.name}`}
        onClick={handleDelete}
        className="absolute top-3 right-3 p-1 rounded-md text-muted-foreground
          opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive
          transition-opacity focus-visible:opacity-100"
      >
        <Trash2 className="size-4" />
      </button>

      {/* Avatar + Name + Role */}
      <div className="flex flex-col items-center text-center mb-4">
        <div
          className={`w-12 h-12 rounded-full ${getRoleColor(contact.role)}
            flex items-center justify-center text-white font-bold text-lg mb-2`}
          aria-hidden="true"
        >
          {initials}
        </div>
        <h3 className="text-title-sm font-semibold text-foreground">{contact.name}</h3>
        <p className="text-caption text-muted-foreground">{roleLabel}</p>
      </div>

      {/* Permission chips */}
      {contact.permissions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1 mb-3">
          {contact.permissions.map((perm) => (
            <span
              key={perm}
              className="inline-flex items-center rounded-full bg-card text-foreground
                px-2 py-0.5 text-[11px] font-medium"
            >
              {MODULE_ACCESS_LABELS[perm]}
            </span>
          ))}
        </div>
      )}

      {/* Hubungi button */}
      <Button
        type="button"
        variant="default"
        size="sm"
        className="w-full"
        aria-label={`Hubungi ${contact.name} via WhatsApp`}
        onClick={handleHubungi}
      >
        Hubungi Sekarang
      </Button>
    </div>
  );
}
