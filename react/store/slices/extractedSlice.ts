import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface ExtractedState {
  text: string
}

const initialState: ExtractedState = {
  text: ''
}

const extractedSlice = createSlice({
  name: 'extracted',
  initialState,
  reducers: {
    setExtractedTextRedux: (state, action: PayloadAction<string>) => {
      state.text = action.payload
    }
  }
})

export const { setExtractedTextRedux } = extractedSlice.actions
export default extractedSlice.reducer
