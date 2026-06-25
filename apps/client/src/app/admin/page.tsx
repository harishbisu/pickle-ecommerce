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
  InputLeftElement, Switch, FormHelperText,
} from '@chakra-ui/react';
import {
  Users, ShoppingBag, IndianRupee, Settings, LayoutDashboard,
  Package, TrendingUp, RefreshCw, LogOut, Plus, Pencil, Trash2,
  Search, Save, Image as ImageIcon, AlertTriangle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { productsApi, ordersApi, settingsApi, Product, Order, AppSetting } from '../../lib/api';
import { useAuth } from '../../providers/AuthContext';

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
};

const ORDER_STATUSES = [
  'ACKNOWLEDGED', 'PAID', 'DISPATCHED',
  'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED',
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
// Sub-components
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

// ─────────────────────────────────────────────────────────────────
// Product Form Modal
// ─────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────
// Delete Confirm Dialog
// ─────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────
// Products Tab
// ─────────────────────────────────────────────────────────────────
function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const toast = useToast();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productsApi.list();
      setProducts(data);
    } catch {
      toast({ title: 'Failed to load products', status: 'error', duration: 2000, position: 'top-right' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    onFormOpen();
  };

  const handleAdd = () => {
    setSelectedProduct(null);
    onFormOpen();
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await productsApi.delete(productToDelete.id);
      toast({ title: 'Product deleted', status: 'success', duration: 2000, position: 'top-right' });
      loadProducts();
      onDeleteClose();
    } catch (err: any) {
      toast({ title: err.message || 'Delete failed', status: 'error', duration: 3000, position: 'top-right' });
    } finally {
      setDeleting(false);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <Flex justify="space-between" align="center" mb={5} gap={4} wrap="wrap">
        <Heading size="sm" color="surface.900">
          Products
          <Badge ml={2} colorScheme="blue" borderRadius="full" fontSize="11px">
            {products.length}
          </Badge>
        </Heading>
        <HStack spacing={3}>
          <InputGroup size="sm" w="220px">
            <InputLeftElement h="full" pointerEvents="none">
              <Search size={14} color="#9aa0a6" />
            </InputLeftElement>
            <Input
              pl={8}
              placeholder="Search products..."
              borderRadius="8px"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          <Button
            size="sm"
            leftIcon={<Plus size={14} />}
            onClick={handleAdd}
            borderRadius="8px"
            px={4}
          >
            Add Product
          </Button>
        </HStack>
      </Flex>

      {loading ? (
        <Flex justify="center" py={16}>
          <VStack spacing={3}>
            <Spinner size="lg" color="brand.500" thickness="3px" />
            <Text fontSize="13px" color="surface.500">Loading products...</Text>
          </VStack>
        </Flex>
      ) : filtered.length === 0 ? (
        <VStack py={16} spacing={4}>
          <Text fontSize="48px">📦</Text>
          <Text color="surface.500" fontSize="14px">
            {search ? 'No products match your search' : 'No products yet. Add your first one!'}
          </Text>
          {!search && (
            <Button size="sm" leftIcon={<Plus size={14} />} onClick={handleAdd} borderRadius="8px">
              Add Product
            </Button>
          )}
        </VStack>
      ) : (
        <Box overflowX="auto">
          <Table size="sm" variant="simple">
            <Thead>
              <Tr bg="surface.50">
                <Th color="surface.500" fontSize="11px" fontWeight="600" borderRadius="8px 0 0 8px">ID</Th>
                <Th color="surface.500" fontSize="11px" fontWeight="600">PRODUCT</Th>
                <Th color="surface.500" fontSize="11px" fontWeight="600">PRICE</Th>
                <Th color="surface.500" fontSize="11px" fontWeight="600">STOCK</Th>
                <Th color="surface.500" fontSize="11px" fontWeight="600">STATUS</Th>
                <Th color="surface.500" fontSize="11px" fontWeight="600" borderRadius="0 8px 8px 0">ACTIONS</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((product) => (
                <Tr
                  key={product.id}
                  _hover={{ bg: 'surface.50' }}
                  transition="background 0.15s"
                >
                  <Td fontWeight="600" color="brand.500" fontSize="12px">#{product.id}</Td>
                  <Td>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="13px" fontWeight="600" color="surface.900">{product.name}</Text>
                      <Text fontSize="11px" color="surface.500" noOfLines={1} maxW="220px">
                        {product.description}
                      </Text>
                    </VStack>
                  </Td>
                  <Td>
                    <Text fontSize="13px" fontWeight="700" color="surface.900">₹{product.price}</Text>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={product.stock === 0 ? 'red' : product.stock <= 10 ? 'orange' : 'green'}
                      borderRadius="full"
                      fontSize="10px"
                    >
                      {product.stock === 0 ? 'Out of stock' : `${product.stock} left`}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge
                      colorScheme={product.stock > 0 ? 'green' : 'red'}
                      borderRadius="full"
                      fontSize="10px"
                    >
                      {product.stock > 0 ? 'Active' : 'Inactive'}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={1}>
                      <Tooltip label="Edit product" hasArrow borderRadius="6px">
                        <IconButton
                          aria-label="Edit product"
                          icon={<Pencil size={14} />}
                          size="xs"
                          variant="ghost"
                          borderRadius="6px"
                          color="brand.500"
                          _hover={{ bg: 'brand.50' }}
                          onClick={() => handleEdit(product)}
                        />
                      </Tooltip>
                      <Tooltip label="Delete product" hasArrow borderRadius="6px">
                        <IconButton
                          aria-label="Delete product"
                          icon={<Trash2 size={14} />}
                          size="xs"
                          variant="ghost"
                          borderRadius="6px"
                          color="google.red"
                          _hover={{ bg: 'google.lightRed' }}
                          onClick={() => handleDeleteClick(product)}
                        />
                      </Tooltip>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}

      <ProductFormModal
        isOpen={isFormOpen}
        onClose={onFormClose}
        product={selectedProduct}
        onSave={loadProducts}
      />

      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleDeleteConfirm}
        productName={productToDelete?.name || ''}
        deleting={deleting}
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// Settings Tab
// ─────────────────────────────────────────────────────────────────
function SettingsTab() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    settingsApi.getAll()
      .then((data) => {
        const map: Record<string, string> = {};
        data.forEach((s) => { map[s.settingKey] = s.settingValue; });
        // Merge with defaults for any missing keys
        DEFAULT_SETTINGS.forEach((d) => {
          if (!(d.settingKey in map)) map[d.settingKey] = d.settingValue;
        });
        setSettings(map);
      })
      .catch(() => {
        // Use defaults if API not ready
        const defaults: Record<string, string> = {};
        DEFAULT_SETTINGS.forEach((d) => { defaults[d.settingKey] = d.settingValue; });
        setSettings(defaults);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (key: string) => {
    setSaving(key);
    try {
      await settingsApi.set(key, settings[key]);
      toast({ title: 'Setting saved', status: 'success', duration: 1500, position: 'top-right' });
    } catch (err: any) {
      toast({ title: err.message || 'Save failed', status: 'error', duration: 3000, position: 'top-right' });
    } finally {
      setSaving(null);
    }
  };

  const handleSaveAll = async () => {
    setSaving('all');
    try {
      await Promise.all(
        Object.entries(settings).map(([key, value]) => settingsApi.set(key, value)),
      );
      toast({ title: 'All settings saved', status: 'success', duration: 2000, position: 'top-right' });
    } catch (err: any) {
      toast({ title: err.message || 'Save failed', status: 'error', duration: 3000, position: 'top-right' });
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" py={16}>
        <VStack spacing={3}>
          <Spinner size="lg" color="brand.500" thickness="3px" />
          <Text fontSize="13px" color="surface.500">Loading settings...</Text>
        </VStack>
      </Flex>
    );
  }

  return (
    <VStack spacing={6} align="stretch">
      <Flex justify="space-between" align="center">
        <Box>
          <Heading size="sm" color="surface.900" mb={1}>Store Settings</Heading>
          <Text fontSize="12px" color="surface.500">
            Configure your store behaviour and appearance
          </Text>
        </Box>
        <Button
          size="sm"
          leftIcon={<Save size={14} />}
          onClick={handleSaveAll}
          isLoading={saving === 'all'}
          loadingText="Saving..."
          borderRadius="8px"
          px={5}
        >
          Save All
        </Button>
      </Flex>

      {DEFAULT_SETTINGS.map(({ settingKey, label, helper }) => {
        const isBool = ['razorpay_enabled', 'maintenance_mode'].includes(settingKey);
        const isToggle = isBool;
        const value = settings[settingKey] ?? '';

        return (
          <Card key={settingKey}>
            <CardBody p={5}>
              <Flex justify="space-between" align="start" gap={4} wrap={{ base: 'wrap', md: 'nowrap' }}>
                <Box flex={1}>
                  <FormLabel fontSize="13px" fontWeight="600" color="surface.800" mb={1}>
                    {label}
                  </FormLabel>
                  <FormHelperText fontSize="12px" color="surface.400" mt={0} mb={3}>
                    {helper}
                  </FormHelperText>

                  {isToggle ? (
                    <HStack spacing={3}>
                      <Switch
                        isChecked={value === 'true'}
                        onChange={(e) =>
                          setSettings({ ...settings, [settingKey]: e.target.checked ? 'true' : 'false' })
                        }
                        colorScheme="green"
                        size="md"
                      />
                      <Badge
                        colorScheme={value === 'true' ? 'green' : 'red'}
                        borderRadius="full"
                        fontSize="10px"
                      >
                        {value === 'true' ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </HStack>
                  ) : (
                    <Input
                      value={value}
                      onChange={(e) => setSettings({ ...settings, [settingKey]: e.target.value })}
                      size="sm"
                      borderRadius="8px"
                      maxW="360px"
                      bg="surface.50"
                      _focus={{ bg: 'white' }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSave(settingKey)}
                    />
                  )}
                </Box>

                <Button
                  size="xs"
                  variant="outline"
                  leftIcon={<Save size={12} />}
                  onClick={() => handleSave(settingKey)}
                  isLoading={saving === settingKey}
                  borderRadius="6px"
                  flexShrink={0}
                  mt={{ base: 0, md: 7 }}
                >
                  Save
                </Button>
              </Flex>
            </CardBody>
          </Card>
        );
      })}
    </VStack>
  );
}

// ─────────────────────────────────────────────────────────────────
// Orders Tab
// ─────────────────────────────────────────────────────────────────
function OrdersTab({ orders, loading, onRefresh }: { orders: Order[]; loading: boolean; onRefresh: () => void }) {
  const toast = useToast();
  const [search, setSearch] = useState('');

  const handleStatusUpdate = async (orderId: number, status: string) => {
    try {
      await ordersApi.updateStatus(orderId, status);
      toast({ title: 'Status updated', status: 'success', duration: 1500, position: 'top-right' });
      onRefresh();
    } catch {
      toast({ title: 'Update failed', status: 'error', duration: 2000, position: 'top-right' });
    }
  };

  const filtered = orders.filter(
    (o) =>
      String(o.id).includes(search) ||
      String(o.userId).includes(search) ||
      o.status.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <Flex justify="space-between" align="center" mb={5} gap={4} wrap="wrap">
        <Heading size="sm" color="surface.900">
          Orders
          <Badge ml={2} colorScheme="blue" borderRadius="full" fontSize="11px">
            {orders.length}
          </Badge>
        </Heading>
        <HStack spacing={3}>
          <InputGroup size="sm" w="220px">
            <InputLeftElement h="full" pointerEvents="none">
              <Search size={14} color="#9aa0a6" />
            </InputLeftElement>
            <Input
              pl={8}
              placeholder="Search orders..."
              borderRadius="8px"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>
          <Button
            size="sm"
            variant="outline"
            leftIcon={<RefreshCw size={14} />}
            onClick={onRefresh}
            isLoading={loading}
            borderRadius="8px"
          >
            Refresh
          </Button>
        </HStack>
      </Flex>

      {loading ? (
        <Flex justify="center" py={16}><Spinner size="lg" color="brand.500" thickness="3px" /></Flex>
      ) : filtered.length === 0 ? (
        <VStack py={16} spacing={3}>
          <Text fontSize="40px">📦</Text>
          <Text color="surface.500" fontSize="14px">
            {search ? 'No matching orders' : 'No orders yet'}
          </Text>
        </VStack>
      ) : (
        <Box overflowX="auto">
          <Table size="sm" variant="simple">
            <Thead>
              <Tr bg="surface.50">
                {['ORDER ID', 'USER', 'AMOUNT', 'STATUS', 'DATE', 'UPDATE'].map((h) => (
                  <Th key={h} color="surface.500" fontSize="11px" fontWeight="600">{h}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {filtered.map((order) => (
                <Tr key={order.id} _hover={{ bg: 'surface.50' }} transition="background 0.15s">
                  <Td fontWeight="700" color="brand.500" fontSize="12px">#{order.id}</Td>
                  <Td fontSize="13px" color="surface.700">User #{order.userId}</Td>
                  <Td fontSize="13px" fontWeight="700">₹{order.totalAmount}</Td>
                  <Td>
                    <Badge
                      colorScheme={statusColor[order.status] || 'gray'}
                      borderRadius="full"
                      fontSize="10px"
                      fontWeight="600"
                    >
                      {order.status.replace(/_/g, ' ')}
                    </Badge>
                  </Td>
                  <Td fontSize="12px" color="surface.500">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })
                      : '—'}
                  </Td>
                  <Td>
                    <Select
                      size="xs"
                      borderRadius="6px"
                      w="150px"
                      fontSize="11px"
                      defaultValue={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                      ))}
                    </Select>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// Dashboard Tab
// ─────────────────────────────────────────────────────────────────
function DashboardTab({ orders, loading }: { orders: Order[]; loading: boolean }) {
  const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.totalAmount || '0'), 0);
  const paidOrders = orders.filter((o) =>
    ['PAID', 'DISPATCHED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(o.status),
  ).length;
  const pendingOrders = orders.filter((o) => o.status === 'ACKNOWLEDGED').length;
  const deliveredOrders = orders.filter((o) => o.status === 'DELIVERED').length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <VStack spacing={6} align="stretch">
      {/* Stats Grid */}
      <SimpleGrid columns={{ base: 1, sm: 2, xl: 4 }} spacing={4}>
        <StatCard label="Total Revenue" value={`₹${totalRevenue.toFixed(0)}`} icon={IndianRupee} color="#34a853" bg="google.lightGreen" help={`from ${paidOrders} paid orders`} />
        <StatCard label="Total Orders" value={orders.length} icon={ShoppingBag} color="#1a73e8" bg="brand.50" help="all time" />
        <StatCard label="Delivered" value={deliveredOrders} icon={TrendingUp} color="#34a853" bg="google.lightGreen" help="successfully delivered" />
        <StatCard label="Pending" value={pendingOrders} icon={Package} color="#fbbc05" bg="google.lightYellow" help="awaiting action" />
      </SimpleGrid>

      {/* Recent Orders Summary */}
      <Card>
        <CardBody p={6}>
          <Heading size="sm" color="surface.900" mb={5}>Recent Orders</Heading>
          {loading ? (
            <Flex justify="center" py={8}><Spinner color="brand.500" /></Flex>
          ) : recentOrders.length === 0 ? (
            <VStack py={8} spacing={2}>
              <Text fontSize="32px">📦</Text>
              <Text color="surface.400" fontSize="13px">No orders yet</Text>
            </VStack>
          ) : (
            <VStack spacing={3} align="stretch">
              {recentOrders.map((order) => (
                <Flex key={order.id} align="center" justify="space-between" py={2} borderBottom="1px solid" borderColor="surface.100" _last={{ borderBottom: 'none' }}>
                  <HStack spacing={3}>
                    <Box w="32px" h="32px" borderRadius="8px" bg="brand.50" display="flex" alignItems="center" justifyContent="center" flexShrink={0}>
                      <ShoppingBag size={14} color="#1a73e8" />
                    </Box>
                    <Box>
                      <Text fontSize="13px" fontWeight="600" color="surface.900">Order #{order.id}</Text>
                      <Text fontSize="11px" color="surface.400">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—'}
                      </Text>
                    </Box>
                  </HStack>
                  <HStack spacing={3}>
                    <Badge colorScheme={statusColor[order.status] || 'gray'} borderRadius="full" fontSize="10px">
                      {order.status.replace(/_/g, ' ')}
                    </Badge>
                    <Text fontSize="13px" fontWeight="700" color="surface.900">₹{order.totalAmount}</Text>
                  </HStack>
                </Flex>
              ))}
            </VStack>
          )}
        </CardBody>
      </Card>
    </VStack>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main Admin Page
// ─────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!isAuthenticated) { router.push('/login'); return; }
    loadOrders();
  }, [isAuthenticated]);

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
    <Flex h="100vh" bg="surface.50" overflow="hidden">
      {/* ── Sidebar ── */}
      <Box
        w={{ base: '60px', lg: '240px' }}
        bg="white"
        borderRight="1px solid"
        borderColor="surface.200"
        display="flex"
        flexDirection="column"
        boxShadow="sm"
        flexShrink={0}
        transition="width 0.2s"
      >
        {/* Logo */}
        <Flex align="center" gap={2} p={5} borderBottom="1px solid" borderColor="surface.100">
          <Box
            w="34px" h="34px" borderRadius="10px"
            bgGradient="linear(135deg, brand.500, brand.700)"
            display="flex" alignItems="center" justifyContent="center"
            flexShrink={0}
            boxShadow="0 2px 8px rgba(26,115,232,0.3)"
          >
            <Text color="white" fontWeight="800" fontSize="16px">P</Text>
          </Box>
          <Box display={{ base: 'none', lg: 'block' }}>
            <Text fontWeight="800" fontSize="14px" color="surface.900">Pickle Hub</Text>
            <Text fontSize="10px" color="surface.400" fontWeight="500">Admin Console</Text>
          </Box>
        </Flex>

        {/* Nav */}
        <VStack spacing={1} p={3} flex={1} align="stretch">
          <Text
            fontSize="10px" color="surface.400" fontWeight="700"
            letterSpacing="0.1em" textTransform="uppercase" px={2} mb={1}
            display={{ base: 'none', lg: 'block' }}
          >
            Menu
          </Text>
          {sidebarItems.map(({ icon: Icon, label, index }) => {
            const isActive = tabIndex === index;
            return (
              <Button
                key={label}
                variant="ghost"
                justifyContent={{ base: 'center', lg: 'start' }}
                leftIcon={<Icon size={17} />}
                size="sm"
                h="38px"
                bg={isActive ? 'brand.50' : 'transparent'}
                color={isActive ? 'brand.600' : 'surface.600'}
                fontWeight={isActive ? '600' : '400'}
                borderRadius="10px"
                borderLeft={isActive ? '3px solid' : '3px solid transparent'}
                borderColor={isActive ? 'brand.500' : 'transparent'}
                _hover={{ bg: isActive ? 'brand.50' : 'surface.50', color: isActive ? 'brand.600' : 'surface.900' }}
                onClick={() => setTabIndex(index)}
                transition="all 0.15s"
                pl={{ base: 2, lg: isActive ? 3 : 3 }}
              >
                <Text display={{ base: 'none', lg: 'block' }}>{label}</Text>
              </Button>
            );
          })}
        </VStack>

        {/* User info */}
        <Box p={3} borderTop="1px solid" borderColor="surface.100">
          <Flex align="center" gap={2} mb={2} display={{ base: 'none', lg: 'flex' }}>
            <Box
              w="30px" h="30px" borderRadius="full"
              bgGradient="linear(135deg, brand.400, brand.600)"
              display="flex" alignItems="center" justifyContent="center" flexShrink={0}
            >
              <Text fontSize="11px" fontWeight="800" color="white">
                {user?.email?.[0]?.toUpperCase() || 'A'}
              </Text>
            </Box>
            <Box minW={0}>
              <Text fontSize="11px" fontWeight="600" color="surface.900" noOfLines={1}>{user?.email}</Text>
              <Badge colorScheme="purple" fontSize="9px" borderRadius="full">{user?.role}</Badge>
            </Box>
          </Flex>
          <Button
            size="xs"
            variant="ghost"
            leftIcon={<LogOut size={12} />}
            color="google.red"
            w="full"
            justifyContent={{ base: 'center', lg: 'start' }}
            _hover={{ bg: 'google.lightRed', color: 'google.red' }}
            onClick={() => { logout(); router.push('/'); }}
            borderRadius="8px"
          >
            <Text display={{ base: 'none', lg: 'block' }}>Sign Out</Text>
          </Button>
        </Box>
      </Box>

      {/* ── Main Content ── */}
      <Box flex={1} overflow="auto">
        {/* Top bar */}
        <Flex
          px={8} py={4}
          bg="white"
          borderBottom="1px solid" borderColor="surface.100"
          align="center" justify="space-between"
          boxShadow="0 1px 3px rgba(60,64,67,0.08)"
        >
          <Box>
            <Heading size="md" color="surface.900">
              {['Dashboard', 'Orders', 'Products', 'Settings'][tabIndex]}
            </Heading>
            <Text fontSize="12px" color="surface.400" mt={0.5}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
          </Box>
          <HStack spacing={3}>
            <Badge
              colorScheme="purple"
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
  );
}
