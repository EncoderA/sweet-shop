import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Award,
  BarChart3,
  Star,
  User,
} from "lucide-react";

/**
 * Quick analytics section for sidebar
 */
export const QuickAnalytics = ({ analytics }) => {
  if (!analytics || Object.keys(analytics).length === 0) {
    return (
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Quick Analytics
        </h3>
        <div className="text-sm text-muted-foreground">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <BarChart3 className="h-5 w-5" />
        Quick Analytics
      </h3>
      <div className="space-y-3">
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Avg Order Value
            </span>
            <Badge variant="secondary">
              ₹{analytics.avgOrderValue?.toFixed(2) || 0}
            </Badge>
          </div>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Avg Customer Value
            </span>
            <Badge variant="secondary">
              ₹{analytics.avgCustomerValue?.toFixed(2) || 0}
            </Badge>
          </div>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Top 20% Revenue Share
            </span>
            <Badge variant="secondary">
              {analytics.revenueFromTopCustomers?.toFixed(1) || 0}%
            </Badge>
          </div>
        </div>
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Active (30 days)
            </span>
            <Badge variant="secondary">
              {analytics.recentActiveCustomers || 0}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Summary cards for main content area
 */
export const CustomerSummaryCards = ({ customers, analytics }) => {
  const totalCustomers = customers.length;
  const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);
  const totalRevenue = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  const cards = [
    {
      title: "Filtered Customers",
      value: totalCustomers,
      icon: Users,
      colorClasses: {
        bg: "bg-blue-100",
        text: "text-blue-600",
      },
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      colorClasses: {
        bg: "bg-green-100",
        text: "text-green-600",
      },
    },
    {
      title: "Total Revenue",
      value: `₹${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      colorClasses: {
        bg: "bg-purple-100",
        text: "text-purple-600",
      },
    },
    {
      title: "Avg Order Value",
      value: `₹${analytics.avgOrderValue?.toFixed(2) || 0}`,
      icon: TrendingUp,
      colorClasses: {
        bg: "bg-orange-100",
        text: "text-orange-600",
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 ${card.colorClasses.bg} rounded-lg`}>
                <card.icon className={`h-5 w-5 ${card.colorClasses.text}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {card.title}
                </p>
                <p className="text-2xl font-bold">
                  {card.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

/**
 * Top performers sidebar component
 */
export const TopPerformers = ({ customers, analytics }) => {
  const topCustomers = customers.slice(0, 5);

  if (topCustomers.length === 0) {
    return (
      <div>
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Award className="h-5 w-5" />
          Top Performers
        </h3>
        <div className="text-sm text-muted-foreground">
          No customers found
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Award className="h-5 w-5" />
        Top Performers
      </h3>
      <div className="space-y-2">
        {topCustomers.map((customer, index) => (
          <div
            key={customer.userId}
            className="p-2 bg-muted rounded flex items-center gap-2"
          >
            <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {customer.userName}
              </div>
              <div className="text-xs text-muted-foreground">
                ₹{customer.totalSpent.toFixed(2)}
              </div>
            </div>
            {index < (analytics.topCustomersCount || 0) && (
              <Star className="h-3 w-3 text-yellow-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Customer analytics header
 */
export const CustomerAnalyticsHeader = ({ 
  customersCount, 
  searchQuery,
  onRefresh 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Customer Management
          </h1>
          <p className="text-muted-foreground">
            Showing {customersCount} customers
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * Empty state component when no customers found
 */
export const EmptyCustomersState = ({ searchQuery }) => {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">
          No customers found
        </h3>
        <p className="text-muted-foreground">
          {searchQuery
            ? "Try adjusting your search criteria or filters."
            : "No orders have been placed yet."}
        </p>
      </CardContent>
    </Card>
  );
};