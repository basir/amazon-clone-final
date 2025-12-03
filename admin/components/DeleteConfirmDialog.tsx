"use client";

import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    productName: string;
    loading?: boolean;
}

export default function DeleteConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    productName,
    loading = false,
}: DeleteConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                            Delete Product
                        </h3>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-zinc-900 dark:text-white">
                                {productName}
                            </span>
                            ? This action cannot be undone.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="shrink-0 rounded-lg p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 disabled:opacity-50"
                    >
                        <X className="h-5 w-5 text-zinc-500 dark:text-zinc-400" />
                    </button>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}
