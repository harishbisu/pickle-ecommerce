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
  Skeleton,
} from "@chakra-ui/react";
import {
  ShoppingBag,
  Star,
  Truck,
  Shield,
  ChevronRight,
  HeadsetIcon,
} from "lucide-react";
import NextLink from "next/link";
import { Navbar } from "../components/Navbar";
import { useCart } from "../providers/CartContext";
import { useToast } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { productsApi } from "../lib/api";
import { Product } from "../types";
import FAQSection from "@/components/FAQSection";
import LinkWithLoader from "@/components/LinkWithLoader";

// We will load featured products dynamically.

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
    icon: HeadsetIcon,
    title: "24/7 Support",
    desc: "We are here to help",
    color: "google.yellow",
  },
  {
    icon: Star,
    title: "Premium Quality",
    desc: "Handpicked ingredients",
    color: "google.red",
  },
];

export default function HomeClient({
  initialFeaturedProducts,
}: {
  initialFeaturedProducts: Product[];
}) {
  const { addItem } = useCart();
  const toast = useToast();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(
    initialFeaturedProducts,
  );

  useEffect(() => {
    if (initialFeaturedProducts.length === 0) {
      productsApi
        .list()
        .then((data) => {
          const featured = data.filter((p) => p.isFeatured);
          if (featured.length >= 3) {
            setFeaturedProducts(featured.slice(0, 3));
          } else {
            setFeaturedProducts(data.slice(0, 3));
          }
        })
        .catch(console.error);
    }
  }, [initialFeaturedProducts]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product.id,
      name: product.name,
      discount: product.discount,
      slug: product.slug,
      price: parseFloat(product.price),
      image: product.images?.[0] || "",
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
              {featuredProducts.length >= 3 && (
                <SimpleGrid columns={2} spacing={4}>
                  <VStack spacing={4} mt={8}>
                    <Image
                      src={featuredProducts[0].images?.[0]}
                      alt={featuredProducts[0].name}
                      borderRadius="16px"
                      h="180px"
                      w="full"
                      objectFit="cover"
                      boxShadow="lg"
                    />
                    <Image
                      src={
                        featuredProducts[2].images?.[0] ||
                        "https://images.unsplash.com/photo-1627308595171-d1b5d6721b06?w=400"
                      }
                      alt={featuredProducts[2].name}
                      borderRadius="16px"
                      h="140px"
                      w="full"
                      objectFit="cover"
                      boxShadow="md"
                    />
                  </VStack>
                  <VStack spacing={4}>
                    <Image
                      src={
                        featuredProducts[1].images?.[0] ||
                        "https://images.unsplash.com/photo-1627308595171-d1b5d6721b06?w=400"
                      }
                      alt={featuredProducts[1].name}
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
                        {featuredProducts[0].name}
                      </Text>
                      <Badge colorScheme="green" mt={2} fontSize="11px">
                        Out for Delivery
                      </Badge>
                    </Box>
                  </VStack>
                </SimpleGrid>
              )}
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
                  <Icon size={20} color={"black"} />
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
          {featuredProducts.length === 0
            ? Array.from({ length: 3 }).map((_, i) => (
                <Box
                  key={i}
                  borderRadius="12px"
                  overflow="hidden"
                  bg="white"
                  border="1px solid"
                  borderColor="surface.200"
                  boxShadow="sm"
                >
                  <Skeleton height="300px" />
                  <Box p={4}>
                    <Skeleton height="16px" mb={2} borderRadius="6px" />
                    <Skeleton height="12px" mb={1} borderRadius="6px" />
                    <Skeleton height="12px" mb={3} w="60%" borderRadius="6px" />
                    <Skeleton height="36px" borderRadius="10px" />
                  </Box>
                </Box>
              ))
            : featuredProducts.map((product) => (
                <LinkWithLoader href={`/shop/${product.slug || product.id}`}>
                  <Card
                    key={product.id}
                    // as={NextLink}
                    overflow="hidden"
                    _hover={{ transform: "translateY(-4px)", boxShadow: "lg" }}
                    transition="all 0.2s ease"
                    cursor="pointer"
                    borderRadius="xl"
                  >
                    <Box position="relative">
                      <Image
                        src={
                          product.images?.[0] ||
                          "https://images.unsplash.com/photo-1627308595171-d1b5d6721b06?w=400"
                        }
                        alt={product.name}
                        h="400px"
                        w="full"
                        objectFit="cover"
                      />
                      <Badge
                        position="absolute"
                        top={3}
                        left={3}
                        colorScheme="orange"
                        borderRadius="full"
                        fontSize="11px"
                        fontWeight="700"
                        px={3}
                        py={1}
                      >
                        {product.isFeatured ? "Featured" : "Trending"}
                      </Badge>
                    </Box>
                    <CardBody p={5}>
                      <Stack spacing={3} justify="space-between" h="full">
                        <VStack align="strech" spacing={1}>
                          <Heading size="sm" color="surface.900">
                            {product.name}
                          </Heading>
                          <Text
                            fontSize="13px"
                            color="surface.500"
                            noOfLines={1}
                          >
                            {product.description}
                          </Text>
                        </VStack>
                        <VStack align="strech" spacing={1}>
                          <HStack>
                            <Text fontSize="12px" color="google.yellow">
                              {"★".repeat(5)}
                            </Text>
                            <Text fontSize="12px" color="surface.600">
                              4.8
                            </Text>
                            <Text fontSize="12px" color="surface.400">
                              (120)
                            </Text>
                          </HStack>
                          <Flex align="center" justify="space-between">
                            <HStack spacing={2} align="baseline">
                              <Text
                                fontWeight="700"
                                fontSize="lg"
                                color="surface.900"
                              >
                                ₹
                                {parseFloat(product.price) -
                                  parseFloat(product.discount || "0")}
                              </Text>
                              {parseFloat(product.discount || "0") && (
                                <Text
                                  fontSize="13px"
                                  color="surface.400"
                                  textDecoration="line-through"
                                >
                                  ₹{product.price}
                                </Text>
                              )}
                            </HStack>
                            {parseFloat(product.discount || "") != 0 && (
                              <Badge colorScheme="green" fontSize="11px">
                                {(
                                  (parseFloat(product.discount || "0") /
                                    parseFloat(product.price)) *
                                  100
                                ).toFixed(0)}
                                % off
                              </Badge>
                            )}
                          </Flex>
                          <Button
                            w="full"
                            size="sm"
                            borderRadius="8px"
                            leftIcon={<ShoppingBag size={14} />}
                            onClick={(e) => handleAddToCart(e, product)}
                          >
                            Add to Cart
                          </Button>
                        </VStack>
                      </Stack>
                    </CardBody>
                  </Card>
                </LinkWithLoader>
              ))}
        </SimpleGrid>
      </Container>
      <FAQSection />
    </Box>
  );
}
