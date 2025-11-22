import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { createClient } from '@/utils/supabase/server';

// Mock dependencies
vi.mock('@/utils/supabase/server');

const mockCreateClient = vi.mocked(createClient);

describe('Checkout API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 for unauthorized users', async () => {
    // Mock unauthorized user
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null } })
      }
    } as any);

    const request = new Request('http://localhost:3000/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ type: 'credits', credits: 100 }),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST(request);
    expect(response.status).toBe(401);
    
    const data = await response.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('should create a credit purchase checkout session', async () => {
    // Mock authenticated user
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } })
      }
    } as any);

    // Mock Stripe checkout session
    const { stripe } = await import('@/utils/stripe');
    const mockSession = { url: 'https://checkout.stripe.com/session' };
    (stripe.checkout.sessions.create as any).mockResolvedValue(mockSession);

    const request = new Request('http://localhost:3000/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ type: 'credits', credits: 100 }),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.url).toBe('https://checkout.stripe.com/session');
    
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: expect.arrayContaining([
          expect.objectContaining({
            price_data: expect.objectContaining({
              unit_amount: 999,
              currency: 'usd'
            })
          })
        ]),
        customer_email: 'test@example.com',
        metadata: expect.objectContaining({
          userId: 'user-123',
          type: 'credits',
          credits: '100'
        })
      })
    );
  });

  it('should create a subscription checkout session', async () => {
    // Mock authenticated user
    const mockUser = { id: 'user-123', email: 'test@example.com' };
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: mockUser } })
      }
    } as any);

    // Mock Stripe checkout session
    const { stripe } = await import('@/utils/stripe');
    const mockSession = { url: 'https://checkout.stripe.com/session' };
    (stripe.checkout.sessions.create as any).mockResolvedValue(mockSession);

    const request = new Request('http://localhost:3000/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ type: 'subscription', planId: 'pro' }),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    
    const data = await response.json();
    expect(data.url).toBe('https://checkout.stripe.com/session');
    
    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        payment_method_types: ['card'],
        mode: 'subscription',
        customer_email: 'test@example.com',
        metadata: expect.objectContaining({
          userId: 'user-123',
          type: 'subscription',
          plan: 'pro'
        })
      })
    );
  });

  it('should return 400 for invalid checkout type', async () => {
    // Mock authenticated user
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } })
      }
    } as any);

    const request = new Request('http://localhost:3000/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ type: 'invalid' }),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.error).toBe('Invalid checkout type');
  });

  it('should return 400 for invalid credit package', async () => {
    // Mock authenticated user
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-123' } } })
      }
    } as any);

    const request = new Request('http://localhost:3000/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ type: 'credits', credits: 999 }),
      headers: { 'Content-Type': 'application/json' }
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.error).toBe('Invalid credit package');
  });
});
