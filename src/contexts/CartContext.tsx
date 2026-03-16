import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from "react";
import { type Product } from "@/data/products";

export interface CartVariant {
  grind: string;
  weight: string;
  label: string;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  name: string;
  origin: string;
  image: string;
  slug: string;
  variant: CartVariant;
  isSubscription: boolean;
  frequency: "2_weeks" | "4_weeks" | "6_weeks" | "8_weeks" | null;
  unitPrice: number;
  subscribePrice: number;
  quantity: number;
  subtotal: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  promoCode: string | null;
  discount: number;
  promoError: string | null;
  justAddedId: string | null;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "subtotal"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { cartItemId: string; quantity: number } }
  | { type: "TOGGLE_SUBSCRIPTION"; payload: string }
  | { type: "SET_FREQUENCY"; payload: { cartItemId: string; frequency: CartItem["frequency"] } }
  | { type: "APPLY_PROMO"; payload: string }
  | { type: "CLEAR_PROMO" }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_DRAWER" }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "SUBSCRIBE_ALL"; payload: boolean }
  | { type: "CLEAR_JUST_ADDED" }
  | { type: "HYDRATE"; payload: CartItem[] };

const VALID_PROMOS: Record<string, number> = { TERROIR15: 0.15, WELCOME10: 0.1 };

function calcSubtotal(item: Omit<CartItem, "subtotal">): number {
  const price = item.isSubscription ? item.subscribePrice : item.unitPrice;
  return price * item.quantity;
}

function recalcItems(items: CartItem[]): CartItem[] {
  return items.map((i) => ({ ...i, subtotal: calcSubtotal(i) }));
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.cartItemId === action.payload.cartItemId);
      if (existing) {
        const updated = state.items.map((i) =>
          i.cartItemId === action.payload.cartItemId
            ? { ...i, quantity: i.quantity + action.payload.quantity, subtotal: calcSubtotal({ ...i, quantity: i.quantity + action.payload.quantity }) }
            : i
        );
        return { ...state, items: updated, justAddedId: action.payload.cartItemId };
      }
      const newItem: CartItem = { ...action.payload, subtotal: calcSubtotal(action.payload) };
      return { ...state, items: [...state.items, newItem], justAddedId: action.payload.cartItemId };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.cartItemId !== action.payload) };
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity < 1) {
        return { ...state, items: state.items.filter((i) => i.cartItemId !== action.payload.cartItemId) };
      }
      const items = state.items.map((i) =>
        i.cartItemId === action.payload.cartItemId
          ? { ...i, quantity: action.payload.quantity, subtotal: calcSubtotal({ ...i, quantity: action.payload.quantity }) }
          : i
      );
      return { ...state, items };
    }
    case "TOGGLE_SUBSCRIPTION": {
      const items = state.items.map((i) => {
        if (i.cartItemId !== action.payload) return i;
        const toggled = !i.isSubscription;
        const updated = { ...i, isSubscription: toggled, frequency: toggled ? (i.frequency || "4_weeks") : null };
        return { ...updated, subtotal: calcSubtotal(updated) };
      });
      return { ...state, items };
    }
    case "SET_FREQUENCY": {
      const items = state.items.map((i) =>
        i.cartItemId === action.payload.cartItemId ? { ...i, frequency: action.payload.frequency } : i
      );
      return { ...state, items };
    }
    case "APPLY_PROMO": {
      const code = action.payload.toUpperCase();
      if (VALID_PROMOS[code] !== undefined) {
        return { ...state, promoCode: code, discount: VALID_PROMOS[code], promoError: null };
      }
      return { ...state, promoCode: null, discount: 0, promoError: "Invalid code" };
    }
    case "CLEAR_PROMO":
      return { ...state, promoCode: null, discount: 0, promoError: null };
    case "CLEAR_CART":
      return { ...state, items: [], promoCode: null, discount: 0, promoError: null };
    case "TOGGLE_DRAWER":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_DRAWER":
      return { ...state, isOpen: true };
    case "CLOSE_DRAWER":
      return { ...state, isOpen: false };
    case "SUBSCRIBE_ALL": {
      const items = state.items.map((i) => {
        const updated = { ...i, isSubscription: action.payload, frequency: action.payload ? (i.frequency || "4_weeks") : null };
        return { ...updated, subtotal: calcSubtotal(updated) };
      });
      return { ...state, items };
    }
    case "CLEAR_JUST_ADDED":
      return { ...state, justAddedId: null };
    case "HYDRATE":
      return { ...state, items: recalcItems(action.payload) };
    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  promoCode: string | null;
  discount: number;
  promoError: string | null;
  justAddedId: string | null;
  totalItems: number;
  subtotal: number;
  discountAmount: number;
  shipping: number;
  total: number;
  addItem: (product: Product, grind: string, weight: string, quantity: number, isSubscription?: boolean) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  toggleSubscription: (cartItemId: string) => void;
  setFrequency: (cartItemId: string, frequency: CartItem["frequency"]) => void;
  applyPromo: (code: string) => void;
  clearPromo: () => void;
  clearCart: () => void;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  subscribeAll: (on: boolean) => void;
  hasNonSubscription: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "terroir_cart";
