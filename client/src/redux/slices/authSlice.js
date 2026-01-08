import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },

    updateProfile: (state, action) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
    updateStats: (state, action) => {
     state.user.stats = {
    ...state.user.stats,
    ...action.payload,
   };
   },

   

  },
});

export const { loginSuccess, logout, updateProfile, updateStats } = authSlice.actions;
export default authSlice.reducer;
