import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import exampleReducer from './slices/exampleSlice.ts';
import likedProductsReducer from './slices/likedProductSlices.ts';
import cartReducer from './slices/cartSlice.ts'

const rootReducer = combineReducers({
  example: exampleReducer,
  likedProducts: likedProductsReducer, 
  cart: cartReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
