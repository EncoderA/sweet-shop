"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { sweetApi } from "@/lib/api/sweetApi";
import { Loader2, Filter, X } from "lucide-react";
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
  
  // Mobile sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Close sidebar when clicking outside on mobile
  const closeSidebar = () => setSidebarOpen(false);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
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
      <div className="flex relative">
        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={closeSidebar}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:relative top-0 left-0 z-50 lg:z-auto
          w-80 h-[100vh] lg:h-[calc(100vh-70px)]
          overflow-y-auto bg-card border-r border-border
          p-4 lg:p-6 space-y-4 lg:space-y-6
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Mobile Close Button */}
          <div className="flex justify-between items-center lg:hidden mb-4">
            <h3 className="text-lg font-semibold">Filters & Analytics</h3>
            <button
              onClick={closeSidebar}
              className="p-2 hover:bg-muted rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

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
        <div className="flex-1 w-full lg:w-auto h-[calc(100vh-70px)] overflow-y-auto p-4 lg:p-8">
          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Filter size={16} />
              Filters & Analytics
            </button>
          </div>

          {/* Header */}
          <div className="flex flex-col gap-4 lg:gap-6 mb-6 lg:mb-8">
            <CustomerAnalyticsHeader
              customersCount={processedCustomers.length}
              searchQuery={searchQuery}
              onRefresh={fetchAllOrders}
            />

            {/* Summary Cards - Make them responsive */}
            <div className="w-full">
              <CustomerSummaryCards 
                customers={processedCustomers} 
                analytics={analytics} 
              />
            </div>

            {/* Search */}
            <CustomerSearchInput
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              onRefresh={fetchAllOrders}
            />
          </div>

          {/* Customer List */}
          <div className="space-y-4 lg:space-y-6">
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
