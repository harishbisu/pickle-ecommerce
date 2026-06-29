"use client";
import { Box, Spinner, VStack } from "@chakra-ui/react";

const FullScreenLoader = () => {
  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      width="100vw"
      height="100vh"
      bgColor={{ base: "whiteAlpha.900", _dark: "gray.900" }}
      zIndex={98}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <VStack>
        <Spinner
          borderWidth="4px"
          transitionDuration="0.65s"
          color="#DAA520"
          size="xl"
        />
      </VStack>
    </Box>
  );
};

export default FullScreenLoader;
