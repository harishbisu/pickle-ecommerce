import { Box, Container, Flex, HStack, Image, Text } from "@chakra-ui/react";

export const Footer = () => {
  return (
    <Box bg="white" borderTop="1px solid" borderColor="surface.200" py={8}>
      <Container maxW="1280px" px={6}>
        <Flex
          justify="space-between"
          align="center"
          direction={{ base: "column", md: "row" }}
          gap={4}
        >
          <Flex align="center" gap={2}>
            <Box h="30px" display="flex" alignItems="center" borderRadius="sm">
              <Image
                src="/logo.webp"
                alt="Pickle Hub Logo"
                width={{ base: 150, md: 200, lg: 250 }}
                height={"auto"}
                style={{ objectFit: "contain" }}
              />
            </Box>
          </Flex>
          <Text fontSize="13px" color="surface.500">
            © 2026 Pickle Hub. Authentic, Natural, Delicious.
          </Text>
          <HStack spacing={4}>
            {["Privacy", "Terms", "Contact"].map((link) => (
              <Text
                key={link}
                fontSize="13px"
                color="surface.500"
                cursor="pointer"
                _hover={{ color: "brand.500" }}
              >
                {link}
              </Text>
            ))}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};
