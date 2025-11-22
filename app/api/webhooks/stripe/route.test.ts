import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { createAdminClient } from '@/utils/supabase/admin';

// Mock dependencies
vi.mock('@/utils/supabase/admin');

const mockCreateAdminClient = vi.mocked(createAdminClient);

describe('Stripe Webhook Handler', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle checkout.session.completed for credits', async () => {
    // Mock Supabase admin client
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      insert: vi.fn().mockResolvedValue({ error: null }),
      rpc: vi.fn().mockResolvedValue({ error: null })
    };
    mockCreateAdminClient.mockReturnValue(mockSupabase as any);

    // Mock Stripe webhook verification
    const { stripe } = await import('@/utils/stripe');
    (stripe.webhooks.constructEvent as any).mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          metadata: {
            userId: 'user-123',
            type: 'credits',
            credits: '100',
            amount: '9.99'
          },
          payment_intent: 'pi_123'
        }
      }
    });

    const request = new Request('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'stripe-signature': 'test-signature'
      }
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    
    // Verify credit purchase was recorded
    expect(mockSupabase.from).toHaveBeenCalledWith('credit_purchases');
    expect(mockSupabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-123',
        stripe_payment_intent_id: 'pi_123',
        credits_purchased: 100,
        amount_paid: 9.99,
        status: 'completed'
      })
    );

    // Verify credits were added
    expect(mockSupabase.rpc).toHaveBeenCalledWith('add_credits', {
      user_id: 'user-123',
      amount: 100
    });
  });

  it('should handle checkout.session.completed for subscriptions', async () => {
    // Mock Supabase admin client
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      insert: vi.fn().mockResolvedValue({ error: null }),
      update: vi.fn().mockResolvedValue({ error: null }),
      rpc: vi.fn().mockResolvedValue({ error: null })
    };
    mockCreateAdminClient.mockReturnValue(mockSupabase as any);

    // Mock Stripe webhook verification
    const { stripe } = await import('@/utils/stripe');
    (stripe.webhooks.constructEvent as any).mockReturnValue({
      type: 'checkout.session.completed',
      data: {
        object: {
          metadata: {
            userId: 'user-123',
            type: 'subscription',
            plan: 'pro'
          },
          subscription: 'sub_123',
          customer: 'cus_123'
        }
      }
    });

    const request = new Request('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'stripe-signature': 'test-signature'
      }
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    
    // Verify subscription was created
    expect(mockSupabase.from).toHaveBeenCalledWith('subscriptions');
    expect(mockSupabase.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: 'user-123',
        stripe_customer_id: 'cus_123',
        stripe_subscription_id: 'sub_123',
        plan_type: 'pro',
        status: 'active'
      })
    );

    // Verify profile was updated
    expect(mockSupabase.update).toHaveBeenCalledWith(
      expect.objectContaining({
        stripe_customer_id: 'cus_123',
        subscription_status: 'active',
        plan_type: 'pro'
      })
    );

    // Verify initial credits were added
    expect(mockSupabase.rpc).toHaveBeenCalledWith('add_credits', {
      user_id: 'user-123',
      amount: 1000
    });
  });

  it('should handle invoice.payment_succeeded', async () => {
    // Mock Supabase admin client
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({
        data: {
          user_id: 'user-123',
          plan_type: 'pro'
        }
      }),
      update: vi.fn().mockResolvedValue({ error: null }),
      rpc: vi.fn().mockResolvedValue({ error: null })
    };
    mockCreateAdminClient.mockReturnValue(mockSupabase as any);

    // Mock Stripe webhook verification
    const { stripe } = await import('@/utils/stripe');
    (stripe.webhooks.constructEvent as any).mockReturnValue({
      type: 'invoice.payment_succeeded',
      data: {
        object: {
          subscription: 'sub_123',
          period_end: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60
        }
      }
    });

    const request = new Request('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'stripe-signature': 'test-signature'
      }
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    
    // Verify monthly credits were added
    expect(mockSupabase.rpc).toHaveBeenCalledWith('add_credits', {
      user_id: 'user-123',
      amount: 1000
    });

    // Verify subscription was updated
    expect(mockSupabase.update).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'active'
      })
    );
  });

  it('should handle customer.subscription.deleted', async () => {
    // Mock Supabase admin client
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockResolvedValue({
        data: {
          user_id: 'user-123'
        }
      }),
      update: vi.fn().mockResolvedValue({ error: null })
    };
    mockCreateAdminClient.mockReturnValue(mockSupabase as any);

    // Mock Stripe webhook verification
    const { stripe } = await import('@/utils/stripe');
    (stripe.webhooks.constructEvent as any).mockReturnValue({
      type: 'customer.subscription.deleted',
      data: {
        object: {
          id: 'sub_123'
        }
      }
    });

    const request = new Request('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'stripe-signature': 'test-signature'
      }
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    
    // Verify subscription was marked as canceled
    expect(mockSupabase.update).toHaveBeenCalledWith({ status: 'canceled' });

    // Verify profile was updated
    expect(mockSupabase.update).toHaveBeenCalledWith(
      expect.objectContaining({
        subscription_status: 'canceled',
        plan_type: 'free'
      })
    );
  });

  it('should return 400 for invalid webhook signature', async () => {
    const { stripe } = await import('@/utils/stripe');
    (stripe.webhooks.constructEvent as any).mockImplementation(() => {
      throw new Error('Invalid signature');
    });

    const request = new Request('http://localhost:3000/api/webhooks/stripe', {
      method: 'POST',
      body: JSON.stringify({}),
      headers: {
        'stripe-signature': 'invalid-signature'
      }
    });

    const response = await POST(request);
    expect(response.status).toBe(400);
    
    const data = await response.json();
    expect(data.error).toBe('Invalid signature');
  });
});
