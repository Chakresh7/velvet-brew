import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from "react";
import { type Product } from "@/data/products";

export interface WishlistItem {
  id: string;
  name: string;
  origin: string;
  flavor_notes: string[];
  roast_level: number;
  price: number;
  subscribe_price: number;
  image: string;
  slug: string;
  badge: string | null;
  addedAt: number;
}

interface WishlistState {
  items: WishlistItem[];
  isOpen: boolean;
  justAdded: string | null; // id of item just added (for pulse animation)
}

type WishlistAction =
  | { type: "ADD_ITEM"; payload: WishlistItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "TOGGLE_DRAWER" }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "CLEAR_ALL" }
  | { type: "CLEAR_JUST_ADDED" }
  | { type: "HYDRATE"; payload: WishlistItem[] };

function wishlistReducer(state: WishlistState, action: WishlistAction): WishlistState {
  switch (action.type) {
    case "ADD_ITEM":
      if (state.items.some((i) => i.id === action.payload.id)) return state;
      return { ...state, items: [action.payload, ...state.items], justAdded: action.payload.id };
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case "TOGGLE_DRAWER":
      return { ...state, isOpen: !state.isOpen };
    case "OPEN_DRAWER":
      return { ...state, isOpen: true };
    case "CLOSE_DRAWER":
      return { ...state, isOpen: false };
    case "CLEAR_ALL":
      return { ...state, items: [] };
    case "CLEAR_JUST_ADDED":
      return { ...state, justAdded: null };
    case "HYDRATE":
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

interface WishlistContextValue {
  items: WishlistItem[];
  isOpen: boolean;
  justAdded: string | null;
  isWishlisted: (id: string) => boolean;
  toggleItem: (product: Product) => void;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  clearAll: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = "terroir_wishlist";

function productToWishlistItem(product: Product): WishlistItem {
  return {
    id: product.id,
    name: product.name,
    origin: product.origin,
    flavor_notes: product.tastingNotes,
    roast_level: product.roastLevel,
    price: product.price,
    subscribe_price: product.subscribePrice,
    image: product.image,
    slug: product.id,
    badge: product.badge || null,
    addedAt: Date.now(),
  };
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
    isOpen: false,
    justAdded: null,
  });

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        dispatch({ type: "HYDRATE", payload: JSON.parse(stored) });
      }
    } catch {}
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {}
  }, [state.items]);

  // Clear justAdded after animation
  useEffect(() => {
    if (state.justAdded) {
      const t = setTimeout(() => dispatch({ type: "CLEAR_JUST_ADDED" }), 400);
      return () => clearTimeout(t);
    }
  }, [state.justAdded]);

  const isWishlisted = useCallback((id: string) => state.items.some((i) => i.id === id), [state.items]);

  const toggleItem = useCallback(
    (product: Product) => {
      if (state.items.some((i) => i.id === product.id)) {
        dispatch({ type: "REMOVE_ITEM", payload: product.id });
      } else {
        dispatch({ type: "ADD_ITEM", payload: productToWishlistItem(product) });
      }
    },
    [state.items]
  );

  const addItem = useCallback((product: Product) => {
    dispatch({ type: "ADD_ITEM", payload: productToWishlistItem(product) });
  }, []);

  const removeItem = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  }, []);

  return (
    <WishlistContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        justAdded: state.justAdded,
        isWishlisted,
        toggleItem,
        addItem,
        removeItem,
        toggleDrawer: () => dispatch({ type: "TOGGLE_DRAWER" }),
        openDrawer: () => dispatch({ type: "OPEN_DRAWER" }),
        closeDrawer: () => dispatch({ type: "CLOSE_DRAWER" }),
        clearAll: () => dispatch({ type: "CLEAR_ALL" }),
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
