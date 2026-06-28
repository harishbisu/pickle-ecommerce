"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  HStack,
  Card,
  CardBody,
  Avatar,
  Spinner,
  Center,
  useToast
} from "@chakra-ui/react";
import { Mail, MoreVertical } from "lucide-react";
import { usersApi, User } from "../../../lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const fetchUsers = async () => {
    try {
      const data = await usersApi.list();
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to load users", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="xl" fontWeight="bold" color="surface.900">
          Manage Users
        </Text>
      </Flex>

      <Card shadow="sm" borderRadius="lg">
        <CardBody p={0}>
          {loading ? (
            <Center py={12}>
              <Spinner size="xl" color="brand.500" />
            </Center>
          ) : (
            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead bg="surface.50">
                  <Tr>
                    <Th py={4} color="surface.600">User</Th>
                    <Th py={4} color="surface.600">Role</Th>
                    <Th py={4} color="surface.600">Joined</Th>
                    <Th py={4} color="surface.600">Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {users.length === 0 ? (
                    <Tr>
                      <Td colSpan={4} textAlign="center" py={8} color="surface.500">
                        No users found
                      </Td>
                    </Tr>
                  ) : (
                    users.map((user) => (
                      <Tr key={user.id} _hover={{ bg: "surface.50" }}>
                        <Td>
                          <HStack spacing={3}>
                            <Avatar size="sm" name={user.name || user.email} />
                            <Box>
                              <Text fontWeight="600" fontSize="13px">
                                {user.name || 'No Name'}
                              </Text>
                              <Text color="surface.500" fontSize="12px">
                                {user.email}
                              </Text>
                            </Box>
                          </HStack>
                        </Td>
                        <Td>
                          {user.role === "ADMIN" ? (
                            <Badge colorScheme="purple" borderRadius="full" px={2} py={0.5}>
                              Admin
                            </Badge>
                          ) : (
                            <Badge colorScheme="gray" borderRadius="full" px={2} py={0.5}>
                              Customer
                            </Badge>
                          )}
                        </Td>
                        <Td color="surface.600">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </Td>
                        <Td>
                          <IconButton
                            aria-label="More"
                            icon={<MoreVertical size={16} />}
                            size="xs"
                            variant="ghost"
                          />
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </Box>
          )}
        </CardBody>
      </Card>
    </Box>
  );
}
