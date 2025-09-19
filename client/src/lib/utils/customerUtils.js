/**
 * Customer data processing utilities
 * Contains logic for filtering, sorting, and analyzing customer data
 */

/**
 * Filters orders based on time period
 * @param {Array} orders - Array of order objects
 * @param {string} period - Time period ('all', 'week', 'month', 'quarter')
 * @returns {Array} Filtered orders
 */
export const filterOrdersByPeriod = (orders, period) => {
  if (period === "all") return orders;

  const now = new Date();
  const periodDays = {
    week: 7,
    month: 30,
    quarter: 90,
  };

  const cutoffDate = new Date(
    now.getTime() - periodDays[period] * 24 * 60 * 60 * 1000
  );

  return orders.filter(
    (order) => new Date(order.orderDate) >= cutoffDate
  );
};

/**
 * Filters orders based on search query
 * @param {Array} orders - Array of order objects
 * @param {string} searchQuery - Search string
 * @returns {Array} Filtered orders
 */
export const filterOrdersBySearch = (orders, searchQuery) => {
  if (!searchQuery) return orders;

  const query = searchQuery.toLowerCase();
  return orders.filter(
    (order) =>
      order.userName.toLowerCase().includes(query) ||
      order.userEmail.toLowerCase().includes(query) ||
      order.items.some((item) =>
        item.sweetName.toLowerCase().includes(query)
      )
  );
};

/**
 * Groups orders by customer and calculates customer metrics
 * @param {Array} orders - Array of order objects
 * @returns {Object} Customer data grouped by userId
 */
export const groupOrdersByCustomer = (orders) => {
  const customerOrders = orders.reduce((acc, order) => {
    if (!acc[order.userId]) {
      acc[order.userId] = {
        userId: order.userId,
        userName: order.userName,
        userEmail: order.userEmail,
        orders: [],
        totalSpent: 0,
        totalOrders: 0,
        lastOrderDate: null,
        averageOrderValue: 0,
        favoriteItems: {},
      };
    }

    acc[order.userId].orders.push(order);
    acc[order.userId].totalSpent += order.totalAmount;
    acc[order.userId].totalOrders += 1;

    const orderDate = new Date(order.orderDate);
    if (
      !acc[order.userId].lastOrderDate ||
      orderDate > acc[order.userId].lastOrderDate
    ) {
      acc[order.userId].lastOrderDate = orderDate;
    }

    // Track favorite items
    order.items.forEach((item) => {
      if (!acc[order.userId].favoriteItems[item.sweetName]) {
        acc[order.userId].favoriteItems[item.sweetName] = 0;
      }
      acc[order.userId].favoriteItems[item.sweetName] += item.quantity;
    });

    return acc;
  }, {});

  // Calculate derived metrics
  Object.values(customerOrders).forEach((customer) => {
    customer.averageOrderValue = customer.totalSpent / customer.totalOrders;
    customer.topFavoriteItem =
      Object.entries(customer.favoriteItems).sort(
        ([, a], [, b]) => b - a
      )[0]?.[0] || null;
  });

  return customerOrders;
};

/**
 * Filters customers based on customer type
 * @param {Array} customers - Array of customer objects
 * @param {string} filterType - Filter type ('all', 'highValue', 'frequent', 'recent')
 * @returns {Array} Filtered customers
 */
export const filterCustomersByType = (customers, filterType) => {
  if (filterType === "all") return customers;

  const avgSpent =
    customers.reduce((sum, c) => sum + c.totalSpent, 0) / customers.length;
  const avgOrders =
    customers.reduce((sum, c) => sum + c.totalOrders, 0) / customers.length;
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  return customers.filter((customer) => {
    switch (filterType) {
      case "highValue":
        return customer.totalSpent > avgSpent * 1.5;
      case "frequent":
        return customer.totalOrders > avgOrders * 1.5;
      case "recent":
        return (
          customer.lastOrderDate && customer.lastOrderDate >= thirtyDaysAgo
        );
      default:
        return true;
    }
  });
};

