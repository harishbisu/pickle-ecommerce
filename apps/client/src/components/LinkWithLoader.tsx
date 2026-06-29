"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Link } from "@chakra-ui/react";
import NextLink from "next/link";
import FullScreenLoader from "./FullScreenLoader";

interface LinkWithLoaderProps {
  href: string;
  children: React.ReactNode;
}

export default function LinkWithLoader({
  href,
  children,
}: LinkWithLoaderProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  // const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = e.target as HTMLElement;
    const isInsideButton = target.closest("button");

    if (isInsideButton) {
      return;
    }
    if (pathname !== href) {
      setLoading(true);
    }
    router.push(href);
    scrollTo({ top: 0 });
  };

  return (
    <>
      {loading && <FullScreenLoader />}
      <Link
        as={NextLink}
        href={href}
        onClick={handleClick}
        h="full"
        w="full"
        p={0}
        m={0}
        borderRadius="lg"
        _hover={{ textDecoration: "none" }}
        _focus={{ boxShadow: "none", outline: "none", border: "none" }}
        _focusVisible={{ boxShadow: "none", outline: "none" }}
        _active={{ boxShadow: "none", border: "none" }}
        border="none"
        textDecoration="none"
      >
        {children}
      </Link>
    </>
  );
}
