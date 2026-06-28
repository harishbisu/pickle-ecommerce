import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Switch,
  VStack,
  HStack,
  Text,
  Box,
  IconButton,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  InputGroup,
  InputLeftAddon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Image,
  SimpleGrid,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { PinIcon, PlusCircle, Save, XIcon } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@chakra-ui/react";
import { Product } from "@/types";
import { productsApi } from "@/lib/api";

export interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: () => void;
}

interface SpecRow {
  id: number;
  key: string;
  value: string;
}

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  price: "",
  stock: "0",
  images: "",
  discount: "0",
  isFeatured: false,
};

function specsToRows(
  specs: Record<string, string> | null | undefined,
): SpecRow[] {
  if (!specs || typeof specs !== "object")
    return [{ id: 1, key: "", value: "" }];
  const entries = Object.entries(specs);
  if (entries.length === 0) return [{ id: 1, key: "", value: "" }];
  return entries.map(([key, value], i) => ({
    id: i + 1,
    key,
    value: String(value),
  }));
}

function rowsToSpecs(rows: SpecRow[]): Record<string, string> | null {
  const result: Record<string, string> = {};
  rows.forEach(({ key, value }) => {
    if (key.trim()) result[key.trim()] = value.trim();
  });
  return Object.keys(result).length ? result : null;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
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
  const [form, setForm] = useState(EMPTY_FORM);
  const [specRows, setSpecRows] = useState<SpecRow[]>([
    { id: 1, key: "", value: "" },
  ]);
  const [nextSpecId, setNextSpecId] = useState(2);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        slug: product.slug || "",
        description: product.description,
        price: String(product.price),
        stock: String(product.stock),
        images: product.images?.join(", ") || "",
        discount: product.discount ? String(product.discount) : "0",
        isFeatured: product.isFeatured || false,
      });
      setSpecRows(specsToRows(product.specifications));
      setNextSpecId(Object.keys(product.specifications || {}).length + 1);
    } else {
      setForm(EMPTY_FORM);
      setSpecRows([{ id: 1, key: "", value: "" }]);
      setNextSpecId(2);
    }
    setErrors({});
  }, [product, isOpen]);

  useEffect(() => {
    const urls = form.images
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    setImagePreviews(urls.slice(0, 6));
  }, [form.images]);

  const handleNameChange = useCallback(
    (name: string) => {
      setForm((f) => ({
        ...f,
        name,
        slug: product ? f.slug : generateSlug(name),
      }));
    },
    [product],
  );

  const addSpecRow = () => {
    setSpecRows((rows) => [...rows, { id: nextSpecId, key: "", value: "" }]);
    setNextSpecId((n) => n + 1);
  };

  const removeSpecRow = (id: number) => {
    setSpecRows((rows) =>
      rows.length > 1 ? rows.filter((r) => r.id !== id) : rows,
    );
  };

  const updateSpecRow = (id: number, field: "key" | "value", val: string) => {
    setSpecRows((rows) =>
      rows.map((r) => (r.id === id ? { ...r, [field]: val } : r)),
    );
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())
      e.name = "Enter a name so customers know what this is.";
    if (!form.description.trim())
      e.description = "Add a short description of the product.";
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      e.price = "Enter the price customers will pay.";
    if (isNaN(Number(form.stock)) || Number(form.stock) < 0)
      e.stock = "Stock can't be a negative number.";
    if (isNaN(Number(form.discount)) || Number(form.discount) < 0)
      e.discount = "Discount can't be a negative number.";
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
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: Number(form.stock),
        discount: form.discount ? Number(form.discount) : null,
        isFeatured: form.isFeatured,
        specifications: rowsToSpecs(specRows),
        images: form.images
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
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
          title: "Product added",
          status: "success",
          duration: 2000,
          position: "top-right",
        });
      }

      onSave();
      onClose();
    } catch (err: any) {
      toast({
        title: err.message || "Couldn't save the product. Try again.",
        status: "error",
        duration: 3000,
        position: "top-right",
      });
    } finally {
      setSaving(false);
    }
  };

  const sectionLabelProps = {
    fontSize: "11px",
    fontWeight: "600",
    color: "gray.400",
    textTransform: "uppercase" as const,
    letterSpacing: "0.6px",
    mb: 3,
  };

  const fieldLabelProps = {
    fontSize: "13px",
    fontWeight: "600",
    color: "gray.600",
    mb: 1,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xxl" scrollBehavior="inside">
      <ModalOverlay backdropFilter="blur(4px)" bg="blackAlpha.400" />
      <ModalContent borderRadius="16px" mx={4} overflow="hidden">
        {/* ── Header ── */}
        <ModalHeader
          bg="gray.900"
          color="white"
          fontSize="15px"
          fontWeight="600"
          py={4}
          px={5}
          display="flex"
          alignItems="center"
          gap={2}
        >
          <Save size={16} />
          {product ? "Edit product" : "Add new product"}
          <Badge
            ml="auto"
            fontSize="11px"
            bg="whiteAlpha.200"
            color="white"
            borderRadius="full"
            px={3}
            py={1}
            fontWeight="400"
          >
            Fill in the details below
          </Badge>
        </ModalHeader>
        <ModalCloseButton color="white" top={3} />

        <ModalBody py={0} px={0}>
          <VStack
            spacing={0}
            align="stretch"
            divider={<Box h="1px" bg="gray.100" />}
          >
            {/* ── Section 1: Basic info ── */}
            <Box px={5} py={5}>
              <Text {...sectionLabelProps}>Basic information</Text>
              <VStack spacing={4} align="stretch">
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel {...fieldLabelProps}>
                    Product name{" "}
                    <Text
                      as="span"
                      color="red.400"
                      fontSize="11px"
                      fontWeight="400"
                    >
                      required
                    </Text>
                  </FormLabel>
                  <Input
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="e.g. Spicy Mango Pickle"
                    borderRadius="8px"
                    variant="filled"
                    _focus={{ bg: "white", borderColor: "blue.400" }}
                  />
                  <FormErrorMessage fontSize="12px">
                    {errors.name}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.description}>
                  <FormLabel {...fieldLabelProps}>
                    Description{" "}
                    <Text
                      as="span"
                      color="red.400"
                      fontSize="11px"
                      fontWeight="400"
                    >
                      required
                    </Text>
                    <Text
                      as="span"
                      color="gray.400"
                      fontSize="11px"
                      fontWeight="400"
                    >
                      {" "}
                      — what's special about this?
                    </Text>
                  </FormLabel>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Describe the taste, ingredients, or what makes it unique…"
                    borderRadius="8px"
                    variant="filled"
                    _focus={{ bg: "white", borderColor: "blue.400" }}
                    rows={3}
                    resize="vertical"
                  />
                  <FormErrorMessage fontSize="12px">
                    {errors.description}
                  </FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel {...fieldLabelProps}>
                    Web address{" "}
                    <Text
                      as="span"
                      color="gray.400"
                      fontSize="11px"
                      fontWeight="400"
                    >
                      {" "}
                      — auto-filled from name
                    </Text>
                  </FormLabel>
                  <InputGroup>
                    <InputLeftAddon
                      children="yourstore.com/"
                      fontSize="12px"
                      color="gray.400"
                      bg="gray.50"
                      borderRadius="8px 0 0 8px"
                    />
                    <Input
                      value={form.slug}
                      onChange={(e) =>
                        setForm({ ...form, slug: e.target.value })
                      }
                      placeholder="spicy-mango-pickle"
                      fontFamily="mono"
                      fontSize="13px"
                      borderRadius="0 8px 8px 0"
                      variant="filled"
                      _focus={{ bg: "white", borderColor: "blue.400" }}
                    />
                  </InputGroup>
                  <Text fontSize="11px" color="gray.400" mt={1}>
                    This is the link customers use to find this product. You can
                    leave it as-is.
                  </Text>
                </FormControl>
              </VStack>
            </Box>

            {/* ── Section 2: Pricing & stock ── */}
            <Box px={5} py={5}>
              <Text {...sectionLabelProps}>Pricing & stock</Text>
              <HStack spacing={4} align="start">
                <FormControl isInvalid={!!errors.price} flex={1}>
                  <FormLabel {...fieldLabelProps}>
                    Selling price{" "}
                    <Text
                      as="span"
                      color="red.400"
                      fontSize="11px"
                      fontWeight="400"
                    >
                      required
                    </Text>
                  </FormLabel>
                  <InputGroup>
                    <InputLeftAddon
                      children="₹"
                      bg="gray.50"
                      borderRadius="8px 0 0 8px"
                      color="gray.500"
                    />
                    <Input
                      value={form.price}
                      onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                      }
                      placeholder="199"
                      type="number"
                      min={0}
                      borderRadius="0 8px 8px 0"
                      variant="filled"
                      _focus={{ bg: "white", borderColor: "blue.400" }}
                    />
                  </InputGroup>
                  <FormErrorMessage fontSize="12px">
                    {errors.price}
                  </FormErrorMessage>
                </FormControl>

                <FormControl flex={1}>
                  <FormLabel {...fieldLabelProps}>
                    Discount{" "}
                    <Text
                      as="span"
                      color="gray.400"
                      fontSize="11px"
                      fontWeight="400"
                    >
                      optional
                    </Text>
                  </FormLabel>
                  <InputGroup>
                    <InputLeftAddon
                      children="₹"
                      bg="gray.50"
                      borderRadius="8px 0 0 8px"
                      color="gray.500"
                    />
                    <Input
                      value={form.discount}
                      onChange={(e) =>
                        setForm({ ...form, discount: e.target.value })
                      }
                      placeholder="0"
                      type="number"
                      min={0}
                      borderRadius="0 8px 8px 0"
                      variant="filled"
                      _focus={{ bg: "white", borderColor: "blue.400" }}
                    />
                  </InputGroup>
                  <Text fontSize="11px" color="gray.400" mt={1}>
                    Amount off the selling price.
                  </Text>
                </FormControl>

                <FormControl isInvalid={!!errors.stock} flex={1}>
                  <FormLabel {...fieldLabelProps}>Units in stock</FormLabel>
                  <NumberInput
                    value={form.stock}
                    onChange={(v) => setForm({ ...form, stock: v })}
                    min={0}
                  >
                    <NumberInputField borderRadius="8px" />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text fontSize="11px" color="gray.400" mt={1}>
                    How many you have to sell.
                  </Text>
                  <FormErrorMessage fontSize="12px">
                    {errors.stock}
                  </FormErrorMessage>
                </FormControl>
              </HStack>

              {/* Featured toggle */}
              <Flex
                mt={4}
                pt={4}
                borderTop="1px solid"
                borderColor="gray.100"
                align="center"
                justify="space-between"
              >
                <Box>
                  <Text fontSize="13px" fontWeight="600" color="gray.700">
                    Feature this product
                  </Text>
                  <Text fontSize="12px" color="gray.400">
                    Highlighted on your homepage and in promotions.
                  </Text>
                </Box>
                <Switch
                  colorScheme="blue"
                  isChecked={form.isFeatured}
                  onChange={(e) =>
                    setForm({ ...form, isFeatured: e.target.checked })
                  }
                  size="md"
                />
              </Flex>
            </Box>

            {/* ── Section 3: Product details (replaces JSON specs) ── */}
            <Box px={5} py={5}>
              <Text {...sectionLabelProps}>
                Product details{" "}
                <Text
                  as="span"
                  textTransform="none"
                  letterSpacing="0"
                  fontWeight="400"
                  color="gray.400"
                >
                  — optional
                </Text>
              </Text>
              <Text fontSize="12px" color="gray.400" mb={3}>
                Add facts like weight, size, or ingredients. Customers see these
                on the product page.
              </Text>

              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th
                      fontSize="11px"
                      color="gray.400"
                      fontWeight="500"
                      textTransform="none"
                      letterSpacing="0"
                      pb={2}
                    >
                      Detail name
                    </Th>
                    <Th
                      fontSize="11px"
                      color="gray.400"
                      fontWeight="500"
                      textTransform="none"
                      letterSpacing="0"
                      pb={2}
                    >
                      Value
                    </Th>
                    <Th w="32px" />
                  </Tr>
                </Thead>
                <Tbody>
                  {specRows.map((row) => (
                    <Tr key={row.id}>
                      <Td py={1} pl={0}>
                        <Input
                          value={row.key}
                          onChange={(e) =>
                            updateSpecRow(row.id, "key", e.target.value)
                          }
                          placeholder="e.g. Weight"
                          size="sm"
                          borderRadius="6px"
                          variant="filled"
                          _focus={{ bg: "white", borderColor: "blue.400" }}
                        />
                      </Td>
                      <Td py={1}>
                        <Input
                          value={row.value}
                          onChange={(e) =>
                            updateSpecRow(row.id, "value", e.target.value)
                          }
                          placeholder="e.g. 500g"
                          size="sm"
                          borderRadius="6px"
                          variant="filled"
                          _focus={{ bg: "white", borderColor: "blue.400" }}
                        />
                      </Td>
                      <Td py={1} pr={0}>
                        <IconButton
                          aria-label="Remove row"
                          icon={<XIcon size="16" />}
                          size="xs"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => removeSpecRow(row.id)}
                          isDisabled={specRows.length === 1}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Button
                leftIcon={<PlusCircle size="16" />}
                size="sm"
                variant="outline"
                borderStyle="dashed"
                borderRadius="8px"
                color="gray.500"
                borderColor="gray.300"
                mt={3}
                w="full"
                _hover={{
                  borderColor: "blue.400",
                  color: "blue.500",
                  bg: "blue.50",
                }}
                onClick={addSpecRow}
              >
                Add another detail
              </Button>
            </Box>

            {/* ── Section 4: Images ── */}
            <Box px={5} py={5}>
              <Text {...sectionLabelProps}>
                Product images{" "}
                <Text
                  as="span"
                  textTransform="none"
                  letterSpacing="0"
                  fontWeight="400"
                  color="gray.400"
                >
                  — optional
                </Text>
              </Text>
              <FormControl>
                <FormLabel {...fieldLabelProps}>
                  Image links{" "}
                  <Text
                    as="span"
                    color="gray.400"
                    fontSize="11px"
                    fontWeight="400"
                  >
                    — paste links to your product photos
                  </Text>
                </FormLabel>
                <Textarea
                  value={form.images}
                  onChange={(e) => setForm({ ...form, images: e.target.value })}
                  placeholder="https://example.com/photo1.jpg, https://example.com/photo2.jpg"
                  rows={2}
                  resize="vertical"
                  fontFamily="mono"
                  fontSize="12px"
                  borderRadius="8px"
                  variant="filled"
                  _focus={{ bg: "white", borderColor: "blue.400" }}
                />
                <Text fontSize="11px" color="gray.400" mt={1}>
                  Paste photo links separated by commas.
                </Text>
              </FormControl>

              {/* Live image previews */}
              {imagePreviews.length > 0 && (
                <SimpleGrid columns={6} spacing={2} mt={3}>
                  {imagePreviews.map((url, i) => (
                    <Box
                      key={i}
                      w="48px"
                      h="48px"
                      borderRadius="6px"
                      border="1px solid"
                      borderColor="gray.200"
                      overflow="hidden"
                      bg="gray.50"
                    >
                      <Image
                        src={url}
                        alt={`Preview ${i + 1}`}
                        w="full"
                        h="full"
                        objectFit="cover"
                        fallback={
                          <Flex align="center" justify="center" h="full">
                            <PinIcon color="gray.300" />
                          </Flex>
                        }
                      />
                    </Box>
                  ))}
                </SimpleGrid>
              )}
            </Box>
          </VStack>
        </ModalBody>

        {/* ── Footer ── */}
        <ModalFooter
          gap={3}
          borderTop="1px solid"
          borderColor="gray.100"
          py={4}
          bg="gray.50"
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
            colorScheme="gray"
            bg="gray.900"
            color="white"
            _hover={{ bg: "gray.700" }}
            onClick={handleSubmit}
            isLoading={saving}
            loadingText="Saving…"
            leftIcon={<Save size={14} />}
            borderRadius="8px"
            px={6}
          >
            {product ? "Update product" : "Save product"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
