"use client";

import { useEffect, useState } from "react";
import { SimpleGrid, Spinner, Center, Text } from "@chakra-ui/react";
import { IndianRupee, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { StatCard } from "../../components/admin/StatCard";
import { ordersApi, Order } from "@/lib/api";

export default function DashboardOverview() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersApi.list();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <Center py={12}>
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  const totalRevenue = orders.reduce(
    (acc, order) => acc + parseFloat(order.totalAmount),
    0,
  );
  const totalOrders = orders.length;

  return (
    <>
      <Text fontSize="xl" fontWeight="bold" mb={6} color="surface.900">
        Dashboard Overview
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <StatCard
          label="Total Revenue"
          value={`₹${totalRevenue.toFixed(2)}`}
          icon={IndianRupee}
          color="#0d9488"
          bg="#ccfbf1"
          help="All time"
        />
        <StatCard
          label="Total Orders"
          value={totalOrders}
          icon={ShoppingBag}
          color="#2563eb"
          bg="#dbeafe"
          help="All time"
        />
        <StatCard
          label="Conversion Rate"
          value="4.2%"
          icon={TrendingUp}
          color="#ea580c"
          bg="#ffedd5"
          help="+0.8% from last month"
        />
        <StatCard
          label="Active Users"
          value="1,249"
          icon={Users}
          color="#9333ea"
          bg="#f3e8ff"
          help="In the last 30 days"
        />
      </SimpleGrid>
    </>
  );
}
