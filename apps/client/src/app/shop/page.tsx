"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Heading,
  Text,
  Button,
  Stack,
  Badge,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  HStack,
  VStack,
  Skeleton,
  useToast,
} from "@chakra-ui/react";
import { Search, ShoppingBag, SlidersHorizontal, X } from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { productsApi } from "../../lib/api";
import { Product } from "../../types";
import { useCart } from "../../providers/CartContext";
import { useRouter } from "next/navigation";

const RATINGS = [4.8, 4.6, 4.7, 4.5, 4.9, 4.4];
const REVIEW_COUNTS = [234, 89, 156, 312, 67, 143];

const CATEGORIES = [
  { id: "all", label: "All Pickles" },
  { id: "mango", label: "🥭 Mango" },
  { id: "garlic", label: "🧄 Garlic" },
  { id: "mixed", label: "🥗 Mixed" },
  { id: "chilli", label: "🌶️ Chilli" },
  { id: "lemon", label: "🍋 Lemon" },
];

const SORT_OPTIONS = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

function matchCategory(product: Product, category: string): boolean {
  if (category === "all") return true;
  return (
    product.name.toLowerCase().includes(category.toLowerCase()) ||
    product.description.toLowerCase().includes(category.toLowerCase())
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({
  product,
  idx,
  onAddToCart,
}: {
  product: Product;
  idx: number;
  onAddToCart: (product: Product) => void;
}) {
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setAdding(true);
    onAddToCart(product);
    setTimeout(() => setAdding(false), 800);
  };

  const router = useRouter();

  const rating = RATINGS[idx % RATINGS.length];
  const reviews = REVIEW_COUNTS[idx % REVIEW_COUNTS.length];
  const discount = parseFloat(product.discount || "0").toFixed(0);

  return (
    <Card
      overflow="hidden"
      position="relative"
      role="group"
      _hover={{ transform: "translateY(-6px)", boxShadow: "xl" }}
      transition="all 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
      className="fade-in"
      cursor="pointer"
      borderRadius="xl"
      onClick={() => router.push(`/shop/${product.slug || product.id}`)}
    >
      {/* Image */}
      <Box position="relative" overflow="hidden" h="300px" bg="surface.50">
        <Image
          src={
            product.images?.[0] ||
            "https://images.unsplash.com/photo-1627308595171-d1b5d6721b06?w=400"
          }
          alt={product.name}
          h="full"
          w="full"
          objectFit="cover"
          transition="transform 0.35s ease"
          _groupHover={{ transform: "scale(1.07)" }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1627308595171-d1b5d6721b06?w=400";
          }}
        />

        {/* Discount badge */}
        {discount != "0" && (
          <Badge
            position="absolute"
            top={2.5}
            left={2.5}
            bg="red.500"
            color="white"
            borderRadius="full"
            fontSize="10px"
            fontWeight="700"
            px={2}
            py={0.5}
          >
            {discount}% OFF
          </Badge>
        )}

        {/* Low stock badge */}
        {product.stock > 0 && product.stock <= 10 && (
          <Badge
            position="absolute"
            top={2.5}
            right={2.5}
            colorScheme="orange"
            borderRadius="full"
            fontSize="10px"
          >
            Only {product.stock} left
          </Badge>
        )}

        {/* Out of stock overlay */}
        {product.stock === 0 && (
          <Box
            position="absolute"
            inset={0}
            bg="blackAlpha.500"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Badge
              colorScheme="red"
              fontSize="12px"
              borderRadius="8px"
              px={3}
              py={1.5}
            >
              Out of Stock
            </Badge>
          </Box>
        )}
      </Box>

      <CardBody p={4}>
        <Stack spacing={3} justify="space-between" h="full">
          {/* Name & Description */}
          <Box>
            <Heading size="sm" color="surface.900" noOfLines={1} mb={1}>
              {product.name}
            </Heading>
            <Text
              fontSize="12px"
              color="surface.500"
              noOfLines={2}
              lineHeight="1.5"
            >
              {product.description}
            </Text>
          </Box>
          <VStack align="stretch">
            {/* Rating */}
            <HStack spacing={1.5}>
              <HStack spacing={0.5}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Text
                    key={star}
                    fontSize="11px"
                    color={
                      star <= Math.round(rating)
                        ? "google.yellow"
                        : "surface.300"
                    }
                  >
                    ★
                  </Text>
                ))}
              </HStack>
              <Text fontSize="12px" fontWeight="600" color="surface.700">
                {rating}
              </Text>
              <Text fontSize="11px" color="surface.400">
                ({reviews})
              </Text>
            </HStack>

            {/* Price Row */}
            <Flex align="center" justify="space-between">
              <Box>
                <HStack spacing={1.5} align="baseline">
                  <Text fontWeight="800" fontSize="18px" color="surface.900">
                    ₹
                    {Math.round(
                      parseFloat(product.price) *
                        parseFloat((1 - parseFloat(discount) / 100).toFixed(2)),
                    )}
                  </Text>
                  {discount != "0" && (
                    <Text
                      fontWeight="400"
                      fontSize="12px"
                      color="surface.400"
                      textDecoration="line-through"
                    >
                      ₹{product.price}
                    </Text>
                  )}
                </HStack>
                <Text fontSize="10px" color="google.green" fontWeight="600">
                  Free delivery
                </Text>
              </Box>
              <Box
                w="10px"
                h="10px"
                borderRadius="full"
                bg={product.stock > 0 ? "google.green" : "google.red"}
              />
            </Flex>

            {/* CTA Button */}
            <Button
              id={`add-cart-${product.id}`}
              size="sm"
              w="full"
              borderRadius="10px"
              leftIcon={<ShoppingBag size={14} />}
              isDisabled={product.stock === 0}
              onClick={handleAdd}
              isLoading={adding}
              loadingText="Adding..."
              h="38px"
              fontSize="13px"
              fontWeight="600"
              _hover={{ transform: "translateY(-1px)", boxShadow: "md" }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.15s ease"
            >
              {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
            </Button>
          </VStack>
        </Stack>
      </CardBody>
    </Card>
  );
}

