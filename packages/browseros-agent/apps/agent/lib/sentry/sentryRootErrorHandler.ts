import type ReactDOM from 'react-dom/client'

/**
 * No-op root error handler. Sentry has been removed.
 * Still logs to console for debugging purposes.
 *
 * @public
 */
export const sentryRootErrorHandler: ReactDOM.RootOptions = {
  onUncaughtError: (error, errorInfo) => {
    // biome-ignore lint/suspicious/noConsole: must log to console for debugging purposes
    console.error(error, errorInfo.componentStack)
  },
  onCaughtError: () => {},
  onRecoverableError: () => {},
}
