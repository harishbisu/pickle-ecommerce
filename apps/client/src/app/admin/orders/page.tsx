'use client';

import { useState, useEffect } from 'react';
import { 
  Box, Table, Thead, Tbody, Tr, Th, Td, Badge, Select, 
  Spinner, Center, Text, useToast, Card, CardBody 
} from '@chakra-ui/react';
import { ordersApi, Order } from '../../../lib/api';

const statusColor: Record<string, string> = {
  ACKNOWLEDGED: 'blue',
  PAID: 'green',
  DISPATCHED: 'orange',
  IN_TRANSIT: 'yellow',
  OUT_FOR_DELIVERY: 'purple',
  DELIVERED: 'green',
  CANCELLED: 'red',
};

const ORDER_STATUSES = [
  'ACKNOWLEDGED', 'PAID', 'DISPATCHED',
  'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED',
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await ordersApi.list();
      setOrders(data);
    } catch (err) {
      console.error(err);
      toast({ title: 'Failed to load orders', status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      toast({ title: 'Status updated', status: 'success', duration: 2000 });
      fetchOrders();
    } catch {
      toast({ title: 'Failed to update status', status: 'error' });
    }
  };

  if (loading) {
    return (
      <Center py={12}>
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  return (
    <Box>
      <Text fontSize="xl" fontWeight="bold" mb={6} color="surface.900">Manage Orders</Text>
      <Card>
        <CardBody>
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead bg="surface.50">
                <Tr>
                  <Th py={4} color="surface.600">Order ID</Th>
                  <Th py={4} color="surface.600">Date</Th>
                  <Th py={4} color="surface.600">Total (₹)</Th>
                  <Th py={4} color="surface.600">Status</Th>
                  <Th py={4} color="surface.600">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.length === 0 ? (
                  <Tr>
                    <Td colSpan={5} textAlign="center" py={8} color="surface.500">
                      No orders found
                    </Td>
                  </Tr>
                ) : (
                  orders.map((order) => (
                    <Tr key={order.id} _hover={{ bg: 'surface.50' }}>
                      <Td fontWeight="600">#{order.id}</Td>
                      <Td color="surface.600">{new Date(order.createdAt).toLocaleDateString()}</Td>
                      <Td fontWeight="600">₹{parseFloat(order.totalAmount).toFixed(2)}</Td>
                      <Td>
                        <Badge colorScheme={statusColor[order.status] || 'gray'} borderRadius="full" px={2} py={0.5}>
                          {order.status}
                        </Badge>
                      </Td>
                      <Td>
                        <Select
                          size="xs"
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          borderRadius="6px"
                          w="140px"
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </Select>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}