// ─── Main Shop Page ───────────────────────────────────────────────────────────
export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");
  const [category, setCategory] = useState("all");
  const { addItem } = useCart();
  const toast = useToast();

  useEffect(() => {
    productsApi
      .list()
      .then((data) => setProducts(data.length > 0 ? data : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = (product: Product) => {
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
      description: product.name,
      status: "success",
      duration: 1800,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const filtered = products
    .filter((p) => matchCategory(p, category))
    .filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) => {
      if (sort === "price-asc")
        return parseFloat(a.price) - parseFloat(b.price);
      if (sort === "price-desc")
        return parseFloat(b.price) - parseFloat(a.price);
      if (sort === "rating")
        return (
          (RATINGS[products.indexOf(b) % RATINGS.length] || 0) -
          (RATINGS[products.indexOf(a) % RATINGS.length] || 0)
        );
      return 0;
    });

  return (
    <Box minH="100vh" bg="surface.50">
      <Navbar />

      {/* ── Hero Banner ──────────────────────────────────────────────── */}
      <Box
        bgGradient="linear(135deg, brand.700 0%, brand.500 50%, #4285f4 100%)"
        py={{ base: 10, md: 14 }}
        px={6}
        position="relative"
        overflow="hidden"
      >
        {/* Decorative circles */}
        <Box
          position="absolute"
          top="-40px"
          right="-40px"
          w="200px"
          h="200px"
          borderRadius="full"
          bg="whiteAlpha.100"
        />
        <Box
          position="absolute"
          bottom="-60px"
          left="10%"
          w="150px"
          h="150px"
          borderRadius="full"
          bg="whiteAlpha.100"
        />

        <Container maxW="1280px">
          <Flex
            direction={{ base: "column", md: "row" }}
            align="center"
            justify="space-between"
            gap={6}
          >
            <Box>
              <Badge
                bg="whiteAlpha.300"
                color="white"
                borderRadius="full"
                fontSize="11px"
                fontWeight="600"
                px={3}
                py={1}
                mb={3}
              >
                🥒 Authentic Rajasthan Flavours
              </Badge>
              <Heading
                color="white"
                fontSize={{ base: "2xl", md: "4xl" }}
                fontWeight="800"
                letterSpacing="-0.03em"
                mb={2}
              >
                Taste the Soul of Rajasthan
              </Heading>
              <Text
                color="whiteAlpha.800"
                fontSize={{ base: "14px", md: "16px" }}
                maxW="400px"
              >
                Crafted with Tradition, free delivery above ₹499
              </Text>
            </Box>

            {/* Search bar in hero */}
            <Box w={{ base: "full", md: "340px" }}>
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none" h="full" pl={4}>
                  <Search size={18} color="white" opacity={0.7} />
                </InputLeftElement>
                <Input
                  id="shop-search"
                  placeholder="Search for pickles..."
                  pl={12}
                  bg="whiteAlpha.200"
                  border="1.5px solid"
                  borderColor="whiteAlpha.400"
                  borderRadius="full"
                  color="white"
                  fontSize="14px"
                  _placeholder={{ color: "whiteAlpha.700" }}
                  _focus={{
                    bg: "white",
                    color: "surface.900",
                    borderColor: "white",
                    _placeholder: { color: "surface.400" },
                  }}
                  transition="all 0.2s"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>
            </Box>
          </Flex>
        </Container>
      </Box>

      <Container maxW="1280px" px={6} py={8}>
        {/* ── Category Chips ─────────────────────────────────────── */}
        <Text fontSize="14px" color="surface.500" mb={2}>
          Browse by category
        </Text>
        <Box
          mb={{ base: 2, md: 6 }}
          overflowX="auto"
          pb={2}
          css={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <HStack spacing={2} minW="max-content">
            {CATEGORIES.map(({ id, label }) => {
              const isActive = category === id;
              return (
                <Button
                  key={id}
                  size="sm"
                  h="36px"
                  px={4}
                  borderRadius="full"
                  fontWeight={isActive ? "600" : "500"}
                  fontSize="13px"
                  bg={isActive ? "brand.500" : "white"}
                  color={isActive ? "white" : "surface.700"}
                  border="1.5px solid"
                  borderColor={isActive ? "brand.500" : "surface.300"}
                  _hover={{
                    bg: isActive ? "brand.600" : "surface.100",
                    borderColor: isActive ? "brand.600" : "surface.400",
                  }}
                  boxShadow={
                    isActive ? "0 2px 8px rgba(26,115,232,0.25)" : "sm"
                  }
                  onClick={() => setCategory(id)}
                  transition="all 0.18s ease"
                >
                  {label}
                </Button>
              );
            })}
          </HStack>
        </Box>

        {/* ── Filter bar ─────────────────────────────────────── */}
        <VStack align="stretch" spacing={4} mb={{ base: 2, md: 6 }}>
          {/* Top Row */}
          <Flex justify="space-between" align="center" wrap="wrap" gap={3}>
            <Text fontSize="14px" color="surface.500">
              {loading ? (
                "Loading..."
              ) : (
                <>
                  <Text as="span" fontWeight="700" color="surface.800">
                    {filtered.length}
                  </Text>{" "}
                  products
                  {category !== "all" && (
                    <>
                      {" "}
                      in{" "}
                      <Text as="span" fontWeight="600" color="brand.500">
                        {CATEGORIES.find((c) => c.id === category)?.label}
                      </Text>
                    </>
                  )}
                  {search && (
                    <>
                      {" "}
                      matching "
                      <Text as="span" fontWeight="600">
                        {search}
                      </Text>
                      "
                    </>
                  )}
                </>
              )}
            </Text>

            {(search || category !== "all") && (
              <Button
                size="sm"
                variant="ghost"
                leftIcon={<X size={13} />}
                borderRadius="full"
                fontSize="12px"
                color="surface.500"
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                }}
              >
                Clear filters
              </Button>
            )}
          </Flex>

          {/* Scrollable Sort Chips */}
          <Box display="flex" gap={3} alignItems="center">
            <SlidersHorizontal size={22} color="#5f6368" />
            <Box
              overflowX="auto"
              overflowY="hidden"
              whiteSpace="nowrap"
              css={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              <HStack spacing={2} display="inline-flex" py={1}>
                {SORT_OPTIONS.map((opt) => (
                  <Button
                    key={opt.value}
                    size="xs"
                    h="30px"
                    px={3}
                    borderRadius="full"
                    fontSize="12px"
                    fontWeight={sort === opt.value ? "600" : "400"}
                    bg={sort === opt.value ? "brand.500" : "white"}
                    color={sort === opt.value ? "white" : "surface.600"}
                    border="1px solid"
                    borderColor={
                      sort === opt.value ? "brand.500" : "surface.200"
                    }
                    _hover={{
                      bg: sort === opt.value ? "brand.600" : "surface.50",
                    }}
                    onClick={() => setSort(opt.value)}
                    transition="all 0.15s"
                    flexShrink={0}
                  >
                    {opt.label}
                  </Button>
                ))}
              </HStack>
            </Box>
          </Box>
        </VStack>

        {/* ── Product Grid ─────────────────────────────────────────── */}
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={5}>
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
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
            : filtered.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  idx={idx}
                  onAddToCart={handleAddToCart}
                />
              ))}
        </SimpleGrid>

        {/* ── Empty State ───────────────────────────────────────────── */}
        {!loading && filtered.length === 0 && (
          <VStack py={20} spacing={4} textAlign="center">
            <Text fontSize="52px">🥒</Text>
            <Heading size="md" color="surface.600">
              No pickles found
            </Heading>
            <Text color="surface.400" fontSize="14px" maxW="300px">
              Try a different search term or category filter
            </Text>
            <Button
              onClick={() => {
                setSearch("");
                setCategory("all");
              }}
              variant="outline"
              size="sm"
              borderRadius="full"
              leftIcon={<X size={14} />}
            >
              Clear all filters
            </Button>
          </VStack>
        )}
      </Container>
    </Box>
  );
}
