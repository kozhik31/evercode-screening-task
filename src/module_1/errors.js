export class UnexpectedLoggingLevelError extends Error {
    constructor(message) {
        const ts = Date.now()
        const status_code = 500
        super(`message: ${message} | status code: ${status_code} | timestamp: ${ts}`);
    }
}
