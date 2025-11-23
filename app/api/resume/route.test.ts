import { describe, it, expect, vi, beforeEach } from 'vitest';

// Polyfill DOM APIs required by pdf-parse
global.DOMMatrix = class DOMMatrix { } as any;
global.ImageData = class ImageData { } as any;
global.Path2D = class Path2D { } as any;

// Mock all dependencies BEFORE importing the route
const mockCreateClient = vi.fn();
const mockGetUser = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockRpc = vi.fn();
const mockGetCookie = vi.fn();
const mockSendTelegramAlert = vi.fn();

vi.mock('@/utils/supabase/server', () => ({
  createClient: () => mockCreateClient(),
}));

vi.mock('next/headers', () => ({
  cookies: vi.fn(() => ({
    get: mockGetCookie,
  })),
}));

const mockAnthropicCreate = vi.fn();
vi.mock('@anthropic-ai/sdk', () => {
  return {
    Anthropic: class {
      messages = {
        create: mockAnthropicCreate,
      };
    },
  };
});

const mockPdfParse = vi.fn();
vi.mock('pdf-parse', () => {
  return {
    default: mockPdfParse,
  };
});

vi.mock('@/lib/telegram', () => ({
  sendTelegramAlert: mockSendTelegramAlert,
}));

// Now import the route after all mocks and polyfills are set up
const { POST } = await import('@/app/api/resume/route');

// Helper to create a mock file
const createMockFile = (name: string, size: number, content: string) => ({
  name,
  size,
  arrayBuffer: vi.fn().mockResolvedValue(Buffer.from(content)),
});

describe('Resume API Route - Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Set up default mock implementations
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: mockGetUser,
      },
      from: vi.fn(() => ({
        select: mockSelect,
      })),
      rpc: mockRpc,
    });

    const mockUpdateChain = {
      eq: mockEq,
      single: mockSingle,
    };
    
    const mockUpdate = vi.fn().mockReturnValue(mockUpdateChain);

    mockSelect.mockReturnValue({
      eq: mockEq,
      single: mockSingle,
      update: mockUpdate,
    });

    mockEq.mockReturnValue({
      single: mockSingle,
      update: mockUpdate,
    });
  });

  it('should be defined', () => {
    expect(POST).toBeDefined();
  });

  it('should be a function', () => {
    expect(typeof POST).toBe('function');
  });

  describe('Access Control - Visitor Limits', () => {
    it('should reject visitor when usage count is 2', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
      mockGetCookie.mockReturnValue({ value: '2' });

      const file = createMockFile('resume.pdf', 1024, 'test pdf content');
      const mockFormData = {
        get: vi.fn().mockReturnValue(file)
      };
      const request = {
        formData: vi.fn().mockResolvedValue(mockFormData)
      } as unknown as Request;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toContain('Visitor limit reached');
    });

    it('should reject visitor when usage count exceeds 2', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
      mockGetCookie.mockReturnValue({ value: '5' });

      const file = createMockFile('resume.pdf', 1024, 'test pdf content');
      const mockFormData = {
        get: vi.fn().mockReturnValue(file)
      };
      const request = {
        formData: vi.fn().mockResolvedValue(mockFormData)
      } as unknown as Request;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toContain('Visitor limit reached');
    });
  });

  describe('Access Control - User Credits', () => {
    it('should reject user with zero credits', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null
      });
      mockSingle.mockResolvedValue({
        data: { credits: 0 },
        error: null
      });

      const file = createMockFile('resume.pdf', 1024, 'test pdf content');
      const mockFormData = {
        get: vi.fn().mockReturnValue(file)
      };
      const request = {
        formData: vi.fn().mockResolvedValue(mockFormData)
      } as unknown as Request;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toContain('Insufficient credits');
    });

    it('should reject user with no profile', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null
      });
      mockSingle.mockResolvedValue({
        data: null,
        error: null
      });

      const file = createMockFile('resume.pdf', 1024, 'test pdf content');
      const mockFormData = {
        get: vi.fn().mockReturnValue(file)
      };
      const request = {
        formData: vi.fn().mockResolvedValue(mockFormData)
      } as unknown as Request;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data.error).toContain('Insufficient credits');
    });
  });

  describe('File Upload Validation', () => {
    it('should reject request with no file', async () => {
      mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
      mockGetCookie.mockReturnValue({ value: '0' });

      // Mock request with empty form data (or null file)
      const mockFormData = {
        get: vi.fn().mockReturnValue(null)
      };
      const request = {
        formData: vi.fn().mockResolvedValue(mockFormData)
      } as unknown as Request;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('No file uploaded');
    });
  });

  describe('Error Handling', () => {
    it('should handle Supabase errors gracefully', async () => {
      mockGetUser.mockRejectedValue(new Error('Database connection error'));

      const request = {
        formData: vi.fn()
      } as unknown as Request;

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to process resume');
    });
  });
});

