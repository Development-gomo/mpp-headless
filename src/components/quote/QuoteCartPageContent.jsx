"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useQuoteCart } from "./QuoteCartProvider";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  company: "",
  message: "",
};

function ProductImage({ src, alt }) {
  if (!src) return <div className="h-full w-full rounded-md bg-white" />;

  return (
    <div className="relative h-full w-full rounded-md bg-white">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="90px"
        className="object-contain p-2"
      />
    </div>
  );
}

function validateForm(form, items) {
  const nextErrors = {};

  if (!items.length) nextErrors.items = "Add at least one product to request a quote.";
  if (!form.name.trim()) nextErrors.name = "Name is required.";
  if (!form.email.trim()) {
    nextErrors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    nextErrors.email = "Enter a valid email address.";
  }
  if (!form.phone.trim()) nextErrors.phone = "Phone number is required.";

  return nextErrors;
}

export default function QuoteCartPageContent() {
  const {
    items,
    updateProductQuantity,
    updateAccessoryQuantity,
    removeProduct,
    removeAccessory,
    clearCart,
  } = useQuoteCart();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [confirmation, setConfirmation] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm(form, items);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, items }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message || "Could not submit quote request.");
      }

      setConfirmation({
        orderId: data.orderId,
        orderNumber: data.orderNumber,
      });
      clearCart();
      setForm(emptyForm);
      setErrors({});
      setStatus("success");
    } catch (error) {
      setErrors({ submit: error.message });
      setStatus("error");
    }
  };

  return (
    <section className="bg-white pb-20 pt-30 text-black md:pb-30 md:pt-37.5">
      <div className="web-width px-6">
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-4 w-0.5 bg-[var(--color-yellow)]" />
            <p className="font-body text-[13px] font-medium uppercase leading-5.5 tracking-[0.52px]">
              RFQ
            </p>
          </div>
          <h1 className="max-w-155 font-heading text-[48px] font-normal leading-14 tracking-[-0.96px] md:text-[64px] md:leading-[70px]">
            Request a <span>quote</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 overflow-hidden rounded-lg border border-[#D7E4EA] lg:grid-cols-[1.15fr_0.85fr]">
          <div className="border-b border-[#D7E4EA] bg-white p-5 md:p-8 lg:border-b-0 lg:border-r">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="font-heading text-[30px] leading-[36px] tracking-[-0.6px]">
                Quotation cart
              </h2>
              {items.length > 0 && (
                <button
                  type="button"
                  onClick={clearCart}
                  className="border-b border-black/30 font-body text-[13px] text-black/60 hover:text-black"
                >
                  Clear cart
                </button>
              )}
            </div>

            {errors.items && (
              <p className="mb-4 rounded-sm bg-red-50 px-4 py-3 font-body text-[14px] text-red-700">
                {errors.items}
              </p>
            )}

            {confirmation ? (
              <div className="rounded-lg bg-[#E5F2F7] p-6">
                <h3 className="font-heading text-[28px] leading-[34px]">
                  Quote request sent
                </h3>
                <p className="mt-3 font-body text-[15px] leading-[23px] text-[#1A1A1A]">
                  Thank you. Your WooCommerce order has been created
                  {confirmation.orderNumber
                    ? ` with order number ${confirmation.orderNumber}`
                    : ""}
                  .
                </p>
              </div>
            ) : items.length === 0 ? (
              <div className="flex min-h-70 items-center justify-center rounded-lg border border-dashed border-black/20 bg-[#F8FAFC] p-8 text-center">
                <div>
                  <p className="mx-auto max-w-[420px] font-body text-[15px] leading-[23px] text-black/60">
                    Add a product or accessory to start your quote request.
                  </p>
                  <Link
                    href="/product/pickuptank"
                    className="mt-5 inline-flex h-11 items-center justify-center rounded-sm bg-[var(--color-yellow)] px-5 font-heading text-[14px] text-black"
                  >
                    Explore products
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {items.map((item) => (
                  <article
                    key={item.key}
                    className="rounded-lg border border-[#D7E4EA] bg-[#F8FBFC] p-4"
                  >
                    <div className="grid grid-cols-[90px_1fr] gap-4">
                      <div className="h-[90px] overflow-hidden rounded-md border border-black/10 bg-white">
                        <ProductImage src={item.image} alt={item.name} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex gap-3">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-heading text-[22px] leading-[28px] tracking-[-0.44px]">
                              {item.name}
                            </h3>
                            {item.capacity && (
                              <p className="mt-1 font-body text-[14px] text-[#007DA5]">
                                Capacity: {item.capacity}
                              </p>
                            )}
                            {item.sku && (
                              <p className="mt-1 font-body text-[13px] text-black/55">
                                Article: {item.sku}
                              </p>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeProduct(item.key)}
                            className="h-fit border-b border-black/30 font-body text-[13px] text-black/60 hover:text-black"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="mt-4 flex items-center gap-3">
                          <span className="font-body text-[13px] text-black/60">
                            Quantity
                          </span>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(event) =>
                              updateProductQuantity(
                                item.key,
                                Number(event.target.value)
                              )
                            }
                            className="h-9 w-20 rounded-sm border border-black/15 px-3 font-body text-[14px] outline-none focus:border-[#007DA5]"
                          />
                        </div>
                      </div>
                    </div>

                    {item.accessories.length > 0 && (
                      <div className="mt-5 border-t border-black/10 pt-4">
                        <p className="mb-3 font-body text-[12px] font-bold uppercase tracking-[0.48px] text-black/55">
                          Accessories
                        </p>
                        <div className="space-y-3">
                          {item.accessories.map((accessory) => (
                            <div
                              key={accessory.key}
                              className="grid grid-cols-[58px_1fr_auto] items-center gap-3 rounded-md bg-white p-2"
                            >
                              <div className="h-[58px] overflow-hidden rounded-sm border border-black/10">
                                <ProductImage
                                  src={accessory.image}
                                  alt={accessory.name}
                                />
                              </div>
                              <div className="min-w-0">
                                <p className="font-heading text-[17px] leading-5.5">
                                  {accessory.name}
                                </p>
                                <p className="font-body text-[12px] leading-[18px] text-black/55">
                                  {[accessory.category, accessory.meta]
                                    .filter(Boolean)
                                    .join(" | ")}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  min="1"
                                  value={accessory.quantity}
                                  onChange={(event) =>
                                    updateAccessoryQuantity(
                                      item.key,
                                      accessory.key,
                                      Number(event.target.value)
                                    )
                                  }
                                  className="h-8 w-16 rounded-sm border border-black/15 px-2 font-body text-[13px] outline-none focus:border-[#007DA5]"
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeAccessory(item.key, accessory.key)
                                  }
                                  className="h-8 w-8 rounded-sm border border-black/15 font-body text-[16px] leading-none hover:bg-black/5"
                                  aria-label={`Remove ${accessory.name}`}
                                >
                                  x
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="bg-[#E5F2F7] p-5 md:p-8">
            <h2 className="font-heading text-[30px] leading-[36px] tracking-[-0.6px]">
              Contact details
            </h2>
            <p className="mt-2 font-body text-[14px] leading-5.5 text-[#1A1A1A]">
              Send us your selected products and contact details. We will review
              the request and get back to you.
            </p>

            <div className="mt-6 space-y-4">
              {[
                { key: "name", label: "Name", type: "text" },
                { key: "email", label: "Email", type: "email" },
                { key: "phone", label: "Phone", type: "tel" },
                { key: "company", label: "Company", type: "text" },
              ].map((field) => (
                <label key={field.key} className="block">
                  <span className="mb-1 block font-body text-[13px] font-bold">
                    {field.label}
                    {["name", "email", "phone"].includes(field.key) ? " *" : ""}
                  </span>
                  <input
                    type={field.type}
                    value={form[field.key]}
                    onChange={(event) =>
                      setForm((currentForm) => ({
                        ...currentForm,
                        [field.key]: event.target.value,
                      }))
                    }
                    className="h-11 w-full rounded-sm border border-transparent bg-white px-3 font-body text-[15px] outline-none focus:border-[#007DA5]"
                  />
                  {errors[field.key] && (
                    <span className="mt-1 block font-body text-[12px] text-red-700">
                      {errors[field.key]}
                    </span>
                  )}
                </label>
              ))}

              <label className="block">
                <span className="mb-1 block font-body text-[13px] font-bold">
                  Message
                </span>
                <textarea
                  value={form.message}
                  onChange={(event) =>
                    setForm((currentForm) => ({
                      ...currentForm,
                      message: event.target.value,
                    }))
                  }
                  rows={5}
                  className="w-full resize-none rounded-sm border border-transparent bg-white px-3 py-3 font-body text-[15px] outline-none focus:border-[#007DA5]"
                />
              </label>

              {errors.submit && (
                <p className="rounded-sm bg-red-50 px-4 py-3 font-body text-[14px] text-red-700">
                  {errors.submit}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="inline-flex h-12 items-center justify-center rounded-sm bg-[var(--color-yellow)] px-6 font-heading text-[14px] tracking-[-0.28px] text-black transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
              >
                {status === "submitting" ? "Submitting..." : "Submit quote request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
