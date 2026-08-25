"use client";

import { UploadIcon } from "lucide-react";
import type { ChangeEvent, DragEvent, ReactNode } from "react";
import { useRef, useState } from "react";

import { Button } from "#components/shadcn/button";
import { cn } from "#lib/utils";

export interface UseDropzoneOptions {
  /** Called with the dropped/picked files. Never called with an empty array. */
  onFiles: (files: File[]) => void;
  /** `<input type="file">` accept attribute, e.g. `"image/*,video/mp4"`. */
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

/**
 * Drag-drop + file-picker plumbing, with no opinion on layout — extracted from Studio's
 * Design Files panel, which needs the drop target to be a whole panel while the trigger is a
 * button in its header (so it can't use the self-contained `<Dropzone>` below). Knows nothing
 * about R2/endpoints: it only ever hands `File[]` back to the caller.
 */
export function useDropzone({
  onFiles,
  accept,
  multiple = false,
  disabled = false
}: UseDropzoneOptions) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  function emit(list: FileList | null) {
    const files = Array.from(list ?? []);
    if (files.length === 0) return;
    onFiles(multiple ? files : files.slice(0, 1));
  }

  return {
    dragOver,
    /** Opens the native file picker — for a trigger rendered outside the drop target. */
    open: () => inputRef.current?.click(),
    /** Spread onto the element that should accept dropped files. */
    dropProps: {
      onDragOver: (e: DragEvent) => {
        if (disabled) return;
        e.preventDefault();
        setDragOver(true);
      },
      onDragLeave: () => setDragOver(false),
      onDrop: (e: DragEvent) => {
        if (disabled) return;
        e.preventDefault();
        setDragOver(false);
        emit(e.dataTransfer.files);
      }
    },
    /** Spread onto a `<input>` rendered anywhere inside the caller's tree. */
    inputProps: {
      ref: inputRef,
      type: "file" as const,
      accept,
      multiple,
      disabled,
      className: "hidden",
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        emit(e.target.files);
        // Lets the same file be picked twice in a row (a retry after a failed upload).
        e.target.value = "";
      }
    }
  };
}

export interface DropzoneProps extends UseDropzoneOptions {
  /** Trigger button copy — i18n lives in the app, never in the design system. */
  label: string;
  description?: string;
  className?: string;
  /** Preview slot, rendered above the trigger (e.g. the currently uploaded image). */
  children?: ReactNode;
}

/** Self-contained drop target: dashed box, click-to-pick, drop-to-pick. */
export function Dropzone({
  label,
  description,
  className,
  children,
  ...options
}: DropzoneProps) {
  const { dragOver, open, dropProps, inputProps } = useDropzone(options);

  return (
    <div
      {...dropProps}
      className={cn(
        "flex flex-col items-center gap-2 rounded-md border border-dashed p-4 text-center",
        dragOver && "border-primary bg-primary/5",
        className
      )}
    >
      <input {...inputProps} />
      {children}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={options.disabled}
        onClick={open}
      >
        <UploadIcon /> {label}
      </Button>
      {description ? (
        <p className="text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
