"use client";
import { getMyOrders } from '@/lib/api/Orders'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const page = () => {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'loading') return; // Wait for session to finish loading
    
    const fetchOrders = async () => {
      if (session?.user?.token) {
        try {
          const response = await getMyOrders(
            session.user.token,
            session.user.id
          );
          console.log(response);
          setOrders(response.data.purchases || []);
        } catch (err) {
          console.error("Error fetching orders:", err);
          setError('Failed to load orders');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [status]); // Only depend on status, not session
  
  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">My Orders</h1>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <Card key={index} className="w-full">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Skeleton className="w-20 h-20 rounded-lg" />
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-1/2" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
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
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      
      {orders.length === 0 ? (
        <Card className="w-full">
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">You haven't placed any orders yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {orders.map((order) => (
            <Card key={order.purchaseId} className="w-full hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{order.sweetName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  {order.sweetImageUrl && (
                    <Image 
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${order.sweetImageUrl}`} 
                      alt={order.sweetName} 
                      width={80} 
                      height={80} 
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-gray-600 font-medium">{order.sweetCategory}</p>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p><span className="font-medium">Quantity:</span> {order.quantity}</p>
                      <p><span className="font-medium">Price:</span> ₹{order.priceAtPurchase}</p>
                      <p><span className="font-medium">Purchased:</span> {new Date(order.purchasedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default page;