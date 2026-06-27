"use client";

import { useState } from "react";
import {
  Box,
  Flex,
  Button,
  Badge,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Image,
} from "@chakra-ui/react";
import { ShoppingCart, User, LogOut, Package, ChevronDown } from "lucide-react";
import NextLink from "next/link";
import { useCart } from "../providers/CartContext";
import { useAuth } from "../providers/AuthContext";

export function Navbar() {
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Box
      as="nav"
      position="sticky"
      top={0}
      zIndex={200}
      bg="#2874f0" // Flipkart Blue
      color="white"
      boxShadow="0 2px 4px 0 rgba(0,0,0,.2)"
    >
      <Flex
        maxW="1280px"
        mx="auto"
        px={{ base: 4, md: 8 }}
        h="64px"
        align="center"
        justify="space-between"
        gap={6}
      >
        {/* Logo */}
        <Flex
          align="center"
          as={NextLink}
          href="/"
          textDecoration="none"
          flexShrink={0}
        >
          <Box h="30px" display="flex" alignItems="center" borderRadius="sm">
            <Image
              src="/logonav.jpeg"
              alt="Pickle Hub Logo"
              width={{ base: 150, md: 200, lg: 250 }}
              height={"auto"}
              style={{ objectFit: "contain" }}
            />
          </Box>
        </Flex>

        {/* Right Actions */}
        <Flex gap={6} align="center" flexShrink={0}>
          {/* User Auth */}
          {!isAuthenticated ? (
            <Button
              as={NextLink}
              href="/login"
              bg="white"
              color="#2874f0"
              px={10}
              h="32px"
              borderRadius="sm"
              fontSize="14px"
              fontWeight="600"
              _hover={{ bg: "white" }}
            >
              Login
            </Button>
          ) : (
            <Menu>
              <MenuButton
                as={Button}
                variant="ghost"
                rightIcon={<ChevronDown size={14} />}
                color="white"
                _hover={{ bg: "transparent", color: "white" }}
                _active={{ bg: "transparent" }}
                fontWeight="500"
              >
                <Flex align="center" gap={2}>
                  <User size={18} />
                  <Text display={{ base: "none", md: "flex" }}>
                    {user?.email?.split(" ")[0]}
                  </Text>
                </Flex>
              </MenuButton>
              <MenuList
                color="surface.900"
                borderRadius="sm"
                boxShadow="md"
                py={0}
              >
                {user?.role === "ADMIN" && (
                  <MenuItem
                    as={NextLink}
                    href="/admin"
                    py={3}
                    _hover={{ bg: "surface.50" }}
                  >
                    Admin Dashboard
                  </MenuItem>
                )}
                <MenuItem
                  as={NextLink}
                  href="/orders"
                  icon={<Package size={16} />}
                  py={3}
                  _hover={{ bg: "surface.50" }}
                >
                  Orders
                </MenuItem>
                <MenuItem
                  onClick={logout}
                  icon={<LogOut size={16} />}
                  color="red.500"
                  py={3}
                  _hover={{ bg: "red.50" }}
                >
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          )}

          {/* Cart */}
          <Flex
            as={NextLink}
            href="/cart"
            align="center"
            gap={2}
            color="white"
            fontWeight="500"
            _hover={{ textDecoration: "none" }}
            position="relative"
          >
            <ShoppingCart size={20} />
            <Text display={{ base: "none", md: "block" }}>Cart</Text>
            {totalItems > 0 && (
              <Badge
                position="absolute"
                top="-8px"
                left="10px"
                borderRadius="full"
                fontSize="10px"
                minW="18px"
                h="18px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                bg="#ff6161"
                color="white"
                border="1px solid white"
              >
                {totalItems}
              </Badge>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
