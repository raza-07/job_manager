import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '@/lib/api-client'
import { Account } from '@/types'

export interface AccountsState {
  items: Account[]
  selectedId: number | null
  isLoading: boolean
  error: string | null
}

const initialState: AccountsState = {
  items: [],
  selectedId: null,
  isLoading: false,
  error: null,
}

export const fetchAccounts = createAsyncThunk('accounts/fetchAll', async (_, thunkAPI) => {
  try {
    return await api.getAccounts()
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const createAccount = createAsyncThunk(
  'accounts/create',
  async ({ name, email }: { name: string; email: string }, thunkAPI) => {
    try {
      const response = await api.createAccount(name, email)
      return response
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const deleteAccount = createAsyncThunk('accounts/delete', async (id: number, thunkAPI) => {
    try {
        await api.deleteAccount(id)
        return id;
    } catch (error: any) {
        return thunkAPI.rejectWithValue(error.message)
    }
})

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    selectAccount: (state, action) => {
      state.selectedId = action.payload
    },
    clearAccounts: (state) => {
        state.items = []
        state.selectedId = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
        // Auto-select first if none selected
        if (!state.selectedId && action.payload.length > 0) {
          state.selectedId = action.payload[0].id
        }
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createAccount.fulfilled, (state, action) => {
          state.items.push(action.payload);
          // Select the new account
          state.selectedId = action.payload.id;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
          state.items = state.items.filter(acc => acc.id !== action.payload);
          if (state.selectedId === action.payload) {
              state.selectedId = state.items.length > 0 ? state.items[0].id : null;
          }
      })
  },
})

export const { selectAccount, clearAccounts } = accountsSlice.actions
export default accountsSlice.reducer

