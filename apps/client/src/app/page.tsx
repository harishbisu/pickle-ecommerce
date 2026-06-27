"use client";

import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Container,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Stack,
  Badge,
  VStack,
  HStack,
} from "@chakra-ui/react";
import {
  ShoppingBag,
  Star,
  Truck,
  Shield,
  RefreshCcw,
  ChevronRight,
} from "lucide-react";
import NextLink from "next/link";
import { Navbar } from "../components/Navbar";
import { useCart } from "../providers/CartContext";
import { useToast } from "@chakra-ui/react";

const featuredProducts = [
  {
    id: 1,
    name: "Spicy Mango Pickle",
    price: 199,
    originalPrice: 249,
    image:
      "https://tse3.mm.bing.net/th/id/OIP.y9hiDDy_L5hpPGtNxWHpbgHaJD?rs=1&pid=ImgDetMain&o=7&rm=3",
    badge: "Bestseller",
    badgeColor: "orange",
    rating: 4.8,
    reviews: 234,
    description: "Sun-dried raw mangoes in aromatic mustard oil",
  },
  {
    id: 2,
    name: "Garlic Pickle",
    price: 249,
    originalPrice: 299,
    image:
      "https://th.bing.com/th/id/OIP.MDBve5I9-yoNFVxBAmK-UQHaHa?w=181&h=181&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    badge: "New",
    badgeColor: "green",
    rating: 4.6,
    reviews: 89,
    description: "Whole garlic cloves slow-pickled in spiced vinegar",
  },
  {
    id: 3,
    name: "Mixed Veg Pickle",
    price: 229,
    originalPrice: 279,
    image:
      "https://th.bing.com/th/id/OIP.Z2ONiI-ko832xPs29JOQ7QHaHa?w=215&h=215&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
    badge: "Popular",
    badgeColor: "blue",
    rating: 4.7,
    reviews: 156,
    description: "Seasonal vegetables pickled with traditional spices",
  },
];

const features = [
  {
    icon: Truck,
    title: "Free Delivery",
    desc: "On orders above ₹499",
    color: "brand.500",
  },
  {
    icon: Shield,
    title: "100% Natural",
    desc: "No preservatives added",
    color: "google.green",
  },
  {
    icon: RefreshCcw,
    title: "Easy Returns",
    desc: "7-day return policy",
    color: "google.yellow",
  },
  {
    icon: Star,
    title: "Premium Quality",
    desc: "Handpicked ingredients",
    color: "google.red",
  },
];

