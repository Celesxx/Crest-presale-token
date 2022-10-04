import { configureStore,} from '@reduxjs/toolkit'
import loginReducer from "store/reducers/login.reducer.js"
import dashboardReducer from "store/reducers/dashboard.reducer.js"
import storage from 'redux-persist/lib/storage'
import {combineReducers} from "redux"; 
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, } from 'redux-persist'


const reducers = combineReducers({
  login: loginReducer,        
  dashboard: dashboardReducer,        
 });
 
 const persistConfig = {
     key: 'presale-crest',
     storage
 };
 
 const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

const persistor = persistStore(store)

export default { store };
