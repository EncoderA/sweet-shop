"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Package, Edit, Trash2, Plus, Loader2, Upload, X } from "lucide-react";
import { sweetApi } from "@/lib/api/sweetApi";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import AddItemDialog from "@/components/shop/inventory/AddItemDialog";
import RestockDialog from "@/components/shop/inventory/RestockDialog";
import EditItemDialog from "@/components/shop/inventory/EditItemDialog";

const InventoryPage = () => {
  const { data: session, status } = useSession();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [editItemModalOpen, setEditItemModalOpen] = useState(false);
  const [selectedSweet, setSelectedSweet] = useState(null);

  const [deleteLoading, setDeleteLoading] = useState(false);


  useEffect(() => {
    if (status === "loading") return;

    const fetchSweets = async () => {
      if (session?.user?.token) {
        try {
          const response = await sweetApi.getAllSweets(session.user.token);
          if (response.success) {
            setSweets(response.data || []);
          } else {
            setError(response.message || "Failed to load inventory");
          }
        } catch (err) {
          console.error("Error fetching inventory:", err);
          setError("Failed to load inventory");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchSweets();
  }, [session, status]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder-sweet.jpg";

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
    return `${backendUrl}${imageUrl}`;
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0)
      return { label: "Out of Stock", variant: "destructive" };
    if (quantity <= 5) return { label: "Low Stock", variant: "secondary" };
    return { label: "In Stock", variant: "default" };
  };

  const handleDelete = async () => {
    if (!selectedSweet) return;

    setDeleteLoading(true);
    try {
      const response = await sweetApi.deleteSweet(
        selectedSweet.id,
        session?.user?.token
      );

      if (response.success) {
        // Remove from local state
        setSweets((prevSweets) =>
          prevSweets.filter((sweet) => sweet.id !== selectedSweet.id)
        );

        toast.success(`Successfully deleted ${selectedSweet.name}`);
        setDeleteDialogOpen(false);
        setSelectedSweet(null);
      } else {
        toast.error(response.message || "Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete item");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openRestockModal = (sweet) => {
    setSelectedSweet(sweet);
    setRestockQuantity("");
    setRestockModalOpen(true);
  };

  const openEditModal = (sweet) => {
    setSelectedSweet(sweet);
    setEditItemModalOpen(true);
  };

  const openDeleteDialog = (sweet) => {
    setSelectedSweet(sweet);
    setDeleteDialogOpen(true);
  };


  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="w-full">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <Skeleton className="w-20 h-20 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-16" />
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Error Loading Inventory</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-gray-600 mt-1">Total items: {sweets.length}</p>
        </div>
        <Button
          className="flex items-center gap-2"
          onClick={() => setAddItemModalOpen(true)}
        >
          <Plus size={16} />
          Add New Item
        </Button>
      </div>

      {sweets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold mb-2">No Items in Inventory</h2>
          <p className="text-gray-600 mb-4">
            Start by adding your first sweet item.
          </p>
          <Button className="flex items-center gap-2">
            <Plus size={16} />
            Add First Item
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sweets.map((sweet) => {
            const stockStatus = getStockStatus(sweet.quantity);

            return (
              <Card
                key={sweet.id}
                className="w-full hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle
                      className="text-lg line-clamp-1"
                      title={sweet.name}
                    >
                      {sweet.name}
                    </CardTitle>
                    <Badge variant={stockStatus.variant} className="ml-2">
                      {stockStatus.label}
                    </Badge>
                  </div>
                  {sweet.category && (
                    <p className="text-sm text-gray-600">{sweet.category}</p>
                  )}
                </CardHeader>

                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    {sweet.imageUrl && (
                      <Image
                        src={getImageUrl(sweet.imageUrl)}
                        alt={sweet.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <div className="text-lg font-bold text-primary mb-1">
                        ₹{sweet.price}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <Package size={14} className="mr-1" />
                        {sweet.quantity} in stock
                      </div>
                      {sweet.description && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {sweet.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Updated: {new Date(sweet.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openRestockModal(sweet)}
                      >
                        <Package size={14} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openEditModal(sweet)}
                      >
                        <Edit size={14} />
                      </Button>
                      <AlertDialog
                        open={
                          deleteDialogOpen && selectedSweet?.id === sweet.id
                        }
                        onOpenChange={setDeleteDialogOpen}
                      >
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => openDeleteDialog(sweet)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Item</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "
                              {selectedSweet?.name}"? This action cannot be
                              undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleDelete}
                              disabled={deleteLoading}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {deleteLoading ? (
                                <>
                                  <Loader2
                                    className="animate-spin mr-2"
                                    size={16}
                                  />
                                  Deleting...
                                </>
                              ) : (
                                "Delete"
                              )}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Restock Modal */}
      <RestockDialog
        open={restockModalOpen}
        setOpen={setRestockModalOpen}
        selectedItem={selectedSweet}
        setSweets={setSweets}
      />

      {/* Edit Item Modal */}
      <EditItemDialog
        open={editItemModalOpen}
        setOpen={setEditItemModalOpen}
        selectedItem={selectedSweet}
        setSweets={setSweets}
      />

      {/* Add New Item Modal */}
      <AddItemDialog
        open={addItemModalOpen}
        setOpen={setAddItemModalOpen}
        setSweets={setSweets}
      />
    </div>
  );
};

export default InventoryPage;
