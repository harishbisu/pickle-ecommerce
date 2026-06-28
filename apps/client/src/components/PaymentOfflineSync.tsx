"use client";

import { useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import CryptoJS from "crypto-js";
import { ordersApi } from "@/lib/api";

const SECRET_KEY = "offline_sync_secret_key"; // In production, use env var

export function PaymentOfflineSync() {
  const toast = useToast();

  useEffect(() => {
    const syncPayment = async () => {
      const encryptedData = localStorage.getItem("pending_payment_verification");
      if (!encryptedData) return;

      try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
        const payload = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

        const verification = await ordersApi.verifyPayment(payload);

        if (verification.success) {
          localStorage.removeItem("pending_payment_verification");
          toast({
            title: "Offline Payment Verified",
            description: `Order #${verification.orderNumber} successfully verified in the background!`,
            status: "success",
            duration: 8000,
            position: "top",
          });
        }
      } catch (err) {
        console.error("Background payment verification failed:", err);
      }
    };

    // Attempt sync on mount
    syncPayment();

    // Attempt sync when browser comes online
    window.addEventListener("online", syncPayment);
    return () => window.removeEventListener("online", syncPayment);
  }, [toast]);

  return null;
}
