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
import { User, Package, MessageSquare, Star, Edit3 } from "lucide-react";
import { Navbar } from "../../components/Navbar";
import { useAuth } from "../../providers/AuthContext";
import { ordersApi, Order } from "../../lib/api";
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
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/profile");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      setAddressForm({
        name: user.email?.split("@")[0] || "",
        phone: user.phone || "",
        address: user.address || "",
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

  const handleUpdateProfile = () => {
    // In a real app, this would call a backend API to update user profile
    toast({
      title: "Profile Updated",
      description: "Your address and phone have been saved.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
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
        <Flex direction={{ base: "column", md: "row" }} gap={8}>
          
          {/* Left Sidebar */}
          <Box w={{ base: "full", md: "250px" }} flexShrink={0}>
            <Card borderRadius="xl" shadow="sm">
              <CardBody textAlign="center">
                <Box
                  w="80px"
                  h="80px"
                  bg="brand.100"
                  color="brand.600"
                  borderRadius="full"
                  mx="auto"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb={4}
                >
                  <User size={36} />
                </Box>
                <Heading size="sm" mb={1}>
                  {user.email.split("@")[0]}
                </Heading>
                <Text color="surface.500" fontSize="sm" mb={4}>
                  {user.email}
                </Text>
                <Badge colorScheme="purple">{user.role}</Badge>
              </CardBody>
            </Card>
          </Box>

          {/* Main Content */}
          <Box flex={1}>
            <Card borderRadius="xl" shadow="sm">
              <CardBody p={0}>
                <Tabs colorScheme="brand" isLazy>
                  <TabList px={6} pt={4}>
                    <Tab fontWeight="600" display="flex" gap={2}><Package size={16}/> Orders</Tab>
                    <Tab fontWeight="600" display="flex" gap={2}><Edit3 size={16}/> Profile Info</Tab>
                    <Tab fontWeight="600" display="flex" gap={2}><MessageSquare size={16}/> Support</Tab>
                  </TabList>

                  <TabPanels>
                    {/* Orders Tab */}
                    <TabPanel p={6}>
                      <Heading size="md" mb={6}>Purchase History</Heading>
                      {loadingOrders ? (
                        <Text>Loading orders...</Text>
                      ) : orders.length > 0 ? (
                        <VStack spacing={4} align="stretch">
                          {orders.map((order) => (
                            <Box key={order.id} p={4} border="1px solid" borderColor="surface.200" borderRadius="lg">
                              <Flex justify="space-between" mb={2}>
                                <Text fontWeight="bold">Order #{order.id}</Text>
                                <Badge colorScheme={order.status === "DELIVERED" ? "green" : "orange"}>
                                  {order.status}
                                </Badge>
                              </Flex>
                              <Text fontSize="sm" color="surface.500" mb={3}>
                                Total: ₹{order.totalAmount} • {new Date(order.createdAt).toLocaleDateString()}
                              </Text>
                              <Flex justify="space-between">
                                <Button size="sm" variant="outline" onClick={() => router.push(`/track?id=${order.id}`)}>
                                  Track Order
                                </Button>
                                {order.status === "DELIVERED" && (
                                  <Button size="sm" colorScheme="orange" variant="ghost" leftIcon={<Star size={14}/>}>
                                    Leave Review
                                  </Button>
                                )}
                              </Flex>
                            </Box>
                          ))}
                        </VStack>
                      ) : (
                        <Text color="surface.500">You haven't placed any orders yet.</Text>
                      )}
                    </TabPanel>

                    {/* Profile Info Tab */}
                    <TabPanel p={6}>
                      <Heading size="md" mb={6}>Address & Details</Heading>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel>Full Name</FormLabel>
                          <Input value={addressForm.name} onChange={(e) => setAddressForm({...addressForm, name: e.target.value})} />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Phone Number</FormLabel>
                          <Input value={addressForm.phone} onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})} />
                        </FormControl>
                        <FormControl>
                          <FormLabel>Delivery Address</FormLabel>
                          <Textarea value={addressForm.address} onChange={(e) => setAddressForm({...addressForm, address: e.target.value})} rows={3} />
                        </FormControl>
                        <Button colorScheme="blue" onClick={handleUpdateProfile} alignSelf="flex-start" mt={2}>
                          Save Details
                        </Button>
                      </VStack>
                    </TabPanel>

                    {/* Support / Raise Issue Tab */}
                    <TabPanel p={6}>
                      <Heading size="md" mb={2}>Raise an Issue</Heading>
                      <Text color="surface.500" mb={6}>Facing problems with your order? Let us know.</Text>
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
                          <Textarea placeholder="Please describe the issue in detail..." rows={4} />
                        </FormControl>
                        <Button colorScheme="red" onClick={handleSubmitIssue} alignSelf="flex-start" mt={2}>
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
