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
  Card,
  CardBody,
  CardHeader,
  Heading,
  Input,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  useToast,
  Spinner,
  Center,
  Divider,
} from "@chakra-ui/react";
import { Link, Copy } from "lucide-react";
import { settingsApi, promotionsApi, AppSetting, Promotion } from "../../../lib/api";

export default function SettingsPage() {
  const [minCartSize, setMinCartSize] = useState("");
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [newUtmSource, setNewUtmSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [creatingPromo, setCreatingPromo] = useState(false);
  const toast = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [settingsRes, promosRes] = await Promise.all([
        settingsApi.get("MIN_CART_SIZE").catch(() => ({ value: "0" })),
        promotionsApi.list().catch(() => []),
      ]);
      setMinCartSize(settingsRes?.value || "0");
      setPromotions(promosRes || []);
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to load data", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await settingsApi.set("MIN_CART_SIZE", minCartSize);
      toast({ title: "Settings saved successfully", status: "success" });
    } catch {
      toast({ title: "Failed to save settings", status: "error" });
    } finally {
      setSavingSettings(false);
    }
  };

  const handleCreatePromo = async () => {
    if (!newUtmSource) return;
    setCreatingPromo(true);
    try {
      await promotionsApi.create({ utmSource: newUtmSource });
      toast({ title: "Promotional link created", status: "success" });
      setNewUtmSource("");
      // Refresh promotions list
      const promosRes = await promotionsApi.list();
      setPromotions(promosRes);
    } catch {
      toast({ title: "Failed to create promotion", status: "error" });
    } finally {
      setCreatingPromo(false);
    }
  };

  const copyToClipboard = (utmSource: string) => {
    const url = `${window.location.origin}?utmmedia=${utmSource}`;
    navigator.clipboard.writeText(url);
    toast({ title: "URL copied to clipboard", status: "success", duration: 2000 });
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
      <Text fontSize="2xl" fontWeight="bold" mb={6} color="surface.900">
        Store Settings
      </Text>

      <VStack spacing={8} align="stretch">
        <Card shadow="sm" borderRadius="lg">
          <CardHeader pb={0}>
            <Heading size="md" color="surface.800">Checkout Preferences</Heading>
          </CardHeader>
          <CardBody>
            <FormControl maxW="400px">
              <FormLabel color="surface.700">Minimum Cart Size (₹)</FormLabel>
              <HStack>
                <Input
                  type="number"
                  value={minCartSize}
                  onChange={(e) => setMinCartSize(e.target.value)}
                  bg="white"
                  borderRadius="md"
                />
                <Button 
                  colorScheme="brand" 
                  onClick={handleSaveSettings}
                  isLoading={savingSettings}
                >
                  Save
                </Button>
              </HStack>
            </FormControl>
          </CardBody>
        </Card>

        <Card shadow="sm" borderRadius="lg">
          <CardHeader pb={0}>
            <Heading size="md" color="surface.800">Promotional Links</Heading>
            <Text fontSize="sm" color="surface.500" mt={1}>
              Generate tracking links to monitor campaign performance.
            </Text>
          </CardHeader>
          <CardBody>
            <Flex mb={6} gap={4} maxW="600px">
              <Input
                placeholder="Campaign Name (e.g., summer_sale)"
                value={newUtmSource}
                onChange={(e) => setNewUtmSource(e.target.value)}
                bg="white"
                borderRadius="md"
              />
              <Button
                colorScheme="brand"
                onClick={handleCreatePromo}
                isLoading={creatingPromo}
                leftIcon={<Link size={16} />}
                flexShrink={0}
              >
                Generate URL
              </Button>
            </Flex>

            <Divider mb={6} />

            <Box overflowX="auto">
              <Table variant="simple" size="sm">
                <Thead bg="surface.50">
                  <Tr>
                    <Th py={4} color="surface.600">Campaign / UTM Source</Th>
                    <Th py={4} color="surface.600">Generated URL</Th>
                    <Th py={4} color="surface.600" isNumeric>Visits</Th>
                    <Th py={4} color="surface.600">Created</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {promotions.length === 0 ? (
                    <Tr>
                      <Td colSpan={4} textAlign="center" py={8} color="surface.500">
                        No promotional links created yet.
                      </Td>
                    </Tr>
                  ) : (
                    promotions.map((promo) => (
                      <Tr key={promo.id} _hover={{ bg: "surface.50" }}>
                        <Td fontWeight="600">{promo.utmSource}</Td>
                        <Td>
                          <HStack>
                            <Text fontSize="xs" color="brand.600" isTruncated maxW="200px">
                              ?utmmedia={promo.utmSource}
                            </Text>
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() => copyToClipboard(promo.utmSource)}
                              aria-label="Copy URL"
                            >
                              <Copy size={12} />
                            </Button>
                          </HStack>
                        </Td>
                        <Td isNumeric fontWeight="bold" color="surface.800">
                          {promo.visitCount}
                        </Td>
                        <Td color="surface.600" fontSize="sm">
                          {new Date(promo.createdAt).toLocaleDateString()}
                        </Td>
                      </Tr>
                    ))
                  )}
                </Tbody>
              </Table>
            </Box>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
}
