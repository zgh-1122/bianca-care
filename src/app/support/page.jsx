
"use client";

import React, { useState, useRef } from "react";

import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from "framer-motion";

import {
  XCircle,
  ShieldAlert,
  Send,
  Sparkles,
  Mail,
  Hash,
  MapPin,
  Clock,
  Headphones,
  ArrowUpRight,
  Phone,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

// Order ID format: BN-12345
// Frontend only checks the format, NOT database existence.
const ORDER_ID_REGEX = /^BN-\d{5}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const fadeUp = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

function Reveal({ children, className = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      variants={fadeUp}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion || inView ? "visible" : "hidden"}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const fieldBase =
  "block w-full min-w-0 rounded-xl border-2 px-4 py-3.5 text-sm font-medium text-[#1B4332] outline-none transition-colors duration-200 placeholder:text-[#668674] focus:ring-4";

const fieldNormal =
  `${fieldBase} border-[#B7D5BD] bg-[#F0F8EE] hover:border-[#74C69D] focus:border-[#2D6A4F] focus:bg-white focus:ring-[#52B788]/15`;

const fieldInvalid =
  `${fieldBase} border-red-400 bg-red-50/60 focus:border-red-500 focus:bg-white focus:ring-red-400/15`;

const fieldValid =
  `${fieldBase} border-emerald-400 bg-emerald-50/40 focus:border-emerald-500 focus:bg-white focus:ring-emerald-400/15`;

const buttonClass =
  "flex w-full items-center justify-center gap-2 rounded-full border border-[#2D6A4F] bg-[#2D6A4F] px-5 py-3.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-[#2D6A4F]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1B4332] disabled:cursor-not-allowed disabled:opacity-60";

function FieldMessage({ message, success = false }) {
  return (
    <AnimatePresence mode="wait">
      {message && (
        <motion.p
          key={message}
          role={success ? "status" : "alert"}
          initial={{ opacity: 0, height: 0, y: -4 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className={`flex items-start gap-1.5 overflow-hidden text-xs font-semibold ${
            success ? "text-emerald-700" : "text-red-600"
          }`}
        >
          {success ? (
            <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
          ) : (
            <AlertCircle size={15} className="mt-0.5 shrink-0" />
          )}

          <span>{message}</span>
        </motion.p>
      )}
    </AnimatePresence>
  );
}

function FormField({
  label,
  icon: Icon,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  error = "",
  success = false,
  required = false,
  hint = "",
  maxLength,
}) {
  const borderClass = error
    ? fieldInvalid
    : success
      ? fieldValid
      : fieldNormal;

  return (
    <div className="min-w-0 space-y-2">
      {label && (
        <label className="block text-xs font-bold text-[#1B4332]">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className={`absolute left-4 top-1/2 -translate-y-1/2 ${
              error
                ? "text-red-500"
                : success
                  ? "text-emerald-600"
                  : "text-[#2D6A4F]"
            }`}
          />
        )}

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          autoComplete={type === "email" ? "email" : "off"}
          aria-invalid={Boolean(error)}
          className={`${borderClass} ${Icon ? "pl-11" : ""} ${
            error || success ? "pr-10" : ""
          }`}
        />

        {(error || success) && (
          <span
            className={`absolute right-3 top-1/2 -translate-y-1/2 ${
              error ? "text-red-500" : "text-emerald-600"
            }`}
          >
            {error ? (
              <AlertCircle size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}
          </span>
        )}
      </div>

      {hint && !error && !success && (
        <p className="text-xs text-[#668674]">{hint}</p>
      )}

      <FieldMessage message={error} />

      {!error && success && (
        <FieldMessage message="Looks good!" success />
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options, error = "" }) {
  return (
    <div className="min-w-0 space-y-2">
      <label className="block text-xs font-bold text-[#1B4332]">
        {label}
        <span className="ml-1 text-red-500">*</span>
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        className={`${error ? fieldInvalid : fieldNormal} cursor-pointer`}
      >
        <option value="">Select an option</option>

        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <FieldMessage message={error} />
    </div>
  );
}

function TextAreaField({ label, value, onChange, placeholder }) {
  return (
    <div className="min-w-0 space-y-2">
      <label className="block text-xs font-bold text-[#1B4332]">
        {label}{" "}
        <span className="font-normal text-[#668674]">(Optional)</span>
      </label>

      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`${fieldNormal} resize-none`}
      />
    </div>
  );
}

const CANCEL_REASONS = [
  "Ordered by mistake",
  "Changed my mind",
  "Incorrect address",
  "Delivery taking too long",
];

const COMPLAINT_CATEGORIES = [
  "Damaged or Broken Product",
  "Wrong Item Delivered",
  "Quality / Formula Issue",
  "Payment / Refund Query",
];

const EMPTY_CANCEL = {
  orderId: "",
  email: "",
  reason: "",
  details: "",
};

const EMPTY_COMPLAINT = {
  orderId: "",
  email: "",
  category: "",
  details: "",
};

const EMPTY_ERRORS = {
  orderId: "",
  email: "",
  selection: "",
  general: "",
};

function RequestForm({
  type,
  data,
  setData,
  errors,
  setErrors,
  touched,
  setTouched,
  onSubmit,
  isSubmitting,
}) {
  const isCancel = type === "cancel";
  const selectionValue = isCancel ? data.reason : data.category;

  const updateField = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));

    const errorKey =
      field === "reason" || field === "category"
        ? "selection"
        : field;

    setErrors((prev) => ({
      ...prev,
      [errorKey]: "",
      general: "",
    }));
  };

  const validateField = (field, value) => {
    let message = "";

    if (field === "orderId") {
      if (!value.trim()) {
        message = "Please enter your Order ID.";
      } else if (!ORDER_ID_REGEX.test(value.trim().toUpperCase())) {
        message = "Enter a valid Order ID, for example BN-12345.";
      }
    }

    if (field === "email") {
      if (!value.trim()) {
        message = "Please enter your email address.";
      } else if (!EMAIL_REGEX.test(value.trim())) {
        message = "Please enter a valid email address.";
      }
    }

    setErrors((prev) => ({ ...prev, [field]: message }));

    return !message;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched({
      orderId: true,
      email: true,
    });

    const orderValid = validateField("orderId", data.orderId);
    const emailValid = validateField("email", data.email);

    let selectionValid = true;

    if (!selectionValue) {
      selectionValid = false;

      setErrors((prev) => ({
        ...prev,
        selection: isCancel
          ? "Please select a cancellation reason."
          : "Please select an issue category.",
      }));
    }

    if (!orderValid || !emailValid || !selectionValid) {
      return;
    }

    onSubmit(e);
  };

  const orderValid =
    touched.orderId &&
    ORDER_ID_REGEX.test(data.orderId.trim().toUpperCase());

  const emailValid =
    touched.email && EMAIL_REGEX.test(data.email.trim());

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <FormField
        label="Order ID"
        icon={Hash}
        value={data.orderId}
        onChange={(value) =>
          updateField("orderId", value.toUpperCase())
        }
        onBlur={() => {
          setTouched((prev) => ({ ...prev, orderId: true }));
          validateField("orderId", data.orderId);
        }}
        placeholder="BN-12345"
        error={errors.orderId}
        success={orderValid && !errors.orderId}
        required
        maxLength={8}
        hint="Enter the Order ID shown after placing your order."
      />

      <FormField
        label="Email Address"
        icon={Mail}
        type="email"
        value={data.email}
        onChange={(value) => updateField("email", value)}
        onBlur={() => {
          setTouched((prev) => ({ ...prev, email: true }));
          validateField("email", data.email);
        }}
        placeholder="name@example.com"
        error={errors.email}
        success={emailValid && !errors.email}
        required
      />

      <SelectField
        label={isCancel ? "Cancellation Reason" : "Issue Category"}
        value={selectionValue}
        onChange={(value) =>
          updateField(isCancel ? "reason" : "category", value)
        }
        options={isCancel ? CANCEL_REASONS : COMPLAINT_CATEGORIES}
        error={errors.selection}
      />

      <TextAreaField
        label="Additional Details"
        value={data.details}
        onChange={(value) =>
          setData((prev) => ({ ...prev, details: value }))
        }
        placeholder={
          isCancel
            ? "Add any additional comments..."
            : "Describe your issue in detail..."
        }
      />

      <FieldMessage message={errors.general} />

      <button
        type="submit"
        disabled={isSubmitting}
        className={buttonClass}
      >
        <Send size={16} className="text-[#74C69D]" />

        {isSubmitting
          ? "Submitting..."
          : isCancel
            ? "Submit Cancellation"
            : "Submit Complaint"}
      </button>
    </form>
  );
}

export default function SupportPage() {
  const reduceMotion = useReducedMotion();

  const [isComplaintMode, setIsComplaintMode] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedType, setSubmittedType] = useState("cancel");
  const [responseMessage, setResponseMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [cancelData, setCancelData] = useState({ ...EMPTY_CANCEL });
  const [complaintData, setComplaintData] = useState({
    ...EMPTY_COMPLAINT,
  });

  const [cancelErrors, setCancelErrors] = useState({ ...EMPTY_ERRORS });
  const [complaintErrors, setComplaintErrors] = useState({
    ...EMPTY_ERRORS,
  });

  const [cancelTouched, setCancelTouched] = useState({
    orderId: false,
    email: false,
  });

  const [complaintTouched, setComplaintTouched] = useState({
    orderId: false,
    email: false,
  });

  const switchMode = (mode) => {
    setIsComplaintMode(mode);
  };

  const submitRequest = async (type, data, setErrors) => {
    const orderId = data.orderId.trim().toUpperCase();
    const email = data.email.trim();

    setErrors({ ...EMPTY_ERRORS });

    // Validate the format only.
    // The frontend does not check whether the order exists in the database.
    if (!ORDER_ID_REGEX.test(orderId)) {
      setErrors({
        ...EMPTY_ERRORS,
        orderId: "Invalid Order ID format. Use BN-12345.",
      });
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setErrors({
        ...EMPTY_ERRORS,
        email: email
          ? "Please enter a valid email address."
          : "Please enter your email address.",
      });
      return;
    }

    const selection =
      type === "cancel" ? data.reason : data.category;

    if (!selection) {
      setErrors({
        ...EMPTY_ERRORS,
        selection:
          type === "cancel"
            ? "Please select a cancellation reason."
            : "Please select an issue category.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          orderId,
          email,
          reasonOrCategory: selection,
          details: data.details.trim(),
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrors({
          ...EMPTY_ERRORS,
          general:
            result.message ||
            result.error ||
            "Unable to submit your request. Please try again.",
        });

        return;
      }

      setSubmittedType(type);

      setResponseMessage(
        result.message ||
          "Your request has been submitted successfully."
      );

      setIsSubmitted(true);
    } catch (error) {
      console.error("Support request error:", error);

      setErrors({
        ...EMPTY_ERRORS,
        general: "Unable to connect to the server. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSubmit = (e) => {
    e.preventDefault();
    submitRequest("cancel", cancelData, setCancelErrors);
  };

  const handleComplaintSubmit = (e) => {
    e.preventDefault();
    submitRequest("complaint", complaintData, setComplaintErrors);
  };

  const transition = reduceMotion
    ? { duration: 0.01 }
    : { type: "spring", stiffness: 90, damping: 22 };

  const cancelForm = (
    <RequestForm
      type="cancel"
      data={cancelData}
      setData={setCancelData}
      errors={cancelErrors}
      setErrors={setCancelErrors}
      touched={cancelTouched}
      setTouched={setCancelTouched}
      onSubmit={handleCancelSubmit}
      isSubmitting={isSubmitting}
    />
  );

  const complaintForm = (
    <RequestForm
      type="complaint"
      data={complaintData}
      setData={setComplaintData}
      errors={complaintErrors}
      setErrors={setComplaintErrors}
      touched={complaintTouched}
      setTouched={setComplaintTouched}
      onSubmit={handleComplaintSubmit}
      isSubmitting={isSubmitting}
    />
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#F7F6EE] font-sans text-[#1B4332]">
      {/* BACKGROUND */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#52B788]/15 blur-[120px]" />
        <div className="absolute -right-32 top-[35%] h-96 w-96 rounded-full bg-[#1B4332]/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-[#52B788]/10 blur-[120px]" />
      </div>

      {/* HEADER */}
      <section className="relative px-4 pb-10 pt-16 sm:px-8 sm:pt-20">
        <Reveal>
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#52B788]/60 bg-white/70 px-4 py-2 text-xs font-black uppercase tracking-widest shadow-sm">
              <Sparkles size={16} className="text-[#2D6A4F]" />
              We're Here to Help
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
              Your Care,{" "}
              <span className="text-[#2D6A4F]">Our Priority.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#2D6A4F] sm:text-base">
              Need help with an order or have a product concern? Choose
              the option that suits you, and our support team will guide you.
            </p>
          </div>
        </Reveal>
      </section>

        <section className="relative px-4 pb-20 sm:px-8">
          <Reveal>
            <div className="mx-auto w-full max-w-5xl">
              {/* DESKTOP */}
              <div className="relative hidden min-h-[650px] overflow-hidden rounded-[2rem] border border-[#1B4332]/15 bg-[#F5F5DC] shadow-[0_25px_80px_-25px_rgba(27,67,50,0.22)] lg:flex">
                <div className="flex w-1/2 flex-col justify-center bg-[#F5F5DC] p-10 xl:p-14">
                  <div className="mb-7">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#1B4332] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
                      <XCircle size={14} className="text-[#52B788]" />
                      Order Resolution
                    </div>

                    <h2 className="text-3xl font-black">Cancel Order</h2>

                    <p className="mt-2 text-sm leading-6 text-[#2D6A4F]">
                      Enter your order details to request a cancellation.
                    </p>
                  </div>

                  {cancelForm}
                </div>

                <div className="flex w-1/2 flex-col justify-center bg-[#F5F5DC] p-10 xl:p-14">
                  <div className="mb-7">
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#1B4332] px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white">
                      <ShieldAlert size={14} className="text-[#52B788]" />
                      Customer Support
                    </div>

                    <h2 className="text-3xl font-black">File Complaint</h2>

                    <p className="mt-2 text-sm leading-6 text-[#2D6A4F]">
                      Tell us about a damaged product, delivery delay, or another concern.
                    </p>
                  </div>

                  {complaintForm}
                </div>

                {/* SLIDING PANEL */}
                <motion.div
                  initial={false}
                  animate={{ x: isComplaintMode ? "100%" : "0%" }}
                  transition={transition}
                  className="absolute inset-y-0 left-0 z-20 flex w-1/2 items-center justify-center overflow-hidden border-x border-[#52B788]/60 bg-gradient-to-br from-[#1B4332] via-[#24563F] to-[#102F25] p-10 text-center text-[#F7F6EE] shadow-2xl xl:p-14"
                >
                  <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#52B788]/20 blur-[70px]" />
                  <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#52B788]/15 blur-[70px]" />

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isComplaintMode ? "complaint-panel" : "cancel-panel"}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.25 }}
                      className="relative z-10 max-w-sm"
                    >
                      <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full border border-[#74C69D]/50 bg-[#52B788]/15">
                        {isComplaintMode ? (
                          <XCircle size={36} className="text-[#74C69D]" />
                        ) : (
                          <ShieldAlert size={36} className="text-[#74C69D]" />
                        )}
                      </div>

                      <h2 className="text-3xl font-black leading-tight xl:text-4xl">
                        {isComplaintMode ? (
                          <>
                            Need to Cancel
                            <br />
                            an Order?
                          </>
                        ) : (
                          <>
                            Have a Product
                            <br />
                            Issue or Query?
                          </>
                        )}
                      </h2>

                      <p className="mx-auto mt-5 max-w-xs text-sm leading-7 text-[#D8F3DC]">
                        {isComplaintMode
                          ? "Changed your mind? Switch back to the cancellation form."
                          : "Received a damaged item or facing a delivery delay? Let us know so we can help."}
                      </p>

                      <button
                        type="button"
                        onClick={() => switchMode(!isComplaintMode)}
                        className="mt-8 inline-flex items-center justify-center gap-2 rounded-full border border-[#74C69D] bg-[#F7F6EE] px-8 py-3.5 text-xs font-black uppercase tracking-widest text-[#1B4332] shadow-lg transition-all hover:-translate-y-1 hover:bg-[#74C69D]"
                      >
                        {isComplaintMode ? "Cancel Order" : "File Complaint"}
                        <ArrowUpRight size={16} />
                      </button>

                      <p className="mt-6 text-[10px] font-semibold uppercase tracking-widest text-[#D8F3DC]/65">
                        Bianca Care • Customer Support
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* MOBILE */}
              <div className="space-y-6 lg:hidden">
                <div className="flex rounded-full border border-[#1B4332]/15 bg-white/70 p-1.5 shadow-sm">
                  <button
                    type="button"
                    onClick={() => switchMode(false)}
                    className={`flex-1 rounded-full px-3 py-3 text-xs font-black transition-all ${
                      !isComplaintMode
                        ? "bg-[#2D6A4F] text-white shadow-md"
                        : "text-[#1B4332]"
                    }`}
                  >
                    Cancel Order
                  </button>

                  <button
                    type="button"
                    onClick={() => switchMode(true)}
                    className={`flex-1 rounded-full px-3 py-3 text-xs font-black transition-all ${
                      isComplaintMode
                        ? "bg-[#2D6A4F] text-white shadow-md"
                        : "text-[#1B4332]"
                    }`}
                  >
                    File Complaint
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {!isComplaintMode ? (
                    <motion.div
                      key="mobile-cancel"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      className="rounded-[2rem] border border-[#1B4332]/15 bg-[#F5F5DC] p-6 shadow-xl sm:p-8"
                    >
                      <XCircle size={30} className="mb-4 text-[#2D6A4F]" />

                      <h2 className="text-2xl font-black">Cancel Order</h2>

                      <p className="mb-6 mt-2 text-sm leading-6 text-[#2D6A4F]">
                        Enter your details to request an order cancellation.
                      </p>

                      {cancelForm}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="mobile-complaint"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      className="rounded-[2rem] border border-[#1B4332]/15 bg-[#F5F5DC] p-6 shadow-xl sm:p-8"
                    >
                      <ShieldAlert size={30} className="mb-4 text-[#2D6A4F]" />

                      <h2 className="text-2xl font-black">File Complaint</h2>

                      <p className="mb-6 mt-2 text-sm leading-6 text-[#2D6A4F]">
                        Tell us about your product or delivery concern.
                      </p>

                      {complaintForm}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </Reveal>
        </section>

      {/* SUCCESS POPUP — stays on the same page */}
      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#102F25]/45 px-4 py-8 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSubmitted(false)}
            role="presentation"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="support-success-title"
              initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={transition}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-[2rem] border-4 border-[#2D6A4F] bg-[#F5F5DC] p-7 text-center shadow-[0_30px_100px_-20px_rgba(16,47,37,0.6)] sm:p-10"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#52B788]/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-[#74C69D]/25 blur-3xl" />

              <button
                type="button"
                aria-label="Close success message"
                onClick={() => setIsSubmitted(false)}
                className="absolute right-4 top-4 z-10 rounded-full p-2 text-[#2D6A4F] transition hover:bg-[#D8F3DC] hover:text-[#1B4332]"
              >
                <XCircle size={22} />
              </button>

              <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#74C69D] bg-[#1B4332] text-[#D8F3DC] shadow-lg shadow-[#1B4332]/20">
                <CheckCircle2 size={38} strokeWidth={1.8} />
              </div>

              <span className="relative inline-flex items-center gap-2 rounded-full border border-[#B7D5BD] bg-white/70 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#2D6A4F]">
                <Sparkles size={13} /> Request received
              </span>

              <h2 id="support-success-title" className="relative mt-4 text-2xl font-black tracking-tight text-[#1B4332] sm:text-3xl">
                {submittedType === "cancel"
                  ? "Cancellation Request Sent!"
                  : "Complaint Submitted!"}
              </h2>

              <p className="relative mt-3 text-sm leading-7 text-[#2D6A4F]">
                {responseMessage}
              </p>

              <div className="relative my-6 rounded-2xl border border-[#B7D5BD] bg-white/70 p-5 text-left">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#1B4332]">
                  <span className="h-2 w-2 rounded-full bg-[#52B788]" />
                  Status: Pending Review
                </div>
                <p className="mt-2 text-sm leading-6 text-[#668674]">
                  Our support team has received your request and will review it. If further information is needed, we will contact you by email.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className={`${buttonClass} relative sm:mx-auto sm:w-auto sm:min-w-40 sm:px-10`}
              >
                Done
                <CheckCircle2 size={16} className="text-[#74C69D]" />
              </button>
              <p className="relative mt-4 text-[10px] font-semibold uppercase tracking-widest text-[#668674]">
                Bianca Care • Customer Support
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTACT INFORMATION */}
      <section className="relative px-4 pb-20 sm:px-8">
        <Reveal>
          <div className="mx-auto max-w-5xl">
            <div className="mb-8 text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#52B788]/50 bg-white/60 px-4 py-2 text-[10px] font-black uppercase tracking-widest">
                <MapPin size={16} className="text-[#2D6A4F]" />
                Find Us
              </span>

              <h2 className="mt-5 text-3xl font-black sm:text-4xl">
                We're Here for You.
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[#2D6A4F]">
                Have questions about your order or products? Reach out to our support team.
              </p>
            </div>

            <div className="grid overflow-hidden rounded-[2rem] border border-[#1B4332]/15 bg-white shadow-xl md:grid-cols-2">
              <div className="flex flex-col justify-center bg-gradient-to-br from-[#1B4332] to-[#2D6A4F] p-8 text-[#F7F6EE] sm:p-10 lg:p-12">
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#74C69D]/50 bg-white/10">
                  <Headphones size={28} className="text-[#74C69D]" />
                </div>

                <h3 className="text-2xl font-black">Bianca Care Studio</h3>

                <p className="mt-3 text-sm leading-7 text-[#D8F3DC]">
                  Contact our customer care team for help with your orders and products.
                </p>

                <div className="mt-8 space-y-4 border-t border-white/15 pt-6 text-xs text-[#D8F3DC]">
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-[#74C69D]" />
                    <span>Gulberg III, Main Boulevard, Lahore, Pakistan</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone size={16} className="shrink-0 text-[#74C69D]" />
                    <span>+92 300 1234567</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail size={16} className="shrink-0 text-[#74C69D]" />
                    <span>support@biancacare.com</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock size={16} className="shrink-0 text-[#74C69D]" />
                    <span>Mon – Sat: 9:00 AM – 8:00 PM PKT</span>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[300px] bg-white">
                <iframe
                  title="Bianca Care Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.383120937812!2d74.3486241!3d31.5135248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3919045a27891827%3A0x86e6807897d2e5b8!2sGulberg%20III%2C%20Lahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 h-full w-full"
                />
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}

