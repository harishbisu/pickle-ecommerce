"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Button,
  Badge,
  IconButton,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Divider,
} from "@chakra-ui/react";
import {
  ShoppingCart,
  Package,
  LogOut,
  User,
  ChevronDown,
  Store,
  MapPin,
} from "lucide-react";
import NextLink from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "../providers/CartContext";
import { useAuth } from "../providers/AuthContext";
import Image from "next/image";

const navLinks = [
  { href: "/shop", label: "Shop", icon: Store },
  { href: "/track", label: "Track", icon: MapPin },
];

export function Navbar() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={200}
      transition="all 0.25s ease"
      bg={scrolled ? "rgba(255,255,255,0.85)" : "white"}
      backdropFilter={scrolled ? "blur(12px)" : "none"}
      borderBottom="1px solid"
      borderColor={scrolled ? "surface.200" : "surface.300"}
      boxShadow={
        scrolled
          ? "0 2px 12px rgba(60,64,67,0.12), 0 1px 4px rgba(60,64,67,0.08)"
          : "0 1px 2px rgba(60,64,67,0.1)"
      }
    >
      <Flex
        maxW="1280px"
        mx="auto"
        px={6}
        h="64px"
        align="center"
        justify="space-between"
      >
        {/* ── Logo ── */}
        <Flex
          align="center"
          gap={2.5}
          as={NextLink}
          href="/"
          textDecoration="none"
          _hover={{ opacity: 0.85 }}
          transition="opacity 0.15s"
        >
          <Box
            w="120px"
            h="36px"
            borderRadius="10px"
            // bgGradient="linear(135deg, brand.500, brand.700)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            // boxShadow="0 2px 8px rgba(26,115,232,0.35)"
          >
            <Image
              src={"/logo.webp"}
              alt="Pickle Hub Logo"
              width={120}
              height={36}
            />
          </Box>
          {/* <Heading
            size="md"
            bgGradient="linear(to-r, brand.600, brand.500)"
            bgClip="text"
            letterSpacing="-0.03em"
            display={{ base: "none", sm: "block" }}
          >
            Pickle Hub
          </Heading> */}
        </Flex>

        {/* ── Nav Links (pill buttons) ── */}
        <Flex gap={1} display={{ base: "none", md: "flex" }} align="center">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + "/");
            return (
              <Button
                key={href}
                as={NextLink}
                href={href}
                variant="ghost"
                size="sm"
                leftIcon={<Icon size={15} />}
                px={4}
                h="36px"
                borderRadius="full"
                fontSize="14px"
                fontWeight={isActive ? "600" : "500"}
                color={isActive ? "brand.600" : "surface.600"}
                bg={isActive ? "brand.50" : "transparent"}
                border="1.5px solid"
                borderColor={isActive ? "brand.200" : "transparent"}
                _hover={{
                  bg: isActive ? "brand.100" : "surface.100",
                  color: isActive ? "brand.600" : "surface.900",
                  borderColor: isActive ? "brand.300" : "surface.200",
                }}
                transition="all 0.18s ease"
                position="relative"
                overflow="hidden"
              >
                {label}
                {isActive && (
                  <Box
                    position="absolute"
                    bottom="0"
                    left="50%"
                    transform="translateX(-50%)"
                    w="16px"
                    h="2.5px"
                    bg="brand.500"
                    borderRadius="full"
                  />
                )}
              </Button>
            );
          })}
        </Flex>

        {/* ── Right Actions ── */}
        <Flex gap={2} align="center">
          {/* Cart icon */}
          <Box position="relative">
            <IconButton
              as={NextLink}
              href="/cart"
              aria-label="Shopping cart"
              icon={<ShoppingCart size={20} />}
              variant="ghost"
              borderRadius="full"
              color="surface.700"
              w="40px"
              h="40px"
              _hover={{ bg: "surface.100", color: "surface.900" }}
              transition="all 0.15s"
            />
            {totalItems > 0 && (
              <Badge
                position="absolute"
                top="-2px"
                right="-2px"
                borderRadius="full"
                fontSize="10px"
                minW="18px"
                h="18px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="google.red"
                color="white"
                fontWeight="700"
                border="2px solid white"
                boxShadow="0 1px 4px rgba(234,67,53,0.4)"
                animation={
                  totalItems > 0
                    ? "bounce-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
                    : "none"
                }
              >
                {totalItems > 9 ? "9+" : totalItems}
              </Badge>
            )}
          </Box>

          {/* Auth */}
          {isAuthenticated && user ? (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                borderRadius="full"
                p={1}
                pr={2}
                h="40px"
                rightIcon={<ChevronDown size={13} />}
                _hover={{ bg: "surface.100" }}
                transition="all 0.15s"
              >
                <Avatar
                  size="sm"
                  name={user.email}
                  bgGradient="linear(135deg, brand.400, brand.600)"
                  color="white"
                  fontSize="12px"
                  fontWeight="700"
                />
              </MenuButton>
              <MenuList
                borderRadius="16px"
                shadow="xl"
                border="1px solid"
                borderColor="surface.200"
                py={2}
                minW="200px"
                overflow="hidden"
              >
                <Box
                  px={4}
                  py={3}
                  bg="surface.50"
                  borderBottom="1px solid"
                  borderColor="surface.100"
                >
                  <Text
                    fontSize="13px"
                    fontWeight="700"
                    color="surface.900"
                    noOfLines={1}
                  >
                    {user.email}
                  </Text>
                  <Badge
                    colorScheme={user.role === "ADMIN" ? "purple" : "blue"}
                    fontSize="10px"
                    mt={1}
                    borderRadius="full"
                    px={2}
                  >
                    {user.role}
                  </Badge>
                </Box>

                {user.role === "ADMIN" && (
                  <>
                    <MenuItem
                      icon={<Package size={16} />}
                      onClick={() => router.push("/admin")}
                      fontSize="14px"
                      fontWeight="500"
                      _hover={{ bg: "brand.50", color: "brand.700" }}
                      py={2.5}
                    >
                      Admin Dashboard
                    </MenuItem>
                    <Divider />
                  </>
                )}
                <MenuItem
                  icon={<User size={16} />}
                  onClick={() => router.push("/track")}
                  fontSize="14px"
                  fontWeight="500"
                  _hover={{ bg: "surface.50" }}
                  py={2.5}
                >
                  My Orders
                </MenuItem>
                <Divider />
                <MenuItem
                  icon={<LogOut size={16} />}
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  color="google.red"
                  fontSize="14px"
                  fontWeight="500"
                  _hover={{ bg: "google.lightRed", color: "google.red" }}
                  py={2.5}
                >
                  Sign Out
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <Button
              as={NextLink}
              href="/login"
              size="sm"
              borderRadius="full"
              fontWeight="600"
              px={5}
              h="36px"
              fontSize="14px"
              bgGradient="linear(135deg, brand.500, brand.600)"
              color="white"
              boxShadow="0 2px 8px rgba(26,115,232,0.3)"
              _hover={{
                bgGradient: "linear(135deg, brand.600, brand.700)",
                boxShadow: "0 4px 12px rgba(26,115,232,0.4)",
                transform: "translateY(-1px)",
              }}
              _active={{ transform: "translateY(0)" }}
              transition="all 0.18s ease"
            >
              Sign In
            </Button>
          )}
        </Flex>
      </Flex>

      {/* Mobile bottom nav links */}
      <Flex
        display={{ base: "flex", md: "none" }}
        px={4}
        pb={2}
        gap={2}
        borderTop="1px solid"
        borderColor="surface.100"
        pt={2}
      >
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Button
              key={href}
              as={NextLink}
              href={href}
              variant="ghost"
              size="xs"
              leftIcon={<Icon size={13} />}
              flex={1}
              borderRadius="full"
              fontWeight={isActive ? "600" : "400"}
              color={isActive ? "brand.600" : "surface.600"}
              bg={isActive ? "brand.50" : "transparent"}
            >
              {label}
            </Button>
          );
        })}
      </Flex>
    </Box>
  );
}
