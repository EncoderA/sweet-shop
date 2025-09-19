import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, Filter, Activity } from "lucide-react";
import { 
  getFilterTypeLabel, 
  getSortByLabel, 
  getPeriodLabel 
} from "@/lib/utils/customerUtils";

/**
 * Search input component for customers
 */
export const CustomerSearchInput = ({ 
  searchQuery, 
  onSearchChange, 
  onRefresh,
  placeholder = "Search customers, orders, or items..." 
}) => {
  return (
    <div className="flex items-center gap-4 max-w-md">
      <div className="relative max-w-lg">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      {onRefresh && (
        <Button
          variant="outline"
          size="sm"
          className="w-10 justify-start"
          onClick={onRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
        </Button>
      )}
    </div>
  );
};

/**
 * Time period filter component
 */
export const TimePeriodFilter = ({ selectedPeriod, onPeriodChange }) => {
  const periods = [
    { value: "all", label: "All Time" },
    { value: "week", label: "Last Week" },
    { value: "month", label: "Last Month" },
    { value: "quarter", label: "Last Quarter" },
  ];

  return (
    <div>
      <label className="text-sm font-medium mb-1 block">
        Time Period
      </label>
      <Select value={selectedPeriod} onValueChange={onPeriodChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {periods.map((period) => (
            <SelectItem key={period.value} value={period.value}>
              {period.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

/**
 * Customer type filter component
 */
export const CustomerTypeFilter = ({ filterBy, onFilterChange }) => {
  const filterTypes = [
    { value: "all", label: "All Customers" },
    { value: "highValue", label: "High Value" },
    { value: "frequent", label: "Frequent Buyers" },
    { value: "recent", label: "Recent Active" },
  ];

  return (
    <div>
      <label className="text-sm font-medium mb-1 block">
        Customer Type
      </label>
      <Select value={filterBy} onValueChange={onFilterChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {filterTypes.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

/**
 * Sort by filter component
 */
export const SortByFilter = ({ sortBy, onSortChange }) => {
  const sortOptions = [
    { value: "totalSpent", label: "Total Spent" },
    { value: "totalOrders", label: "Total Orders" },
    { value: "recent", label: "Recent Activity" },
  ];

  return (
    <div>
      <label className="text-sm font-medium mb-1 block">
        Sort By
      </label>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

/**
 * Combined filters section
 */
export const CustomerFilters = ({
  selectedPeriod,
  onPeriodChange,
  filterBy,
  onFilterChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <div>
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Filter className="h-5 w-5" />
        Filters & Sort
      </h3>
      <div className="space-y-3">
        <TimePeriodFilter
          selectedPeriod={selectedPeriod}
          onPeriodChange={onPeriodChange}
        />
        <CustomerTypeFilter
          filterBy={filterBy}
          onFilterChange={onFilterChange}
        />
        <SortByFilter
          sortBy={sortBy}
          onSortChange={onSortChange}
        />
      </div>
    </div>
  );
};

/**
 * Active filters display component
 */
export const ActiveFilters = ({ 
  searchQuery, 
  filterBy, 
  selectedPeriod,
  onClearSearch
}) => {
  const hasActiveFilters = searchQuery || filterBy !== "all" || selectedPeriod !== "all";

  if (!hasActiveFilters) return null;

  return (
    <div>
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Activity className="h-5 w-5" />
        Active Filters
      </h3>
      <div className="space-y-2">
        {searchQuery && (
          <div className="flex items-center gap-2">
            <Badge variant="outline">Search: {searchQuery}</Badge>
            {onClearSearch && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={onClearSearch}
              >
                ×
              </Button>
            )}
          </div>
        )}
        {filterBy !== "all" && (
          <Badge variant="outline">
            Type: {getFilterTypeLabel(filterBy)}
          </Badge>
        )}
        {selectedPeriod !== "all" && (
          <Badge variant="outline">
            Period: {getPeriodLabel(selectedPeriod)}
          </Badge>
        )}
      </div>
    </div>
  );
};