import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock environment variables
process.env.STRIPE_SECRET_KEY = 'sk_test_123'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_123'
process.env.ANTHROPIC_API_KEY = 'sk-ant-test_123'
process.env.GROQ_API_KEY = 'gsk_test_123'
process.env.GROQ_API_KEY_PAID = 'gsk_paid_test_123'
process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000'

// Mock Next.js headers
vi.mock('next/headers', () => ({
  headers: vi.fn(() => ({
    get: vi.fn((key: string) => {
      if (key === 'stripe-signature') return 'test-signature'
      return null
    })
  })),
  cookies: vi.fn(() => ({
    get: vi.fn(() => ({ value: '0' })),
    set: vi.fn()
  }))
}))

// Mock Stripe
vi.mock('@/utils/stripe', () => ({
  stripe: {
    checkout: {
      sessions: {
        create: vi.fn()
      }
    },
    webhooks: {
      constructEvent: vi.fn()
    }
  }
}))

// Mock Anthropic with proper named export
vi.mock('@anthropic-ai/sdk', () => ({
  Anthropic: vi.fn().mockImplementation(() => ({
    messages: {
      create: vi.fn()
    }
  }))
}))

// Mock Groq
vi.mock('groq-sdk', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn()
      }
    }
  }))
}))

// Mock Supabase
vi.mock('@/utils/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      insert: vi.fn(),
      update: vi.fn(() => ({
        eq: vi.fn()
      }))
    })),
    rpc: vi.fn()
  }))
}))

vi.mock('@/utils/supabase/admin', () => ({
  createAdminClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      insert: vi.fn(),
      update: vi.fn(() => ({
        eq: vi.fn()
      }))
    })),
    rpc: vi.fn()
  }))
}))

// Mock Telegram
vi.mock('@/lib/telegram', () => ({
  sendTelegramAlert: vi.fn()
}))
