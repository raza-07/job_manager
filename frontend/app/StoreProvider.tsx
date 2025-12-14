'use client'

import { useRef, useEffect } from 'react'
import { Provider } from 'react-redux'
import { makeStore, AppStore } from '../lib/store'
import { initializeAuth, getMe } from '../lib/features/auth/authSlice'
import { useAppDispatch } from '../lib/hooks'

function AuthInitializer() {
    const dispatch = useAppDispatch()

    useEffect(() => {
        // Initialize auth state
        dispatch(initializeAuth())
        
        // If we have a token, fetch the user
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
        if (token) {
            dispatch(getMe())
        }
    }, [dispatch])

    return null
}

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore>()
  if (!storeRef.current) {
    storeRef.current = makeStore()
  }

  return (
    <Provider store={storeRef.current}>
        <AuthInitializer />
        {children}
    </Provider>
  )
}
