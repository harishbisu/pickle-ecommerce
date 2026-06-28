"use client";

import { useState, useEffect, Suspense } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Flex,
  Card,
  CardBody,
  Badge,
  Input,
  InputGroup,
  InputRightElement,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  ReceiptText,
  ArrowRight,
  ShoppingBag,
} from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { ordersApi, Order } from "../../lib/api";
import { useSearchParams } from "next/navigation";
import { useAuth } from "../../providers/AuthContext";
import NextLink from "next/link";

// ─── Step definitions ──────────────────────────────────────────────────────────
const STATUS_STEPS = [
  {
    key: "ACKNOWLEDGED",
    label: "Order Placed",
    subLabel: "We received your order",
    icon: Package,
    colorKey: "#1a73e8",
    bgKey: "#e5f3ff",
  },
  {
    key: "PAID",
    label: "Payment Confirmed",
    subLabel: "Payment successfully processed",
    icon: CheckCircle,
    colorKey: "#10b981",
    bgKey: "#d1fae5",
  },
  {
    key: "DISPATCHED",
    label: "Dispatched",
    subLabel: "Your order is packed & shipped",
    icon: Package,
    colorKey: "#f97316",
    bgKey: "#fff7ed",
  },
  {
    key: "IN_TRANSIT",
    label: "In Transit",
    subLabel: "On its way to you",
    icon: Truck,
    colorKey: "#8b5cf6",
    bgKey: "#f5f3ff",
  },
  {
    key: "OUT_FOR_DELIVERY",
    label: "Out for Delivery",
    subLabel: "Your delivery partner is nearby",
    icon: MapPin,
    colorKey: "#f59e0b",
    bgKey: "#fffbeb",
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    subLabel: "Enjoy your pickles!",
    icon: CheckCircle,
    colorKey: "#10b981",
    bgKey: "#d1fae5",
  },
];

