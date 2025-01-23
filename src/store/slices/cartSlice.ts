import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDispatch } from '../store'; 

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

const CART_STORAGE_KEY = 'cart_state';

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
        // Remove the item if the quantity is 0
        if (item.quantity === 0) {
          state.items = state.items.filter(item => item.skuId !== action.payload.skuId);
        }
      }
    },
    setCartState: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, setCartState } = cartSlice.actions;

export const saveCartToStorage = () => async (dispatch: AppDispatch, getState: () => { cart: CartState }) => {
  try {
    const cartState = getState().cart;
    await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState.items));
  } catch (error) {
    console.error('Failed to save cart state to AsyncStorage:', error);
  }
};

export const loadCartFromStorage = () => async (dispatch: AppDispatch) => {
  try {
    const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      dispatch(setCartState(JSON.parse(savedCart)));
    }
  } catch (error) {
    console.error('Failed to load cart state from AsyncStorage:', error);
  }
};

export default cartSlice.reducer;