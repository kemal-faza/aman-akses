// lib/companion-repository-localstorage.ts
import type { TrustedContact } from "./companion-types";

const CONTACTS_KEY = "companion:contacts";

export function createCompanionRepository() {
  return {
    getAllContacts(): TrustedContact[] {
      try {
        const raw = localStorage.getItem(CONTACTS_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch {
        return [];
      }
    },

    saveContact(contact: TrustedContact): void {
      const contacts = this.getAllContacts();
      const idx = contacts.findIndex((c) => c.id === contact.id);
      if (idx !== -1) {
        contacts[idx] = contact;
      } else {
        contacts.push(contact);
      }
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
    },

    updateContact(id: string, updates: Partial<TrustedContact>): TrustedContact | null {
      const contacts = this.getAllContacts();
      const idx = contacts.findIndex((c) => c.id === id);
      if (idx === -1) return null;
      contacts[idx] = { ...contacts[idx], ...updates, updatedAt: new Date().toISOString() };
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
      return contacts[idx];
    },

    deleteContact(id: string): boolean {
      const contacts = this.getAllContacts();
      const filtered = contacts.filter((c) => c.id !== id);
      if (filtered.length === contacts.length) return false;
      localStorage.setItem(CONTACTS_KEY, JSON.stringify(filtered));
      return true;
    },
  };
}

export type CompanionRepository = ReturnType<typeof createCompanionRepository>;
