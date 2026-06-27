'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box, Flex, Heading, SimpleGrid, Card, CardBody, Text,
  Stat, StatLabel, StatNumber, Button, Badge,
  VStack, HStack, Table, Thead, Tbody, Tr, Th, Td,
  Spinner, Select, useToast, Divider, Input, Textarea,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, ModalCloseButton, useDisclosure, FormControl,
  FormLabel, FormErrorMessage, NumberInput, NumberInputField,
  NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay, IconButton, Tooltip,
  Tabs, TabList, Tab, TabPanels, TabPanel, InputGroup,
  InputLeftElement, Switch, FormHelperText, Center, Alert, AlertIcon,
} from '@chakra-ui/react';
import {
  Users, ShoppingBag, IndianRupee, Settings, LayoutDashboard,
  Package, TrendingUp, RefreshCw, LogOut, Plus, Pencil, Trash2,
  Search, Save, Image as ImageIcon, AlertTriangle, ShieldAlert,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { productsApi, ordersApi, settingsApi, Product, Order, AppSetting } from '../../lib/api';
import { useAuth } from '../../providers/AuthContext';
import { Navbar } from '../../components/Navbar';

// ─────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────
const statusColor: Record<string, string> = {
  ACKNOWLEDGED: 'blue',
  PAID: 'green',
  DISPATCHED: 'orange',
  IN_TRANSIT: 'yellow',
  OUT_FOR_DELIVERY: 'purple',
  DELIVERED: 'green',
  CANCELLED: 'red',
};

const ORDER_STATUSES = [
  'ACKNOWLEDGED', 'PAID', 'DISPATCHED',
  'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED',
];

const DEFAULT_SETTINGS = [
  { settingKey: 'store_name', settingValue: 'Pickle Hub', label: 'Store Name', helper: 'Displayed in the site header and emails' },
  { settingKey: 'delivery_fee', settingValue: '49', label: 'Delivery Fee (₹)', helper: 'Applied to all orders below the free-delivery threshold' },
  { settingKey: 'free_delivery_above', settingValue: '499', label: 'Free Delivery Above (₹)', helper: 'Orders above this amount get free delivery' },
  { settingKey: 'support_email', settingValue: 'support@picklehub.in', label: 'Support Email', helper: 'Displayed on receipts and contact pages' },
  { settingKey: 'razorpay_enabled', settingValue: 'true', label: 'Enable Razorpay', helper: 'Toggle live payment gateway' },
  { settingKey: 'maintenance_mode', settingValue: 'false', label: 'Maintenance Mode', helper: 'Show maintenance page to non-admin visitors' },
];

// ─────────────────────────────────────────────────────────────────
// Sub-components (StatCard, ProductFormModal, DeleteDialog, etc.)
// ─────────────────────────────────────────────────────────────────

function StatCard({
  label, value, icon: Icon, color, bg, help,
}: { label: string; value: string | number; icon: any; color: string; bg: string; help: string }) {
  return (
    <Card>
      <CardBody p={5}>
        <Flex align="start" justify="space-between">
          <Box>
            <Text fontSize="12px" color="surface.500" fontWeight="500" mb={1}>{label}</Text>
            <Text fontSize="28px" fontWeight="800" color="surface.900" lineHeight={1}>{value}</Text>
            <Text fontSize="11px" color="surface.400" mt={1}>{help}</Text>
          </Box>
          <Box w="44px" h="44px" borderRadius="12px" bg={bg} display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
            <Icon size={22} color={color} />
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: () => void;
}

function ProductFormModal({ isOpen, onClose, product, onSave }: ProductFormProps) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '0',
    images: '',
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: String(product.stock),
        images: product.images?.join(', ') || '',
      });
    } else {
      setForm({ name: '', description: '', price: '', stock: '0', images: '' });
    }
    setErrors({});
  }, [product, isOpen]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Product name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = 'Enter a valid price';
    if (isNaN(Number(form.stock)) || Number(form.stock) < 0)
      e.stock = 'Stock must be 0 or greater';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        images: form.images
          ? form.images.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
      };

      if (product) {
        await productsApi.update(product.id, payload);
        toast({ title: 'Product updated', status: 'success', duration: 2000, position: 'top-right' });
      } else {
        await productsApi.create(payload);
        toast({ title: 'Product created', status: 'success', duration: 2000, position: 'top-right' });
      }
      onSave();
      onClose();
    } catch (err: any) {
      toast({ title: err.message || 'Save failed', status: 'error', duration: 3000, position: 'top-right' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.400" />
      <ModalContent borderRadius="20px" mx={4} overflow="hidden">
        <ModalHeader
          bgGradient="linear(135deg, brand.500, brand.700)"
          color="white"
          fontSize="16px"
          fontWeight="700"
          py={5}
        >
          {product ? '✏️ Edit Product' : '➕ Add New Product'}
        </ModalHeader>
        <ModalCloseButton color="white" top={4} />
        <ModalBody py={6}>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.name}>
              <FormLabel fontSize="13px" fontWeight="600" color="surface.700">Product Name *</FormLabel>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Spicy Mango Pickle"
                size="sm"
                borderRadius="8px"
              />
              <FormErrorMessage fontSize="12px">{errors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.description}>
              <FormLabel fontSize="13px" fontWeight="600" color="surface.700">Description *</FormLabel>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Describe the product..."
                size="sm"
                borderRadius="8px"
                rows={3}
                resize="vertical"
              />
              <FormErrorMessage fontSize="12px">{errors.description}</FormErrorMessage>
            </FormControl>

            <HStack spacing={4} align="start">
              <FormControl isInvalid={!!errors.price} flex={1}>
                <FormLabel fontSize="13px" fontWeight="600" color="surface.700">Price (₹) *</FormLabel>
                <Input
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="199"
                  size="sm"
                  borderRadius="8px"
                  type="number"
                  min={0}
                />
                <FormErrorMessage fontSize="12px">{errors.price}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.stock} flex={1}>
                <FormLabel fontSize="13px" fontWeight="600" color="surface.700">Stock Qty</FormLabel>
                <NumberInput
                  value={form.stock}
                  onChange={(v) => setForm({ ...form, stock: v })}
                  min={0}
                  size="sm"
                >
                  <NumberInputField borderRadius="8px" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <FormErrorMessage fontSize="12px">{errors.stock}</FormErrorMessage>
              </FormControl>
            </HStack>

            <FormControl>
              <FormLabel fontSize="13px" fontWeight="600" color="surface.700">
                <HStack spacing={1}>
                  <ImageIcon size={13} />
                  <Text>Image URLs</Text>
                </HStack>
              </FormLabel>
              <Textarea
                value={form.images}
                onChange={(e) => setForm({ ...form, images: e.target.value })}
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                size="sm"
                borderRadius="8px"
                rows={2}
                resize="vertical"
                fontFamily="mono"
                fontSize="12px"
              />
              <Text fontSize="11px" color="surface.400" mt={1}>
                Separate multiple URLs with commas
              </Text>
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter gap={3} borderTop="1px solid" borderColor="surface.100" py={4}>
          <Button variant="ghost" size="sm" onClick={onClose} borderRadius="8px">
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleSubmit}
            isLoading={saving}
            loadingText="Saving..."
            leftIcon={<Save size={14} />}
            borderRadius="8px"
            px={6}
          >
            {product ? 'Update Product' : 'Add Product'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

interface DeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
  deleting: boolean;
}

