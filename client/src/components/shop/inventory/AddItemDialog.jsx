"use client"
import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2 } from "lucide-react"
import { sweetApi } from "@/lib/api/sweetApi"
import { toast } from "sonner"
import { useSession } from "next-auth/react"

const AddItemDialog = ({ open, setOpen, setSweets }) => {
  const { data: session } = useSession()
  const fileInputRef = useRef(null)

  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: ""
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [addItemLoading, setAddItemLoading] = useState(false)

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (ev) => setImagePreview(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const resetForm = () => {
    setNewItem({ name: "", description: "", category: "", price: "", quantity: "" })
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Handle dialog close with form reset
  const handleDialogClose = (isOpen) => {
    if (!isOpen && !addItemLoading) {
      resetForm()
    }
    setOpen(isOpen)
  }

  const handleAddItem = async () => {
    // Add validation for name length
    if (newItem.name.trim().length <= 2) {
      toast.error("Item name must be more than 2 characters")
      return
    }

    if (!newItem.name.trim() || !newItem.category.trim() || !newItem.price || !newItem.quantity) {
      toast.error("Please fill in all required fields")
      return
    }
    
    if (parseFloat(newItem.price) <= 0 || parseInt(newItem.quantity) < 0) {
      toast.error("Please enter valid price and quantity")
      return
    }

    setAddItemLoading(true)
    let imageUrl = null

    try {
      // Upload image if selected
      if (selectedImage) {
        const formData = new FormData()
        formData.append("image", selectedImage)

        const uploadResponse = await sweetApi.uploadImage(formData, session.user.token)
        if (uploadResponse.success) {
          imageUrl = uploadResponse.data.url
        } else {
          toast.error("Failed to upload image")
          setAddItemLoading(false)
          return
        }
      }

      // Create the sweet
      const sweetData = {
        ...newItem,
        price: parseFloat(newItem.price),
        quantity: parseInt(newItem.quantity),
        imageUrl,
        createdBy: session.user.id
      }

      const response = await sweetApi.createSweet(sweetData, session.user.token)

      // Check for both success spelling variations and handle errors properly
      if (response.success || response.sucess) {
        setSweets((prev) => [response.data, ...prev])
        toast.success("Item added successfully!")
        
        // Reset form and close dialog
        resetForm()
        setOpen(false)
      } else {
        // Handle specific error messages
        if (response.message && response.message.includes("already exists")) {
          toast.error("An item with this name already exists")
        } else {
          toast.error(response.message || "Failed to add item")
        }
      }
    } catch (error) {
      console.error("Error adding item:", error)
      // Check if this is a duplicate name error
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message)
      } else {
        toast.error("Failed to add item")
      }
    } finally {
      setAddItemLoading(false)
    }
  }

  const handleCancel = () => {
    if (!addItemLoading) {
      resetForm()
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>Add a new sweet item to your inventory.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Image Upload */}
          <div className="grid gap-2">
            <Label htmlFor="image">Image (Optional)</Label>
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />
              <Label
                htmlFor="image"
                className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
              >
                <Upload size={16} />
                Choose Image
              </Label>
              {imagePreview && (
                <div className="relative">
                  <img src={imagePreview} alt="Preview" className="w-16 h-16 object-cover rounded-lg" />
                  <button
                    onClick={removeImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="grid gap-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              placeholder="Enter item name"
              value={newItem.name}
              onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>

          {/* Category */}
          <div className="grid gap-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              placeholder="e.g., Cakes, Cookies, Chocolates"
              value={newItem.category}
              onChange={(e) => setNewItem((prev) => ({ ...prev, category: e.target.value }))}
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter item description"
              value={newItem.description}
              onChange={(e) => setNewItem((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Price and Quantity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={newItem.price}
                onChange={(e) => setNewItem((prev) => ({ ...prev, price: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="0"
                min="0"
                value={newItem.quantity}
                onChange={(e) => setNewItem((prev) => ({ ...prev, quantity: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleCancel} disabled={addItemLoading}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAddItem}
            disabled={addItemLoading || !newItem.name.trim() || !newItem.category.trim() || !newItem.price || !newItem.quantity}
          >
            {addItemLoading ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} /> Adding...
              </>
            ) : (
              "Add Item"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddItemDialog