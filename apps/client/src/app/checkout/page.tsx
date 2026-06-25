'use client';

import { useState, useEffect } from 'react';
import {
  Box, Container, Heading, Text, Button, VStack, HStack, Flex,
  Card, CardBody, Divider, Badge, Spinner, useToast, Image,
  FormControl, FormLabel, Input, SimpleGrid, Alert, AlertIcon, AlertTitle, AlertDescription,
} from '@chakra-ui/react';
import { ShieldCheck, Lock, CreditCard, ArrowLeft } from 'lucide-react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/Navbar';
import { useCart } from '../../providers/CartContext';
import { useAuth } from '../../providers/AuthContext';
import { ordersApi } from '../../lib/api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const { items, totalAmount, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ orderId: number } | null>(null);
  const [address, setAddress] = useState({ name: '', phone: '', street: '', city: '', pincode: '' });

  const deliveryCharge = totalAmount >= 499 ? 0 : 49;
  const grandTotal = totalAmount + deliveryCharge;

  // Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    if (items.length === 0 && !orderSuccess) { router.push('/cart'); }
  }, [isAuthenticated, items.length, orderSuccess, router]);

  // Load Razorpay SDK
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  const handlePlaceOrder = async () => {
    if (!address.name || !address.phone || !address.street || !address.city || !address.pincode) {
      toast({ title: 'Please fill all address fields', status: 'warning', position: 'top-right', duration: 3000 });
      return;
    }

    setLoading(true);
    try {
      // Step 1: Create order on server (returns Razorpay order ID)
      const order = await ordersApi.checkout(
        items.map(i => ({ productId: i.productId, quantity: i.quantity, price: i.price })),
      );

      // Step 2: Open Razorpay payment modal
      const options = {
        key: order.razorpayKeyId,
        amount: Math.round(grandTotal * 100), // paise
        currency: 'INR',
        name: 'Pickle Hub',
        description: `Order #${order.id} — ${items.length} item(s)`,
        order_id: order.razorpayOrderId,
        prefill: {
          name: address.name,
          contact: address.phone,
          email: user?.email,
        },
        theme: { color: '#1a73e8' },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // Step 3: Verify payment server-side (HMAC-SHA256)
          try {
            const verification = await ordersApi.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            if (verification.success) {
              clearCart();
              setOrderSuccess({ orderId: verification.orderId });
              toast({
                title: '🎉 Payment Successful!',
                description: `Order #${verification.orderId} placed successfully`,
                status: 'success',
                duration: 5000,
                position: 'top',
              });
            }
          } catch (verifyErr: any) {
            toast({
              title: 'Payment Verification Failed',
              description: 'Payment could not be verified. Please contact support.',
              status: 'error',
              duration: 8000,
              position: 'top',
            });
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast({ title: 'Payment cancelled', status: 'info', duration: 2000, position: 'top-right' });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast({
        title: 'Order failed',
        description: err.message || 'Unable to create order. Please try again.',
        status: 'error',
        duration: 4000,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  // Order Success Screen
  if (orderSuccess) {
    return (
      <Box minH="100vh" bg="surface.50">
        <Navbar />
        <Container maxW="600px" px={6} py={20}>
          <VStack spacing={6} textAlign="center" className="fade-in">
            <Box
              w="80px" h="80px" borderRadius="full" bg="green.50"
              display="flex" alignItems="center" justifyContent="center"
              border="2px solid" borderColor="google.green"
            >
              <Text fontSize="40px">✅</Text>
            </Box>
            <Heading size="lg" color="surface.900">Order Placed!</Heading>
            <Text color="surface.500" fontSize="15px" maxW="400px">
              Your payment was verified and order #{orderSuccess.orderId} has been confirmed.
              We'll send updates as your order is prepared.
            </Text>
            <HStack spacing={4}>
              <Button
                id="track-order-btn"
                as={NextLink}
                href={`/track?id=${orderSuccess.orderId}`}
                size="lg"
                borderRadius="24px"
              >
                Track Order
              </Button>
              <Button
                as={NextLink}
                href="/shop"
                variant="outline"
                size="lg"
                borderRadius="24px"
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
    <Box minH="100vh" bg="surface.50">
      <Navbar />
      <Container maxW="1100px" px={6} py={10}>
        <Flex align="center" gap={3} mb={8}>
          <Button
            as={NextLink}
            href="/cart"
            variant="ghost"
            leftIcon={<ArrowLeft size={18} />}
            size="sm"
          >
            Back to Cart
          </Button>
        </Flex>

        <Heading size="lg" mb={8} color="surface.900">Checkout</Heading>

        {/* Security Banner */}
        <Alert status="success" borderRadius="12px" mb={6} bg="google.lightGreen" border="1px solid" borderColor="green.200">
          <AlertIcon as={ShieldCheck} color="google.green" />
          <Box>
            <AlertTitle fontSize="13px" color="green.800">Secure Checkout</AlertTitle>
            <AlertDescription fontSize="12px" color="green.700">
              Payments are processed by Razorpay with end-to-end encryption. Your card details are never stored on our servers.
            </AlertDescription>
          </Box>
        </Alert>

        <Flex gap={8} direction={{ base: 'column', lg: 'row' }}>
          {/* Delivery Address */}
          <Box flex={1}>
            <Card mb={6}>
              <CardBody p={6}>
                <HStack mb={5} spacing={2}>
                  <Box w="28px" h="28px" borderRadius="full" bg="brand.500" display="flex" alignItems="center" justifyContent="center">
                    <Text color="white" fontWeight="700" fontSize="13px">1</Text>
                  </Box>
                  <Heading size="sm" color="surface.900">Delivery Address</Heading>
                </HStack>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="13px" fontWeight="500" color="surface.600">Full Name</FormLabel>
                    <Input id="checkout-name" placeholder="John Doe" value={address.name} onChange={e => setAddress(a => ({ ...a, name: e.target.value }))} />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="13px" fontWeight="500" color="surface.600">Phone Number</FormLabel>
                    <Input id="checkout-phone" placeholder="98765 43210" value={address.phone} onChange={e => setAddress(a => ({ ...a, phone: e.target.value }))} />
                  </FormControl>
                  <FormControl gridColumn={{ sm: '1 / -1' }}>
                    <FormLabel fontSize="13px" fontWeight="500" color="surface.600">Street Address</FormLabel>
                    <Input id="checkout-street" placeholder="123 MG Road, Apartment 4B" value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="13px" fontWeight="500" color="surface.600">City</FormLabel>
                    <Input id="checkout-city" placeholder="Bengaluru" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="13px" fontWeight="500" color="surface.600">Pincode</FormLabel>
                    <Input id="checkout-pincode" placeholder="560001" value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} />
                  </FormControl>
                </SimpleGrid>
              </CardBody>
            </Card>

            {/* Payment method */}
            <Card>
              <CardBody p={6}>
                <HStack mb={4} spacing={2}>
                  <Box w="28px" h="28px" borderRadius="full" bg="brand.500" display="flex" alignItems="center" justifyContent="center">
                    <Text color="white" fontWeight="700" fontSize="13px">2</Text>
                  </Box>
                  <Heading size="sm" color="surface.900">Payment</Heading>
                </HStack>
                <Box
                  p={4} borderRadius="10px" border="2px solid" borderColor="brand.400"
                  bg="brand.50" display="flex" alignItems="center" gap={3}
                >
                  <CreditCard size={20} color="#1a73e8" />
                  <Box>
                    <Text fontWeight="600" fontSize="14px" color="brand.700">Razorpay Secure Payment</Text>
                    <Text fontSize="12px" color="surface.500">Cards, UPI, Netbanking, Wallets</Text>
                  </Box>
                  <Box ml="auto">
                    <Lock size={16} color="#34a853" />
                  </Box>
                </Box>
              </CardBody>
            </Card>
          </Box>

          {/* Order Summary */}
          <Box w={{ base: 'full', lg: '340px' }} flexShrink={0}>
            <Card position="sticky" top="80px">
              <CardBody p={6}>
                <Heading size="sm" mb={4} color="surface.900">Order Summary</Heading>
                <VStack spacing={3} align="stretch" mb={4} maxH="200px" overflowY="auto">
                  {items.map(item => (
                    <Flex key={item.productId} gap={3} align="center">
                      <Image
                        src={item.image} alt={item.name}
                        w="40px" h="40px" objectFit="cover" borderRadius="8px" flexShrink={0}
                      />
                      <Box flex={1} minW={0}>
                        <Text fontSize="13px" fontWeight="500" noOfLines={1}>{item.name}</Text>
                        <Text fontSize="12px" color="surface.500">×{item.quantity}</Text>
                      </Box>
                      <Text fontSize="13px" fontWeight="600" flexShrink={0}>₹{(item.price * item.quantity).toFixed(0)}</Text>
                    </Flex>
                  ))}
                </VStack>
                <Divider mb={4} />
                <VStack spacing={2} align="stretch" mb={4}>
                  <Flex justify="space-between">
                    <Text fontSize="13px" color="surface.600">Subtotal</Text>
                    <Text fontSize="13px">₹{totalAmount.toFixed(0)}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text fontSize="13px" color="surface.600">Delivery</Text>
                    <Text fontSize="13px" color={deliveryCharge === 0 ? 'google.green' : 'surface.900'}>
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </Text>
                  </Flex>
                </VStack>
                <Divider mb={4} />
                <Flex justify="space-between" mb={6}>
                  <Text fontWeight="700">Total</Text>
                  <Text fontWeight="700" fontSize="xl">₹{grandTotal.toFixed(0)}</Text>
                </Flex>
                <Button
                  id="pay-now-btn"
                  w="full"
                  size="lg"
                  borderRadius="8px"
                  fontWeight="600"
                  leftIcon={<Lock size={16} />}
                  isLoading={loading}
                  loadingText="Creating order..."
                  onClick={handlePlaceOrder}
                >
                  Pay ₹{grandTotal.toFixed(0)} Securely
                </Button>
                <HStack justify="center" mt={3} spacing={1}>
                  <ShieldCheck size={12} color="#34a853" />
                  <Text fontSize="11px" color="surface.400">256-bit SSL encrypted</Text>
                </HStack>
              </CardBody>
            </Card>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
