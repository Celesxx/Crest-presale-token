import { createSlice } from '@reduxjs/toolkit'

export const loginSlice = createSlice(
{
  name: 'login',
  initialState: 
  {
    address: "",
    language: "en",
  },

  reducers: 
  {
    login: (state, action) => 
    {
      switch(action.payload.action)
      {
          case 'address': 
              state.address = action.payload.address 
              break;

          case 'language':
              state.language = action.payload.language
              break;
      }
    },
  },
})

export const { login, disconnect } = loginSlice.actions

export default loginSlice.reducer