'use client';

import { useState, useEffect, Suspense } from 'react';
import {
  Box, Container, Heading, Text, Button, VStack, HStack, Flex,
  Card, CardBody, Badge, Input, InputGroup, InputRightElement,
  Divider, Spinner, Alert, AlertIcon,
} from '@chakra-ui/react';
import {
  Search, Package, Truck, CheckCircle, Clock, MapPin,
  ReceiptText, ArrowRight,
} from 'lucide-react';
import { Navbar } from '../../components/Navbar';
import { ordersApi, Order } from '../../lib/api';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '../../providers/AuthContext';
import NextLink from 'next/link';

// ─── Step definitions ──────────────────────────────────────────────────────────
const STATUS_STEPS = [
  { key: 'ACKNOWLEDGED', label: 'Order Placed', subLabel: 'We received your order', icon: Package, colorKey: 'brand.500', bgKey: 'brand.50' },
  { key: 'PAID', label: 'Payment Confirmed', subLabel: 'Payment successfully processed', icon: CheckCircle, colorKey: 'google.green', bgKey: 'google.lightGreen' },
  { key: 'DISPATCHED', label: 'Dispatched', subLabel: 'Your order is packed & shipped', icon: Package, colorKey: '#f97316', bgKey: '#fff7ed' },
  { key: 'IN_TRANSIT', label: 'In Transit', subLabel: 'On its way to you', icon: Truck, colorKey: '#8b5cf6', bgKey: '#f5f3ff' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', subLabel: 'Your delivery partner is nearby', icon: MapPin, colorKey: '#f59e0b', bgKey: '#fffbeb' },
  { key: 'DELIVERED', label: 'Delivered 🎉', subLabel: 'Enjoy your pickles!', icon: CheckCircle, colorKey: 'google.green', bgKey: 'google.lightGreen' },
];

const statusColorMap: Record<string, string> = {
  ACKNOWLEDGED: 'blue',
  PAID: 'green',
  DISPATCHED: 'orange',
  IN_TRANSIT: 'purple',
  OUT_FOR_DELIVERY: 'yellow',
  DELIVERED: 'green',
};

function getStatusIndex(status: string) {
  return STATUS_STEPS.findIndex((s) => s.key === status);
}

// ─── Receipt-style meta card ─────────────────────────────────────────────────
function OrderReceipt({ order }: { order: Order }) {
  const statusIdx = getStatusIndex(order.status);
  const step = STATUS_STEPS[statusIdx];

  return (
    <Card overflow="hidden">
      {/* Receipt header */}
      <Box
        bgGradient="linear(135deg, brand.600, brand.500)"
        px={6} py={5}
      >
        <Flex justify="space-between" align="start">
          <Box>
            <Text fontSize="11px" color="whiteAlpha.700" fontWeight="600" letterSpacing="0.08em" textTransform="uppercase" mb={1}>
              Order ID
            </Text>
            <Heading color="white" size="lg" fontWeight="800">#{order.id}</Heading>
          </Box>
          <Badge
            bg="whiteAlpha.300"
            color="white"
            borderRadius="full"
            fontSize="11px"
            fontWeight="700"
            px={3}
            py={1}
            textTransform="uppercase"
          >
            {order.status.replace(/_/g, ' ')}
          </Badge>
        </Flex>
      </Box>

      {/* Receipt body — GPay-style rows */}
      <CardBody p={0}>
        {[
          { label: 'Total Amount', value: `₹${order.totalAmount}`, bold: true },
          ...(order.paymentId ? [{ label: 'Payment ID', value: order.paymentId.slice(0, 24) + '...', mono: true }] : []),
          { label: 'Order Date', value: order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
          ...(order.trackingId ? [{ label: 'Tracking ID', value: order.trackingId, mono: true }] : []),
        ].map(({ label, value, bold, mono }, i, arr) => (
          <Flex
            key={label}
            px={6}
            py={4}
            justify="space-between"
            align="center"
            borderBottom={i < arr.length - 1 ? '1px dashed' : 'none'}
            borderColor="surface.100"
            _hover={{ bg: 'surface.50' }}
            transition="background 0.1s"
          >
            <Text fontSize="13px" color="surface.500">{label}</Text>
            <Text
              fontWeight={bold ? '800' : '600'}
              color={bold ? 'surface.900' : 'surface.700'}
              fontFamily={mono ? 'mono' : 'body'}
              fontSize={mono ? '12px' : '13px'}
            >
              {value}
            </Text>
          </Flex>
        ))}

        {/* Order items */}
        {order.items && order.items.length > 0 && (
          <>
            <Box px={6} pt={4} pb={2}>
              <Text fontSize="11px" color="surface.400" fontWeight="700" letterSpacing="0.08em" textTransform="uppercase">
                Items
              </Text>
            </Box>
            {order.items.map((item) => (
              <Flex
                key={item.id}
                px={6} py={3}
                justify="space-between"
                align="center"
                _hover={{ bg: 'surface.50' }}
              >
                <HStack spacing={3}>
                  <Box w="6px" h="6px" borderRadius="full" bg="brand.500" flexShrink={0} />
                  <Text fontSize="13px" color="surface.700">
                    Product #{item.productId} <Text as="span" color="surface.400">×{item.quantity}</Text>
                  </Text>
                </HStack>
                <Text fontSize="13px" fontWeight="700" color="surface.900">₹{item.price}</Text>
              </Flex>
            ))}
            <Flex px={6} py={4} justify="space-between" borderTop="2px solid" borderColor="surface.100">
              <Text fontWeight="700" fontSize="14px" color="surface.900">Total</Text>
              <Text fontWeight="800" fontSize="14px" color="brand.600">₹{order.totalAmount}</Text>
            </Flex>
          </>
        )}
      </CardBody>
    </Card>
  );
}

// ─── Timeline stepper ─────────────────────────────────────────────────────────
function DeliveryTimeline({ order }: { order: Order }) {
  const currentStep = getStatusIndex(order.status);

  return (
    <Card>
      <CardBody p={6}>
        <HStack mb={6} spacing={2}>
          <Truck size={18} color="#1a73e8" />
          <Heading size="sm" color="surface.900">Delivery Progress</Heading>
        </HStack>

        <VStack spacing={0} align="stretch">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx <= currentStep;
            const isCurrent = idx === currentStep;
            const isPending = idx > currentStep;
            const Icon = step.icon;
            const isLast = idx === STATUS_STEPS.length - 1;

            return (
              <Flex key={step.key} gap={4} pb={isLast ? 0 : 6} position="relative">
                {/* Connector line */}
                {!isLast && (
                  <Box
                    position="absolute"
                    left="19px"
                    top="40px"
                    w="2px"
                    h="calc(100% - 14px)"
                    bgGradient={
                      isCompleted && idx < currentStep
                        ? 'linear(to-b, brand.500, brand.400)'
                        : isPending
                        ? 'linear(to-b, surface.200, surface.200)'
                        : 'linear(to-b, brand.500, surface.200)'
                    }
                    transition="all 0.4s ease"
                    borderRadius="full"
                  />
                )}

                {/* Step icon */}
                <Box
                  w="40px" h="40px"
                  borderRadius="full"
                  bg={isCompleted ? step.bgKey : 'surface.100'}
                  border="2.5px solid"
                  borderColor={isCompleted ? step.colorKey : 'surface.200'}
                  display="flex" alignItems="center" justifyContent="center"
                  flexShrink={0}
                  transition="all 0.35s ease"
                  boxShadow={
                    isCurrent
                      ? `0 0 0 6px rgba(26,115,232,0.12), 0 0 0 12px rgba(26,115,232,0.06)`
                      : 'none'
                  }
                  className={isCurrent ? 'pulse-ring' : ''}
                  zIndex={1}
                  position="relative"
                >
                  <Icon
                    size={17}
                    color={isCompleted ? step.colorKey : '#bdc1c6'}
                  />
                </Box>

                {/* Step label */}
                <Box pt={1.5}>
                  <Text
                    fontWeight={isCurrent ? '700' : isCompleted ? '600' : '400'}
                    fontSize="14px"
                    color={isPending ? 'surface.400' : 'surface.900'}
                    transition="all 0.2s"
                  >
                    {step.label}
                  </Text>
                  <Text
                    fontSize="12px"
                    color={isCurrent ? 'brand.500' : 'surface.400'}
                    fontWeight={isCurrent ? '500' : '400'}
                    mt={0.5}
                  >
                    {isCurrent ? `Current Status — ${step.subLabel}` : step.subLabel}
                  </Text>
                </Box>
              </Flex>
            );
          })}
        </VStack>
      </CardBody>
    </Card>
  );
}

