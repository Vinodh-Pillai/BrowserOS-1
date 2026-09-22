// Analytics removed for local deployment hardening.

const noop = () => {}

export const posthog = {
  init: noop,
  identify: noop,
  reset: noop,
  capture: noop,
  register: noop,
}
