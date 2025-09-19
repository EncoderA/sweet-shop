"use client"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { sweetApi } from "@/lib/api/sweetApi"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

const RestockDialog = ({ open, setOpen, selectedItem, setSweets }) => {
  const { data: session } = useSession()
  const [restockQuantity, setRestockQuantity] = useState("")
  const [restockLoading, setRestockLoading] = useState(false)

  const handleRestock = async () => {
    const qty = parseInt(restockQuantity)
    if (!qty || qty <= 0) {
      toast.error("Please enter a valid quantity")
      return
    }

    setRestockLoading(true)
    try {
      const response = await sweetApi.restockSweet(
        selectedItem.id,
        qty,
        session.user.token
      )

      if (response.success) {
        setSweets((prev) =>
          prev.map((item) =>
            item.id === selectedItem.id
              ? { ...item, quantity: item.quantity + qty }
              : item
          )
        )
        toast.success(`${selectedItem.name} restocked successfully!`)
        setRestockQuantity("")
        setOpen(false)
      } else {
        toast.error(response.message || "Failed to restock item")
      }
    } catch (error) {
      console.error("Error restocking item:", error)
      toast.error("Failed to restock item")
    } finally {
      setRestockLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Restock Item</DialogTitle>
          <DialogDescription>
            Add more stock for{" "}
            <span className="font-semibold">{selectedItem?.name}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="restockQuantity">Quantity *</Label>
            <Input
              id="restockQuantity"
              type="number"
              placeholder="Enter quantity"
              min="1"
              value={restockQuantity}
              onChange={(e) => setRestockQuantity(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={restockLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleRestock}
            disabled={restockLoading || !restockQuantity}
          >
            {restockLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} /> Restocking...
              </>
            ) : (
              "Restock"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default RestockDialog
