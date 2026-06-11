"use client";

import { useRef, useState, useEffect } from "react";
import { Lock } from "lucide-react";

interface VaultPinDialogProps {
  mode: "setup" | "unlock";
  error: string | null;
  onSubmit: (pin: string) => void;
  onCancel?: () => void;
}

export function VaultPinDialog({ mode, error, onSubmit, onCancel }: VaultPinDialogProps) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    const pin = newDigits.join("");
    if (pin.length === 6) {
      setTimeout(() => onSubmit(pin), 150);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      setTimeout(() => onSubmit(pasted), 150);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-lg p-8 max-w-sm w-full shadow-none">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-lg font-bold text-foreground mb-1">
            {mode === "setup" ? "Buat PIN Brankas" : "Buka Brankas"}
          </h2>

          <p className="text-sm text-muted-foreground mb-6">
            {mode === "setup"
              ? "Buat PIN 6-digit untuk mengamankan berkas Anda. PIN tidak bisa dipulihkan jika lupa."
              : "Masukkan PIN 6-digit untuk membuka akses ke berkas Anda."}
          </p>

          {mode === "setup" && (
            <p className="text-xs text-warning bg-warning/10 px-3 py-1.5 rounded-md mb-4">
              Peringatan: PIN yang hilang tidak bisa dipulihkan. Simpan baik-baik.
            </p>
          )}

          <div className="flex gap-2 mb-4" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-12 h-14 text-center text-xl font-bold border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary ${
                  error ? "border-destructive" : "border-border"
                }`}
                aria-label={`Digit PIN ke-${i + 1}`}
              />
            ))}
          </div>

          {error && (
            <p className="text-sm text-destructive mb-3" role="alert">{error}</p>
          )}

          {onCancel && (
            <button onClick={onCancel} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Batal
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