describe('Resume API Route - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockCreateClient.mockReturnValue({
      auth: {
        getUser: mockGetUser,
      },
      from: vi.fn(() => ({
        select: mockSelect,
      })),
      rpc: mockRpc,
    });

    const mockUpdateChain = {
      eq: mockEq,
      single: mockSingle,
    };
    
    const mockUpdate = vi.fn().mockReturnValue(mockUpdateChain);

    mockSelect.mockReturnValue({
      eq: mockEq,
      single: mockSingle,
      update: mockUpdate,
    });

    mockEq.mockReturnValue({
      single: mockSingle,
      update: mockUpdate,
    });
  });

  it('should process resume for authenticated user with credits', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-456' } },
      error: null
    });
    mockSingle.mockResolvedValue({
      data: { credits: 10 },
      error: null
    });
    mockAnthropicCreate.mockResolvedValue({
      content: [{
        type: 'text',
        text: JSON.stringify({
          analysis: 'This resume contains robotic buzzwords.',
          rewritten_text: 'Resume with improved and natural keywords'
        })
      }]
    });
    mockRpc.mockResolvedValue({ data: true, error: null });

    const file = createMockFile('resume.pdf', 1024, 'test pdf content');
    const mockFormData = {
      get: vi.fn().mockReturnValue(file)
    };
    const request = {
      formData: vi.fn().mockResolvedValue(mockFormData)
    } as unknown as Request;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('analysis');
    expect(data).toHaveProperty('rewritten_text');
    expect(mockAnthropicCreate).toHaveBeenCalled();
    expect(mockRpc).toHaveBeenCalledWith('deduct_credits', {
      user_id: 'user-456',
      amount: 1
    });
  });

  it('should use correct Anthropic model and parameters', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-789' } },
      error: null
    });
    mockSingle.mockResolvedValue({
      data: { credits: 5 },
      error: null
    });
    mockAnthropicCreate.mockResolvedValue({
      content: [{
        type: 'text',
        text: JSON.stringify({
          analysis: 'Analysis',
          rewritten_text: 'Improved'
        })
      }]
    });
    mockRpc.mockResolvedValue({ data: true, error: null });

    const file = createMockFile('resume.pdf', 1024, 'test pdf');
    const mockFormData = {
      get: vi.fn().mockReturnValue(file)
    };
    const request = {
      formData: vi.fn().mockResolvedValue(mockFormData)
    } as unknown as Request;

    await POST(request);

    expect(mockAnthropicCreate).toHaveBeenCalled();
    const callArgs = mockAnthropicCreate.mock.calls[0][0];
    expect(callArgs.model).toBe('claude-haiku-4-5-20251001');
    expect(callArgs.max_tokens).toBe(4096);
  });

  it('should reject files larger than 5MB', async () => {
    mockGetUser.mockResolvedValue({ data: { user: null }, error: null });
    mockGetCookie.mockReturnValue({ value: '0' });

    // Mock a large file
    const file = createMockFile('large.pdf', 6 * 1024 * 1024, 'large content');

    const mockFormData = {
      get: vi.fn().mockReturnValue(file)
    };
    const request = {
      formData: vi.fn().mockResolvedValue(mockFormData)
    } as unknown as Request;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('exceeds 5MB limit');
  });

  it('should handle rate limit errors from Anthropic', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-rate' } },
      error: null
    });
    mockSingle.mockResolvedValue({
      data: { credits: 5 },
      error: null
    });

    const rateError: any = new Error('Rate limit exceeded');
    rateError.status = 429;
    mockAnthropicCreate.mockRejectedValue(rateError);

    const file = createMockFile('resume.pdf', 1024, 'test pdf');
    const mockFormData = {
      get: vi.fn().mockReturnValue(file)
    };
    const request = {
      formData: vi.fn().mockResolvedValue(mockFormData)
    } as unknown as Request;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toContain('under heavy load');
    expect(mockSendTelegramAlert).toHaveBeenCalledWith('CRITICAL: Resume API Rate Limit Hit!');
  });

  it('should handle empty Anthropic response', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-empty' } },
      error: null
    });
    mockSingle.mockResolvedValue({
      data: { credits: 5 },
      error: null
    });
    mockAnthropicCreate.mockResolvedValue({
      content: [] // Empty content
    });

    const file = createMockFile('resume.pdf', 1024, 'test pdf');
    const mockFormData = {
      get: vi.fn().mockReturnValue(file)
    };
    const request = {
      formData: vi.fn().mockResolvedValue(mockFormData)
    } as unknown as Request;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to process resume');
  });
});
