import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAnalytics = createAsyncThunk(
  "analytics/fetchAnalytics",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/analytics`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      return response.data.data;
    } catch (error) {
      console.error(
        "fetchAnalytics error:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response.data);
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    totalUsers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    topProducts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.totalUsers = action.payload.totalUsers;
        state.totalOrders = action.payload.totalOrders;
        state.pendingOrders = action.payload.pendingOrders;
        state.totalRevenue = action.payload.totalRevenue;
        state.topProducts = action.payload.topProducts;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch analytics";
      });
  },
});

export default analyticsSlice.reducer;
