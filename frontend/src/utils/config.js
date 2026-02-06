// /root/my-flute-shop/src/utils/config.js

export const SHOP_CONFIG = {
  // Your Real WhatsApp Number (No spaces, include country code)
  whatsappNumber: "919004471707",
  
  // Standard Messages
  messages: {
    quickBuy: (name, price) => `👋 Hi Echowood, I want to order:\n\n*${name}*\nPrice: ₹${price}\n\nPlease confirm.`,
    cartCheckout: "👋 Hi Echowood, here is my order list:"
  },

  // Currency Symbol
  currency: "₹"
};