'use client';

import {
  Box, Container, Heading, Text, Button, VStack, HStack, Flex,
  Image, Divider, IconButton, Badge, Card, CardBody, Input,
  InputGroup, InputLeftAddon, useToast,
} from '@chakra-ui/react';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Tag } from 'lucide-react';
import NextLink from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from '../../components/Navbar';
import { useCart } from '../../providers/CartContext';
import { useAuth } from '../../providers/AuthContext';

export default function CartPage() {
  const { items, totalAmount, totalItems, updateQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const deliveryCharge = totalAmount >= 499 ? 0 : 49;
  const grandTotal = totalAmount + deliveryCharge;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to checkout',
        status: 'warning',
        duration: 3000,
        position: 'top-right',
      });
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <Box minH="100vh" bg="surface.50">
        <Navbar />
        <Container maxW="600px" px={6} py={20}>
          <VStack spacing={6} textAlign="center" className="fade-in">
            <Text fontSize="80px" lineHeight={1}>🛒</Text>
            <Heading size="lg" color="surface.900">Your cart is empty</Heading>
            <Text color="surface.500" fontSize="15px">
              Looks like you haven't added any pickles yet!
            </Text>
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
          <IconButton
            aria-label="Back"
            icon={<ArrowLeft size={18} />}
            variant="ghost"
            borderRadius="full"
            onClick={() => router.back()}
          />
          <Box>
            <Heading size="lg" color="surface.900">Your Cart</Heading>
            <Text color="surface.500" fontSize="14px">{totalItems} item{totalItems !== 1 ? 's' : ''}</Text>
          </Box>
        </Flex>

        <Flex gap={8} direction={{ base: 'column', lg: 'row' }}>
          {/* Cart Items */}
          <Box flex={1}>
            <VStack spacing={4} align="stretch">
              {items.map(item => (
                <Card key={item.productId}>
                  <CardBody p={4}>
                    <Flex gap={4} align="start">
                      <Image
                        src={item.image || 'https://images.unsplash.com/photo-1627308595171-d1b5d6721b06?w=200'}
                        alt={item.name}
                        w="80px" h="80px"
                        objectFit="cover"
                        borderRadius="10px"
                        flexShrink={0}
                      />
                      <Box flex={1} minW={0}>
                        <Flex justify="space-between" align="start" gap={2}>
                          <Heading size="sm" color="surface.900" noOfLines={2}>{item.name}</Heading>
                          <IconButton
                            aria-label="Remove"
                            icon={<Trash2 size={16} />}
                            size="sm"
                            variant="ghost"
                            color="google.red"
                            borderRadius="full"
                            onClick={() => removeItem(item.productId)}
                            flexShrink={0}
                          />
                        </Flex>
                        <Text color="surface.500" fontSize="13px" mt={1}>₹{item.price} per unit</Text>
                        <Flex align="center" justify="space-between" mt={3}>
                          {/* Quantity Control */}
                          <HStack
                            border="1px solid"
                            borderColor="surface.300"
                            borderRadius="8px"
                            overflow="hidden"
                            spacing={0}
                          >
                            <IconButton
                              aria-label="Decrease"
                              icon={<Minus size={14} />}
                              size="sm"
                              variant="ghost"
                              borderRadius={0}
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            />
                            <Text
                              px={4} py={1} fontSize="14px" fontWeight="600"
                              color="surface.900" minW="36px" textAlign="center"
                            >
                              {item.quantity}
                            </Text>
                            <IconButton
                              aria-label="Increase"
                              icon={<Plus size={14} />}
                              size="sm"
                              variant="ghost"
                              borderRadius={0}
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            />
                          </HStack>
                          <Text fontWeight="700" color="surface.900">
                            ₹{(item.price * item.quantity).toFixed(0)}
                          </Text>
                        </Flex>
                      </Box>
                    </Flex>
                  </CardBody>
                </Card>
              ))}
            </VStack>

            <Button
              variant="ghost"
              color="google.red"
              size="sm"
              mt={4}
              leftIcon={<Trash2 size={14} />}
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </Box>

          {/* Order Summary */}
          <Box w={{ base: 'full', lg: '340px' }} flexShrink={0}>
            <Card position="sticky" top="80px">
              <CardBody p={6}>
                <Heading size="md" mb={5} color="surface.900">Order Summary</Heading>

                <VStack spacing={3} align="stretch" mb={4}>
                  <Flex justify="space-between">
                    <Text fontSize="14px" color="surface.600">Subtotal ({totalItems} items)</Text>
                    <Text fontSize="14px" fontWeight="600">₹{totalAmount.toFixed(0)}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text fontSize="14px" color="surface.600">Delivery</Text>
                    <Text fontSize="14px" fontWeight="600" color={deliveryCharge === 0 ? 'google.green' : 'surface.900'}>
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </Text>
                  </Flex>
                  {deliveryCharge > 0 && (
                    <Text fontSize="12px" color="surface.400">
                      Add ₹{499 - totalAmount} more for free delivery
                    </Text>
                  )}
                </VStack>

                <Divider mb={4} />

                <Flex justify="space-between" mb={6}>
                  <Text fontWeight="700" color="surface.900">Total</Text>
                  <Text fontWeight="700" fontSize="xl" color="surface.900">₹{grandTotal.toFixed(0)}</Text>
                </Flex>

                <Button
                  id="proceed-checkout-btn"
                  w="full"
                  size="lg"
                  borderRadius="8px"
                  fontWeight="600"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>

                <Button
                  as={NextLink}
                  href="/shop"
                  w="full"
                  variant="ghost"
                  size="sm"
                  mt={3}
                  color="brand.500"
                >
                  Continue Shopping
                </Button>
              </CardBody>
            </Card>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
