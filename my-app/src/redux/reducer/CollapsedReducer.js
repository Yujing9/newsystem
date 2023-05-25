import { createSlice } from "@reduxjs/toolkit";

export const CollapsedReducer = createSlice({
  name: "isCollapsed",
  initialState: {
    value: false,
  },
  reducers: {
    changeCollapsed: (state) => {
      state.value = !state.value;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeCollapsed } = CollapsedReducer.actions;

export default CollapsedReducer.reducer;