/**
 * Sorts customers based on sort criteria
 * @param {Array} customers - Array of customer objects
 * @param {string} sortBy - Sort criteria ('totalSpent', 'totalOrders', 'recent')
 * @returns {Array} Sorted customers
 */
export const sortCustomers = (customers, sortBy) => {
  return [...customers].sort((a, b) => {
    switch (sortBy) {
      case "totalOrders":
        return b.totalOrders - a.totalOrders;
      case "recent":
        return new Date(b.lastOrderDate) - new Date(a.lastOrderDate);
      case "totalSpent":
      default:
        return b.totalSpent - a.totalSpent;
    }
  });
};

/**
 * Processes and filters customer data based on all filters
 * @param {Array} orders - Raw order data from API
 * @param {Object} filters - Filter configuration
 * @param {string} filters.searchQuery - Search query
 * @param {string} filters.sortBy - Sort criteria
 * @param {string} filters.filterBy - Customer type filter
 * @param {string} filters.selectedPeriod - Time period filter
 * @returns {Array} Processed and filtered customers
 */
export const processCustomerData = (orders, filters) => {
  const {
    searchQuery = "",
    sortBy = "totalSpent",
    filterBy = "all",
    selectedPeriod = "all",
  } = filters;

  // Apply filters step by step
  let filteredOrders = filterOrdersByPeriod(orders, selectedPeriod);
  filteredOrders = filterOrdersBySearch(filteredOrders, searchQuery);

  // Group by customer
  const customerOrders = groupOrdersByCustomer(filteredOrders);
  let customers = Object.values(customerOrders);

  // Apply customer-level filters
  customers = filterCustomersByType(customers, filterBy);

  // Sort customers
  customers = sortCustomers(customers, sortBy);

  return customers;
};

/**
 * Calculates analytics for customer data
 * @param {Array} customers - Processed customer data
 * @returns {Object} Analytics object
 */
export const calculateCustomerAnalytics = (customers) => {
  if (customers.length === 0) return {};

  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
  const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);
  const avgOrderValue = totalSpent / totalOrders || 0;
  const avgCustomerValue = totalSpent / customers.length || 0;

  // Top customers (top 20%)
  const topCustomersCount = Math.ceil(customers.length * 0.2);
  const topCustomers = customers.slice(0, topCustomersCount);
  const topCustomersRevenue = topCustomers.reduce(
    (sum, c) => sum + c.totalSpent,
    0
  );
  const revenueFromTopCustomers = (topCustomersRevenue / totalSpent) * 100 || 0;

  // Recent activity (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recentCustomers = customers.filter(
    (c) => c.lastOrderDate && c.lastOrderDate >= thirtyDaysAgo
  );

  return {
    avgOrderValue,
    avgCustomerValue,
    revenueFromTopCustomers,
    recentActiveCustomers: recentCustomers.length,
    topCustomersCount,
    totalSpent,
    totalOrders,
  };
};

/**
 * Gets filter type display labels
 * @param {string} filterType - Filter type key
 * @returns {string} Human-readable label
 */
export const getFilterTypeLabel = (filterType) => {
  const labels = {
    all: "All Customers",
    highValue: "High Value",
    frequent: "Frequent Buyers",
    recent: "Recent Active",
  };
  return labels[filterType] || filterType;
};

/**
 * Gets sort by display labels
 * @param {string} sortBy - Sort by key
 * @returns {string} Human-readable label
 */
export const getSortByLabel = (sortBy) => {
  const labels = {
    totalSpent: "Total Spent",
    totalOrders: "Total Orders",
    recent: "Recent Activity",
  };
  return labels[sortBy] || sortBy;
};

/**
 * Gets period display labels
 * @param {string} period - Period key
 * @returns {string} Human-readable label
 */
export const getPeriodLabel = (period) => {
  const labels = {
    all: "All Time",
    week: "Last Week",
    month: "Last Month",
    quarter: "Last Quarter",
  };
  return labels[period] || period;
};