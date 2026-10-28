
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Printer,
  Sparkles,
  MapPin,
  CreditCard,
  User,
  Phone,
  Truck,
  Send,
  ShieldCheck,
  X,
  AlertCircle,
} from "lucide-react";
import { useCart } from "../context/CardContext";
import Link from "next/link";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal,
    clearCart,
  } = useCart();

  const INPUT_BG = "#E8F0E5";

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    paymentMethod: "cod",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardHolder: "",
    walletNumber: "",
    walletTrxId: "",
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedOrderId, setGeneratedOrderId] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (apiError) {
      setApiError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const nameRegex = /^[a-zA-Z\s]{3,40}$/;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required!";
    } else if (!nameRegex.test(formData.fullName.trim())) {
      newErrors.fullName = "Please enter a valid name using letters only.";
    }

    const phoneRegex = /^((\+92)|(92)|(0))?3[0-9]{9}$/;
    const cleanPhone = formData.phone.trim().replace(/[\s-]/g, "");

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone Number is required!";
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.phone =
        "Please enter a valid mobile number (e.g., 03001234567).";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Delivery Address is required!";
    } else if (formData.address.trim().length < 2) {
      newErrors.address = "Please enter a valid delivery address.";
    }

    if (formData.paymentMethod === "card") {
      const cardNumClean = formData.cardNumber.replace(/[\s-]/g, "");

      if (
        !cardNumClean ||
        cardNumClean.length !== 16 ||
        !/^\d+$/.test(cardNumClean)
      ) {
        newErrors.cardNumber = "Card number must be exactly 16 digits.";
      }

      const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;

      if (!formData.cardExpiry || !expiryRegex.test(formData.cardExpiry)) {
        newErrors.cardExpiry =
          "Enter expiry date in MM/YY format (e.g., 08/28).";
      }

      if (!formData.cardCvv || !/^\d{3,4}$/.test(formData.cardCvv)) {
        newErrors.cardCvv = "CVV must be 3 or 4 digits.";
      }
    }

    if (formData.paymentMethod === "easypaisa") {
      const walletClean = formData.walletNumber.replace(/[\s-]/g, "");

      if (!walletClean || !phoneRegex.test(walletClean)) {
        newErrors.walletNumber =
          "Please enter a valid mobile wallet number.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentMethodSelect = (methodId) => {
    setFormData((prev) => ({
      ...prev,
      paymentMethod: methodId,
    }));

    if (methodId === "card" || methodId === "easypaisa") {
      setShowPaymentModal(true);
    }
  };

  const getMaskedCardNumber = () => {
    if (!formData.cardNumber) {
      return "XXXX-XXXX-XXXX-XXXX";
    }

    const clean = formData.cardNumber.replace(/\s+/g, "");

    if (clean.length < 4) {
      return clean;
    }

    return `•••• •••• •••• ${clean.slice(-4)}`;
  };

  const handlePlaceOrder = async (e) => {
    if (e) {
      e.preventDefault();
    }

    setApiError("");

    if (cartItems.length === 0) {
      setApiError("Your shopping bag is empty.");
      return;
    }

    if (!validateForm()) {
      setApiError(
        "Please fill out all required fields correctly before placing the order."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const uniqueId = `BN-${Math.floor(
        10000 + Math.random() * 90000
      )}`;

      const orderPayload = {
        orderId: uniqueId,
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city || "",
        paymentMethod: formData.paymentMethod,
        paymentDetail:
          formData.paymentMethod === "card"
            ? `Card: ${getMaskedCardNumber()}`
            : formData.paymentMethod === "easypaisa"
            ? `Wallet: ${formData.walletNumber}`
            : "Cash on Delivery",
        totalAmount: cartTotal,
        cartItems: cartItems.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedOrderId(uniqueId);
        setIsOrderPlaced(true);
      } else {
        setApiError(
          "Order Error: " + (data.error || "Something went wrong")
        );
      }
    } catch (error) {
      console.error("Network error placing order:", error);
      setApiError(
        "Network error. Please check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F5F5DC] via-[#EFEFE0] to-[#D8F3DC]/40 text-[#1B4332] py-12 px-6 sm:px-12 lg:px-20 font-sans relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-[#52B788]/15 rounded-full blur-3xl pointer-events-none no-print" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#1B4332]/10 rounded-full blur-3xl pointer-events-none no-print" />

      <style jsx global>{`
        @media print {
          @page {
            size: portrait;
            margin: 0;
          }

          html,
          body {
            background: #ffffff !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }

          body * {
            visibility: hidden !important;
            height: 0 !important;
          }

          #printable-receipt,
          #printable-receipt * {
            visibility: visible !important;
            height: auto !important;
          }

          #printable-receipt {
            position: fixed !important;
            left: 50% !important;
            top: 20px !important;
            transform: translateX(-50%) !important;
            width: 85% !important;
            max-width: 500px !important;
            background: #E8F0E5 !important;
            border: 2px solid #1B4332 !important;
            box-shadow: none !important;
            padding: 20px !important;
            border-radius: 16px !important;
            margin: 0 auto !important;
          }

          .no-print {
            display: none !important;
            height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-[#1B4332]/20 pb-6 no-print">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#1B4332] text-[#F5F5DC] text-[10px] font-black uppercase tracking-widest border border-[#52B788]">
              <Sparkles className="w-3.5 h-3.5 text-[#52B788]" />
              Secure Checkout
            </div>

            <h1 className="text-3xl font-black text-[#1B4332]">
              Shopping Bag & Checkout
            </h1>
          </div>

          <Link
            href="/shop"
            className="px-6 py-2.5 rounded-full bg-[#1B4332] text-[#F5F5DC] text-xs font-bold uppercase tracking-wider hover:bg-[#2D6A4F] transition-all border-2 border-[#1B4332]"
          >
            Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart Box */
          <div
            className="backdrop-blur-md border-2 border-[#1B4332] rounded-3xl p-12 text-center space-y-4 shadow-xl no-print"
            style={{ backgroundColor: INPUT_BG }}
          >
            <div className="w-16 h-16 rounded-full bg-[#52B788]/20 border-2 border-[#1B4332] flex items-center justify-center mx-auto text-[#1B4332]">
              <ShoppingBag className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-xl font-black text-[#1B4332]">
                Your Shopping Bag is Empty
              </h2>

              <p className="text-xs text-[#2D6A4F] font-semibold">
                Please select products from the shop to proceed with checkout.
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-block px-8 py-3 rounded-full bg-[#1B4332] text-[#F5F5DC] text-xs font-black uppercase tracking-widest hover:bg-[#2D6A4F] transition-all border-2 border-[#1B4332]"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Cart Items & Form */}
            <div className="lg:col-span-7 space-y-6 no-print">
              {apiError && (
                <div className="bg-red-50 border-2 border-red-600 p-4 rounded-2xl flex items-center gap-3 text-red-900 shadow-sm">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <p className="text-xs font-bold">{apiError}</p>
                </div>
              )}

              {/* Selected Products */}
              <div className="space-y-3">
                <h2 className="text-sm font-black uppercase tracking-wider text-[#1B4332] flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#52B788]" />
                  Selected Products ({cartItems.length})
                </h2>

                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      className="backdrop-blur-md border-2 border-[#1B4332] rounded-2xl p-4 flex items-center gap-4 shadow-sm"
                      style={{ backgroundColor: INPUT_BG }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover border-2 border-[#1B4332]/20 shrink-0"
                        style={{ backgroundColor: INPUT_BG }}
                      />

                      <div className="flex-1 space-y-1">
                        <h3 className="font-black text-sm text-[#1B4332]">
                          {item.name}
                        </h3>

                        <p className="text-xs font-black text-[#52B788]">
                          {item.price}
                        </p>

                        <div className="flex items-center gap-3 pt-1">
                          <div
                            className="flex items-center border-2 border-[#1B4332] rounded-full px-2 py-0.5"
                            style={{ backgroundColor: INPUT_BG }}
                          >
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="text-[#1B4332] hover:text-[#52B788] p-0.5 cursor-pointer"
                            >
                              <Minus className="w-3 h-3 stroke-[3]" />
                            </button>

                            <span className="text-xs font-black px-2.5">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="text-[#1B4332] hover:text-[#52B788] p-0.5 cursor-pointer"
                            >
                              <Plus className="w-3 h-3 stroke-[3]" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-700 hover:text-red-900 transition-colors p-1 cursor-pointer"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Shipping Details */}
              <div
                className="backdrop-blur-md border-2 border-[#1B4332] rounded-3xl p-6 shadow-md space-y-6"
                style={{ backgroundColor: INPUT_BG }}
              >
                <div className="space-y-4">
                  <h2 className="text-sm font-black uppercase tracking-wider text-[#1B4332] flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#52B788]" />
                    Shipping Details
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#1B4332] flex items-center gap-1">
                        <User className="w-3 h-3 text-[#52B788]" />
                        Full Name *
                      </label>

                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Zuleha Gh"
                        className={`w-full px-3.5 py-2.5 text-xs rounded-xl border-2 font-semibold text-[#1B4332] outline-none transition-colors ${
                          errors.fullName
                            ? "border-red-600 bg-red-50"
                            : "border-[#1B4332] focus:border-[#52B788]"
                        }`}
                        style={{
                          backgroundColor: errors.fullName ? undefined : INPUT_BG,
                        }}
                      />

                      {errors.fullName && (
                        <p className="text-[10px] text-red-600 font-bold">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-[#1B4332] flex items-center gap-1">
                        <Phone className="w-3 h-3 text-[#52B788]" />
                        Phone Number *
                      </label>

                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="03001234567"
                        className={`w-full px-3.5 py-2.5 text-xs rounded-xl border-2 font-semibold text-[#1B4332] outline-none transition-colors ${
                          errors.phone
                            ? "border-red-600 bg-red-50"
                            : "border-[#1B4332] focus:border-[#52B788]"
                        }`}
                        style={{
                          backgroundColor: errors.phone ? undefined : INPUT_BG,
                        }}
                      />

                      {errors.phone && (
                        <p className="text-[10px] text-red-600 font-bold">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-[#1B4332] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#52B788]" />
                        Delivery Address *
                      </label>

                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="House / Street / Area details"
                        className={`w-full px-3.5 py-2.5 text-xs rounded-xl border-2 font-semibold text-[#1B4332] outline-none transition-colors ${
                          errors.address
                            ? "border-red-600 bg-red-50"
                            : "border-[#1B4332] focus:border-[#52B788]"
                        }`}
                        style={{
                          backgroundColor: errors.address ? undefined : INPUT_BG,
                        }}
                      />

                      {errors.address && (
                        <p className="text-[10px] text-red-600 font-bold">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    {/* City */}
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-bold text-[#1B4332]">
                        City
                      </label>

                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Gujrat / Lahore"
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl border-2 border-[#1B4332] font-semibold text-[#1B4332] outline-none focus:border-[#52B788]"
                        style={{ backgroundColor: INPUT_BG }}
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Selection */}
                <div className="space-y-4 pt-4 border-t-2 border-[#1B4332]/20">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black uppercase tracking-wider text-[#1B4332] flex items-center gap-1">
                      <CreditCard className="w-4 h-4 text-[#52B788]" />
                      Select Payment Method
                    </label>

                    {(formData.paymentMethod === "card" ||
                      formData.paymentMethod === "easypaisa") && (
                      <button
                        type="button"
                        onClick={() => setShowPaymentModal(true)}
                        className="text-[11px] font-bold text-[#52B788] underline hover:text-[#1B4332] cursor-pointer"
                      >
                        Edit Payment Details ✏️
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "cod", label: "Cash on Delivery" },
                      { id: "card", label: "Credit / Debit Card" },
                      { id: "easypaisa", label: "JazzCash / EasyPaisa" },
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => handlePaymentMethodSelect(method.id)}
                        className={`p-3 rounded-2xl border-2 text-xs font-bold transition-all text-center cursor-pointer ${
                          formData.paymentMethod === method.id
                            ? "bg-[#1B4332] text-[#F5F5DC] border-[#1B4332] shadow-md"
                            : "text-[#1B4332] border-[#1B4332] hover:bg-[#D8F3DC]"
                        }`}
                        style={{
                          backgroundColor:
                            formData.paymentMethod === method.id
                              ? undefined
                              : INPUT_BG,
                        }}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Place Order */}
                <div className="pt-3">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handlePlaceOrder}
                    className="w-full py-3.5 rounded-full bg-[#1B4332] text-[#F5F5DC] text-xs font-black uppercase tracking-widest hover:bg-[#2D6A4F] transition-all shadow-lg flex items-center justify-center gap-2 border-2 border-[#1B4332] cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-[#52B788]" />
                    {isSubmitting ? "Saving Order..." : "Confirm & Place Order"}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Printable Receipt */}
            <div className="lg:col-span-5">
              <div
                id="printable-receipt"
                className="backdrop-blur-md border-2 border-[#1B4332] rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 sticky top-24"
                style={{ backgroundColor: INPUT_BG }}
              >
                {/* Store Header */}
                <div className="text-center border-b-2 border-[#1B4332]/20 pb-4 space-y-1">
                  <div className="inline-flex p-2 rounded-full bg-[#1B4332] text-[#F5F5DC] mb-1">
                    <Sparkles className="w-4 h-4 text-[#52B788]" />
                  </div>

                  <h2 className="text-xl font-black text-[#1B4332]">
                    Bianca Skincare
                  </h2>

                  <p className="text-[10px] font-bold text-[#2D6A4F] uppercase tracking-widest">
                    Official Invoice & Receipt
                  </p>

                  <p className="text-[10px] text-[#2D6A4F] font-semibold pt-1">
                    Date: {new Date().toLocaleDateString()} | Receipt #: BNC-
                    {Math.floor(100000 + Math.random() * 900000)}
                  </p>
                </div>

                {/* Customer Details */}
                <div
                  className="p-3.5 rounded-2xl border-2 border-[#1B4332] text-xs"
                  style={{ backgroundColor: INPUT_BG }}
                >
                  <p className="font-black text-[#1B4332] border-b border-[#1B4332]/15 pb-1 uppercase tracking-wider text-[10px]">
                    Customer & Payment Details
                  </p>

                  <p className="text-[#2D6A4F] font-bold pt-1">
                    <span className="text-[#1B4332]">Name:</span>{" "}
                    {formData.fullName || "Guest Customer"}
                  </p>

                  <p className="text-[#2D6A4F] font-bold">
                    <span className="text-[#1B4332]">Phone:</span>{" "}
                    {formData.phone || "N/A"}
                  </p>

                  <p className="text-[#2D6A4F] font-bold">
                    <span className="text-[#1B4332]">Address:</span>{" "}
                    {formData.address
                      ? `${formData.address}${
                          formData.city ? `, ${formData.city}` : ""
                        }`
                      : "Express Direct Delivery"}
                  </p>

                  <div className="pt-1.5 border-t border-[#1B4332]/15 mt-1 space-y-0.5">
                    <p className="text-[#2D6A4F] font-bold uppercase">
                      <span className="text-[#1B4332]">Payment Method:</span>{" "}
                      {formData.paymentMethod}
                    </p>

                    {formData.paymentMethod === "card" && (
                      <p className="text-[#2D6A4F] font-mono font-bold">
                        <span className="text-[#1B4332]">Card No:</span>{" "}
                        {getMaskedCardNumber()}
                      </p>
                    )}

                    {formData.paymentMethod === "easypaisa" && (
                      <p className="text-[#2D6A4F] font-mono font-bold">
                        <span className="text-[#1B4332]">Wallet Acc:</span>{" "}
                        {formData.walletNumber || "03XX-XXXXXXX"}
                      </p>
                    )}
                  </div>
                </div>

                {/* Ordered Items */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-black uppercase tracking-wider text-[#1B4332]">
                    Ordered Items
                  </h4>

                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {cartItems.map((item) => {
                      const itemPrice =
                        parseFloat(
                          String(item.price).replace(/[^0-9.-]+/g, "")
                        ) || 0;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between text-xs font-semibold border-b-2 border-[#1B4332]/15 pb-2"
                        >
                          <div>
                            <p className="font-black text-[#1B4332]">
                              {item.name}
                            </p>

                            <p className="text-[10px] text-[#2D6A4F]">
                              Qty: {item.quantity} × {item.price}
                            </p>
                          </div>

                          <span className="font-black text-[#1B4332]">
                            ${(itemPrice * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Totals */}
                <div className="space-y-1.5 pt-2 border-t-2 border-[#1B4332] text-xs font-bold text-[#1B4332]">
                  <div className="flex justify-between">
                    <span className="text-[#2D6A4F]">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#2D6A4F]">Shipping Fee</span>
                    <span className="text-[#52B788]">FREE</span>
                  </div>

                  <div className="flex justify-between text-base font-black pt-2 border-t-2 border-[#1B4332]">
                    <span>Total Amount</span>
                    <span className="text-[#1B4332]">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Print Receipt */}
                <div className="pt-2 no-print space-y-2">
                  <button
                    type="button"
                    onClick={handlePrintReceipt}
                    className="w-full py-2.5 rounded-full text-[#1B4332] text-xs font-black uppercase tracking-wider hover:bg-[#1B4332] hover:text-[#F5F5DC] transition-all shadow-sm flex items-center justify-center gap-2 border-2 border-[#1B4332] cursor-pointer"
                    style={{ backgroundColor: INPUT_BG }}
                  >
                    <Printer className="w-4 h-4" />
                    Print Receipt (Optional)
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Popup Modal */}
      <AnimatePresence>
        {isOrderPlaced && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-md no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="mx-auto max-w-sm w-full rounded-[2rem] border-2 border-[#1B4332] p-6 text-center shadow-2xl sm:p-7 relative"
              style={{ backgroundColor: INPUT_BG }}
            >
              <button
                type="button"
                onClick={() => {
                  setIsOrderPlaced(false);
                  clearCart();
                }}
                className="absolute top-4 right-4 w-7 h-7 rounded-full border-2 border-[#1B4332] flex items-center justify-center text-[#1B4332] hover:bg-[#1B4332] hover:text-[#F5F5DC] transition-all cursor-pointer shadow-sm"
                style={{ backgroundColor: INPUT_BG }}
              >
                <X className="w-3.5 h-3.5" />
              </button>

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#1B4332] bg-[#2D6A4F] text-white shadow-lg">
                <Sparkles className="h-6 w-6 text-[#74C69D]" />
              </div>

              <h2 className="text-xl font-black tracking-tight text-[#1B4332] sm:text-2xl">
                🎉 Order Placed Successfully!
              </h2>

              <p className="mt-1.5 text-xs font-medium text-[#2D6A4F]">
                Thank you for shopping with Bianca Care.
              </p>

              <div
                className="my-5 rounded-2xl border-2 border-[#1B4332] p-4 shadow-sm"
                style={{ backgroundColor: INPUT_BG }}
              >
                <span className="block text-[10px] font-bold uppercase tracking-widest text-[#668674]">
                  Your Order ID
                </span>

                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className="text-lg font-black tracking-wider text-[#2D6A4F]">
                    {generatedOrderId}
                  </span>
                </div>

                <p className="mt-1.5 text-[11px] text-[#2D6A4F] font-medium leading-relaxed">
                  Please save your Order ID for complaints or order
                  cancellations.
                </p>
              </div>

              <div
                className="rounded-xl p-3 text-[11px] font-semibold text-[#1B4332] border-2 border-[#1B4332] shadow-sm"
                style={{ backgroundColor: INPUT_BG }}
              >
                ⚠️ <span className="underline">Important:</span> Keep your
                Order ID safe for future reference.
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/support"
                  onClick={() => clearCart()}
                  className="flex items-center justify-center gap-2 rounded-full bg-[#1B4332] px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg transition-all duration-300 hover:bg-[#2D6A4F] border-2 border-[#1B4332]"
                >
                  Go to Support Page
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm no-print">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="border-2 border-[#1B4332] rounded-3xl p-6 max-w-md w-full shadow-2xl relative space-y-5"
              style={{ backgroundColor: INPUT_BG }}
            >
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full border-2 border-[#1B4332] flex items-center justify-center text-[#1B4332] hover:bg-[#1B4332] hover:text-[#F5F5DC] transition-all cursor-pointer shadow-sm"
                style={{ backgroundColor: INPUT_BG }}
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1B4332] text-[#F5F5DC] text-[9px] font-black uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3 text-[#52B788]" />
                  Secure Payment Gateway
                </div>

                <h3 className="text-xl font-black text-[#1B4332]">
                  {formData.paymentMethod === "card"
                    ? "Add Credit / Debit Card"
                    : "Mobile Wallet Details"}
                </h3>

                <p className="text-xs text-[#2D6A4F] font-medium">
                  {formData.paymentMethod === "card"
                    ? "Enter your Visa or MasterCard details securely."
                    : "Enter your JazzCash or EasyPaisa mobile account."}
                </p>
              </div>

              {formData.paymentMethod === "card" ? (
                <div
                  className="space-y-3 p-4 rounded-2xl border-2 border-[#1B4332]"
                  style={{ backgroundColor: INPUT_BG }}
                >
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#1B4332]">
                      Cardholder Name
                    </label>

                    <input
                      type="text"
                      name="cardHolder"
                      value={formData.cardHolder}
                      onChange={handleInputChange}
                      placeholder="e.g. Zuleha Gh"
                      className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#1B4332] font-semibold text-[#1B4332] outline-none"
                      style={{ backgroundColor: INPUT_BG }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#1B4332]">
                      Card Number (16 Digits) *
                    </label>

                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      maxLength={19}
                      placeholder="4532 1234 5678 8923"
                      className={`w-full px-3 py-2 text-xs rounded-xl border-2 font-mono font-bold text-[#1B4332] outline-none ${
                        errors.cardNumber
                          ? "border-red-600 bg-red-50"
                          : "border-[#1B4332]"
                      }`}
                      style={{
                        backgroundColor: errors.cardNumber
                          ? undefined
                          : INPUT_BG,
                      }}
                    />

                    {errors.cardNumber && (
                      <p className="text-[9px] text-red-600 font-bold">
                        {errors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#1B4332]">
                        Expiry Date (MM/YY) *
                      </label>

                      <input
                        type="text"
                        name="cardExpiry"
                        value={formData.cardExpiry}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={`w-full px-3 py-2 text-xs rounded-xl border-2 font-mono font-bold text-[#1B4332] outline-none ${
                          errors.cardExpiry
                            ? "border-red-600 bg-red-50"
                            : "border-[#1B4332]"
                        }`}
                        style={{
                          backgroundColor: errors.cardExpiry
                            ? undefined
                            : INPUT_BG,
                        }}
                      />

                      {errors.cardExpiry && (
                        <p className="text-[9px] text-red-600 font-bold">
                          {errors.cardExpiry}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-[#1B4332]">
                        CVV *
                      </label>

                      <input
                        type="password"
                        name="cardCvv"
                        value={formData.cardCvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength={4}
                        className={`w-full px-3 py-2 text-xs rounded-xl border-2 font-mono font-bold text-[#1B4332] outline-none ${
                          errors.cardCvv
                            ? "border-red-600 bg-red-50"
                            : "border-[#1B4332]"
                        }`}
                        style={{
                          backgroundColor: errors.cardCvv
                            ? undefined
                            : INPUT_BG,
                        }}
                      />

                      {errors.cardCvv && (
                        <p className="text-[9px] text-red-600 font-bold">
                          {errors.cardCvv}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="space-y-3 p-4 rounded-2xl border-2 border-[#1B4332]"
                  style={{ backgroundColor: INPUT_BG }}
                >
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#1B4332]">
                      Mobile Account Number *
                    </label>

                    <input
                      type="text"
                      name="walletNumber"
                      value={formData.walletNumber}
                      onChange={handleInputChange}
                      placeholder="03001234567"
                      className={`w-full px-3 py-2 text-xs rounded-xl border-2 font-mono font-bold text-[#1B4332] outline-none ${
                        errors.walletNumber
                          ? "border-red-600 bg-red-50"
                          : "border-[#1B4332]"
                      }`}
                      style={{
                        backgroundColor: errors.walletNumber
                          ? undefined
                          : INPUT_BG,
                      }}
                    />

                    {errors.walletNumber && (
                      <p className="text-[9px] text-red-600 font-bold">
                        {errors.walletNumber}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-[#1B4332]">
                      Transaction ID / CNIC (Optional)
                    </label>

                    <input
                      type="text"
                      name="walletTrxId"
                      value={formData.walletTrxId}
                      onChange={handleInputChange}
                      placeholder="e.g. TRX-8823192"
                      className="w-full px-3 py-2 text-xs rounded-xl border-2 border-[#1B4332] font-mono font-bold text-[#1B4332] outline-none"
                      style={{ backgroundColor: INPUT_BG }}
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full py-3 rounded-full bg-[#1B4332] text-[#F5F5DC] text-xs font-black uppercase tracking-wider hover:bg-[#2D6A4F] transition-all border-2 border-[#1B4332] cursor-pointer"
                >
                  Save & Continue
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

