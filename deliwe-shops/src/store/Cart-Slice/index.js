import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { getState }) => {
    const { auth } = getState();
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/cart/add`,
      { productId, quantity },
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );
    return response.data.data;
  }
);

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState }) => {
    const { auth } = getState();
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/cart`,
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );
    return response.data.data;
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity }, { getState }) => {
    const { auth } = getState();
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/cart/update`,
      { productId, quantity },
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );
    return response.data.data;
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId }, { getState }) => {
    const { auth } = getState();
    const response = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/cart/remove/${productId}`,
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );
    return response.data.data;
  }
);

export const createOrder = createAsyncThunk(
  "cart/createOrder",
  async ({ paymentMethod, shippingAddress, paymentIntentId }, { getState }) => {
    const { auth } = getState();
    console.log("Sending createOrder request:", { paymentMethod, shippingAddress, paymentIntentId });
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/orders`,
      { paymentMethod, shippingAddress, paymentIntentId },
      { headers: { Authorization: `Bearer ${auth.token}` } }
    );
    console.log("createOrder response:", response.data);
    return response.data.data;
  }
);

export const fetchOrders = createAsyncThunk(
  "cart/fetchOrders",
  async (_, { getState }) => {
    const { auth } = getState();
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/orders`,
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );
    return response.data.data;
  }
);

export const fetchAllOrders = createAsyncThunk(
  "cart/fetchAllOrders",
  async (_, { getState }) => {
    const { auth } = getState();
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/admin/orders`,
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );
    return response.data.data;
  }
);

export const updateOrderStatus = createAsyncThunk(
  "cart/updateOrderStatus",
  async ({ orderId, status }, { getState }) => {
    const { auth } = getState();
    const response = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/admin/orders/${orderId}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${auth.token}` },
      }
    );
    return response.data.data;
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalPrice: 0,
    lastOrder: null,
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalPrice = action.payload.totalPrice;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createOrder.pending, (state) => { state.loading = true; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [];
        state.totalPrice = 0;
        state.lastOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default cartSlice.reducer;
