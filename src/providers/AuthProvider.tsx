'use client'

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react'
import { useMutation, useApolloClient } from '@apollo/client/react'
import { useRouter } from 'next/navigation'
import { LOGIN_MUTATION, SIGNUP_MUTATION } from '@/lib/graphql/mutations'
import { ME_QUERY } from '@/lib/graphql/queries'

interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  avatar: string
}

interface AuthContextType {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<string | null>
  signup: (name: string, email: string, password: string) => Promise<string | null>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

function isAbortError(err: unknown): boolean {
  return (
    (err instanceof DOMException && err.name === 'AbortError') ||
    (err instanceof Error && err.message === 'The operation was aborted.') ||
    (err instanceof Error && err.name === 'AbortError')
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const mountedRef = useRef(true)
  const router = useRouter()
  const client = useApolloClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [loginMutation] = useMutation<any>(LOGIN_MUTATION)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [signupMutation] = useMutation<any>(SIGNUP_MUTATION)

  // Track mounted state to prevent state updates after unmount
  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  // Validate existing token on mount
  useEffect(() => {
    const controller = new AbortController()

    const stored = localStorage.getItem('token')
    if (!stored) {
      setIsLoading(false)
      return
    }
    setToken(stored)

    client
      .query<{ me: AuthUser | null }>({
        query: ME_QUERY,
        fetchPolicy: 'network-only',
        context: { fetchOptions: { signal: controller.signal } },
      })
      .then(({ data }) => {
        if (!mountedRef.current) return
        if (data?.me) {
          setUser(data.me)
        } else {
          localStorage.removeItem('token')
          setToken(null)
        }
      })
      .catch((err) => {
        if (isAbortError(err) || !mountedRef.current) return
        localStorage.removeItem('token')
        setToken(null)
      })
      .finally(() => {
        if (mountedRef.current) setIsLoading(false)
      })

    return () => { controller.abort() }
  }, [client])

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    try {
      const { data } = await loginMutation({ variables: { email, password } })
      const result = data?.login
      if (!result) return 'Login failed'

      localStorage.setItem('token', result.token)
      if (mountedRef.current) {
        setToken(result.token)
        setUser(result.user)
      }

      if (result.user.role === 'ADMIN') {
        router.push('/admin/dashboard')
      } else {
        router.push('/dashboard')
      }
      return null
    } catch (err: unknown) {
      if (isAbortError(err)) return null
      const message = err instanceof Error ? err.message : 'Login failed'
      return message.replace('ApolloError: ', '')
    }
  }, [loginMutation, router])

  const signup = useCallback(async (name: string, email: string, password: string): Promise<string | null> => {
    try {
      const { data } = await signupMutation({ variables: { name, email, password } })
      const result = data?.signup
      if (!result) return 'Signup failed'

      localStorage.setItem('token', result.token)
      if (mountedRef.current) {
        setToken(result.token)
        setUser(result.user)
      }
      // New signups go to welcome page for skill assessment
      router.push('/welcome')
      return null
    } catch (err: unknown) {
      if (isAbortError(err)) return null
      const message = err instanceof Error ? err.message : 'Signup failed'
      return message.replace('ApolloError: ', '')
    }
  }, [signupMutation, router])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    // Use clearStore instead of resetStore to avoid refetching active queries (which causes AbortErrors)
    client.clearStore()
    router.push('/login')
  }, [client, router])

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider')
  return ctx
}
