"use client";

import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Divider,
  Heading,
  HStack,
  Icon,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { CheckCircle2, Crown, Sparkles } from "lucide-react";

const plans = [
  {
    id: 1,
    name: "Starter",
    price: 999,
    current: true,
    color: "blue",
    features: [
      "100 Orders / Month",
      "Basic Reports",
      "Email Support",
      "Inventory Management",
    ],
  },
  {
    id: 2,
    name: "Business",
    price: 1999,
    current: false,
    popular: false,
    color: "purple",
    features: [
      "500 Orders / Month",
      "Advanced Analytics",
      "Priority Support",
      "Bulk Product Upload",
      "Marketing Tools",
    ],
  },
  {
    id: 3,
    name: "Enterprise",
    price: 3100,
    current: false,
    color: "orange",
    features: [
      "Unlimited Orders",
      "Dedicated Account Manager",
      "Custom Reports",
      "Multiple Users",
      "API Access",
      "Premium Support",
    ],
  },
];

export default function SubscriptionPlans() {
  return (
    <Container maxW="7xl" py={12}>
      <VStack spacing={3} mb={12}>
        <Badge
          colorScheme="brand"
          px={4}
          py={1}
          borderRadius="full"
          fontSize="12px"
        >
          Subscription Plans
        </Badge>

        <Heading size="xl">Choose the Right Plan</Heading>

        <Text color="gray.500" maxW="650px" textAlign="center">
          Upgrade anytime to unlock more features and grow your business without
          interruptions.
        </Text>
      </VStack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
        {plans.map((plan) => (
          <Card
            key={plan.id}
            borderRadius="2xl"
            border={plan.current ? "2px solid #22543D" : "1px solid gray.200"}
            position="relative"
            overflow="hidden"
            transition=".3s"
            _hover={{
              transform: "translateY(-6px)",
              shadow: "xl",
            }}
          >
            {plan.current && (
              <Badge
                position="absolute"
                top={5}
                right={5}
                colorScheme="green"
                px={3}
                py={1}
                borderRadius="full"
              >
                Current Plan
              </Badge>
            )}

            {plan.popular && (
              <Badge
                position="absolute"
                top={5}
                right={5}
                colorScheme="purple"
                px={3}
                py={1}
                borderRadius="full"
              >
                Most Popular
              </Badge>
            )}

            <CardBody p={8} justifyContent="space-between" display="flex" flexDirection="column">
              <VStack align="start" spacing={6}>
                <HStack>
                  <Box p={3} borderRadius="xl" bg={`${plan.color}.50`}>
                    <Icon
                      as={plan.price === 2199 ? Crown : Sparkles}
                      color={`${plan.color}.500`}
                    />
                  </Box>

                  <Box>
                    <Heading size="md">{plan.name}</Heading>
                    <Text color="gray.500">Perfect for growing businesses</Text>
                  </Box>
                </HStack>

                <Heading size="2xl">
                  ₹{plan.price}
                  <Text
                    as="span"
                    fontSize="md"
                    color="gray.500"
                    fontWeight="normal"
                  >
                    {" "}
                    / month
                  </Text>
                </Heading>

                <Divider />

                <List spacing={4} w="full">
                  {plan.features.map((feature) => (
                    <ListItem key={feature}>
                      <ListIcon as={CheckCircle2} color="green.500" />
                      {feature}
                    </ListItem>
                  ))}
                </List>
              </VStack>

              <Button
                mt={4}
                w="full"
                size="lg"
                colorScheme={plan.current ? "green" : "brand"}
                variant={plan.current ? "outline" : "solid"}
                isDisabled={plan.current}
              >
                {plan.current
                  ? "Purchased"
                  : `Upgrade to ₹${plan.price}`}
              </Button>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Container>
  );
}
