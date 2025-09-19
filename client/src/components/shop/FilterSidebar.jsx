"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { X, Filter } from "lucide-react";

const FilterSidebar = ({ 
  onFiltersApply, 
  initialFilters = {}, 
  categories = [],
  priceRange = { min: 0, max: 1000 }
}) => {
  const [selectedCategories, setSelectedCategories] = useState(initialFilters.category || []);
  const [priceValues, setPriceValues] = useState([
    initialFilters.minPrice || priceRange.min,
    initialFilters.maxPrice || priceRange.max
  ]);
  const [isOpen, setIsOpen] = useState(false);

  // Default categories if none provided
  const defaultCategories = [
    "Chocolates",
    "Candies", 
    "Gummies",
    "Cookies",
    "Cakes",
    "Ice Cream"
  ];

  const categoriesToShow = categories.length > 0 ? categories : defaultCategories;

  // Apply filters when user clicks confirm
  const handleApplyFilters = () => {
    const filters = {
      category: selectedCategories,
      minPrice: priceValues[0],
      maxPrice: priceValues[1]
    };
    onFiltersApply(filters);
    setIsOpen(false);
  };

  const handleCategoryChange = (category, checked) => {
    if (checked) {
      setSelectedCategories(prev => [...prev, category]);
    } else {
      setSelectedCategories(prev => prev.filter(cat => cat !== category));
    }
  };

  const handlePriceChange = (values) => {
    setPriceValues(values);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceValues([priceRange.min, priceRange.max]);
  };

  const hasActiveFilters = selectedCategories.length > 0 || 
    priceValues[0] !== priceRange.min || 
    priceValues[1] !== priceRange.max;

  const hasUnappliedChanges = () => {
    return selectedCategories.length !== initialFilters.category?.length ||
           !selectedCategories.every(cat => initialFilters.category?.includes(cat)) ||
           priceValues[0] !== initialFilters.minPrice ||
           priceValues[1] !== initialFilters.maxPrice;
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-3">
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center gap-2 h-8 text-sm"
          size="sm"
        >
          <Filter size={14} />
          Filters
          {hasActiveFilters && (
            <span className="bg-[#ee2b8c] text-white text-xs px-1.5 py-0.5 rounded-full text-[10px]">
              {selectedCategories.length + (priceValues[0] !== priceRange.min || priceValues[1] !== priceRange.max ? 1 : 0)}
            </span>
          )}
        </Button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar - Compact Version */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-background border-r border-border
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        lg:w-64 lg:block max-h-screen
      `}>
        <div className="h-full flex flex-col p-3">
          {/* Mobile Header - Compact */}
          <div className="flex items-center justify-between mb-2 lg:hidden">
            <h2 className="text-base font-semibold">Filters</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              <X size={14} />
            </Button>
          </div>

          {/* Clear Filters - Compact */}
          {hasActiveFilters && (
            <div className="mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="w-full text-[#ee2b8c] border-[#ee2b8c] hover:bg-[#ee2b8c] hover:text-white h-7 text-xs"
              >
                Clear All
              </Button>
            </div>
          )}

          {/* Main Content - Scrollable if needed */}
          <div className="flex-1 space-y-3 min-h-0">
            {/* Categories Filter - Compact */}
            <Card className="border-gray-200">
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="grid grid-cols-2 gap-2">
                  {categoriesToShow.map((category) => (
                    <div key={category} className="flex items-center space-x-1.5">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => handleCategoryChange(category, checked)}
                        className="data-[state=checked]:bg-[#ee2b8c] data-[state=checked]:border-[#ee2b8c] h-3.5 w-3.5"
                      />
                      <label
                        htmlFor={category}
                        className="text-xs font-medium leading-none cursor-pointer truncate"
                      >
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Price Range Filter - Compact */}
            <Card className="border-gray-200">
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-sm font-medium">Price Range</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <div className="space-y-3">
                  <Slider
                    value={priceValues}
                    onValueChange={handlePriceChange}
                    max={priceRange.max}
                    min={priceRange.min}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Rs{priceValues[0]}</span>
                    <span>Rs{priceValues[1]}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Apply/Confirm Buttons - Always Visible */}
          <div className="mt-2 space-y-2 flex-shrink-0">
            {hasUnappliedChanges() && (
              <div className="p-2 border border-blue-200 rounded text-center">
                <p className="text-xs text-blue-600 mb-2">Unsaved changes</p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleApplyFilters}
                    className="flex-1 bg-[#ee2b8c] hover:bg-[#ee2b8c]/90 text-white h-7 text-xs"
                    size="sm"
                  >
                    Apply
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedCategories(initialFilters.category || []);
                      setPriceValues([
                        initialFilters.minPrice || priceRange.min,
                        initialFilters.maxPrice || priceRange.max
                      ]);
                    }}
                    variant="outline"
                    className="flex-1 h-7 text-xs"
                    size="sm"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}
            
            {/* Mobile close button */}
            <div className="lg:hidden">
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="w-full h-7 text-xs"
                size="sm"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;