import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppDispatch } from '../store'; 

interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: number;
  subCategoryId: number;
  launchDate: string;
  status: string;
  tags: string[]; 
  createdAt: string;
  updatedAt: string;
  price: number;
  imageUrls: string[];
}

interface LikedProductsState {
  likedProducts: Product[];
}

const initialState: LikedProductsState = {
  likedProducts: [],
};

const LIKED_PRODUCTS_STORAGE_KEY = 'liked_products_state';

const likedProductsSlice = createSlice({
  name: 'likedProducts',
  initialState,
  reducers: {
    toggleLikeProduct: (state, action: PayloadAction<Product>) => {
      const existingIndex = state.likedProducts.findIndex(
        (product) => product.id === action.payload.id
      );

      if (existingIndex !== -1) {
        state.likedProducts.splice(existingIndex, 1);
      } else {
        state.likedProducts.push(action.payload);
      }
    },
    setLikedProductsState: (state, action: PayloadAction<Product[]>) => {
      state.likedProducts = action.payload;
    },
  },
});

export const { toggleLikeProduct, setLikedProductsState } = likedProductsSlice.actions;

// Thunks for persisting and loading liked products state
export const saveLikedProductsToStorage = () => async (dispatch: AppDispatch, getState: () => { likedProducts: LikedProductsState }) => {
  try {
    const likedProductsState = getState().likedProducts;
    await AsyncStorage.setItem(LIKED_PRODUCTS_STORAGE_KEY, JSON.stringify(likedProductsState.likedProducts));
  } catch (error) {
    console.error('Failed to save liked products state to AsyncStorage:', error);
  }
};

export const loadLikedProductsFromStorage = () => async (dispatch: AppDispatch) => {
  try {
    const savedLikedProducts = await AsyncStorage.getItem(LIKED_PRODUCTS_STORAGE_KEY);
    if (savedLikedProducts) {
      dispatch(setLikedProductsState(JSON.parse(savedLikedProducts)));
    }
  } catch (error) {
    console.error('Failed to load liked products state from AsyncStorage:', error);
  }
};

export default likedProductsSlice.reducer;