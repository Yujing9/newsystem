import { createSlice } from "@reduxjs/toolkit";

export const LoadingReducer = createSlice({
  name: "isLoading",
  initialState: {
    value: false,
  },
  reducers: {
    changeLoading: (state) => {
      state.value = !state.value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeLoading } = LoadingReducer.actions;

export default LoadingReducer.reducer;
