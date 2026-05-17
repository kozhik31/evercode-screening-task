import config from './config.js';

function createLogger() {
    const appName = config.appName;

    return function consoleLogger(message) {
        const date = new Date().toISOString();
        console.log(`${appName} ${date} ${message}`);
    };
}

export default createLogger;