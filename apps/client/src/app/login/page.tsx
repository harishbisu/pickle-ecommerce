"use client";

import { useState } from "react";
import {
  Box,
  Flex,
  VStack,
  Heading,
  Text,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Divider,
  InputGroup,
  InputRightElement,
  IconButton,
  useToast,
  Image,
} from "@chakra-ui/react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import NextLink from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../providers/AuthContext";
import { Suspense } from "react";

function LoginContent() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const { login, register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams?.get("redirect") || "/shop";
  const toast = useToast();

  const validate = () => {
    const e: typeof errors = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }
      toast({
        title: mode === "login" ? "Welcome back!" : "Account created!",
        status: "success",
        duration: 2000,
        position: "top-right",
      });
      router.push(redirectUrl);
    } catch (err: any) {
      setErrors({
        general: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg="surface.50"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={4}
    >
      <Flex
        direction="column"
        w="full"
        maxW="420px"
        gap={6}
        className="fade-in"
      >
        {/* Logo */}
        <VStack spacing={2} mb={2}>
          <Flex
            as={NextLink}
            href="/"
            textDecoration="none"
            align="center"
            gap={2}
          >
            <Box
              w="auto"
              h="100px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Image src="logo.webp" />
            </Box>
          </Flex>
          <Heading size="lg" color="#1a73e8" letterSpacing="-0.02em">
            {mode === "login" ? "Sign in" : "Create account"}
          </Heading>
          <Text fontSize="14px" color="surface.500">
            {mode === "login"
              ? "to continue to Pickle Hub"
              : "to get started with Pickle Hub"}
          </Text>
        </VStack>

        {/* Card */}
        <Box
          bg="white"
          borderRadius="16px"
          border="1px solid"
          borderColor="surface.300"
          boxShadow="md"
          p={8}
        >
          <form onSubmit={handleSubmit}>
            <VStack spacing={5}>
              {errors.general && (
                <Box
                  w="full"
                  bg="red.50"
                  border="1px solid"
                  borderColor="red.200"
                  borderRadius="8px"
                  p={3}
                >
                  <Text fontSize="13px" color="red.600">
                    {errors.general}
                  </Text>
                </Box>
              )}

              <FormControl isInvalid={!!errors.email}>
                <FormLabel
                  fontSize="14px"
                  fontWeight="500"
                  color="surface.700"
                  mb={1.5}
                >
                  Email address
                </FormLabel>
                <InputGroup>
                  <Input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    size="lg"
                    borderRadius="8px"
                    pl={10}
                  />
                  <Box
                    position="absolute"
                    left={3}
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={1}
                    color="surface.400"
                  >
                    <Mail size={18} />
                  </Box>
                </InputGroup>
                <FormErrorMessage fontSize="12px">
                  {errors.email}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel
                  fontSize="14px"
                  fontWeight="500"
                  color="surface.700"
                  mb={1.5}
                >
                  Password
                </FormLabel>
                <InputGroup>
                  <Input
                    id="login-password"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    size="lg"
                    borderRadius="8px"
                    pl={10}
                    pr={12}
                  />
                  <Box
                    position="absolute"
                    left={3}
                    top="50%"
                    transform="translateY(-50%)"
                    zIndex={1}
                    color="surface.400"
                  >
                    <Lock size={18} />
                  </Box>
                  <InputRightElement h="full" pr={2}>
                    <IconButton
                      aria-label="Toggle password"
                      icon={showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowPass((v) => !v)}
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage fontSize="12px">
                  {errors.password}
                </FormErrorMessage>
              </FormControl>

              <Button
                id="auth-submit-btn"
                type="submit"
                w="full"
                size="lg"
                isLoading={loading}
                loadingText={
                  mode === "login" ? "Signing in..." : "Creating account..."
                }
                borderRadius="8px"
                fontWeight="600"
              >
                {mode === "login" ? "Sign in" : "Create account"}
              </Button>
            </VStack>
          </form>

          <Divider my={6} />

          <Text fontSize="14px" textAlign="center" color="surface.600">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <Button
              variant="link"
              color="brand.500"
              fontSize="14px"
              fontWeight="600"
              onClick={() => {
                setMode((m) => (m === "login" ? "register" : "login"));
                setErrors({});
              }}
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </Button>
          </Text>
        </Box>

        {/* Footer note */}
        <Text fontSize="12px" color="surface.400" textAlign="center">
          By continuing, you agree to Pickle Hub's Terms of Service and Privacy
          Policy.
        </Text>
      </Flex>
    </Box>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<Box p={10}>Loading...</Box>}>
      <LoginContent />
    </Suspense>
  );
}
