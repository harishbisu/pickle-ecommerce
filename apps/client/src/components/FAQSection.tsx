"use client";

import {
  Box,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Container,
  Text,
} from "@chakra-ui/react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  title?: string;
  faqs?: FAQItem[];
}

const faqsData = [
  {
    question: "What types of pickles do you offer?",
    answer:
      "We offer a variety of homemade pickles, including Mango, Lemon, Mixed Vegetable, Green Chilli, Garlic, Amla, and seasonal specialties made using traditional recipes.",
  },
  {
    question: "Are your pickles homemade?",
    answer:
      "Yes. All our pickles are prepared using traditional homemade recipes with carefully selected ingredients, premium spices, and edible oil to ensure authentic taste and quality.",
  },
  {
    question: "Do your pickles contain preservatives?",
    answer:
      "Our pickles are made with minimal or no artificial preservatives. Natural ingredients like salt, oil, and spices help preserve freshness while maintaining authentic flavor.",
  },
  {
    question: "How should I store the pickle?",
    answer:
      "Store the pickle in a cool, dry place. Always use a clean and dry spoon, and keep the jar tightly closed after every use. Refrigeration after opening can help extend freshness.",
  },
  {
    question: "How long do the pickles stay fresh?",
    answer:
      "When stored properly, our pickles typically remain fresh for 6 to 12 months. Please refer to the product label for the best-before date.",
  },
  {
    question: "Do you deliver across India?",
    answer:
      "Yes, we deliver our pickles to most locations across India through trusted courier partners with secure packaging.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept UPI, debit cards, credit cards, net banking, and other secure online payment methods. Cash on Delivery may be available in selected locations.",
  },
  {
    question: "Can I return or exchange my order?",
    answer:
      "Due to the nature of food products, returns are generally not accepted. However, if you receive a damaged, leaking, or incorrect product, please contact us within 48 hours for assistance.",
  },
  {
    question: "Are your pickles spicy?",
    answer:
      "We offer both mild and spicy varieties. The spice level is mentioned on each product page to help you choose according to your preference.",
  },
  {
    question: "Do you offer bulk or gift orders?",
    answer:
      "Yes, we accept bulk orders for festivals, weddings, corporate gifting, and special occasions. Please contact us for customized packaging and pricing.",
  },
];

export default function FAQSection({
  title = "Frequently Asked Questions",
  faqs = faqsData,
}: FAQSectionProps) {
  return (
    <Box
      bg="white"
      borderRadius="xl"
      p={{ base: 5, md: 8 }}
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.200"
      alignItems="center"
    >
      <Container maxW="container.xl" py={{ base: 8, md: 12 }}>
        <Heading size="lg" color="surface.900" mb={6}>
          {title}
        </Heading>

        <Accordion allowMultiple>
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              mb={4}
              overflow="hidden"
            >
              <AccordionButton py={5} _hover={{ bg: "gray.50" }}>
                <Box
                  flex="1"
                  textAlign="left"
                  fontWeight="600"
                  fontSize={{
                    base: "md",
                    md: "lg",
                  }}
                >
                  {faq.question}
                </Box>

                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel pb={5} color="gray.600">
                <Text lineHeight="1.8">{faq.answer}</Text>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Box>
  );
}
