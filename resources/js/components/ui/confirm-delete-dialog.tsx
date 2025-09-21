import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle } from "lucide-react"

/**
 * A reusable confirmation dialog component for delete operations.
 * 
 * @example
 * ```tsx
 * const [deleteDialog, setDeleteDialog] = useState({
 *   isOpen: false,
 *   item: null,
 *   isLoading: false,
 * })
 * 
 * const handleDeleteClick = (item) => {
 *   setDeleteDialog({ isOpen: true, item, isLoading: false })
 * }
 * 
 * const handleDeleteConfirm = () => {
 *   setDeleteDialog(prev => ({ ...prev, isLoading: true }))
 *   // Perform delete operation
 *   router.delete(deleteUrl, {
 *     onSuccess: () => {
 *       toast.success("Item deleted successfully")
 *       setDeleteDialog({ isOpen: false, item: null, isLoading: false })
 *     },
 *     onError: () => {
 *       toast.error("Failed to delete item")
 *       setDeleteDialog(prev => ({ ...prev, isLoading: false }))
 *     },
 *   })
 * }
 * 
 * <ConfirmDeleteDialog
 *   isOpen={deleteDialog.isOpen}
 *   onClose={() => setDeleteDialog({ isOpen: false, item: null, isLoading: false })}
 *   onConfirm={handleDeleteConfirm}
 *   title="Delete Item"
 *   itemName={deleteDialog.item?.name}
 *   isLoading={deleteDialog.isLoading}
 * />
 * ```
 */
interface ConfirmDeleteDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title?: string
  description?: string
  itemName?: string
  isLoading?: boolean
}

export function ConfirmDeleteDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Item",
  description = "Are you sure you want to delete this item? This action cannot be undone.",
  itemName,
  isLoading = false,
}: ConfirmDeleteDialogProps) {
  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground mt-1">
                {itemName ? `Delete "${itemName}"` : description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            {itemName 
              ? `This will permanently delete "${itemName}" and remove all associated data. This action cannot be undone.`
              : description
            }
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="border-border hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
