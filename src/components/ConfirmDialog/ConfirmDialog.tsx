import { useCallback, useEffect, useRef } from 'react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'default' | 'danger'
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Onayla',
  cancelLabel = 'İptal',
  onConfirm,
  onCancel,
  variant = 'default',
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && dialogRef.current) {
      dialogRef.current.focus()
    }
  }, [isOpen])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel()
    }
  }, [onCancel])

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />
      
      {/* Dialog */}
      <div 
        ref={dialogRef}
        tabIndex={-1}
        className="relative bg-surface-container-high rounded-2xl shadow-2xl max-w-md w-full overflow-hidden outline-none"
      >
        <div className="p-6 pb-4">
          <h2 
            id="confirm-dialog-title"
            className="font-headline text-xl font-bold text-on-surface mb-2"
          >
            {title}
          </h2>
          <p className="font-body text-on-surface-variant">
            {message}
          </p>
        </div>
        
        <div className="flex justify-end gap-3 p-4 bg-surface-container-low">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg font-body text-sm font-medium text-on-surface-variant hover:bg-surface-variant transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-body text-sm font-medium transition-colors cursor-pointer ${
              variant === 'danger'
                ? 'bg-error text-on-error hover:bg-error/90'
                : 'bg-primary text-on-primary hover:bg-primary/90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog