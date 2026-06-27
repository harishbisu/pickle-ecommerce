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
  useToast,
  Spinner,
  Center,
  Card,
  CardBody,
  useDisclosure,
} from "@chakra-ui/react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ProductFormModal } from "../../../components/admin/ProductFormModal";
import { DeleteDialog } from "../../../components/admin/DeleteDialog";
import { productsApi, Product } from "@/lib/api";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    isOpen: isFormOpen,
    onOpen: onFormOpen,
    onClose: onFormClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);
  const toast = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productsApi.list();
      setProducts(data);
    } catch {
      toast({ title: "Failed to load products", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAdd = () => {
    setSelectedProduct(null);
    onFormOpen();
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    onFormOpen();
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProduct(product);
    onDeleteOpen();
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;
    setDeleting(true);
    try {
      await productsApi.delete(selectedProduct.id);
      toast({ title: "Product deleted", status: "success", duration: 2000 });
      fetchProducts();
      onDeleteClose();
    } catch {
      toast({ title: "Failed to delete product", status: "error" });
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <Center py={12}>
        <Spinner size="xl" color="brand.500" />
      </Center>
    );
  }

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Text fontSize="xl" fontWeight="bold" color="surface.900">
          Manage Products
        </Text>
        <Button
          leftIcon={<Plus size={16} />}
          size="sm"
          onClick={handleAdd}
          borderRadius="8px"
        >
          Add Product
        </Button>
      </Flex>

      <Card>
        <CardBody>
          <Box overflowX="auto">
            <Table variant="simple" size="sm">
              <Thead bg="surface.50">
                <Tr>
                  <Th py={4} color="surface.600">
                    Name
                  </Th>
                  <Th py={4} color="surface.600">
                    Price (₹)
                  </Th>
                  <Th py={4} color="surface.600">
                    Stock
                  </Th>
                  <Th py={4} color="surface.600">
                    Actions
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {products.length === 0 ? (
                  <Tr>
                    <Td
                      colSpan={4}
                      textAlign="center"
                      py={8}
                      color="surface.500"
                    >
                      No products found
                    </Td>
                  </Tr>
                ) : (
                  products.map((product) => (
                    <Tr key={product.id} _hover={{ bg: "surface.50" }}>
                      <Td fontWeight="500">{product.name}</Td>
                      <Td>₹{product.price}</Td>
                      <Td>
                        <Badge
                          colorScheme={
                            product.stock > 10
                              ? "green"
                              : product.stock > 0
                                ? "orange"
                                : "red"
                          }
                          borderRadius="full"
                          px={2}
                          py={0.5}
                        >
                          {product.stock} in stock
                        </Badge>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            aria-label="Edit"
                            icon={<Pencil size={14} />}
                            size="xs"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => handleEdit(product)}
                          />
                          <IconButton
                            aria-label="Delete"
                            icon={<Trash2 size={14} />}
                            size="xs"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleDeleteClick(product)}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </Box>
        </CardBody>
      </Card>

      <ProductFormModal
        isOpen={isFormOpen}
        onClose={onFormClose}
        product={selectedProduct}
        onSave={fetchProducts}
      />

      <DeleteDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleConfirmDelete}
        productName={selectedProduct?.name || ""}
        deleting={deleting}
      />
    </Box>
  );
}
