import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ShoppingBag,
  Calendar,
  Mail,
  User,
  Clock,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

/**
 * Individual order item display
 */
export const OrderItem = ({ item }) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-background rounded">
      {item.sweetImageUrl && (
        <Image
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${item.sweetImageUrl}`}
          alt={item.sweetName}
          width={32}
          height={32}
          className="rounded object-cover"
        />
      )}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate">
          {item.sweetName}
        </div>
        <div className="text-xs text-muted-foreground">
          {item.quantity}x ₹{item.priceAtPurchase}
        </div>
      </div>
      <div className="text-sm font-medium">
        ₹{item.itemTotal.toFixed(2)}
      </div>
    </div>
  );
};

/**
 * Single order display
 */
export const OrderDisplay = ({ order }) => {
  return (
    <div className="border rounded-lg p-4 bg-muted/30">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">
            {new Date(order.orderDate).toLocaleDateString()}
          </span>
          <Badge variant="secondary">
            {order.items.length} items
          </Badge>
        </div>
        <div className="text-right">
          <div className="font-semibold">
            ₹{order.totalAmount.toFixed(2)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {order.items.map((item) => (
          <OrderItem
            key={item.purchaseId}
            item={item}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Customer card component
 */
export const CustomerCard = ({ customer, index, analytics }) => {
  const isTopCustomer = index < (analytics?.topCustomersCount || 0);
  const visibleOrders = customer.orders.slice(0, 3);
  const remainingOrders = customer.orders.length - 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${customer.userName}`}
                />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {customer.userName}
                  {isTopCustomer && (
                    <Badge variant="default" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Top Customer
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {customer.userEmail}
                </CardDescription>
                {customer.topFavoriteItem && (
                  <div className="text-xs text-muted-foreground mt-1">
                    Favorite: {customer.topFavoriteItem}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">
                Total Spent
              </div>
              <div className="text-xl font-bold text-green-600">
                ₹{customer.totalSpent.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">
                {customer.totalOrders} orders • Avg: ₹
                {customer.averageOrderValue.toFixed(2)}
              </div>
              {customer.lastOrderDate && (
                <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-1">
                  <Clock className="h-3 w-3" />
                  Last order:{" "}
                  {customer.lastOrderDate.toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <ShoppingBag className="h-4 w-4" />
              Recent Orders ({customer.orders.length})
            </div>

            <div className="space-y-3">
              {visibleOrders.map((order) => (
                <OrderDisplay key={order.orderId} order={order} />
              ))}

              {remainingOrders > 0 && (
                <div className="text-center">
                  <Button variant="ghost" size="sm">
                    View {remainingOrders} more orders
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

/**
 * Customer list component
 */
export const CustomerList = ({ customers, analytics, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (customers.length === 0) {
    return null; // Will be handled by EmptyCustomersState in parent
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {customers.map((customer, index) => (
          <CustomerCard
            key={customer.userId}
            customer={customer}
            index={index}
            analytics={analytics}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

/**
 * Customer stats summary component
 */
export const CustomerStatsSummary = ({ customer }) => {
  const stats = [
    {
      label: "Total Orders",
      value: customer.totalOrders,
      color: "blue",
    },
    {
      label: "Total Spent",
      value: `₹${customer.totalSpent.toFixed(2)}`,
      color: "green",
    },
    {
      label: "Avg Order",
      value: `₹${customer.averageOrderValue.toFixed(2)}`,
      color: "purple",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {stats.map((stat) => (
        <div key={stat.label} className="text-center p-2 bg-muted rounded">
          <div className="text-lg font-bold">{stat.value}</div>
          <div className="text-xs text-muted-foreground">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};