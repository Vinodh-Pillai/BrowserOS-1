/**
 * @license
 * Copyright 2025 BrowserOS
 * SPDX-License-Identifier: AGPL-3.0-or-later
 *
 * Build-time inlined environment variables.
 *
 * IMPORTANT: Values here are replaced at build time by Bun's `--env inline` flag.
 * The `process.env.X` access MUST be direct (not via a variable) for inlining to work.
 *
 * These variables are:
 * - Replaced with literal strings in production builds
 * - Read from actual env vars during development
 *
 * For runtime-only env vars (like BROWSEROS_CDP_PORT), use process.env directly.
 */

export const INLINED_ENV = {} as const

export const REQUIRED_FOR_PRODUCTION =
  [] as const satisfies readonly (keyof typeof INLINED_ENV)[]
