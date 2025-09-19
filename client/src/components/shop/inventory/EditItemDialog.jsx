"use client"
import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Upload, X, Loader2 } from "lucide-react"
import { sweetApi } from "@/lib/api/sweetApi"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import Image from "next/image"

const EditItemDialog = ({ open, setOpen, selectedItem, setSweets }) => {
  const { data: session } = useSession()
  const fileInputRef = useRef(null)

  const [editItem, setEditItem] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: ""
  })
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [currentImageUrl, setCurrentImageUrl] = useState(null)
  const [keepCurrentImage, setKeepCurrentImage] = useState(true)
  const [updateLoading, setUpdateLoading] = useState(false)

  // Initialize form when selectedItem changes
  useEffect(() => {
    if (selectedItem && open) {
      setEditItem({
        name: selectedItem.name || "",
        description: selectedItem.description || "",
        category: selectedItem.category || "",
        price: selectedItem.price?.toString() || "",
        quantity: selectedItem.quantity?.toString() || ""
      })
      
      // Set current image URL for display
      if (selectedItem.imageUrl) {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
        const fullImageUrl = selectedItem.imageUrl.startsWith("http") 
          ? selectedItem.imageUrl 
          : `${backendUrl}${selectedItem.imageUrl}`
        setCurrentImageUrl(fullImageUrl)
        setKeepCurrentImage(true)
      } else {
        setCurrentImageUrl(null)
        setKeepCurrentImage(false)
      }
      
      // Reset new image selection
      setSelectedImage(null)
      setImagePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }, [selectedItem, open])

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (ev) => setImagePreview(ev.target.result)
      reader.readAsDataURL(file)
    }
  }

  const removeNewImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeCurrentImage = () => {
    setCurrentImageUrl(null)
    setKeepCurrentImage(false)
  }

  const resetForm = () => {
    setEditItem({ name: "", description: "", category: "", price: "", quantity: "" })
    setSelectedImage(null)
    setImagePreview(null)
    setCurrentImageUrl(null)
    setKeepCurrentImage(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditItem(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedItem) {
      toast.error("No item selected for editing")
      return
    }

    // Validation
    if (!editItem.name?.trim()) {
      toast.error("Name is required")
      return
    }

    if (!editItem.price || isNaN(parseFloat(editItem.price)) || parseFloat(editItem.price) <= 0) {
      toast.error("Please enter a valid price")
      return
    }

    if (!editItem.quantity || isNaN(parseInt(editItem.quantity)) || parseInt(editItem.quantity) < 0) {
      toast.error("Please enter a valid quantity")
      return
    }

    setUpdateLoading(true)

    try {
      let imageUrl = selectedItem.imageUrl 
      if (selectedImage) {
        console.log("Uploading new image:", selectedImage.name)
        const formData = new FormData()
        formData.append("image", selectedImage)

        const uploadResponse = await sweetApi.uploadImage(formData, session?.user?.token)
        
        if (uploadResponse.success) {
          imageUrl = uploadResponse.data.url
          console.log("New image uploaded successfully:", imageUrl)
        } else {
          throw new Error(uploadResponse.message || "Failed to upload image")
        }
      } else if (!keepCurrentImage) {
        imageUrl = null
        console.log("Image removed, setting to null")
      } else {
        console.log("Keeping existing image:", imageUrl)
      }

      const updateData = {
        name: editItem.name.trim(),
        description: editItem.description.trim(),
        category: editItem.category.trim(),
        price: parseFloat(editItem.price),
        quantity: parseInt(editItem.quantity),
        imageUrl: imageUrl,
        createdBy: session?.user?.id
      }

      console.log("Update data being sent:", updateData)

      const response = await sweetApi.updateSweet(selectedItem.id, updateData, session?.user?.token)

      if (response.success) {
        console.log("Update response:", response.data)
        
        // Update the sweets list
        setSweets(prevSweets => 
          prevSweets.map(sweet => 
            sweet.id === selectedItem.id ? response.data : sweet
          )
        )

        toast.success(`Successfully updated ${editItem.name}`)
        setOpen(false)
        resetForm()
      } else {
        throw new Error(response.message || "Failed to update item")
      }
    } catch (error) {
      console.error("Error updating item:", error)
      toast.error(error.message || "Failed to update item")
    } finally {
      setUpdateLoading(false)
    }
  }

  const handleCancel = () => {
    setOpen(false)
    resetForm()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Sweet Item</DialogTitle>
          <DialogDescription>
            Update the details of the sweet item. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                name="name"
                value={editItem.name}
                onChange={handleInputChange}
                placeholder="Sweet name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Input
                id="edit-category"
                name="category"
                value={editItem.category}
                onChange={handleInputChange}
                placeholder="e.g., Chocolate, Candy, etc."
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-price">Price (₹) *</Label>
              <Input
                id="edit-price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={editItem.price}
                onChange={handleInputChange}
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantity *</Label>
              <Input
                id="edit-quantity"
                name="quantity"
                type="number"
                min="0"
                value={editItem.quantity}
                onChange={handleInputChange}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              name="description"
              value={editItem.description}
              onChange={handleInputChange}
              placeholder="Describe the sweet item..."
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <Label>Images</Label>
            
            {/* Current Image */}
            {currentImageUrl && (
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Current Image</Label>
                <div className="relative inline-block">
                  <Image
                    src={currentImageUrl}
                    alt="Current item image"
                    width={120}
                    height={120}
                    className="w-30 h-30 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeCurrentImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* New Image Upload */}
            <div className="space-y-2">
              <Label className="text-sm text-gray-600">
                {currentImageUrl ? "Replace with new image" : "Upload new image"}
              </Label>
              <div className="flex items-center space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload size={16} />
                  Choose Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                {selectedImage && (
                  <span className="text-sm text-green-600">
                    New image selected: {selectedImage.name}
                  </span>
                )}
              </div>

              {/* New Image Preview */}
              {imagePreview && (
                <div className="relative inline-block">
                  <Image
                    src={imagePreview}
                    alt="New image preview"
                    width={120}
                    height={120}
                    className="w-30 h-30 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeNewImage}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={updateLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateLoading}
            >
              {updateLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Updating...
                </>
              ) : (
                "Update Item"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditItemDialog