import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { api } from '@/lib/api-client'
import { Job } from '@/types'

export interface JobsState {
  items: Job[]
  isLoading: boolean
  error: string | null
}

const initialState: JobsState = {
  items: [],
  isLoading: false,
  error: null,
}

// Helper to get selected account from state if needed, but thunk args are better
export const fetchJobs = createAsyncThunk('jobs/fetchAll', async (accountId: number, thunkAPI) => {
  try {
    return await api.getJobs(accountId)
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const createJob = createAsyncThunk(
  'jobs/create',
  async ({ accountId, job }: { accountId: number; job: any }, thunkAPI) => {
    try {
      const response = await api.createJob(accountId, job)
      return response
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

export const updateJob = createAsyncThunk(
    'jobs/update',
    async ({ accountId, jobId, job }: { accountId: number; jobId: number; job: any }, thunkAPI) => {
        try {
            const response = await api.updateJob(accountId, jobId, job)
            return response
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const deleteJob = createAsyncThunk(
    'jobs/delete',
    async ({ accountId, jobId }: { accountId: number; jobId: number }, thunkAPI) => {
        try {
            await api.deleteJob(accountId, jobId)
            return jobId
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.message)
        }
    }
)

export const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
      clearJobs: (state) => {
          state.items = []
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.items.findIndex(job => job.id === action.payload.id)
        if (index !== -1) {
            state.items[index] = action.payload
        }
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
          state.items = state.items.filter(job => job.id !== action.payload)
      })
  },
})

export const { clearJobs } = jobsSlice.actions
export default jobsSlice.reducer