const FREE_SHIPPING_THRESHOLD = 75;
const SHIPPING_COST = 6.99;

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
    promoCode: null,
    discount: 0,
    promoError: null,
    justAddedId: null,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) dispatch({ type: "HYDRATE", payload: JSON.parse(stored) });
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  useEffect(() => {
    if (state.justAddedId) {
      const t = setTimeout(() => dispatch({ type: "CLEAR_JUST_ADDED" }), 500);
      return () => clearTimeout(t);
    }
  }, [state.justAddedId]);

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = state.items.reduce((s, i) => s + i.subtotal, 0);
  const discountAmount = subtotal * state.discount;
  const afterDiscount = subtotal - discountAmount;
  const shipping = afterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = afterDiscount + shipping;
  const hasNonSubscription = state.items.some((i) => !i.isSubscription);

  const addItem = useCallback((product: Product, grind: string, weight: string, quantity: number, isSubscription = false) => {
    const cartItemId = `${product.id}-${grind}-${weight}`;
    dispatch({
      type: "ADD_ITEM",
      payload: {
        cartItemId,
        productId: product.id,
        name: product.name,
        origin: product.origin,
        image: product.image,
        slug: product.id,
        variant: { grind, weight, label: `${weight} · ${grind}` },
        isSubscription,
        frequency: isSubscription ? "4_weeks" : null,
        unitPrice: product.price,
        subscribePrice: product.subscribePrice,
        quantity,
      },
    });
  }, []);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        promoCode: state.promoCode,
        discount: state.discount,
        promoError: state.promoError,
        justAddedId: state.justAddedId,
        totalItems,
        subtotal,
        discountAmount,
        shipping,
        total,
        hasNonSubscription,
        addItem,
        removeItem: (id) => dispatch({ type: "REMOVE_ITEM", payload: id }),
        updateQuantity: (id, qty) => dispatch({ type: "UPDATE_QUANTITY", payload: { cartItemId: id, quantity: qty } }),
        toggleSubscription: (id) => dispatch({ type: "TOGGLE_SUBSCRIPTION", payload: id }),
        setFrequency: (id, f) => dispatch({ type: "SET_FREQUENCY", payload: { cartItemId: id, frequency: f } }),
        applyPromo: (code) => dispatch({ type: "APPLY_PROMO", payload: code }),
        clearPromo: () => dispatch({ type: "CLEAR_PROMO" }),
        clearCart: () => dispatch({ type: "CLEAR_CART" }),
        toggleDrawer: () => dispatch({ type: "TOGGLE_DRAWER" }),
        openDrawer: () => dispatch({ type: "OPEN_DRAWER" }),
        closeDrawer: () => dispatch({ type: "CLOSE_DRAWER" }),
        subscribeAll: (on) => dispatch({ type: "SUBSCRIBE_ALL", payload: on }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
