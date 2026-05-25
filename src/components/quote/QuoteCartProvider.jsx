"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const QuoteCartContext = createContext(null);
const STORAGE_KEY = "mpp_quote_cart";

function normalizeKey(value, fallback = "item") {
  return String(value || fallback)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getProductKey(product) {
  return String(product?.productId || product?.id || product?.slug || "product");
}

function normalizeProduct(product) {
  return {
    key: getProductKey(product),
    productId: product?.productId || product?.id || "",
    slug: product?.slug || "",
    name: product?.name || product?.title || "Product",
    sku: product?.sku || "",
    capacity: product?.capacity || "",
    image: product?.image || "",
    quantity: Math.max(Number(product?.quantity) || 1, 1),
    accessories: Array.isArray(product?.accessories) ? product.accessories : [],
  };
}

function normalizeAccessory(accessory) {
  return {
    key: accessory?.key || normalizeKey(accessory?.title || accessory?.name),
    name: accessory?.name || accessory?.title || "Accessory",
    category: accessory?.category || "",
    meta: accessory?.meta || "",
    image: accessory?.image || "",
    quantity: Math.max(Number(accessory?.quantity) || 1, 1),
  };
}

export function useQuoteCart() {
  const context = useContext(QuoteCartContext);

  if (!context) {
    throw new Error("useQuoteCart must be used inside QuoteCartProvider");
  }

  return context;
}

export default function QuoteCartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hasLoadedStoredCart, setHasLoadedStoredCart] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHasLoadedStoredCart(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedStoredCart) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hasLoadedStoredCart, items]);

  const addProduct = useCallback((product) => {
    const nextProduct = normalizeProduct(product);

    setItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (item) => item.key === nextProduct.key
      );

      if (existingIndex === -1) return [...currentItems, nextProduct];

      return currentItems.map((item, index) =>
        index === existingIndex
          ? {
              ...item,
              ...nextProduct,
              quantity: item.quantity + nextProduct.quantity,
              accessories: item.accessories,
            }
          : item
      );
    });
  }, []);

  const addAccessory = useCallback((product, accessory) => {
    const nextProduct = normalizeProduct(product);
    const nextAccessory = normalizeAccessory(accessory);

    setItems((currentItems) => {
      const productExists = currentItems.some(
        (item) => item.key === nextProduct.key
      );
      const baseItems = productExists ? currentItems : [...currentItems, nextProduct];

      return baseItems.map((item) => {
        if (item.key !== nextProduct.key) return item;

        const accessoryExists = item.accessories.some(
          (currentAccessory) => currentAccessory.key === nextAccessory.key
        );

        return {
          ...item,
          accessories: accessoryExists
            ? item.accessories.map((currentAccessory) =>
                currentAccessory.key === nextAccessory.key
                  ? {
                      ...currentAccessory,
                      quantity: currentAccessory.quantity + nextAccessory.quantity,
                    }
                  : currentAccessory
              )
            : [...item.accessories, nextAccessory],
        };
      });
    });
  }, []);

  const updateProductQuantity = useCallback((key, quantity) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.key === key ? { ...item, quantity: Math.max(quantity, 1) } : item
      )
    );
  }, []);

  const updateAccessoryQuantity = useCallback((productKey, accessoryKey, quantity) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.key === productKey
          ? {
              ...item,
              accessories: item.accessories.map((accessory) =>
                accessory.key === accessoryKey
                  ? { ...accessory, quantity: Math.max(quantity, 1) }
                  : accessory
              ),
            }
          : item
      )
    );
  }, []);

  const removeProduct = useCallback((key) => {
    setItems((currentItems) => currentItems.filter((item) => item.key !== key));
  }, []);

  const removeAccessory = useCallback((productKey, accessoryKey) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.key === productKey
          ? {
              ...item,
              accessories: item.accessories.filter(
                (accessory) => accessory.key !== accessoryKey
              ),
            }
          : item
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce(
        (total, item) =>
          total +
          item.quantity +
          item.accessories.reduce(
            (accessoryTotal, accessory) => accessoryTotal + accessory.quantity,
            0
          ),
        0
      ),
      addProduct,
      addAccessory,
      updateProductQuantity,
      updateAccessoryQuantity,
      removeProduct,
      removeAccessory,
      clearCart,
    }),
    [
      addAccessory,
      addProduct,
      clearCart,
      items,
      removeAccessory,
      removeProduct,
      updateAccessoryQuantity,
      updateProductQuantity,
    ]
  );

  return (
    <QuoteCartContext.Provider value={value}>
      {children}
    </QuoteCartContext.Provider>
  );
}
