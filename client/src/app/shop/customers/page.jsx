"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { sweetApi } from "@/lib/api/sweetApi";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Import our new components
import {
  CustomerSearchInput,
  CustomerFilters,
  ActiveFilters,
} from "@/components/shop/customers/CustomerFilters";
import {
  QuickAnalytics,
  CustomerSummaryCards,
  TopPerformers,
  CustomerAnalyticsHeader,
  EmptyCustomersState,
} from "@/components/shop/customers/CustomerAnalytics";
import { CustomerList } from "@/components/shop/customers/CustomerList";

// Import utility functions
import {
  processCustomerData,
  calculateCustomerAnalytics,
} from "@/lib/utils/customerUtils";

const CustomersPage = () => {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("totalSpent");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  // Check if user is admin
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      toast.error("Please login to access this page");
      return;
    }

    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      return;
    }

    fetchAllOrders();
  }, [status, isAdmin]);

  const fetchAllOrders = async () => {
    if (!session?.user?.token) return;

    setLoading(true);
    try {
      const response = await sweetApi.getAllUserOrders(session.user.token);

      if (response.success) {
        setOrders(response.data.orders);
      } else {
        toast.error(response.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch customer orders");
    } finally {
      setLoading(false);
    }
  };

  // Process customer data using our utility functions
  const processedCustomers = useMemo(() => {
    return processCustomerData(orders, {
      searchQuery,
      sortBy,
      filterBy,
      selectedPeriod,
    });
  }, [orders, searchQuery, sortBy, filterBy, selectedPeriod]);

  // Calculate analytics
  const analytics = useMemo(() => {
    return calculateCustomerAnalytics(processedCustomers);
  }, [processedCustomers]);

  // Filter handlers
  const handleSearchChange = (query) => setSearchQuery(query);
  const handlePeriodChange = (period) => setSelectedPeriod(period);
  const handleFilterChange = (filter) => setFilterBy(filter);
  const handleSortChange = (sort) => setSortBy(sort);
  const handleClearSearch = () => setSearchQuery("");

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You need admin privileges to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 h-[calc(100vh-70px)] overflow-y-auto bg-card border-r border-border p-6 space-y-6">
          {/* Quick Analytics */}
          <QuickAnalytics analytics={analytics} />

          {/* Filters */}
          <CustomerFilters
            selectedPeriod={selectedPeriod}
            onPeriodChange={handlePeriodChange}
            filterBy={filterBy}
            onFilterChange={handleFilterChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />

          {/* Top Performers */}
          <TopPerformers 
            customers={processedCustomers} 
            analytics={analytics} 
          />

          {/* Active Filters */}
          <ActiveFilters
            searchQuery={searchQuery}
            filterBy={filterBy}
            selectedPeriod={selectedPeriod}
            onClearSearch={handleClearSearch}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 h-[calc(100vh-70px)] overflow-y-auto p-8">
          {/* Header */}
          <div className="flex flex-col gap-6 mb-8">
            <CustomerAnalyticsHeader
              customersCount={processedCustomers.length}
              searchQuery={searchQuery}
              onRefresh={fetchAllOrders}
            />

            {/* Summary Cards */}
            <CustomerSummaryCards 
              customers={processedCustomers} 
              analytics={analytics} 
            />

            {/* Search */}
            <CustomerSearchInput
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onRefresh={fetchAllOrders}
            />
          </div>

          {/* Customer List */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin h-8 w-8" />
              </div>
            ) : processedCustomers.length === 0 ? (
              <EmptyCustomersState searchQuery={searchQuery} />
            ) : (
              <CustomerList 
                customers={processedCustomers} 
                analytics={analytics}
                loading={loading}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomersPage;
