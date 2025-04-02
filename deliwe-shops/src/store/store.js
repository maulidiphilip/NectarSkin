import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Auth-slice/index";
import productReducer from "./Product-slice/index";
import cartReducer from "./Cart-Slice/index";

const store = configureStore({
    reducer: {
        // Add reducers here
        auth: authSlice,
        products: productReducer,
        cart: cartReducer,
    }
})

export default store;