"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  Input,
  FormControl,
  FormLabel,
  useToast,
  Badge,
  Textarea,
  Divider,
  Flex,
} from "@chakra-ui/react";
import {
  User,
  Package,
  MessageSquare,
  Star,
  Edit3,
  MapPin,
  Phone,
  Hash,
} from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { useAuth } from "../../providers/AuthContext";
import { ordersApi, usersApi, Order } from "../../lib/api";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    address: "",
    state: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setAddressForm({
        name: user.name || user.email?.split("@")[0] || "",
        phone: user.phone || "",
        address: user.address || "",
        state: user.state || "",
      });
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      // Assuming list() returns orders for the logged-in user if not admin
      const data = await ordersApi.list();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders", error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSavingProfile(true);
    try {
      await usersApi.updateProfile({
        name: addressForm.name,
        phone: addressForm.phone,
        address: addressForm.address,
        state: addressForm.state,
      });
      toast({
        title: "Profile Updated",
        description: "Your profile details have been saved securely.",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    } catch (err) {
      toast({
        title: "Failed to update",
        description: "An error occurred while saving your profile.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSubmitIssue = () => {
    toast({
      title: "Issue Submitted",
      description: "We will get back to you shortly.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  if (isLoading || !user) {
    return (
      <Box minH="100vh" bg="surface.50">
        <Navbar />
        <Container maxW="800px" py={20} textAlign="center">
          <Text>Loading profile...</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="surface.50">
      <Navbar />

      <Container maxW="900px" py={10}>
        <Flex direction={"column"} gap={8}>
          {/* Left Sidebar */}
          <Box w={"full"} flexShrink={0}>
            <Card borderRadius="xl" shadow="sm">
              <CardBody
                textAlign="center"
                display="flex"
                alignItems="center"
                justifyContent="space-around"
              >
                <Box
                  w="full"
                  bg="brand.100"
                  minH="80px"
                  color="brand.600"
                  borderRadius="full"
                  mx="auto"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-around"
                  mb={4}
                >
                  <User size={36} />
                  <Badge borderRadius={'xl'} colorScheme="purple">{user.role}</Badge>
                </Box>
                <Box w="full" ml={4}>
                  <Heading size="sm" mb={1}>
                    {user.name || user.email?.split("@")[0]}
                  </Heading>
                  <Text color="surface.500" fontSize="sm" mb={4}>
                    {user.email}
                  </Text>
                </Box>
              </CardBody>
            </Card>
          </Box>

          {/* Main Content */}
          <Box flex={1}>
            <Card borderRadius="xl" shadow="sm">
              <CardBody p={0}>
                <Tabs colorScheme="brand" isLazy>
                  <TabList px={6} pt={4}>
                    <Tab fontWeight="600" display="flex" gap={2}>
                      <Package size={16} /> Orders
                    </Tab>
                    <Tab fontWeight="600" display="flex" gap={2}>
                      <Edit3 size={16} /> Profile Info
                    </Tab>
                    <Tab fontWeight="600" display="flex" gap={2}>
                      <MessageSquare size={16} /> Support
                    </Tab>
                  </TabList>

                  <TabPanels>
                    {/* Orders Tab */}
                    <TabPanel p={6}>
                      <Heading size="md" mb={6}>
                        Purchase History
                      </Heading>
                      {loadingOrders ? (
                        <Text>Loading orders...</Text>
                      ) : orders.length > 0 ? (
                        <VStack spacing={4} align="stretch">
                          {orders.map((order) => (
                            <Box
                              key={order.id}
                              p={4}
                              border="1px solid"
                              borderColor="surface.200"
                              borderRadius="lg"
                            >
                              <Flex justify="space-between" mb={2}>
                                <Text fontWeight="bold">
                                  Order #{order.orderNumber}
                                </Text>
                                <Badge
                                  colorScheme={
                                    order.status === "DELIVERED"
                                      ? "green"
                                      : "orange"
                                  }
                                >
                                  {order.status}
                                </Badge>
                              </Flex>
                              <Text fontSize="sm" color="surface.500" mb={3}>
                                Total: ₹{order.totalAmount} •{" "}
                                {new Date(order.createdAt).toLocaleDateString()}
                              </Text>
                              <Flex justify="space-between">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    router.push(
                                      `/track?id=${order.orderNumber}`,
                                    )
                                  }
                                >
                                  Track Order
                                </Button>
                                {order.status === "DELIVERED" && (
                                  <Button
                                    size="sm"
                                    colorScheme="orange"
                                    variant="ghost"
                                    leftIcon={<Star size={14} />}
                                  >
                                    Leave Review
                                  </Button>
                                )}
                              </Flex>
                            </Box>
                          ))}
                        </VStack>
                      ) : (
                        <Text color="surface.500">
                          You haven't placed any orders yet.
                        </Text>
                      )}
                    </TabPanel>

                    {/* Profile Info Tab */}
                    <TabPanel p={6}>
                      <Heading size="md" mb={6} color="surface.800">
                        Personal Details
                      </Heading>
                      <Card
                        variant="outline"
                        borderColor="surface.200"
                        borderRadius="xl"
                      >
                        <CardBody>
                          <VStack spacing={5} align="stretch">
                            <FormControl>
                              <FormLabel
                                fontSize="sm"
                                color="surface.600"
                                fontWeight="600"
                              >
                                <HStack spacing={2}>
                                  <User size={14} /> <Text>Full Name</Text>
                                </HStack>
                              </FormLabel>
                              <Input
                                size="md"
                                borderRadius="lg"
                                focusBorderColor="brand.500"
                                value={addressForm.name}
                                onChange={(e) =>
                                  setAddressForm({
                                    ...addressForm,
                                    name: e.target.value,
                                  })
                                }
                              />
                            </FormControl>

                            <Flex
                              gap={4}
                              direction={{ base: "column", md: "row" }}
                            >
                              <FormControl flex={1}>
                                <FormLabel
                                  fontSize="sm"
                                  color="surface.600"
                                  fontWeight="600"
                                >
                                  <HStack spacing={2}>
                                    <Phone size={14} />{" "}
                                    <Text>Phone Number</Text>
                                  </HStack>
                                </FormLabel>
                                <Input
                                  size="md"
                                  borderRadius="lg"
                                  focusBorderColor="brand.500"
                                  value={addressForm.phone}
                                  onChange={(e) =>
                                    setAddressForm({
                                      ...addressForm,
                                      phone: e.target.value,
                                    })
                                  }
                                />
                              </FormControl>
                              <FormControl flex={1}>
                                <FormLabel
                                  fontSize="sm"
                                  color="surface.600"
                                  fontWeight="600"
                                >
                                  <HStack spacing={2}>
                                    <MapPin size={14} /> <Text>State</Text>
                                  </HStack>
                                </FormLabel>
                                <Input
                                  size="md"
                                  borderRadius="lg"
                                  focusBorderColor="brand.500"
                                  value={addressForm.state}
                                  onChange={(e) =>
                                    setAddressForm({
                                      ...addressForm,
                                      state: e.target.value,
                                    })
                                  }
                                />
                              </FormControl>
                            </Flex>

                            <FormControl>
                              <FormLabel
                                fontSize="sm"
                                color="surface.600"
                                fontWeight="600"
                              >
                                <HStack spacing={2}>
                                  <MapPin size={14} />{" "}
                                  <Text>Delivery Address</Text>
                                </HStack>
                              </FormLabel>
                              <Textarea
                                size="md"
                                borderRadius="lg"
                                focusBorderColor="brand.500"
                                value={addressForm.address}
                                onChange={(e) =>
                                  setAddressForm({
                                    ...addressForm,
                                    address: e.target.value,
                                  })
                                }
                                rows={3}
                              />
                            </FormControl>

                            <Divider my={2} />
                            <Button
                              colorScheme="brand"
                              onClick={handleUpdateProfile}
                              alignSelf="flex-end"
                              px={8}
                              borderRadius="full"
                              isLoading={savingProfile}
                              loadingText="Saving..."
                            >
                              Save Changes
                            </Button>
                          </VStack>
                        </CardBody>
                      </Card>
                    </TabPanel>

                    {/* Support / Raise Issue Tab */}
                    <TabPanel p={6}>
                      <Heading size="md" mb={2}>
                        Raise an Issue
                      </Heading>
                      <Text color="surface.500" mb={6}>
                        Facing problems with your order? Let us know.
                      </Text>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel>Related Order Number</FormLabel>
                          <Input placeholder="e.g. ORD-12345" />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Subject</FormLabel>
                          <Input placeholder="e.g. Received damaged product" />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Description</FormLabel>
                          <Textarea
                            placeholder="Please describe the issue in detail..."
                            rows={4}
                          />
                        </FormControl>
                        <Button
                          colorScheme="red"
                          onClick={handleSubmitIssue}
                          alignSelf="flex-start"
                          mt={2}
                        >
                          Submit Issue
                        </Button>
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </CardBody>
            </Card>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}