export default function Home() {
  const { addItem } = useCart();
  const toast = useToast();

  const handleAddToCart = (product: (typeof featuredProducts)[0]) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast({
      title: "Added to cart",
      description: `${product.name} added successfully`,
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "top-right",
    });
  };

  return (
    <Box minH="100vh" bg="surface.50">
      <Navbar />

      {/* Hero */}
      <Box
        bgGradient="linear(135deg, #e8f0fe 0%, #f8f9fa 40%, #e6f4ea 100%)"
        py={{ base: 16, md: 24 }}
        overflow="hidden"
        position="relative"
      >
        {/* Decorative blobs */}
        <Box
          position="absolute"
          top="-60px"
          right="-60px"
          w="300px"
          h="300px"
          borderRadius="full"
          bg="brand.100"
          opacity={0.4}
          filter="blur(60px)"
        />
        <Box
          position="absolute"
          bottom="-40px"
          left="-40px"
          w="200px"
          h="200px"
          borderRadius="full"
          bg="green.100"
          opacity={0.5}
          filter="blur(40px)"
        />

        <Container maxW="1280px" px={6}>
          <Flex
            align="center"
            gap={12}
            direction={{ base: "column", lg: "row" }}
          >
            <VStack
              align={{ base: "center", lg: "start" }}
              spacing={6}
              flex={1}
              textAlign={{ base: "center", lg: "left" }}
            >
              <Badge
                bg="brand.50"
                color="brand.600"
                borderRadius="full"
                px={4}
                py={1}
                fontSize="13px"
                fontWeight="600"
                border="1px solid"
                borderColor="brand.200"
              >
                🥒 Fresh from Home Kitchens
              </Badge>
              <Heading
                fontSize={{ base: "3xl", md: "5xl" }}
                fontWeight="700"
                color="surface.900"
                lineHeight="1.1"
                letterSpacing="-0.03em"
              >
                Authentic Taste
                <Box as="span" color="brand.500">
                  {" "}
                  of Home
                </Box>
              </Heading>
              <Text
                fontSize={{ base: "md", md: "lg" }}
                color="surface.600"
                maxW="480px"
                lineHeight="1.7"
              >
                Discover the finest selection of traditional pickles made with
                authentic recipes, premium ingredients, and generations of love.
              </Text>
              <HStack
                spacing={4}
                flexWrap="wrap"
                justify={{ base: "center", lg: "start" }}
              >
                <Button
                  as={NextLink}
                  href="/shop"
                  size="lg"
                  leftIcon={<ShoppingBag size={18} />}
                  borderRadius="24px"
                  px={8}
                  fontWeight="600"
                >
                  Shop Now
                </Button>
                <Button
                  as={NextLink}
                  href="/track"
                  size="lg"
                  variant="outline"
                  borderRadius="24px"
                  px={8}
                >
                  Track Order
                </Button>
              </HStack>

              <HStack spacing={8} pt={4}>
                {[
                  ["500+", "Happy Customers"],
                  ["50+", "Pickle Varieties"],
                  ["4.8★", "Avg Rating"],
                ].map(([val, label]) => (
                  <VStack
                    key={label}
                    spacing={0}
                    align={{ base: "center", lg: "start" }}
                  >
                    <Text fontWeight="700" fontSize="xl" color="surface.900">
                      {val}
                    </Text>
                    <Text fontSize="12px" color="surface.500">
                      {label}
                    </Text>
                  </VStack>
                ))}
              </HStack>
            </VStack>

            {/* Hero Image Grid */}
            <Box flex={1} display={{ base: "none", lg: "block" }}>
              <SimpleGrid columns={2} spacing={4}>
                <VStack spacing={4} mt={8}>
                  <Image
                    src={featuredProducts[0].image}
                    alt="Mango Pickle"
                    borderRadius="16px"
                    h="180px"
                    w="full"
                    objectFit="cover"
                    boxShadow="lg"
                  />
                  <Image
                    src={featuredProducts[2].image}
                    alt="Mixed Veg Pickle"
                    borderRadius="16px"
                    h="140px"
                    w="full"
                    objectFit="cover"
                    boxShadow="md"
                  />
                </VStack>
                <VStack spacing={4}>
                  <Image
                    src={featuredProducts[1].image}
                    alt="Garlic Pickle"
                    borderRadius="16px"
                    h="160px"
                    w="full"
                    objectFit="cover"
                    boxShadow="md"
                  />
                  <Box
                    bg="white"
                    borderRadius="16px"
                    p={4}
                    boxShadow="lg"
                    border="1px solid"
                    borderColor="surface.200"
                  >
                    <Text fontSize="12px" color="surface.500" mb={1}>
                      Latest Order
                    </Text>
                    <Text fontWeight="600" fontSize="14px">
                      Spicy Mango Pickle
                    </Text>
                    <Badge colorScheme="green" mt={2} fontSize="11px">
                      Out for Delivery
                    </Badge>
                  </Box>
                </VStack>
              </SimpleGrid>
            </Box>
          </Flex>
        </Container>
      </Box>

      {/* Features Strip */}
      <Box bg="white" borderBottom="1px solid" borderColor="surface.200" py={6}>
        <Container maxW="1280px" px={6}>
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
            {features.map(({ icon: Icon, title, desc, color }) => (
              <Flex key={title} gap={3} align="center">
                <Box
                  w="40px"
                  h="40px"
                  borderRadius="10px"
                  bg="surface.50"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  flexShrink={0}
                >
                  <Icon size={20} color={color} />
                </Box>
                <Box>
                  <Text fontWeight="600" fontSize="13px" color="surface.900">
                    {title}
                  </Text>
                  <Text fontSize="12px" color="surface.500">
                    {desc}
                  </Text>
                </Box>
              </Flex>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Trending Products */}
      <Container maxW="1280px" px={6} py={16}>
        <Flex align="center" justify="space-between" mb={8}>
          <Box>
            <Text
              fontSize="12px"
              color="brand.500"
              fontWeight="600"
              letterSpacing="0.1em"
              textTransform="uppercase"
              mb={1}
            >
              Most Loved
            </Text>
            <Heading size="lg" color="surface.900">
              Trending Pickles
            </Heading>
          </Box>
          <Button
            as={NextLink}
            href="/shop"
            variant="ghost-text"
            rightIcon={<ChevronRight size={16} />}
            color="brand.500"
            fontWeight="500"
            size="sm"
          >
            View All
          </Button>
        </Flex>

        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              overflow="hidden"
              _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}
              transition="all 0.2s ease"
              cursor="pointer"
            >
              <Box position="relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  h="220px"
                  w="full"
                  objectFit="cover"
                />
                <Badge
                  position="absolute"
                  top={3}
                  left={3}
                  colorScheme={product.badgeColor}
                  borderRadius="full"
                  fontSize="11px"
                  fontWeight="700"
                  px={3}
                  py={1}
                >
                  {product.badge}
                </Badge>
              </Box>
              <CardBody p={5}>
                <Stack spacing={3}>
                  <Heading size="sm" color="surface.900">
                    {product.name}
                  </Heading>
                  <Text fontSize="13px" color="surface.500" noOfLines={1}>
                    {product.description}
                  </Text>
                  <HStack>
                    <Text fontSize="12px" color="google.yellow">
                      {"★".repeat(Math.floor(product.rating))}
                    </Text>
                    <Text fontSize="12px" color="surface.600">
                      {product.rating}
                    </Text>
                    <Text fontSize="12px" color="surface.400">
                      ({product.reviews})
                    </Text>
                  </HStack>
                  <Flex align="center" justify="space-between">
                    <HStack spacing={2} align="baseline">
                      <Text fontWeight="700" fontSize="lg" color="surface.900">
                        ₹{product.price}
                      </Text>
                      <Text
                        fontSize="13px"
                        color="surface.400"
                        textDecoration="line-through"
                      >
                        ₹{product.originalPrice}
                      </Text>
                    </HStack>
                    <Badge colorScheme="green" fontSize="11px">
                      {Math.round(
                        ((product.originalPrice - product.price) /
                          product.originalPrice) *
                          100,
                      )}
                      % off
                    </Badge>
                  </Flex>
                  <Button
                    w="full"
                    size="sm"
                    borderRadius="8px"
                    leftIcon={<ShoppingBag size={14} />}
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </Stack>
              </CardBody>
            </Card>
          ))}
        </SimpleGrid>
      </Container>

      {/* Footer */}
      <Box bg="white" borderTop="1px solid" borderColor="surface.200" py={8}>
        <Container maxW="1280px" px={6}>
          <Flex
            justify="space-between"
            align="center"
            direction={{ base: "column", md: "row" }}
            gap={4}
          >
            <Flex align="center" gap={2}>
              <Box
                h="30px"
                display="flex"
                alignItems="center"
                borderRadius="sm"
              >
                <Image
                  src="/logo.webp"
                  alt="Pickle Hub Logo"
                  width={{ base: 150, md: 200, lg: 250 }}
                  height={"auto"}
                  style={{ objectFit: "contain" }}
                />
              </Box>
            </Flex>
            <Text fontSize="13px" color="surface.500">
              © 2026 Pickle Hub. Authentic, Natural, Delicious.
            </Text>
            <HStack spacing={4}>
              {["Privacy", "Terms", "Contact"].map((link) => (
                <Text
                  key={link}
                  fontSize="13px"
                  color="surface.500"
                  cursor="pointer"
                  _hover={{ color: "brand.500" }}
                >
                  {link}
                </Text>
              ))}
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}
