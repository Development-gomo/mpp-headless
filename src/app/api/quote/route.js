import { getWPBaseUrl } from "@/config";

export const dynamic = "force-dynamic";

function getWooCredentials() {
  return {
    key:
      process.env.WOOCOMMERCE_CONSUMER_KEY ||
      process.env.WC_CONSUMER_KEY ||
      process.env.WOO_CONSUMER_KEY ||
      "",
    secret:
      process.env.WOOCOMMERCE_CONSUMER_SECRET ||
      process.env.WC_CONSUMER_SECRET ||
      process.env.WOO_CONSUMER_SECRET ||
      "",
  };
}

function cleanText(value) {
  return String(value || "").trim();
}

function validatePayload(payload) {
  const customer = payload?.customer || {};
  const items = Array.isArray(payload?.items) ? payload.items : [];
  const errors = {};

  if (!items.length) errors.items = "Quote cart is empty.";
  if (!cleanText(customer.name)) errors.name = "Name is required.";
  if (!cleanText(customer.email)) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanText(customer.email))) {
    errors.email = "Enter a valid email address.";
  }
  if (!cleanText(customer.phone)) errors.phone = "Phone number is required.";

  return errors;
}

function splitName(name) {
  const parts = cleanText(name).split(/\s+/).filter(Boolean);
  const firstName = parts.shift() || "";

  return {
    firstName,
    lastName: parts.join(" "),
  };
}

function formatAccessory(accessory) {
  const bits = [
    cleanText(accessory?.name),
    cleanText(accessory?.meta),
    `Qty: ${Math.max(Number(accessory?.quantity) || 1, 1)}`,
  ].filter(Boolean);

  return bits.join(" | ");
}

function buildLineItems(items) {
  return items
    .map((item) => {
      const productId = Number(item?.productId);
      if (!Number.isFinite(productId) || productId <= 0) return null;

      const accessories = Array.isArray(item?.accessories)
        ? item.accessories
        : [];
      const metaData = [
        cleanText(item?.capacity)
          ? { key: "Selected capacity", value: cleanText(item.capacity) }
          : null,
        cleanText(item?.slug)
          ? { key: "Product slug", value: cleanText(item.slug) }
          : null,
        accessories.length
          ? {
              key: "Accessories",
              value: accessories.map(formatAccessory).join("\n"),
            }
          : null,
      ].filter(Boolean);

      return {
        product_id: productId,
        quantity: Math.max(Number(item?.quantity) || 1, 1),
        meta_data: metaData,
      };
    })
    .filter(Boolean);
}

function buildQuoteSummary(items) {
  return items
    .map((item) => {
      const productLine = [
        cleanText(item?.name) || "Product",
        cleanText(item?.capacity) ? `Capacity: ${cleanText(item.capacity)}` : "",
        `Qty: ${Math.max(Number(item?.quantity) || 1, 1)}`,
      ]
        .filter(Boolean)
        .join(" | ");
      const accessories = Array.isArray(item?.accessories)
        ? item.accessories.map((accessory) => `  - ${formatAccessory(accessory)}`)
        : [];

      return [productLine, ...accessories].join("\n");
    })
    .join("\n\n");
}

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON payload." }, { status: 400 });
  }

  const errors = validatePayload(payload);
  if (Object.keys(errors).length > 0) {
    return Response.json(
      { message: "Please check the quote request details.", errors },
      { status: 400 }
    );
  }

  const items = payload.items;
  const lineItems = buildLineItems(items);
  if (!lineItems.length) {
    return Response.json(
      { message: "No valid WooCommerce products found in the quote cart." },
      { status: 400 }
    );
  }

  let wpBaseUrl;

  try {
    wpBaseUrl = getWPBaseUrl();
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }

  const credentials = getWooCredentials();
  if (!credentials.key || !credentials.secret) {
    return Response.json(
      {
        message:
          "WooCommerce API credentials are not configured. Set WOOCOMMERCE_CONSUMER_KEY and WOOCOMMERCE_CONSUMER_SECRET.",
      },
      { status: 500 }
    );
  }

  const customer = payload.customer;
  const { firstName, lastName } = splitName(customer.name);
  const quoteSummary = buildQuoteSummary(items);
  const customerNote = [cleanText(customer.message), quoteSummary]
    .filter(Boolean)
    .join("\n\nQuote items:\n");
  const auth = Buffer.from(`${credentials.key}:${credentials.secret}`).toString(
    "base64"
  );

  const wooPayload = {
    status: "pending",
    set_paid: false,
    payment_method: "quote_request",
    payment_method_title: "Quote request",
    billing: {
      first_name: firstName,
      last_name: lastName,
      email: cleanText(customer.email),
      phone: cleanText(customer.phone),
      company: cleanText(customer.company),
    },
    customer_note: customerNote,
    line_items: lineItems,
    meta_data: [
      { key: "quote_request", value: "yes" },
      { key: "quote_customer_message", value: cleanText(customer.message) },
      { key: "quote_items", value: JSON.stringify(items) },
    ],
  };

  const response = await fetch(`${wpBaseUrl}/wp-json/wc/v3/orders`, {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(wooPayload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return Response.json(
      {
        message:
          data?.message ||
          "WooCommerce could not create the order for this quote request.",
        details: data,
      },
      { status: response.status }
    );
  }

  return Response.json({
    ok: true,
    orderId: data?.id,
    orderNumber: data?.number || data?.id,
  });
}
