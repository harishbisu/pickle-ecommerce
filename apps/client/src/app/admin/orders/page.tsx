"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Select,
  Spinner,
  Center,
  Text,
  useToast,
  Card,
  CardBody,
  VStack,
  HStack,
  Button,
  Flex,
} from "@chakra-ui/react";
import { ordersApi, Order } from "../../../lib/api";

const statusColor: Record<string, string> = {
  ACKNOWLEDGED: "blue",
  PAID: "green",
  DISPATCHED: "orange",
  IN_TRANSIT: "yellow",
  OUT_FOR_DELIVERY: "purple",
  DELIVERED: "green",
  CANCELLED: "red",
};

const ORDER_STATUSES = [
  "ACKNOWLEDGED",
  "PAID",
  "DISPATCHED",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const toast = useToast();
  const PAGE_SIZE = 5;

  const fetchOrders = async (pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await ordersApi.list({
        page: pageNum,
        limit: PAGE_SIZE,
        status: filterStatus || undefined,
        date: filterDate || undefined,
      });

      // Handle old API vs new API format
      let fetchedOrders = [];
      let total = 0;
      if (Array.isArray(res)) {
        fetchedOrders = res;
      } else {
        fetchedOrders = res.data;
        total = res.total;
      }

      if (append) {
        setOrders((prev) => [...prev, ...fetchedOrders]);
      } else {
        setOrders(fetchedOrders);
      }

      setHasMore(res.hasMore);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to load orders", status: "error" });
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchOrders(1, false);
  }, [filterStatus, filterDate]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchOrders(nextPage, true);
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      toast({ title: "Status updated", status: "success", duration: 2000 });
      setOrders(
        orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
      );
    } catch {
      toast({ title: "Failed to update status", status: "error" });
    }
  };

  return (
    <Box>
      <Flex
        justify="space-between"
        align="center"
        mb={6}
        flexWrap="wrap"
        gap={4}
      >
        <Text fontSize="2xl" fontWeight="bold" color="surface.900">
          Manage Orders
        </Text>
        <HStack spacing={4}>
          <Select
            placeholder="All Statuses"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            bg="white"
            borderRadius="md"
            shadow="sm"
          >
            <option value="PAID">Pending Payment (PAID)</option>
            <option value="DELIVERED">Delivered</option>
            {ORDER_STATUSES.filter(
              (s) => s !== "PAID" && s !== "DELIVERED",
            ).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </Select>

          <Select
            placeholder="All Dates"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            bg="white"
            borderRadius="md"
            shadow="sm"
          >
            <option value="today">Today</option>
          </Select>
        </HStack>
      </Flex>

      <Card shadow="md" maxW={"7xl"} borderRadius="lg" overflow="hidden">
        <CardBody p={0}>
          {loading ? (
            <Center py={20}>
              <Spinner size="xl" color="brand.500" thickness="4px" />
            </Center>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple" size="md">
                <Thead bg="surface.50">
                  <Tr>
                    <Th
                      minW={"200px"}
                      py={4}
                      color="surface.600"
                      fontWeight="600"
                    >
                      Order ID & Date
                    </Th>
                    <Th py={4} color="surface.600" fontWeight="600">
                      Customer
                    </Th>
                    <Th
                      minW={"200px"}
                      py={4}
                      color="surface.600"
                      fontWeight="600"
                    >
                      Items
                    </Th>
                    <Th py={4} color="surface.600" fontWeight="600">
                      Payment Details
                    </Th>
                    <Th py={4} color="surface.600" fontWeight="600">
                      Total (₹)
                    </Th>
                    <Th py={4} color="surface.600" fontWeight="600">
                      Status
                    </Th>
                    <Th py={4} color="surface.600" fontWeight="600">
                      Actions
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {orders.length === 0 ? (
                    <Tr>
                      <Td
                        colSpan={6}
                        textAlign="center"
                        py={12}
                        color="surface.500"
                      >
                        <VStack spacing={2}>
                          <Text fontSize="lg" fontWeight="500">
                            No orders found
                          </Text>
                          <Text fontSize="sm">Try adjusting your filters</Text>
                        </VStack>
                      </Td>
                    </Tr>
                  ) : (
                    orders.map((order) => {
                      const addressJson = JSON.parse(
                        order.shippingAddress || "{}",
                      );
                      return (
                        <Tr
                          key={order.id}
                          _hover={{ bg: "surface.50" }}
                          transition="all 0.2s"
                        >
                          <Td>
                            <Text fontWeight="600" color="brand.600">
                              #{order.orderNumber}
                            </Text>
                            <Text fontSize="xs" color="surface.500" mt={1}>
                              {new Date(order.createdAt).toLocaleString()}
                            </Text>
                          </Td>
                          <Td>
                            <Text fontWeight="600">
                              {order.shippingName || "Unknown"}
                            </Text>
                            {order.shippingPhone && (
                              <Text fontSize="xs" color="surface.500">
                                {order.shippingPhone}
                              </Text>
                            )}
                            {order.shippingAddress && (
                              <Text fontSize="12px" color="surface.600">
                                {addressJson.street && `${addressJson.street}`}
                                {addressJson.city && `, ${addressJson.city}`}
                                {order.shippingState &&
                                  `, ${order.shippingState}`}
                                {addressJson.pincode &&
                                  `, ${addressJson.pincode}`}
                              </Text>
                            )}
                          </Td>
                          <Td>
                            <VStack align="start" spacing={1}>
                              {order.items?.map((item) => (
                                <Text key={item.productId} fontSize="sm">
                                  {item.quantity} x {item.productName}
                                </Text>
                              ))}
                            </VStack>
                          </Td>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Badge
                                colorScheme={
                                  order.status !== "ACKNOWLEDGED" &&
                                  order.paymentId
                                    ? "green"
                                    : "red"
                                }
                                fontSize="xs"
                              >
                                {order.status !== "ACKNOWLEDGED" &&
                                order.paymentId
                                  ? "Paid via Razorpay"
                                  : "Not Confirmed"}
                              </Badge>
                              {order.paymentId && (
                                <Text
                                  fontSize="xs"
                                  color="surface.500"
                                  fontFamily="mono"
                                >
                                  {order.paymentId}
                                </Text>
                              )}
                            </VStack>
                          </Td>
                          <Td fontWeight="700" color="surface.800">
                            ₹{parseFloat(order.totalAmount).toFixed(2)}
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={statusColor[order.status] || "gray"}
                              borderRadius="full"
                              px={3}
                              py={1}
                              fontSize="xs"
                              fontWeight="600"
                            >
                              {order.status}
                            </Badge>
                          </Td>
                          <Td>
                            <Select
                              size="sm"
                              value={order.status}
                              onChange={(e) =>
                                handleStatusChange(order.id, e.target.value)
                              }
                              borderRadius="md"
                              w="140px"
                              bg="white"
                            >
                              {ORDER_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </Select>
                          </Td>
                        </Tr>
                      );
                    })
                  )}
                </Tbody>
              </Table>
            </Box>
          )}

          {!loading && hasMore && (
            <Center p={6} borderTop="1px solid" borderColor="surface.100">
              <Button
                onClick={handleLoadMore}
                isLoading={loadingMore}
                colorScheme="brand"
                variant="outline"
                size="md"
                borderRadius="full"
                px={8}
              >
                Load More Orders
              </Button>
            </Center>
          )}
        </CardBody>
      </Card>
    </Box>
  );
}