function DeleteDialog({ isOpen, onClose, onConfirm, productName, deleting }: DeleteDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
      <AlertDialogOverlay backdropFilter="blur(4px)" bg="blackAlpha.400">
        <AlertDialogContent borderRadius="20px" mx={4}>
          <AlertDialogHeader fontSize="16px" fontWeight="700">
            <HStack>
              <AlertTriangle size={18} color="#ea4335" />
              <Text>Delete Product</Text>
            </HStack>
          </AlertDialogHeader>
          <AlertDialogBody fontSize="14px" color="surface.600">
            Are you sure you want to delete <strong>"{productName}"</strong>? This action cannot be undone.
          </AlertDialogBody>
          <AlertDialogFooter gap={3}>
            <Button ref={cancelRef} variant="ghost" size="sm" onClick={onClose} borderRadius="8px">
              Cancel
            </Button>
            <Button
              colorScheme="red"
              size="sm"
              onClick={onConfirm}
              isLoading={deleting}
              loadingText="Deleting..."
              borderRadius="8px"
              bg="google.red"
              _hover={{ bg: '#c5221f' }}
              leftIcon={<Trash2 size={14} />}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

// Placeholder for remaining tab components (DashboardTab, OrdersTab, ProductsTab, SettingsTab)
// These should be extracted from the original admin page

function DashboardTab({ orders, loading }: { orders: Order[]; loading: boolean }) {
  return <Text>Dashboard Tab</Text>;
}

function OrdersTab({ orders, loading, onRefresh }: { orders: Order[]; loading: boolean; onRefresh: () => void }) {
  return <Text>Orders Tab</Text>;
}

function ProductsTab() {
  return <Text>Products Tab</Text>;
}

function SettingsTab() {
  return <Text>Settings Tab</Text>;
}

// ─────────────────────────────────────────────────────────────────
// Main Admin Dashboard Component
// ─────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const { user, logout } = useAuth();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const data = await ordersApi.list();
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', index: 0 },
    { icon: ShoppingBag, label: 'Orders', index: 1 },
    { icon: Package, label: 'Products', index: 2 },
    { icon: Settings, label: 'Settings', index: 3 },
  ];

  return (
    <Box minH="100vh" bg="surface.50">
      <Navbar />
      <Flex>
        {/* Sidebar */}
        <Box
          w={{ base: '0px', md: '220px' }}
          bg="white"
          borderRight="1px solid"
          borderColor="surface.100"
          p={6}
          display={{ base: 'none', md: 'block' }}
          position="sticky"
          top="80px"
          h="calc(100vh - 80px)"
          overflowY="auto"
        >
          <VStack align="stretch" spacing={2}>
            {sidebarItems.map((item) => (
              <Button
                key={item.index}
                variant={tabIndex === item.index ? 'solid' : 'ghost'}
                justifyContent="flex-start"
                leftIcon={<item.icon size={18} />}
                onClick={() => setTabIndex(item.index)}
                size="sm"
                borderRadius="8px"
                fontSize="14px"
              >
                {item.label}
              </Button>
            ))}
          </VStack>
        </Box>

        {/* Main Content */}
        <Box flex={1} minH="calc(100vh - 80px)">
          <Flex align="center" justify="space-between" p={6} borderBottom="1px solid" borderColor="surface.100" bg="white">
            <Heading size="md" color="surface.900">Admin Dashboard</Heading>
            <HStack spacing={4}>
              <HStack spacing={2}>
                <Badge
                  bg="brand.50"
                  color="brand.700"
                  borderRadius="full"
                  px={3} py={1}
                  fontSize="11px"
                  fontWeight="600"
                >
                  Admin
                </Badge>
                <Text fontSize="13px" color="surface.600" display={{ base: 'none', md: 'block' }}>
                  {user?.email}
                </Text>
              </HStack>
            </HStack>
          </Flex>

          {/* Tab content */}
          <Box p={8}>
            <Tabs index={tabIndex} onChange={setTabIndex} isLazy>
              <TabList display="none">
                <Tab>Dashboard</Tab>
                <Tab>Orders</Tab>
                <Tab>Products</Tab>
                <Tab>Settings</Tab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <DashboardTab orders={orders} loading={ordersLoading} />
                </TabPanel>
                <TabPanel p={0}>
                  <Card>
                    <CardBody p={6}>
                      <OrdersTab orders={orders} loading={ordersLoading} onRefresh={loadOrders} />
                    </CardBody>
                  </Card>
                </TabPanel>
                <TabPanel p={0}>
                  <Card>
                    <CardBody p={6}>
                      <ProductsTab />
                    </CardBody>
                  </Card>
                </TabPanel>
                <TabPanel p={0}>
                  <SettingsTab />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
