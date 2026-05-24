import config from './config.js';
import {UnexpectedLoggingLevelError} from "./errors.js";

function createLogger() {
    const appName = config.appName;

    return function consoleLogger(message, level, requestId = null) {
        const date = new Date().toISOString();
        const requestPart = requestId ? ` ${requestId}` : ``
        const logMessage = `${appName} ${date} ${level}${requestPart} ${message}`

        switch (level) {
            case "ERROR": {
                console.error(logMessage)
                break
            }
            case "WARN": {
                console.warn(logMessage)
                break
            }
            case "INFO": {
                console.info(logMessage)
                break
            }
            case "DEBUG": {
                console.debug(logMessage)
                break
            }
            case "TRACE": {
                console.trace(logMessage)
                break
            }
            default: {
                throw new UnexpectedLoggingLevelError(`не существует уровня: ${level}`)
            }
        }
    };
}

export default createLogger;