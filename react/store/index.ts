import { configureStore } from '@reduxjs/toolkit'
import extractedReducer from '../store/slices/extractedSlice'

export const store = configureStore({
  reducer: {
    extracted: extractedReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
