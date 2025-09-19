"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import FilterSidebar from "@/components/shop/FilterSidebar";
import SweetCard from "@/components/shop/SweetCard";
import SweetCardSkeleton from "@/components/shop/SweetCardSkeleton";
import { sweetApi } from "@/lib/api/sweetApi";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2, Grid3X3, Grid2X2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useCart } from "@/contexts/CartContext";

const ShopPage = () => {
  const { data: session, status } = useSession();
  const { addToCart } = useCart();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    category: [],
    minPrice: 0,
    maxPrice: 1000,
  });
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("name"); // 'name', 'price', 'category'
  
  const debounceTimer = useRef(null);

  const isAdmin = session?.user?.role === "admin";

  // Debounce search query
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [searchQuery]);

  // Fetch sweets based on filters and search
  const fetchSweets = useCallback(async () => {
    // Don't fetch if session is still loading
    if (status === "loading") {
      return;
    }

    setLoading(true);
    try {
      let result;
      const token = session?.user?.token;

      // Check if we have any active filters or search
      const hasFilters =
        appliedFilters.category.length > 0 ||
        appliedFilters.minPrice > 0 ||
        appliedFilters.maxPrice < 1000 ||
        debouncedSearchQuery.trim();

      if (hasFilters) {
        result = await sweetApi.searchSweets(
          {
            ...appliedFilters,
            name: debouncedSearchQuery.trim(),
          },
          token
        );
      } else {
        result = await sweetApi.getAllSweets(token);
      }

      if (result.success) {
        setSweets(result.data || []);
        console.log(result.data);
      } else {
        toast.error("Failed to fetch sweets");
      }
    } catch (error) {
      console.error("Error fetching sweets:", error);
      toast.error("Failed to fetch sweets");
    } finally {
      setLoading(false);
    }
  }, [appliedFilters, debouncedSearchQuery, status]);

  useEffect(() => {
    if (status !== "loading") {
      fetchSweets();
    }
  }, [fetchSweets, status]);

  const handleFiltersApply = useCallback((newFilters) => {
    setAppliedFilters(newFilters);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleAddToCart = async (sweet, quantity) => {
    return await addToCart(sweet, quantity);
  };

  // Handle purchase
  const handlePurchase = async (sweet, quantity) => {
    try {
      if (!session?.user?.id) {
        toast.error("Please login to purchase");
        return;
      }

      const token = session?.user?.token;
      const result = await sweetApi.purchaseSweet(
        sweet.id,
        {
          quantity,
          userId: session.user.id,
        },
        token
      );

      if (result.success) {
        toast.success(`Successfully purchased ${quantity} ${sweet.name}(s)`);
        fetchSweets(); // Refresh to update quantities
      } else {
        toast.error(result.message || "Purchase failed");
      }
    } catch (error) {
      toast.error("Failed to purchase sweet");
    }
  };

  // Sort sweets
  const sortedSweets = [...sweets].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "category":
        return a.category.localeCompare(b.category);
      case "name":
      default:
        return a.name.localeCompare(b.name);
    }
  });

  // Show loading if session is still loading
//   if (status === "loading") {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="flex items-center gap-2">
//           <Loader2 className="animate-spin" size={24} />
//           <span>Loading...</span>
//         </div>
//       </div>
//     );
//   }

  return (
    <div className="min-h-full` bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}

        {/* Search and Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                size={16}
              />
              <Input
                type="text"
                placeholder="Search sweets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading}>
              {/* {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : ( */}
                <Search size={16} />
              {/* )} */}
            </Button>
          </form>

          {/* View Controls */}
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="category">Sort by Category</option>
            </select>

            {/* <div className="flex border border-border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="rounded-r-none"
              >
                <Grid3X3 size={16} />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-l-none"
              >
                <Grid2X2 size={16} />
              </Button>
            </div> */}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[70vh] flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <FilterSidebar
              onFiltersApply={handleFiltersApply}
              initialFilters={appliedFilters}
              priceRange={{ min: 0, max: 1000 }}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>

                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 h-[calc(70vh)] overflow-y-auto">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <SweetCardSkeleton key={index} />
                  ))}
                </div>
              </>
            ) : sortedSweets.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🍭</div>
                <h3 className="text-xl font-semibold mb-2">No sweets found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-muted-foreground">
                  Showing {sortedSweets.length} sweet
                  {sortedSweets.length !== 1 ? "s" : ""}
                </div>

                <AnimatePresence>
                  <div
                    className={`
                    grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 h-[calc(70vh)] overflow-y-auto`}
                  >
                    {sortedSweets.map((sweet, index) => (
                      <motion.div
                        key={sweet.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <SweetCard
                          sweet={sweet}
                          onAddToCart={handleAddToCart}
                          onPurchase={handlePurchase}
                          isAdmin={isAdmin}
                        />
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
