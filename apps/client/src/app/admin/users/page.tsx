"use client";

import { useState } from "react";
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
} from "@chakra-ui/react";
import { Mail, MoreVertical } from "lucide-react";

const DUMMY_USERS = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@picklehub.in",
    role: "ADMIN",
    status: "ACTIVE",
    joined: "2024-01-10",
  },
  {
    id: 2,
    name: "Ravi Kumar",
    email: "ravi@example.com",
    role: "USER",
    status: "ACTIVE",
    joined: "2024-02-15",
  },
  {
    id: 3,
    name: "Priya Singh",
    email: "priya.s@example.com",
    role: "USER",
    status: "INACTIVE",
    joined: "2024-03-01",
  },
];

export default function UsersPage() {
  const [users] = useState(DUMMY_USERS);

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="xl" fontWeight="bold" color="surface.900">
          Manage Users
        </Text>
        <Button
          leftIcon={<Mail size={16} />}
          size="sm"
          variant="outline"
          borderRadius="8px"
        >
          Invite User
        </Button>
      </Flex>

      <Card>
        <CardBody>
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead bg="surface.50">
                <Tr>
                  <Th py={4} color="surface.600">
                    User
                  </Th>
                  <Th py={4} color="surface.600">
                    Role
                  </Th>
                  <Th py={4} color="surface.600">
                    Status
                  </Th>
                  <Th py={4} color="surface.600">
                    Joined
                  </Th>
                  <Th py={4} color="surface.600">
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user) => (
                  <Tr key={user.id} _hover={{ bg: "surface.50" }}>
                    <Td>
                      <HStack spacing={3}>
                        <Avatar size="sm" name={user.name} />
                        <Box>
                          <Text fontWeight="600" fontSize="13px">
                            {user.name}
                          </Text>
                          <Text color="surface.500" fontSize="12px">
                            {user.email}
                          </Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td>
                      {user.role === "ADMIN" ? (
                        <Badge
                          colorScheme="purple"
                          borderRadius="full"
                          px={2}
                          py={0.5}
                        >
                          Admin
                        </Badge>
                      ) : (
                        <Badge
                          colorScheme="gray"
                          borderRadius="full"
                          px={2}
                          py={0.5}
                        >
                          Customer
                        </Badge>
                      )}
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={user.status === "ACTIVE" ? "green" : "red"}
                        borderRadius="full"
                        px={2}
                        py={0.5}
                      >
                        {user.status}
                      </Badge>
                    </Td>
                    <Td color="surface.600">
                      {new Date(user.joined).toLocaleDateString()}
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
                ))}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>
    </Box>
  );
}
