import { configureStore } from '@reduxjs/toolkit'
import codeReducer from './slices/langSlices'
export const store = configureStore({
    reducer: {
        curCode: codeReducer,
    },
})