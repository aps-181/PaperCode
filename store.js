import { configureStore } from '@reduxjs/toolkit'
import langReducer from './slices/langSlices'
export const store = configureStore({
    reducer: {
        curLang: langReducer,
    },
})