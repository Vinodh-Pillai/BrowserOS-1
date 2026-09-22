/**
 * No-op Sentry module. Sentry error reporting has been removed for local-deployment hardening.
 * All public methods are stubbed so existing callers compile without changes.
 */

function noOp(): void {
  // no-op
}

const Sentry = {
  init: noOp,
  setUser: noOp,
  setContext: noOp,
  setTag: noOp,
  captureException: noOp,
  withScope: (_: () => void) => {},
  getCurrentScope: () => ({
    setTag: noOp,
    setContext: noOp,
    setUser: noOp,
  }),
}

export { Sentry }
