import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  productId: number;
  skuId: number;
  name: string;
  skuName: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(item => item.skuId === action.payload.skuId);
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.skuId !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ skuId: number; quantity: number }>) => {
      const item = state.items.find(item => item.skuId === action.payload.skuId);
      if (item) {
        item.quantity = action.payload.quantity;
        if (item.quantity === 0) {
          state.items = state.items.filter(item => item.skuId !== action.payload.skuId);
        }
      }
    },
    setCartState: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    clearCart(state) {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, setCartState, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
