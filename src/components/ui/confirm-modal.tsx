"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  busy?: boolean;
  /** Red styling for destructive actions. */
  danger?: boolean;
}

/** Small confirm-step dialog for destructive / irreversible actions. */
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  busy = false,
  danger = false,
}: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="space-y-4">
        <p className="text-sm text-mu leading-relaxed">{description}</p>
        <div className="flex gap-3 pt-1">
          <Button
            onClick={onConfirm}
            disabled={busy}
            className={danger ? "bg-red-600 hover:bg-red-700" : undefined}
          >
            {busy ? "Working..." : confirmLabel}
          </Button>
          <Button variant="outline" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