const statusColorMap: Record<string, string> = {
  ACKNOWLEDGED: "blue",
  PAID: "green",
  DISPATCHED: "orange",
  IN_TRANSIT: "purple",
  OUT_FOR_DELIVERY: "yellow",
  DELIVERED: "green",
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
      <Box bgGradient="linear(135deg, brand.600, brand.500)" px={6} py={5}>
        <Flex justify="space-between" align="start">
          <Box>
            <Text
              fontSize="11px"
              color="whiteAlpha.700"
              fontWeight="600"
              letterSpacing="0.08em"
              textTransform="uppercase"
              mb={1}
            >
              Order ID
            </Text>
            <Heading color="white" size="lg" fontWeight="800">
              #{order.id}
            </Heading>
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
            {order.status.replace(/_/g, " ")}
          </Badge>
        </Flex>
      </Box>

      {/* Receipt body — GPay-style rows */}
      <CardBody p={0}>
        {[
          ...(order.totalAmount
            ? [
                {
                  label: "Total Amount",
                  value: `₹${order.totalAmount}`,
                  bold: true,
                },
              ]
            : []),
          ...(order.paymentId
            ? [
                {
                  label: "Payment ID",
                  value: order.paymentId.slice(0, 24) + "...",
                  mono: true,
                },
              ]
            : []),
          {
            label: "Order Date",
            value: order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "—",
          },
          ...(order.trackingId
            ? [{ label: "Tracking ID", value: order.trackingId, mono: true }]
            : []),
        ].map(({ label, value, bold, mono }, i, arr) => (
          <Flex
            key={label}
            px={6}
            py={4}
            justify="space-between"
            align="center"
            borderBottom={i < arr.length - 1 ? "1px dashed" : "none"}
            borderColor="surface.100"
            _hover={{ bg: "surface.50" }}
            transition="background 0.1s"
          >
            <Text fontSize="13px" color="surface.500">
              {label}
            </Text>
            <Text
              fontWeight={bold ? "800" : "600"}
              color={bold ? "surface.900" : "surface.700"}
              fontFamily={mono ? "mono" : "body"}
              fontSize={mono ? "12px" : "13px"}
            >
              {value}
            </Text>
          </Flex>
        ))}

        {/* Order items */}
        {order.items && order.items.length > 0 && (
          <>
            <Box px={6} pt={4} pb={2}>
              <Text
                fontSize="11px"
                color="surface.400"
                fontWeight="700"
                letterSpacing="0.08em"
                textTransform="uppercase"
              >
                Items
              </Text>
            </Box>
            {order.items.map((item) => (
              <Flex
                key={item.id}
                px={6}
                py={3}
                justify="space-between"
                align="center"
                _hover={{ bg: "surface.50" }}
              >
                <HStack spacing={3}>
                  <Box
                    w="6px"
                    h="6px"
                    borderRadius="full"
                    bg="brand.500"
                    flexShrink={0}
                  />
                  <Text fontSize="13px" color="surface.700">
                    Product #{item.productId}{" "}
                    <Text as="span" color="surface.400">
                      ×{item.quantity}
                    </Text>
                  </Text>
                </HStack>
                <Text fontSize="13px" fontWeight="700" color="surface.900">
                  ₹{item.price}
                </Text>
              </Flex>
            ))}
            <Flex
              px={6}
              py={4}
              justify="space-between"
              borderTop="2px solid"
              borderColor="surface.100"
            >
              <Text fontWeight="700" fontSize="14px" color="surface.900">
                Total
              </Text>
              <Text fontWeight="800" fontSize="14px" color="brand.600">
                ₹{order.totalAmount}
              </Text>
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
    <Card
      borderRadius="2xl"
      border="1px solid"
      borderColor="surface.200"
      overflow="hidden"
    >
      <CardBody p={6}>
        <HStack justify="space-between" mb={7}>
          <HStack spacing={3}>
            <Flex
              w="42px"
              h="42px"
              bg="brand.50"
              borderRadius="xl"
              align="center"
              justify="center"
            >
              <Truck size={18} color="#1a73e8" />
            </Flex>

            <Box>
              <Heading size="sm" color="surface.900">
                Delivery Progress
              </Heading>

              <Text fontSize="13px" color="surface.500">
                Track your shipment status
              </Text>
            </Box>
          </HStack>
        </HStack>

        <VStack spacing={0} align="stretch">
          {STATUS_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isCurrent = idx === currentStep;
            const isPending = idx > currentStep;
            const isLast = idx === STATUS_STEPS.length - 1;
            const Icon = step.icon;

            return (
              <Flex
                key={step.key}
                gap={4}
                pb={isLast ? 0 : 8}
                position="relative"
              >
                {!isLast && (
                  <Box
                    position="absolute"
                    left="21px"
                    top="44px"
                    w="2px"
                    h="calc(100% - 12px)"
                    bg={
                      isCompleted
                        ? "brand.500"
                        : isCurrent
                          ? "linear-gradient(#1A73E8,#E5E7EB)"
                          : "surface.200"
                    }
                  />
                )}

                <Flex
                  w="44px"
                  h="44px"
                  borderRadius="full"
                  align="center"
                  justify="center"
                  flexShrink={0}
                  bg={
                    isCompleted
                      ? step.bgKey
                      : isCurrent
                        ? "brand.50"
                        : "surface.50"
                  }
                  border="2px solid"
                  borderColor={
                    isCompleted
                      ? step.colorKey
                      : isCurrent
                        ? "brand.500"
                        : "surface.200"
                  }
                  boxShadow={
                    isCurrent ? "0 6px 18px rgba(26,115,232,.15)" : "sm"
                  }
                >
                  <Icon
                    size={18}
                    color={isCompleted || isCurrent ? step.colorKey : "#9ca3af"}
                  />
                </Flex>

                <Box flex="1" pt={1}>
                  <HStack justify="space-between" align="start">
                    <Text
                      fontWeight="600"
                      fontSize="15px"
                      color={isPending ? "surface.500" : "surface.900"}
                    >
                      {step.label}
                    </Text>

                    <Badge
                      borderRadius="full"
                      px={3}
                      py={1}
                      colorScheme={
                        isCompleted ? "green" : isCurrent ? "blue" : "gray"
                      }
                      textTransform="none"
                      fontWeight="600"
                      fontSize="11px"
                    >
                      {isCompleted
                        ? "Completed"
                        : isCurrent
                          ? "Current"
                          : "Pending"}
                    </Badge>
                  </HStack>

                  <Text
                    mt={1}
                    fontSize="13px"
                    color="surface.500"
                    lineHeight="1.5"
                  >
                    {step.subLabel}
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

  const [orderId, setOrderId] = useState(searchParams?.get("id") || "");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const id = searchParams?.get("id");
    if (id) {
      setOrderId(id);
      handleTrack(id);
    }
  }, []);

  const handleTrack = async (id?: string) => {
    const trackId = id || orderId;
    if (!trackId) return;
    setLoading(true);
    setError("");
    setSearched(true);
    try {
      const data = await ordersApi.track(trackId);
      if (!data) {
        setError("Order not found. Please check the order number.");
        setOrder(null);
      } else setOrder(data);
    } catch (err: any) {
      setError(err.message || "Unable to track order. Please try again.");
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
          <Heading size="xl" color="surface.900" letterSpacing="-0.03em">
            Track Your Order
          </Heading>
          <Text color="surface.500" fontSize="15px" maxW="340px">
            Enter your order Number starting with "ORD-" to get real-time
            delivery updates
          </Text>
        </VStack>

        {/* Search card */}
        <Card borderRadius="xl">
          <CardBody p={6}>
            <InputGroup size="lg">
              <Input
                id="track-order-input"
                placeholder="Order Number (e.g. ORD-XXX)"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleTrack()}
                type="text"
                bg="surface.50"
                borderRadius="12px"
                fontSize="15px"
                autoComplete="off"
                pr="120px"
                _focus={{ bg: "white" }}
              />

              <InputRightElement width="110px" h="100%">
                <Button
                  id="track-search-btn"
                  w="100px"
                  h="40px"
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

            {/* Removed authentication requirement warning */}
          </CardBody>
        </Card>

        {/* Loading */}
        {loading && (
          <Flex justify="center" py={10}>
            <VStack spacing={3}>
              <Spinner
                size="lg"
                color="brand.500"
                thickness="3px"
                speed="0.65s"
              />
              <Text color="surface.400" fontSize="14px">
                Fetching order details...
              </Text>
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
            <Text color="surface.400" fontSize="15px">
              Enter your order ID above to track your delivery
            </Text>
            {isAuthenticated && (
              <Button
                as={NextLink}
                href="/shop"
                size="lg"
                borderRadius="24px"
                leftIcon={<ShoppingBag size={18} />}
                px={8}
              >
                Browse Pickles
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
      <Suspense
        fallback={
          <Flex justify="center" align="center" py={24}>
            <Spinner size="lg" color="brand.500" thickness="3px" />
          </Flex>
        }
      >
        <TrackPageContent />
      </Suspense>
    </Box>
  );
}
