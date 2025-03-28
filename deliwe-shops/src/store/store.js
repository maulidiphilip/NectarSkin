import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./Auth-slice/index";

const store = configureStore({
    reducer: {
        // Add reducers here
        auth: authSlice,
    }
})

export default store;