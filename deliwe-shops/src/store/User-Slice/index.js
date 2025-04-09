import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Base URL for your API 
// const API_URL = "http://localhost:6060";
const API_URL = "https://shop-backend-lwk9.onrender.com";

// Async thunks for user actions
export const getProfile = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/users/`, userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteProfile = createAsyncThunk(
  'user/deleteProfile',
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/users/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return null;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunks for admin actions
export const getAllUsers = createAsyncThunk(
    'user/getAllUsers',
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(`${API_URL}/api/users/all`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        console.log('getAllUsers response:', response.data); // Debug log
        return response.data.data;
      } catch (error) {
        console.error('getAllUsers error:', error.response?.data || error.message);
        return rejectWithValue(error.response.data);
      }
    }
  );

export const getUserById = createAsyncThunk(
  'user/getUserById',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ userId, userData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/api/users/${userId}`, userData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return userId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    users: [],
    selectedUser: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    // Get Profile
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete Profile
      .addCase(deleteProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProfile.fulfilled, (state) => {
        state.loading = false;
        state.currentUser = null;
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Get All Users (Admin)
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Get User by ID (Admin)
      .addCase(getUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update User (Admin)
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map(user =>
          user._id === action.payload._id ? action.payload : user
        );
        state.selectedUser = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Delete User (Admin)
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(user => user._id !== action.payload);
        state.selectedUser = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearError, clearSelectedUser } = userSlice.actions;
export default userSlice.reducer;