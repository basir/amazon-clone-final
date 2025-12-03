"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  CreditCard,
  Activity,
  Users,
} from "lucide-react";
import { OverviewChart } from "@/components/OverviewChart";
import { RecentOrders } from "@/components/RecentOrders";
import { StatsCard } from "@/components/StatsCard";
import { api, Order } from "@/lib/api";

export default function Home() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<{ name: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await api.getStats();
        const ordersData = await api.getOrders();
        const monthlyData = await api.getMonthlyRevenue();
        setStats(statsData);
        setOrders(ordersData);
        setMonthlyRevenue(monthlyData);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-8">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
          Dashboard
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          description="Total earnings"
        />
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders.toString()}
          icon={CreditCard}
          description="Total orders placed"
        />
        <StatsCard
          title="Total Products"
          value={stats.totalProducts.toString()}
          icon={Activity}
          description="Products in inventory"
        />
        <StatsCard
          title="Total Users"
          value={stats.totalUsers.toString()}
          icon={Users}
          description="Registered users"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <OverviewChart data={monthlyRevenue} />
        </div>
        <div className="col-span-3">
          <RecentOrders orders={orders} />
        </div>
      </div>
    </div>
  );
}
