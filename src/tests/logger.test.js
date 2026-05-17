import createLogger from '../logger.js';
import { UnexpectedLoggingLevelError } from '../errors.js';
import { jest, describe, test, beforeEach, afterEach, expect } from '@jest/globals';

describe('Logger Module', () => {
    let spyDebug, spyTrace, spyInfo, spyWarn, spyError;

    beforeEach(() => {
        spyInfo = jest.spyOn(console, 'info').mockImplementation(() => {});
        spyWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        spyError = jest.spyOn(console, 'error').mockImplementation(() => {});
        spyTrace = jest.spyOn(console, 'trace').mockImplementation(() => {});
        spyDebug = jest.spyOn(console, 'debug').mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('должен вызывать console.info для уровня INFO', () => {
        const logger = createLogger();
        logger('Привет', 'INFO');

        expect(spyInfo).toHaveBeenCalledTimes(1);
        expect(spyInfo.mock.calls[0][0]).toContain('Привет');
        expect(spyInfo.mock.calls[0][0]).toContain('INFO');
    });

    test('должен включать requestId в лог, если он передан', () => {
        const logger = createLogger();
        logger('Привет', 'INFO', '123');

        expect(spyInfo.mock.calls[0][0]).toContain('123');
    });

    test('должен выбрасывать UnexpectedLoggingLevelError при неверном уровне', () => {
        const logger = createLogger();

        expect(() => {
            logger('Привет', 'NOT_EXIST');
        }).toThrow(UnexpectedLoggingLevelError);
    });
});
