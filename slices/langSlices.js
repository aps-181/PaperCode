import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    lang: "javascript"
}

export const langSlice = createSlice({
    name: "curLang",
    initialState,
    reducers: {
        setLang: (state, action) => {
            state.lang = action.payload;
        }
    }
})

export const { setLang } = langSlice.actions

//selectors

export const selectLang = (state) => state.curLang.lang

export default langSlice.reducer