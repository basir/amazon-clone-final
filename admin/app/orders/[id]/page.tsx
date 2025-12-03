"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, MapPin } from "lucide-react";
import { api, Order } from "@/lib/api";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            if (typeof params.id === "string") {
                try {
                    const data = await api.getOrder(params.id);
                    setOrder(data);
                } catch (error) {
                    console.error("Error fetching order:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchOrder();
    }, [params.id]);

    const handleStatusUpdate = async (newStatus: string) => {
        if (!order) return;
        setUpdating(true);
        try {
            await api.updateOrderStatus(order.id, newStatus);
            setOrder({ ...order, status: newStatus });
        } catch (error) {
            console.error("Error updating status:", error);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <div className="p-8">Loading order details...</div>;
    }

    if (!order) {
        return <div className="p-8">Order not found</div>;
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Completed":
            case "Delivered":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "Processing":
            case "Shipped":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
            case "Cancelled":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            default:
                return "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-400";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                >
                    <ArrowLeft className="h-4 w-4" />
                </button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                        Order #{order.id}
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                        {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Order Items
                        </h3>
                        <div className="space-y-4">
                            {order.items?.map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 dark:border-zinc-800"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                                            {item.productImage && (
                                                <img
                                                    src={item.productImage}
                                                    alt={item.productName}
                                                    className="h-full w-full object-cover"
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-zinc-900 dark:text-white">
                                                {item.productName}
                                            </p>
                                            <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-medium text-zinc-900 dark:text-white">
                                        ${item.price}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end border-t pt-4 dark:border-zinc-800">
                            <div className="text-right">
                                <p className="text-sm text-zinc-500 dark:text-zinc-400">Total Amount</p>
                                <p className="text-2xl font-bold text-zinc-900 dark:text-white">
                                    ${order.totalAmount}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Order Status
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-zinc-500 dark:text-zinc-400">Current Status</span>
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                                        order.status
                                    )}`}
                                >
                                    {order.status}
                                </span>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-900 dark:text-white">
                                    Update Status
                                </label>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusUpdate(e.target.value)}
                                    disabled={updating}
                                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:border-zinc-50"
                                >
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="rounded-xl border bg-white p-6 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
                        <h3 className="mb-4 text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Shipping Info
                        </h3>
                        <div className="space-y-4 text-sm">
                            <div>
                                <p className="text-zinc-500 dark:text-zinc-400">User ID</p>
                                <p className="font-medium text-zinc-900 dark:text-white">{order.userId}</p>
                            </div>
                            {order.shippingAddress && (
                                <div>
                                    <p className="text-zinc-500 dark:text-zinc-400">Address</p>
                                    <p className="font-medium text-zinc-900 dark:text-white">
                                        {order.shippingAddress.fullName}<br />
                                        {order.shippingAddress.address}<br />
                                        {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                                        {order.shippingAddress.country}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
