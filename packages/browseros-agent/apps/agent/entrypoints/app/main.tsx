import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/styles/global.css'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { Toaster } from '@/components/ui/sonner'
import { AnalyticsProvider } from '@/lib/analytics/AnalyticsProvider.tsx'
import { AuthProvider } from '@/lib/auth/AuthProvider'
import { QueryProvider } from '@/lib/graphql/QueryProvider'
import { App } from './App'

const $root = document.getElementById('root')

if ($root) {
  ReactDOM.createRoot($root).render(
    <React.StrictMode>
      <AuthProvider>
        <QueryProvider>
          <AnalyticsProvider>
            <ThemeProvider>
              <App />
              <Toaster />
            </ThemeProvider>
          </AnalyticsProvider>
        </QueryProvider>
      </AuthProvider>
    </React.StrictMode>,
  )
}
