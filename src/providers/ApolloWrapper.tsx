'use client'

import { ApolloProvider } from '@apollo/client/react'
import { useMemo } from 'react'
import { makeClient } from '@/lib/apollo-client'

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  const client = useMemo(() => makeClient(), [])
  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
