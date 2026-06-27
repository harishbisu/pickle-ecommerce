"use client";

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
  Divider,
  Image,
  FormControl,
  FormLabel,
  Input,
  SimpleGrid,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";
import {
  ShieldCheck,
  Lock,
  CreditCard,
  ArrowLeft,
  CheckCircleIcon,
} from "lucide-react";
import NextLink from "next/link";
import { Navbar } from "../../components/Navbar";
import { useCheckout } from "../../hooks/useCheckout";

export default function CheckoutPage() {
  const {
    loading,
    processingPayment,
    orderSuccess,
    address,
    setAddress,
    handlePlaceOrder,
    totalAmount,
    deliveryCharge,
    grandTotal,
    items,
  } = useCheckout();

  // Order Success Screen
  if (orderSuccess) {
    return (
      <Box minH="100vh" bg="surface.50">
        <Navbar />
        <Container maxW="600px" px={6} py={20}>
          <VStack spacing={6} textAlign="center" className="fade-in">
            <Box
              w="80px"
              h="80px"
              borderRadius="full"
              bg="green.50"
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="2px solid"
              borderColor="google.green"
            >
              <CheckCircleIcon size={40} color="#34a853" />
            </Box>
            <Heading size="lg" color="surface.900">
              Order Placed!
            </Heading>
            <Text color="surface.500" fontSize="15px" maxW="400px">
              Your payment was verified and order #{orderSuccess.orderId} has
              been confirmed. We'll send updates as your order is prepared.
            </Text>
            <HStack spacing={4}>
              <Button
                id="track-order-btn"
                as={NextLink}
                href={`/track?id=${orderSuccess.orderId}`}
                size="lg"
                borderRadius="24px"
                bg="#2874f0" // Flipkart Blue
                color="white"
                _hover={{ bg: "#1c5ac6" }}
              >
                Track Order
              </Button>
              <Button
                as={NextLink}
                href="/shop"
                variant="outline"
                size="lg"
                borderRadius="24px"
                borderColor="#2874f0"
                color="#2874f0"
                _hover={{ bg: "blue.50" }}
              >
                Shop More
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="surface.50" position="relative">
      {/* Payment Processing Overlay */}
      {processingPayment && (
        <Box
          position="absolute"
          top="0"
          left="0"
          w="full"
          h="full"
          bg="whiteAlpha.800"
          zIndex="2000"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <VStack bg="white" p={8} borderRadius="16px" boxShadow="xl">
            <Lock size={40} color="#2874f0" />
            <Heading size="md" color="surface.900">
              Processing Payment...
            </Heading>
            <Text color="surface.500" fontSize="sm">
              Please do not refresh or close this page.
            </Text>
          </VStack>
        </Box>
      )}

      <Navbar />
      <Container maxW="1100px" px={6} py={10}>
        <Flex align="center" gap={3} mb={8}>
          <Button
            as={NextLink}
            href="/cart"
            variant="ghost"
            leftIcon={<ArrowLeft size={18} />}
            size="sm"
            color="#2874f0"
          >
            Back to Cart
          </Button>
        </Flex>

        <Heading size="lg" mb={8} color="surface.900">
          Secure Checkout
        </Heading>

        {/* Security Banner */}
        <Alert
          status="success"
          borderRadius="12px"
          mb={6}
          bg="green.50"
          border="1px solid"
          borderColor="green.200"
        >
          <AlertIcon as={ShieldCheck} color="green.600" />
          <Box>
            <AlertTitle fontSize="13px" color="green.800">
              100% Secure Transaction
            </AlertTitle>
            <AlertDescription fontSize="12px" color="green.700">
              Payments are processed by Razorpay with end-to-end encryption.
              Your card details are never stored on our servers.
            </AlertDescription>
          </Box>
        </Alert>

        <Flex gap={8} direction={{ base: "column", lg: "row" }}>
          {/* Delivery Address */}
          <Box flex={1}>
            <Card
              mb={6}
              borderRadius="12px"
              border="1px solid #e0e0e0"
              boxShadow="sm"
            >
              <CardBody p={6}>
                <HStack mb={5} spacing={3}>
                  <Box
                    w="30px"
                    h="30px"
                    borderRadius="full"
                    bg="#2874f0"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="white" fontWeight="700" fontSize="14px">
                      1
                    </Text>
                  </Box>
                  <Heading size="md" color="surface.900">
                    Delivery Address
                  </Heading>
                </HStack>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel
                      fontSize="13px"
                      fontWeight="600"
                      color="surface.700"
                    >
                      Full Name
                    </FormLabel>
                    <Input
                      id="checkout-name"
                      placeholder="John Doe"
                      value={address.name}
                      onChange={(e) =>
                        setAddress((a) => ({ ...a, name: e.target.value }))
                      }
                      focusBorderColor="#2874f0"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel
                      fontSize="13px"
                      fontWeight="600"
                      color="surface.700"
                    >
                      Phone Number
                    </FormLabel>
                    <Input
                      id="checkout-phone"
                      placeholder="98765 43210"
                      value={address.phone}
                      onChange={(e) =>
                        setAddress((a) => ({ ...a, phone: e.target.value }))
                      }
                      focusBorderColor="#2874f0"
                    />
                  </FormControl>
                  <FormControl gridColumn={{ sm: "1 / -1" }}>
                    <FormLabel
                      fontSize="13px"
                      fontWeight="600"
                      color="surface.700"
                    >
                      Street Address
                    </FormLabel>
                    <Input
                      id="checkout-street"
                      placeholder="123 MG Road, Apartment 4B"
                      value={address.street}
                      onChange={(e) =>
                        setAddress((a) => ({ ...a, street: e.target.value }))
                      }
                      focusBorderColor="#2874f0"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel
                      fontSize="13px"
                      fontWeight="600"
                      color="surface.700"
                    >
                      City
                    </FormLabel>
                    <Input
                      id="checkout-city"
                      placeholder="Bengaluru"
                      value={address.city}
                      onChange={(e) =>
                        setAddress((a) => ({ ...a, city: e.target.value }))
                      }
                      focusBorderColor="#2874f0"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel
                      fontSize="13px"
                      fontWeight="600"
                      color="surface.700"
                    >
                      Pincode
                    </FormLabel>
                    <Input
                      id="checkout-pincode"
                      placeholder="560001"
                      value={address.pincode}
                      onChange={(e) =>
                        setAddress((a) => ({ ...a, pincode: e.target.value }))
                      }
                      focusBorderColor="#2874f0"
                    />
                  </FormControl>
                </SimpleGrid>
              </CardBody>
            </Card>

            {/* Payment method */}
            <Card borderRadius="12px" border="1px solid #e0e0e0" boxShadow="sm">
              <CardBody p={6}>
                <HStack mb={4} spacing={3}>
                  <Box
                    w="30px"
                    h="30px"
                    borderRadius="full"
                    bg="#2874f0"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text color="white" fontWeight="700" fontSize="14px">
                      2
                    </Text>
                  </Box>
                  <Heading size="md" color="surface.900">
                    Payment Options
                  </Heading>
                </HStack>
                <Box
                  p={4}
                  borderRadius="8px"
                  border="2px solid #2874f0"
                  bg="blue.50"
                  display="flex"
                  alignItems="center"
                  gap={3}
                >
                  <CreditCard size={24} color="#2874f0" />
                  <Box>
                    <Text fontWeight="600" fontSize="15px" color="blue.900">
                      Razorpay Secure Payment
                    </Text>
                    <Text fontSize="13px" color="blue.700">
                      UPI, Credit/Debit Cards, Netbanking
                    </Text>
                  </Box>
                  <Box ml="auto">
                    <Lock size={20} color="#2874f0" />
                  </Box>
                </Box>
              </CardBody>
            </Card>
          </Box>

          {/* Order Summary */}
          <Box w={{ base: "full", lg: "360px" }} flexShrink={0}>
            <Card
              position="sticky"
              top="80px"
              borderRadius="12px"
              border="1px solid #e0e0e0"
              boxShadow="md"
            >
              <CardBody p={6}>
                <Heading
                  size="sm"
                  mb={5}
                  color="surface.900"
                  textTransform="uppercase"
                  letterSpacing="1px"
                >
                  Price Details
                </Heading>
                <VStack
                  spacing={4}
                  align="stretch"
                  mb={4}
                  maxH="250px"
                  overflowY="auto"
                >
                  {items.map((item) => (
                    <Flex key={item.productId} gap={3} align="center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        w="48px"
                        h="48px"
                        objectFit="cover"
                        borderRadius="8px"
                        flexShrink={0}
                        border="1px solid #eee"
                      />
                      <Box flex={1} minW={0}>
                        <Text fontSize="14px" fontWeight="500" noOfLines={1}>
                          {item.name}
                        </Text>
                        <Text fontSize="12px" color="surface.500">
                          Qty: {item.quantity}
                        </Text>
                      </Box>
                      <Text fontSize="14px" fontWeight="600" flexShrink={0}>
                        ₹{(item.price * item.quantity).toFixed(0)}
                      </Text>
                    </Flex>
                  ))}
                </VStack>
                <Divider mb={4} borderColor="gray.200" />
                <VStack spacing={3} align="stretch" mb={4}>
                  <Flex justify="space-between">
                    <Text fontSize="14px" color="surface.600">
                      Price ({items.length} items)
                    </Text>
                    <Text fontSize="14px">₹{totalAmount.toFixed(0)}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text fontSize="14px" color="surface.600">
                      Delivery Charges
                    </Text>
                    <Text
                      fontSize="14px"
                      color={deliveryCharge === 0 ? "green.500" : "surface.900"}
                      fontWeight={deliveryCharge === 0 ? "600" : "normal"}
                    >
                      {deliveryCharge === 0
                        ? "FREE Delivery"
                        : `₹${deliveryCharge}`}
                    </Text>
                  </Flex>
                </VStack>
                <Divider mb={4} borderColor="gray.200" />
                <Flex justify="space-between" mb={6}>
                  <Text fontWeight="700" fontSize="lg">
                    Total Amount
                  </Text>
                  <Text fontWeight="700" fontSize="xl" color="#2874f0">
                    ₹{grandTotal.toFixed(0)}
                  </Text>
                </Flex>
                <Button
                  id="pay-now-btn"
                  w="full"
                  size="lg"
                  borderRadius="4px"
                  fontWeight="700"
                  textTransform="uppercase"
                  bg="#fb641b" // Flipkart Orange
                  color="white"
                  _hover={{ bg: "#e05a18" }}
                  leftIcon={<Lock size={16} />}
                  isLoading={loading || processingPayment}
                  loadingText="Processing..."
                  isDisabled={processingPayment}
                  onClick={handlePlaceOrder}
                >
                  Pay Securely
                </Button>
                <HStack justify="center" mt={4} spacing={1}>
                  <ShieldCheck size={14} color="#34a853" />
                  <Text fontSize="12px" color="surface.500" fontWeight="500">
                    Safe and secure payments.
                  </Text>
                </HStack>
              </CardBody>
            </Card>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
