import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock ResizeObserver as a class
class ResizeObserver {
  observe() {
    // do nothing
  }

  unobserve() {
    // do nothing
  }

  disconnect() {
    // do nothing
  }
}

window.ResizeObserver = ResizeObserver
