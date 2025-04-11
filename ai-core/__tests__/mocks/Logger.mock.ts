import { jest } from '@jest/globals';

export const mockLogger = {
  info: jest.fn(),
  error: jest.fn()
};

describe('Logger Mock', () => {
  test('should have mock methods', () => {
    expect(mockLogger.info).toBeDefined();
    expect(mockLogger.error).toBeDefined();
  });
});
