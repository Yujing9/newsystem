import { configureStore } from '@reduxjs/toolkit'
import CollapsedReducer from './reducer/CollapsedReducer'
import LoadingReducer from './reducer/LoadingReducer'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web


const persistConfig = {
  key: 'root',
  storage,
}
const persistedReducer = persistReducer(persistConfig, CollapsedReducer)

export default configureStore({
  reducer: {CollapsedReducer,LoadingReducer},
})