import { createSlice } from '@reduxjs/toolkit'

export const dashboardSlice = createSlice(
{
  name: 'dashboard',
  initialState: 
  {
    crestPrice: 
    {
        public: null,
        private: null,
    },
    maxUserToken: null,
    maxToken: null,
    isWhitelist: false,
    remainingToken: null,
    allowance: false,
    stableBalance: null,
    crestBalance: null,
    crestBuy: null,
  },

  reducers: 
  {
    dashboard: (state, action) => 
    {
      switch(action.payload.action)
      {
        case 'save-data': 
        for(const [key, value] of Object.entries(action.payload.data))
        {
            if(state[key] !== undefined)
            { 
                if(typeof(value) === "object" && !Array.isArray(value))
                {
                    for(const [key1, value1] of Object.entries(value)) 
                    { 
                        if(state[key][key1] !== undefined)state[key][key1] = value1
                        else console.log(`value not exist for ${key1} in ${key}`)
                    }
                }else state[key] = value 
            }else console.log(`value not exist : ${key}`)
        }
        break;

        default:
            console.log(`wrong action !`)
            break;            
      }
    },
  },
})

export const { dashboard } = dashboardSlice.actions

export default dashboardSlice.reducer