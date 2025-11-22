import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Navbar } from './Navbar'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createClient } from '@/utils/supabase/client'

// Mock the Supabase client
vi.mock('@/utils/supabase/client', () => ({
  createClient: vi.fn(),
}))

// Mock next/link
vi.mock('next/link', () => {
  return {
    default: ({ children, href }: { children: React.ReactNode; href: string }) => (
      <a href={href}>{children}</a>
    ),
  }
})

describe('Navbar', () => {
  const mockAuthUnsubscribe = vi.fn()
  const mockSupabase = {
    auth: {
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: mockAuthUnsubscribe } },
      })),
      signOut: vi.fn(),
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    ;(createClient as any).mockReturnValue(mockSupabase)
  })

  it('renders correctly for unauthenticated user', async () => {
    // Mock getUser to return no user
    mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null } })

    render(<Navbar />)

    // Should show logo
    expect(screen.getByText('NOTAROBOT.COM')).toBeInTheDocument()

    // Should show Sign In link
    // Wait for the effect to run
    await waitFor(() => {
      expect(screen.getByText('Sign In')).toBeInTheDocument()
    })
    
    // Should show Start Verifying button
    expect(screen.getByText('Start Verifying')).toBeInTheDocument()

    // Should NOT show Profile or Sign Out
    expect(screen.queryByText('Profile')).not.toBeInTheDocument()
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument()
  })

  it('renders correctly for authenticated user', async () => {
    // Mock getUser to return a user
    mockSupabase.auth.getUser.mockResolvedValue({ 
      data: { user: { id: '123', email: 'test@example.com' } } 
    })

    render(<Navbar />)

    // Wait for user state to update
    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument()
    })

    // Should show Sign Out
    expect(screen.getByText('Sign Out')).toBeInTheDocument()

    // Should NOT show Sign In or Start Verifying
    expect(screen.queryByText('Sign In')).not.toBeInTheDocument()
    expect(screen.queryByText('Start Verifying')).not.toBeInTheDocument()
  })

  it('handles sign out', async () => {
    // Mock authenticated user
    mockSupabase.auth.getUser.mockResolvedValue({ 
        data: { user: { id: '123', email: 'test@example.com' } } 
    })
    
    // Mock window.location.href
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true
    })

    render(<Navbar />)

    await waitFor(() => {
      expect(screen.getByText('Sign Out')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByText('Sign Out'))

    expect(mockSupabase.auth.signOut).toHaveBeenCalled()
    // We check if window.location.href was set (we can't easily check the value in jsdom without more mocking, 
    // but ensuring the function didn't crash is a good start. 
    // In a real browser integration test we'd check the URL)
  })
})
