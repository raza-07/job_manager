import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import accountsReducer from './features/accounts/accountsSlice'
import jobsReducer from './features/jobs/jobsSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      accounts: accountsReducer,
      jobs: jobsReducer,
    },
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']


