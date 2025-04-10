import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Auth-slice/index";
import productReducer from "./Product-slice/index";
import userReducer from "./User-Slice/index";
import cartReducer from "./Cart-Slice/index";
import analyticsReducer from "./Analytics-Slice/index";

const store = configureStore({
    reducer: {
        // Add reducers here
        auth: authSlice,
        products: productReducer,
        user: userReducer,
        cart: cartReducer,
        analytics: analyticsReducer,
    }
})

export default store;