// ─── Inner page content (needs Suspense for useSearchParams) ────────────────
function TrackPageContent() {
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  const [orderId, setOrderId] = useState(searchParams?.get('id') || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const id = searchParams?.get('id');
    if (id) { setOrderId(id); handleTrack(id); }
  }, []);

  const handleTrack = async (id?: string) => {
    const trackId = id || orderId;
    if (!trackId) return;
    if (!isAuthenticated) { setError('Please sign in to track your order'); return; }
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const data = await ordersApi.track(parseInt(trackId));
      if (!data) { setError('Order not found. Please check the order ID.'); setOrder(null); }
      else setOrder(data);
    } catch (err: any) {
      setError(err.message || 'Unable to track order. Please try again.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="760px" px={6} py={12}>
      <VStack spacing={8} align="stretch">

        {/* Header */}
        <VStack textAlign="center" spacing={2}>
          <Box
            w="60px" h="60px" borderRadius="20px"
            bgGradient="linear(135deg, brand.500, brand.700)"
            display="flex" alignItems="center" justifyContent="center"
            boxShadow="0 4px 16px rgba(26,115,232,0.3)"
            mb={2}
          >
            <ReceiptText size={26} color="white" />
          </Box>
          <Heading size="xl" color="surface.900" letterSpacing="-0.03em">Track Your Order</Heading>
          <Text color="surface.500" fontSize="15px" maxW="340px">
            Enter your order ID to get real-time delivery updates
          </Text>
        </VStack>

        {/* Search card */}
        <Card>
          <CardBody p={6}>
            <InputGroup size="lg">
              <Input
                id="track-order-input"
                placeholder="Order ID (e.g. 42)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                borderRadius="12px"
                fontSize="15px"
                onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                type="number"
                bg="surface.50"
                _focus={{ bg: 'white' }}
              />
              <InputRightElement w="auto" pr={1.5} h="full">
                <Button
                  id="track-search-btn"
                  h="44px"
                  px={6}
                  borderRadius="10px"
                  leftIcon={<Search size={15} />}
                  onClick={() => handleTrack()}
                  isLoading={loading}
                  fontSize="14px"
                  fontWeight="600"
                >
                  Track
                </Button>
              </InputRightElement>
            </InputGroup>

            {!isAuthenticated && (
              <Alert status="warning" mt={4} borderRadius="10px" fontSize="13px">
                <AlertIcon />
                <Text>
                  Please{' '}
                  <Button as={NextLink} href="/login" variant="link" fontSize="13px" color="brand.500">
                    sign in
                  </Button>
                  {' '}to track your orders.
                </Text>
              </Alert>
            )}
          </CardBody>
        </Card>

        {/* Loading */}
        {loading && (
          <Flex justify="center" py={10}>
            <VStack spacing={3}>
              <Spinner size="lg" color="brand.500" thickness="3px" speed="0.65s" />
              <Text color="surface.400" fontSize="14px">Fetching order details...</Text>
            </VStack>
          </Flex>
        )}

        {/* Error */}
        {error && !loading && (
          <Alert status="error" borderRadius="12px">
            <AlertIcon />
            <Text fontSize="14px">{error}</Text>
          </Alert>
        )}

        {/* Order Result */}
        {order && !loading && (
          <VStack spacing={5} align="stretch" className="fade-in">
            <OrderReceipt order={order} />
            <DeliveryTimeline order={order} />
          </VStack>
        )}

        {/* Empty state */}
        {!loading && !order && !error && !searched && (
          <VStack py={16} spacing={4} textAlign="center">
            <Box fontSize="60px">📦</Box>
            <Text color="surface.400" fontSize="15px">Enter your order ID above to track your delivery</Text>
            {isAuthenticated && (
              <Button
                as={NextLink}
                href="/shop"
                variant="outline"
                size="sm"
                borderRadius="full"
                rightIcon={<ArrowRight size={14} />}
              >
                Browse Shop
              </Button>
            )}
          </VStack>
        )}
      </VStack>
    </Container>
  );
}

// ─── Export with Suspense boundary ───────────────────────────────────────────
export default function TrackPage() {
  return (
    <Box minH="100vh" bg="surface.50">
      <Navbar />
      <Suspense fallback={
        <Flex justify="center" align="center" py={24}>
          <Spinner size="lg" color="brand.500" thickness="3px" />
        </Flex>
      }>
        <TrackPageContent />
      </Suspense>
    </Box>
  );
}
