import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { chatApi } from "./chatApi";
import { setupListeners } from '@reduxjs/toolkit/query'


export const store = configureStore({
    reducer: {
        [chatApi.reducerPath]: chatApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(chatApi.middleware),

})


setupListeners(store.dispatch)
