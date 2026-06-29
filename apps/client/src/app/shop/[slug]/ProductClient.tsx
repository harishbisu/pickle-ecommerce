"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Badge,
  Image,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Skeleton,
  useToast,
  Flex,
  Icon,
} from "@chakra-ui/react";
import {
  ShoppingBag,
  Star,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  HeadsetIcon,
} from "lucide-react";
import { Navbar } from "../../../components/Navbar";
import { useCart } from "../../../providers/CartContext";
import { Product } from "../../../types";

export default function ProductClient({ initialProduct }: { initialProduct: Product | null }) {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(initialProduct);
  const [loading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCart();
  const toast = useToast();

  useEffect(() => {
    if (initialProduct) {
      setProduct(initialProduct);
    }
  }, [initialProduct]);

  if (loading) {
    return (
      <Box minH="100vh" bg="surface.50">
        <Navbar />
        <Container maxW="1280px" py={10}>
          <Skeleton height="500px" borderRadius="xl" />
        </Container>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box minH="100vh" bg="surface.50">
        <Navbar />
        <Container maxW="1280px" py={20} textAlign="center">
          <Heading>Product Not Found</Heading>
          <Text color="surface.500" mt={4}>
            We couldn't find the product you're looking for.
          </Text>
        </Container>
      </Box>
    );
  }

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: parseFloat(product.price),
      image: product.images?.[0] || "",
      discount: product.discount,
      slug: product.slug, 
    });
    toast({
      title: "Added to cart!",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const images = product.images?.length
    ? product.images
    : ["https://images.unsplash.com/photo-1627308595171-d1b5d6721b06?w=800"];
  const discountAmount = product.discount ? parseFloat(product.discount) : 0;
  const priceAfterDiscount = parseFloat(product.price) - discountAmount;
  const discountPercent =
    discountAmount > 0 ? Math.round((discountAmount / parseFloat(product.price)) * 100) : 0;

  return (
    <Box minH="100vh" bg="surface.50">
      <Navbar />

      <Container maxW="1280px" py={{ base: 6, md: 10 }}>
        <Grid
          templateColumns={{ base: "1fr", md: "45% 55%" }}
          gap={{ base: 8, md: 12 }}
        >
          {/* Left Column: Image Carousel */}
          <GridItem>
            <Box
              position="relative"
              borderRadius="xl"
              overflow="hidden"
              bg="white"
              border="1px solid"
              borderColor="surface.200"
              mb={4}
            >
              <Image
                src={images[activeImage]}
                alt={product.name}
                w="full"
                h={{ base: "350px", md: "500px" }}
                objectFit="contain"
              />
              {/* Carousel controls */}
              {images.length > 1 && (
                <>
                  <Button
                    position="absolute"
                    left={2}
                    top="50%"
                    transform="translateY(-50%)"
                    borderRadius="full"
                    w="40px"
                    h="40px"
                    p={0}
                    bg="white"
                    boxShadow="md"
                    onClick={() =>
                      setActiveImage((prev) =>
                        prev > 0 ? prev - 1 : images.length - 1,
                      )
                    }
                  >
                    <ChevronLeft color="#2874f0" size={20} />
                  </Button>
                  <Button
                    position="absolute"
                    right={2}
                    top="50%"
                    transform="translateY(-50%)"
                    borderRadius="full"
                    w="40px"
                    h="40px"
                    p={0}
                    bg="white"
                    boxShadow="md"
                    onClick={() =>
                      setActiveImage((prev) =>
                        prev < images.length - 1 ? prev + 1 : 0,
                      )
                    }
                  >
                    <ChevronRight color="#2874f0" size={20} />
                  </Button>
                </>
              )}
            </Box>

            {/* Thumbnails */}
            {images.length > 1 && (
              <HStack spacing={3} overflowX="auto" pb={2}>
                {images.map((img, i) => (
                  <Box
                    key={i}
                    w="70px"
                    h="70px"
                    borderRadius="md"
                    overflow="hidden"
                    border="2px solid"
                    borderColor={
                      activeImage === i ? "brand.500" : "transparent"
                    }
                    cursor="pointer"
                    onClick={() => setActiveImage(i)}
                  >
                    <Image src={img} alt={`${product?.name} thumbnail ${i + 1}`} w="full" h="full" objectFit="cover" />
                  </Box>
                ))}
              </HStack>
            )}
          </GridItem>

          {/* Right Column: Product Details */}
          <GridItem>
            <VStack align="stretch" spacing={5}>
              <Box>
                <Heading as="h1" size="xl" color="surface.900" mb={2}>
                  {product.name}
                </Heading>
                <HStack spacing={4} align="center">
                  <Badge
                    colorScheme="green"
                    px={2}
                    py={1}
                    borderRadius="md"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    4.5 <Star size={12} fill="currentColor" />
                  </Badge>
                  <Text color="surface.500" fontSize="sm">
                    (128 Ratings & 45 Reviews)
                  </Text>
                </HStack>
              </Box>

              <Box>
                <HStack align="baseline" spacing={3}>
                  <Text fontSize="3xl" fontWeight="bold" color="surface.900">
                    ₹{priceAfterDiscount.toFixed(2)}
                  </Text>
                  {discountPercent > 0 && (
                    <>
                      <Text
                        fontSize="lg"
                        color="surface.400"
                        textDecoration="line-through"
                      >
                        ₹{parseFloat(product.price).toFixed(2)}
                      </Text>
                      <Text fontSize="md" color="green.500" fontWeight="bold">
                        {discountPercent}% off
                      </Text>
                    </>
                  )}
                </HStack>
                {product.stock > 0 ? (
                  <Text color="green.600" fontSize="sm" fontWeight="500" mt={1}>
                    In Stock
                  </Text>
                ) : (
                  <Text color="red.500" fontSize="sm" fontWeight="500" mt={1}>
                    Out of Stock
                  </Text>
                )}
              </Box>

              <HStack spacing={4} w="full" mt={2}>
                <Button
                  colorScheme="orange"
                  size="lg"
                  w="full"
                  leftIcon={<ShoppingBag size={18} />}
                  onClick={handleAddToCart}
                  isDisabled={product.stock === 0}
                >
                  Add to Cart
                </Button>
              </HStack>

              {/* Trust Badges */}
              <Grid
                templateColumns="repeat(3, 1fr)"
                gap={4}
                py={4}
                borderTop="1px solid"
                borderBottom="1px solid"
                borderColor="surface.200"
              >
                <VStack align="center" spacing={1}>
                  <Icon as={ShieldCheck} size={24} color="brand.500" />
                  <Text fontSize="xs" textAlign="center" fontWeight="500">
                    100% Quality
                    <br />
                    Guarantee
                  </Text>
                </VStack>
                <VStack align="center" spacing={1}>
                  <Icon as={Truck} size={24} color="brand.500" />
                  <Text fontSize="xs" textAlign="center" fontWeight="500">
                    Free & Fast
                    <br />
                    Delivery
                  </Text>
                </VStack>
                <VStack align="center" spacing={1}>
                  <Icon as={HeadsetIcon} size={24} color="brand.500" />
                  <Text fontSize="xs" textAlign="center" fontWeight="500">
                    24/7 Support
                    <br />
                    Help
                  </Text>
                </VStack>
              </Grid>

              {/* Tabs for Details, Specs, Reviews */}
              <Box mt={4}>
                <Tabs colorScheme="brand" variant="line">
                  <TabList>
                    <Tab fontWeight="600">Description</Tab>
                    <Tab fontWeight="600">Specifications</Tab>
                    <Tab fontWeight="600">Reviews</Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel px={0} py={4}>
                      <Text
                        color="surface.700"
                        lineHeight="1.7"
                        whiteSpace="pre-wrap"
                      >
                        {product.description}
                      </Text>
                    </TabPanel>
                    <TabPanel px={0} py={4}>
                      {product.specifications ? (
                        <VStack
                          align="stretch"
                          spacing={3}
                          border="1px solid"
                          borderColor="surface.200"
                          borderRadius="md"
                          p={0}
                        >
                          {Object.entries(product.specifications).map(
                            ([key, value], idx) => (
                              <Grid
                                key={key}
                                templateColumns="1fr 2fr"
                                p={3}
                                bg={idx % 2 === 0 ? "surface.50" : "white"}
                              >
                                <Text
                                  fontWeight="600"
                                  color="surface.600"
                                  textTransform="capitalize"
                                >
                                  {key}
                                </Text>
                                <Text color="surface.800">{String(value)}</Text>
                              </Grid>
                            ),
                          )}
                        </VStack>
                      ) : (
                        <Text color="surface.500">
                          No specifications available for this product.
                        </Text>
                      )}
                    </TabPanel>
                    <TabPanel px={0} py={4}>
                      {/* Placeholder for Reviews */}
                      <VStack align="stretch" spacing={6}>
                        <Box
                          p={4}
                          border="1px solid"
                          borderColor="surface.200"
                          borderRadius="md"
                        >
                          <HStack justify="space-between" mb={2}>
                            <HStack>
                              <Badge colorScheme="green" px={2}>
                                4 ★
                              </Badge>
                              <Text fontWeight="600">Amazing Taste!</Text>
                            </HStack>
                            <Text fontSize="xs" color="surface.400">
                              2 months ago
                            </Text>
                          </HStack>
                          <Text fontSize="sm" color="surface.700">
                            The authentic taste of Rajasthan is really here.
                            It's perfectly spiced and goes well with any meal.
                            Highly recommended!
                          </Text>
                          <Text fontSize="xs" color="surface.500" mt={2}>
                            - Rahul K.
                          </Text>
                        </Box>

                        {/* Write a Review Button */}
                        <Button variant="outline" alignSelf="flex-start">
                          Write a Review
                        </Button>
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
