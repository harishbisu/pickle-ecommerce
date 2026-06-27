'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function useRazorpay() {
  useEffect(() => {
    const loadScript = async () => {
      if (document.getElementById('razorpay-sdk')) {
        return;
      }
      
      const script = document.createElement('script');
      script.id = 'razorpay-sdk';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    };

    loadScript();

    return () => {
      const script = document.getElementById('razorpay-sdk');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return {
    isLoaded: typeof window !== 'undefined' && !!window.Razorpay
  };
}
