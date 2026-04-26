import config from './config.js';

function createLogger() {
    return function consoleLogger(message) {
        const appName = config.appName;
        const date = Date.now();
        console.log(`${appName} ${date} ${message}`);
    };
}

export default createLogger;