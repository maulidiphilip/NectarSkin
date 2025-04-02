// src/store/Cart-Slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const API_URL = "http://localhost:6060";
const API_URL = "https://shop-backend-lwk9.onrender.com";
export const addToCart = createAsyncThunk("cart/addToCart", async (item, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await axios.post(`${API_URL}/api/cart/add`, item, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } else {
      return { items: [item] };
    }
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const updateCart = createAsyncThunk("cart/updateCart", async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await axios.put(`${API_URL}/api/cart/update`, { productId, quantity }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } else {
      return { items: [{ productId, quantity }] };
    }
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const deleteFromCart = createAsyncThunk("cart/deleteFromCart", async (productId, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await axios.delete(`${API_URL}/api/cart/delete/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } else {
      return { items: [] };
    }
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const fetchCart = createAsyncThunk("cart/fetchCart", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await axios.get(`${API_URL}/api/cart/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } else {
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      return { items: localCart };
    }
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const syncCart = createAsyncThunk("cart/syncCart", async (localItems, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/api/cart/sync`, { items: localItems }, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    localStorage.removeItem("cart");
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLocalCart: (state, action) => {
      state.items = action.payload;
      localStorage.setItem("cart", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        if (!localStorage.getItem("token")) {
          const newItem = action.payload.items[0];
          const existingItem = state.items.find((item) => item.productId === newItem.productId);
          if (existingItem) {
            existingItem.quantity += newItem.quantity;
          } else {
            state.items.push(newItem);
          }
          localStorage.setItem("cart", JSON.stringify(state.items));
        } else {
          state.items = action.payload.items;
        }
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.loading = false;
        if (!localStorage.getItem("token")) {
          const updatedItem = action.payload.items[0];
          const itemIndex = state.items.findIndex((item) => item.productId === updatedItem.productId);
          if (itemIndex > -1) {
            if (updatedItem.quantity <= 0) {
              state.items.splice(itemIndex, 1);
            } else {
              state.items[itemIndex].quantity = updatedItem.quantity;
            }
          }
          localStorage.setItem("cart", JSON.stringify(state.items));
        } else {
          state.items = action.payload.items;
        }
      })
      .addCase(deleteFromCart.fulfilled, (state, action) => {
        state.loading = false;
        if (!localStorage.getItem("token")) {
          state.items = state.items.filter((item) => item.productId !== action.meta.arg);
          localStorage.setItem("cart", JSON.stringify(state.items));
        } else {
          state.items = action.payload.items;
        }
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
      })
      .addCase(syncCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
      })
      .addMatcher(
        (action) => action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload?.message || "An error occurred";
        }
      );
  },
});

export const { setLocalCart } = cartSlice.actions;
export default cartSlice.reducer;