import { Logger } from '../../utils/Logger';
import winston from 'winston';

jest.mock('winston', () => ({
  createLogger: jest.fn().mockReturnValue({
    info: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    warn: jest.fn(),
    add: jest.fn()
  }),
  format: {
    timestamp: jest.fn(),
    json: jest.fn(),
    simple: jest.fn(),
    combine: jest.fn()
  },
  transports: {
    File: jest.fn(),
    Console: jest.fn()
  }
}));

describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    logger = new Logger('test-service');
  });

  test('should log info messages', () => {
    const message = 'test info message';
    const meta = { key: 'value' };

    logger.info(message, meta);

    expect(winston.createLogger().info).toHaveBeenCalledWith(message, meta);
  });

  test('should log error messages', () => {
    const message = 'test error message';
    const meta = { error: new Error('test') };

    logger.error(message, meta);

    expect(winston.createLogger().error).toHaveBeenCalledWith(message, meta);
  });
});