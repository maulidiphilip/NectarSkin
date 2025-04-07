import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Auth-slice/index";
import productReducer from "./Product-slice/index";

const store = configureStore({
    reducer: {
        // Add reducers here
        auth: authSlice,
        products: productReducer,
    }
})

export default store;