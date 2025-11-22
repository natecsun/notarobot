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

const mockGroqCreate = vi.fn();
vi.mock('groq-sdk', () => {
  return {
    default: class {
      constructor() {
        this.chat = {
          completions: {
            create: mockGroqCreate,
          },
        };
      }
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

    mockSelect.mockReturnValue({
      eq: mockEq,
    });

    mockEq.mockReturnValue({
      single: mockSingle,
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

    mockSelect.mockReturnValue({
      eq: mockEq,
    });

    mockEq.mockReturnValue({
      single: mockSingle,
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
    mockPdfParse.mockResolvedValue({ text: 'Resume with leverage and synergy keywords. This text needs to be long enough to pass the minimum length check of 50 characters.' });
    mockGroqCreate.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            analysis: 'This resume contains robotic buzzwords.',
            rewritten_text: 'Resume with improved and natural keywords'
          })
        }
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
    expect(mockPdfParse).toHaveBeenCalled();
    expect(mockGroqCreate).toHaveBeenCalled();
    expect(mockRpc).toHaveBeenCalledWith('deduct_credits', {
      user_id: 'user-456',
      amount: 1
    });
  });

  it('should use correct Groq model and parameters', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-789' } },
      error: null
    });
    mockSingle.mockResolvedValue({
      data: { credits: 5 },
      error: null
    });
    mockPdfParse.mockResolvedValue({ text: 'Test resume content that is definitely longer than fifty characters to ensure it passes the validation check for scanned PDFs.' });
    mockGroqCreate.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            analysis: 'Analysis',
            rewritten_text: 'Improved'
          })
        }
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

    expect(mockGroqCreate).toHaveBeenCalled();
    const callArgs = mockGroqCreate.mock.calls[0][0];
    expect(callArgs.model).toBe('llama3-8b-8192');
    expect(callArgs.temperature).toBe(0.6);
    expect(callArgs.response_format).toEqual({ type: 'json_object' });
  });

  it('should handle PDF parsing errors', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-error' } },
      error: null
    });
    mockSingle.mockResolvedValue({
      data: { credits: 5 },
      error: null
    });
    mockPdfParse.mockRejectedValue(new Error('Invalid PDF format'));

    const file = createMockFile('resume.pdf', 1024, 'corrupt data');
    const mockFormData = {
      get: vi.fn().mockReturnValue(file)
    };
    const request = {
      formData: vi.fn().mockResolvedValue(mockFormData)
    } as unknown as Request;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to parse PDF file.');
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

  it('should reject scanned/empty PDFs', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-scanned' } },
      error: null
    });
    mockSingle.mockResolvedValue({ data: { credits: 5 }, error: null });
    mockPdfParse.mockResolvedValue({ text: '   Short text   ' }); // < 50 chars

    const file = createMockFile('resume.pdf', 1024, 'test pdf');
    const mockFormData = {
      get: vi.fn().mockReturnValue(file)
    };
    const request = {
      formData: vi.fn().mockResolvedValue(mockFormData)
    } as unknown as Request;

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toContain('Could not extract text');
  });

  it('should handle rate limit errors from Groq', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-rate' } },
      error: null
    });
    mockSingle.mockResolvedValue({
      data: { credits: 5 },
      error: null
    });
    mockPdfParse.mockResolvedValue({ text: 'Resume text that is definitely long enough to pass the validation check for this test case.' });

    const rateError: any = new Error('Rate limit exceeded');
    rateError.status = 429;
    mockGroqCreate.mockRejectedValue(rateError);

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

  it('should handle empty Groq response', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: { id: 'user-empty' } },
      error: null
    });
    mockSingle.mockResolvedValue({
      data: { credits: 5 },
      error: null
    });
    mockPdfParse.mockResolvedValue({ text: 'Resume text that is definitely long enough to pass the validation check for this test case.' });
    mockGroqCreate.mockResolvedValue({
      choices: [{
        message: {
          content: null
        }
      }]
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
