"use client";

import { useState, useCallback } from "react";
import { useVault } from "@/lib/vault-context";
import { VaultGrid } from "./VaultGrid";
import { VaultCategoryTabs } from "./VaultCategoryTabs";
import { VaultFilterBar } from "./VaultFilterBar";
import { VaultSecurityPanel } from "./VaultSecurityPanel";
import { VaultPinDialog } from "./VaultPinDialog";
import { VaultUploadDialog } from "./VaultUploadDialog";
import { VaultFileDrawer } from "./VaultFileDrawer";
import { VaultDeleteDialog } from "./VaultDeleteDialog";
import { filterFiles } from "@/lib/vault-utils";
import { Plus, Search } from "lucide-react";
import type { EvidenceCategory, EvidenceFile, AddFileInput } from "@/lib/vault-types";

export function BrankasBuktiClient() {
  const vault = useVault();
  const { state } = vault;

  const [searchQuery, setSearchQuery] = useState("");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EvidenceFile | null>(null);
  const [pinError, setPinError] = useState<string | null>(null);

  const hasPin =
    typeof window !== "undefined" &&
    localStorage.getItem("vault:pin-hash") !== null;

  const filtered = filterFiles(state.files, {
    category: state.activeCategory,
    quickChips: state.activeFilters.quickChips,
    searchQuery,
    advanced: state.activeFilters.advanced,
  });

  const categoryCounts = state.files.reduce(
    (acc, f) => {
      acc[f.category] = (acc[f.category] || 0) + 1;
      return acc;
    },
    {} as Partial<Record<EvidenceCategory, number>>
  );

  const selectedFile = state.files.find((f) => f.id === state.selectedFileId) ?? null;

  const handleSearch = useCallback(
    (q: string) => {
      setSearchQuery(q);
      vault.setFilters({ searchQuery: q });
    },
    [vault]
  );

  const handlePinSubmit = useCallback(
    async (pin: string) => {
      setPinError(null);
      if (!hasPin) {
        await vault.setupPin(pin);
        await vault.unlock(pin);
      } else {
        const ok = await vault.unlock(pin);
        if (!ok) setPinError("PIN tidak sesuai. Coba lagi.");
      }
    },
    [vault, hasPin]
  );

  const handleUpload = useCallback(
    async (input: AddFileInput) => {
      await vault.addFile(input);
    },
    [vault]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    await vault.deleteFile(deleteTarget.id);
    if (state.selectedFileId === deleteTarget.id) {
      vault.selectFile(null);
    }
    setDeleteTarget(null);
  }, [deleteTarget, vault, state.selectedFileId]);

  const showPinDialog =
    !state.isUnlocked && !state.loading;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-display-md font-bold text-foreground">
            Brankas Bukti
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Penyimpanan aman untuk bukti Anda
          </p>
        </div>
        {state.isUnlocked && (
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                placeholder="Cari berkas..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 pr-3 py-2 border border-border rounded-md text-sm bg-background w-52 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="Cari berkas berdasarkan nama"
              />
            </div>
            <button
              onClick={() => setUploadOpen(true)}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Tambah
            </button>
          </div>
        )}
      </div>

      {state.isUnlocked && (
        <>
          <VaultCategoryTabs
            active={state.activeCategory}
            counts={categoryCounts}
            onSelect={vault.setCategory}
          />
          <VaultFilterBar
            filters={{
              quickChips: state.activeFilters.quickChips,
              searchQuery: state.activeFilters.searchQuery,
              advanced: state.activeFilters.advanced,
            }}
            onFiltersChange={vault.setFilters}
          />
        </>
      )}

      <div className="flex gap-4">
        <div className="flex-1 min-w-0">
          {state.isUnlocked ? (
            <VaultGrid
              files={filtered}
              isLocked={false}
              onFileClick={vault.selectFile}
              onUploadClick={() => setUploadOpen(true)}
            />
          ) : !state.loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-muted-foreground">
                Brankas terkunci. Masukkan PIN untuk melihat berkas.
              </p>
            </div>
          ) : null}
        </div>
        {state.isUnlocked && (
          <div className="w-[200px] flex-shrink-0">
            <VaultSecurityPanel
              isUnlocked={state.isUnlocked}
              autoLockMinutes={Math.round(state.autoLockTimeoutMs / 60000)}
              onLock={vault.lock}
              onChangePin={() => {
                vault.lock();
              }}
            />
          </div>
        )}
      </div>

      {showPinDialog && (
        <VaultPinDialog
          mode={hasPin ? "unlock" : "setup"}
          error={pinError}
          onSubmit={handlePinSubmit}
        />
      )}

      <VaultUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUpload={handleUpload}
      />

      <VaultFileDrawer
        file={selectedFile!}
        open={selectedFile !== null}
        onOpenChange={(open) => {
          if (!open) vault.selectFile(null);
        }}
        onDelete={(id) => {
          const f = state.files.find((x) => x.id === id);
          if (f) setDeleteTarget(f);
        }}
        onRename={() => {}}
        onDownload={() => {}}
        onLinkNote={() => {
          vault.selectFile(null);
        }}
      />

      <VaultDeleteDialog
        open={deleteTarget !== null}
        fileName={deleteTarget?.name ?? ""}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
