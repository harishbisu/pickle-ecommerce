"use client";

import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useCart } from "../providers/CartContext";
import { useAuth } from "../providers/AuthContext";
import { ordersApi } from "../lib/api";
import { useRazorpay } from "./useRazorpay";
import CryptoJS from "crypto-js";

const SECRET_KEY = "offline_sync_secret_key";

export function useCheckout() {
  const { items, totalAmount, clearCart } = useCart();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const toast = useToast();
  useRazorpay();

  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderNumber: string;
  } | null>(null);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (user && !address.phone && !address.street) {
      const userAddress = JSON.parse(user.address || "{}");
      setAddress((prev) => ({
        ...prev,
        name: user.name || user.email?.split("@")[0] || "",
        phone: user.phone || "",
        street: userAddress.street || "",
        city: userAddress.city || "",
        state: userAddress.state || "",
        pincode: userAddress.pincode || "",
      }));
    }
  }, [user]);

  const deliveryCharge = totalAmount >= 499 ? 0 : 49;
  const grandTotal = totalAmount + deliveryCharge;

  // Redirect if not logged in or cart is empty
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?redirect=/checkout");
      return;
    }
    if (items.length === 0 && !orderSuccess) {
      router.push("/cart");
    }
  }, [isAuthenticated, items.length, orderSuccess, router]);

  // Accidental exit prevention
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (processingPayment) {
        e.preventDefault();
        e.returnValue =
          "Your payment is processing. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [processingPayment]);

  const validateAddress = () => {
    const errors: string[] = [];
    if (!address.name || address.name.trim().length === 0)
      errors.push("Full name is required");
    if (!address.phone || address.phone.trim().length === 0)
      errors.push("Phone number is required");
    if (address.phone && !/^[0-9]{10}$/.test(address.phone.replace(/\D/g, "")))
      errors.push("Phone number must be 10 digits");
    if (!address.street || address.street.trim().length === 0)
      errors.push("Street address is required");
    if (!address.city || address.city.trim().length === 0)
      errors.push("City is required");
    if (!address.state || address.state.trim().length === 0)
      errors.push("State is required");
    if (!address.pincode || address.pincode.trim().length === 0)
      errors.push("Pincode is required");
    if (
      address.pincode &&
      !/^[0-9]{6}$/.test(address.pincode.replace(/\D/g, ""))
    )
      errors.push("Pincode must be 6 digits");
    return errors;
  };

  const handlePlaceOrder = async () => {
    if (processingPayment) return; // Prevent double clicks

    const errors = validateAddress();
    if (errors.length > 0) {
      toast({
        title: "Address Validation Error",
        description: errors.join(", "),
        status: "warning",
        position: "top-right",
        duration: 5000,
      });
      return;
    }

    setLoading(true);
    setProcessingPayment(true);

    try {
      const order = await ordersApi.checkout(
        items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          price: i.price,
        })),
        {
          shippingName: address.name,
          shippingAddress: JSON.stringify({
            street: address.street,
            city: address.city,
            pincode: address.pincode,
          }),
          shippingState: address.state,
          shippingPhone: address.phone,
        },
      );

      const options = {
        key: order.razorpayKeyId,
        amount: Math.round(grandTotal * 100),
        currency: "INR",
        name: "Pickle Hub",
        description: `Order #${order.id} — ${items.length} item(s)`,
        order_id: order.razorpayOrderId,
        prefill: {
          name: address.name,
          contact: address.phone,
          email: user?.email,
        },
        theme: { color: "#2874f0" }, // Flipkart blue
        handler: async (response: any) => {
          try {
            const payload = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            };
            const verification = await ordersApi.verifyPayment(payload);

            if (verification.success) {
              clearCart();
              setOrderSuccess({ orderNumber: verification.orderNumber });
              toast({
                title: "Payment Successful!",
                description: `Order #${verification.orderNumber} placed successfully`,
                status: "success",
                duration: 5000,
                position: "top",
              });
            }
          } catch (verifyErr: any) {
            console.error("Payment verification error:", verifyErr);

            // Network or server error - save for offline sync
            const payload = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            };
            const encrypted = CryptoJS.AES.encrypt(
              JSON.stringify(payload),
              SECRET_KEY,
            ).toString();
            localStorage.setItem("pending_payment_verification", encrypted);

            clearCart();
            setOrderSuccess({ orderNumber: "Pending Sync" });

            toast({
              title: "Connection Lost",
              description:
                "Your payment was processed. We will securely verify your order in the background once you are back online.",
              status: "info",
              duration: 8000,
              position: "top",
            });
          } finally {
            setProcessingPayment(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setProcessingPayment(false);
            toast({
              title: "Payment cancelled",
              status: "info",
              duration: 2000,
              position: "top-right",
            });
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast({
        title: "Order failed",
        description: err.message || "Unable to create order. Please try again.",
        status: "error",
        duration: 4000,
        position: "top-right",
      });
      setProcessingPayment(false);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    processingPayment,
    orderSuccess,
    address,
    setAddress,
    handlePlaceOrder,
    totalAmount,
    deliveryCharge,
    grandTotal,
    items,
  };
}
