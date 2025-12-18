import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { api } from '@/lib/api-client'

// Define a type for the slice state
export interface AuthState {
  user: { id: number; name: string; email: string } | null
  token: string | null
  isLoading: boolean
  isInitialized: boolean
  error: string | null
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null, // We'll initialize this in an effect or App wrapper
  isLoading: false,
  isInitialized: false,
  error: null,
}

// Thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, pass }: { email: string; pass: string }, thunkAPI) => {
    try {
      const response = await api.login(email, pass)
      return response
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, pass }: { name: string; email: string; pass: string }, thunkAPI) => {
    try {
      const response = await api.register(name, email, pass)
      return response
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
  try {
    const response = await api.getMe()
    return response
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

// Slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isInitialized = true
      localStorage.removeItem('auth_token')
    },
    initializeAuth: (state) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        if (token) {
            state.token = token;
            state.isLoading = true; // Will trigger getMe
        } else {
            state.isInitialized = true;
        }
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.token = action.payload.access_token
        state.user = action.payload.user
        state.isInitialized = true
        localStorage.setItem('auth_token', action.payload.access_token)
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false
        // Registration successful, but we don't auto-login as per rules
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

    // Get Me
    builder
      .addCase(getMe.pending, (state) => {
        // Only set loading if not already initialized or if we want a spinner
        // state.isLoading = true
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
        state.isInitialized = true
      })
      .addCase(getMe.rejected, (state) => {
        state.isLoading = false
        state.user = null
        state.token = null
        state.isInitialized = true
        localStorage.removeItem('auth_token')
      })
  },
})

export const { logout, initializeAuth } = authSlice.actions
export default authSlice.reducer





