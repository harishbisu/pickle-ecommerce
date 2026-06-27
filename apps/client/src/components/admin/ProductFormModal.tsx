import { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  VStack,
  Switch,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Save, Image as ImageIcon, EditIcon } from "lucide-react";
import { productsApi, Product } from "@/lib/api";

export interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: () => void;
}

export function ProductFormModal({
  isOpen,
  onClose,
  product,
  onSave,
}: ProductFormProps) {
  const toast = useToast();
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "0",
    images: "",
    discount: "0",
    specifications: "",
    isFeatured: false,
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        slug: product.slug || "",
        description: product.description,
        price: product.price,
        stock: String(product.stock),
        images: product.images?.join(", ") || "",
        discount: product.discount || "0",
        specifications: product.specifications
          ? JSON.stringify(product.specifications, null, 2)
          : "",
        isFeatured: product.isFeatured || false,
      });
    } else {
      setForm({
        name: "",
        slug: "",
        description: "",
        price: "",
        stock: "0",
        images: "",
        discount: "0",
        specifications: "",
        isFeatured: false,
      });
    }
    setErrors({});
  }, [product, isOpen]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = "Enter a valid price";
    if (isNaN(Number(form.stock)) || Number(form.stock) < 0)
      e.stock = "Stock must be 0 or greater";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setSaving(true);
    try {
      let parsedSpecs = null;
      if (form.specifications) {
        try {
          parsedSpecs = JSON.parse(form.specifications);
        } catch (e) {
          toast({ title: "Invalid JSON in specifications", status: "error" });
          setSaving(false);
          return;
        }
      }

      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        discount: form.discount ? form.discount : null,
        isFeatured: form.isFeatured,
        specifications: parsedSpecs,
        images: form.images
          ? form.images
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      };

      if (product) {
        await productsApi.update(product.id, payload);
        toast({
          title: "Product updated",
          status: "success",
          duration: 2000,
          position: "top-right",
        });
      } else {
        await productsApi.create(payload);
        toast({
          title: "Product created",
          status: "success",
          duration: 2000,
          position: "top-right",
        });
      }
      onSave();
      onClose();
    } catch (err: any) {
      toast({
        title: err.message || "Save failed",
        status: "error",
        duration: 3000,
        position: "top-right",
      });
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
          display="flex"
          gap={2}
        >
          {product ? <EditIcon /> : <Save />}
          {product ? "Edit Product" : "Add New Product"}
        </ModalHeader>
        <ModalCloseButton color="white" top={4} />
        <ModalBody py={6}>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4} align="start">
              <FormControl isInvalid={!!errors.name} flex={1}>
                <FormLabel fontSize="13px" fontWeight="600" color="surface.700">
                  Product Name *
                </FormLabel>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Spicy Mango Pickle"
                  size="sm"
                  borderRadius="8px"
                />
                <FormErrorMessage fontSize="12px">
                  {errors.name}
                </FormErrorMessage>
              </FormControl>

              <FormControl flex={1}>
                <FormLabel fontSize="13px" fontWeight="600" color="surface.700">
                  Slug URL
                </FormLabel>
                <Input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="e.g. spicy-mango"
                  size="sm"
                  borderRadius="8px"
                />
              </FormControl>
            </HStack>

            <FormControl isInvalid={!!errors.description}>
              <FormLabel fontSize="13px" fontWeight="600" color="surface.700">
                Description *
              </FormLabel>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Describe the product..."
                size="sm"
                borderRadius="8px"
                rows={3}
                resize="vertical"
              />
              <FormErrorMessage fontSize="12px">
                {errors.description}
              </FormErrorMessage>
            </FormControl>

            <HStack spacing={4} align="start">
              <FormControl isInvalid={!!errors.price} flex={1}>
                <FormLabel fontSize="13px" fontWeight="600" color="surface.700">
                  Price (₹) *
                </FormLabel>
                <Input
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="199"
                  size="sm"
                  borderRadius="8px"
                  type="number"
                  min={0}
                />
                <FormErrorMessage fontSize="12px">
                  {errors.price}
                </FormErrorMessage>
              </FormControl>

              <FormControl flex={1}>
                <FormLabel fontSize="13px" fontWeight="600" color="surface.700">
                  Discount Amount (₹)
                </FormLabel>
                <Input
                  value={form.discount}
                  onChange={(e) =>
                    setForm({ ...form, discount: e.target.value })
                  }
                  placeholder="e.g. 50"
                  size="sm"
                  borderRadius="8px"
                  type="number"
                  min={0}
                />
              </FormControl>

              <FormControl isInvalid={!!errors.stock} flex={1}>
                <FormLabel fontSize="13px" fontWeight="600" color="surface.700">
                  Stock Qty
                </FormLabel>
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
                <FormErrorMessage fontSize="12px">
                  {errors.stock}
                </FormErrorMessage>
              </FormControl>
            </HStack>

            <HStack spacing={4} align="end">
              <FormControl>
                <FormLabel fontSize="13px" fontWeight="600" color="surface.700">
                  Specifications (JSON)
                </FormLabel>
                <Textarea
                  value={form.specifications}
                  onChange={(e) =>
                    setForm({ ...form, specifications: e.target.value })
                  }
                  placeholder='{"Weight": "500g", "Ingredients": "Mango, Spices"}'
                  size="sm"
                  borderRadius="8px"
                  rows={2}
                  fontFamily="mono"
                  fontSize="12px"
                />
              </FormControl>

              <FormControl display="flex" alignItems="center" pb={2}>
                <FormLabel
                  htmlFor="featured-product"
                  mb="0"
                  fontSize="13px"
                  fontWeight="600"
                >
                  Featured Product
                </FormLabel>
                <Switch
                  id="featured-product"
                  colorScheme="brand"
                  isChecked={form.isFeatured}
                  onChange={(e) =>
                    setForm({ ...form, isFeatured: e.target.checked })
                  }
                />
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
        <ModalFooter
          gap={3}
          borderTop="1px solid"
          borderColor="surface.100"
          py={4}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            borderRadius="8px"
          >
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
            {product ? "Update Product" : "Add Product"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
