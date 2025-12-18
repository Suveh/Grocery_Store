"use client";
import GlobalApi from "@/app/_utils/GlobalApi";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger,} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Package, Calendar, CreditCard, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react";

function MyOrder() {
  const [jwt, setJwt] = useState(null);
  const [user, setUser] = useState(null);
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const jwtToken = sessionStorage.getItem("jwt");
    const userData = sessionStorage.getItem("user");

    setJwt(jwtToken);
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (!jwt) {
      return;
    }

    if (user && jwt) {
      getMyOrder();
    }
  }, [user, jwt]);

  const getMyOrder = async () => {
    setLoading(true);
    try {
      const orderList_ = await GlobalApi.getMyOrder(user.id, jwt);
      console.log("Orders:", orderList_);
      // Sort orders by date (newest first)
      const sortedOrders = (orderList_ || []).sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrderList(sortedOrders);
    } catch (error) {
      console.error("Order Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-600" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-orange-600" />;
      case 'cancelled':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending': 
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-white flex items-center justify-center">
            <Package className="mr-3 h-8 w-8" />
            My Orders
          </h2>
        </div>
        <div className="py-12 mx-4 md:mx-20">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
              <p className="text-lg text-gray-600">Loading your orders...</p>
              <p className="text-sm text-gray-500">Please wait while we fetch your order history</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-primary p-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-white flex items-center justify-center">
            <Package className="mr-3 h-8 w-8" />
            My Orders
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8 mx-4 md:mx-20">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Order History
            </h2>
            <p className="text-gray-600">
              {orderList.length} order{orderList.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {orderList.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Orders Yet
                </h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  You haven't placed any orders yet. Start shopping to see your orders here!
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              orderList.map((item, index) => (
                <Collapsible 
                  key={item.id} 
                  open={expandedOrder === item.id}
                  onOpenChange={() => setExpandedOrder(expandedOrder === item.id ? null : item.id)}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 overflow-hidden"
                >
                  <CollapsibleTrigger className="w-full p-6 hover:bg-gray-50 transition-colors duration-200 flex justify-between items-center">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4">
                      {/* Order Info */}
                      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-3 rounded-lg">
                            <Package className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-800">ORDER #{item.id}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              <p className="text-sm text-gray-600">
                                {new Date(item.createdAt).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Amount & Status */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="text-right">
                          <p className="text-xl font-bold text-gray-900">
                            Rs. {item.totalOrderAmount?.toFixed(2) || "0.00"}
                          </p>
                          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)}
                            <span>{item.status || "Pending"}</span>
                          </div>
                        </div>
                        
                        <div className="shrink-0">
                          {expandedOrder === item.id ? (
                            <ChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="border-t border-gray-200">
                    <div className="p-6">
                      <h4 className="font-semibold text-lg text-gray-800 mb-4 ml-2 flex items-center gap-2">
                        
                        Items
                      </h4>
                      
                      {item.orderItemList?.length > 0 ? (
                        <div className="space-y-3">
                          {item.orderItemList.map((orderItem, idx) => (
                            <div 
                              key={idx} 
                              className="flex items-center gap-4 p-4 bg-gray-200 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                            >
                              {/* Product Image */}
                              <div className="shrink-0">
                                {orderItem.product?.image?.[0]?.url ? (
                                  <img 
                                    src={`http://localhost:1337${orderItem.product.image[0].url}`}
                                    alt={orderItem.product.name}
                                    className="w-20 h-20 object-cover rounded-lg shadow-sm"
                                    onError={(e) => {
                                      e.target.src = `https://via.placeholder.com/80x80/f3f4f6/6b7280?text=${encodeURIComponent(orderItem.product?.name?.charAt(0) || 'P')}`;
                                    }}
                                  />
                                ) : (
                                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                                    <Package className="h-8 w-8 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              
                              {/* Product Details */}
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 text-lg">
                                  {orderItem.product?.name || "Unknown Product"}
                                </p>
                                <div className="flex flex-wrap gap-4 mt-2">
                                  <p className="text-sm text-gray-600">
                                    Quantity: <span className="font-semibold">{orderItem.quantity}</span>
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Price: <span className="font-semibold">Rs. {orderItem.price?.toFixed(2)}</span> each
                                  </p>
                                </div>
                              </div>
                              
                              {/* Subtotal */}
                              <div className="text-right">
                                <p className="text-sm text-gray-500">Subtotal</p>
                                <p className="text-lg font-bold text-gray-900">
                                  Rs. {(orderItem.quantity * orderItem.price)?.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                          
                          {/* Order Summary */}
                          <div className="mt-6 pt-6 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm text-gray-600">Items Total</p>
                                <p className="text-2xl font-bold text-gray-900">
                                  Rs. {item.totalOrderAmount?.toFixed(2)}
                                </p>
                              </div>

                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-xl">
                          <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No items found in this order</p>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-8 text-center text-sm text-gray-500 pb-6">
        <p>Having trouble viewing your orders? <button className="text-primary hover:underline font-medium">Contact our support team</button></p>
      </div>
    </div>
  );
}

export default MyOrder;
