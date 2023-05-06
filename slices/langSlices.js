import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    code: "//Write code here",
    output: null,
}

export const codeSlice = createSlice({
    name: "curCode",
    initialState,
    reducers: {
        setCode: (state, action) => {
            state.code = action.payload;
        },
        setOutput: (state, action) => {
            state.output = action.payload;
        },

    }
})

export const { setCode, setOutput, } = codeSlice.actions

//selectors

export const selectCode = (state) => state.curCode.code
export const selectOutput = (state) => state.curCode.output
export const selectFileDetails = (state) => state.curCode.fileDetails

export default codeSlice.reducer