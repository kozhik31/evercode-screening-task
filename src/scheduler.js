import createLogger from './logger.js';

const logger = createLogger();
logger("scheduler запустился", "INFO");

function scheduleTask(name, interval, task) {
    logger(`Задача ${name} запланирована`, "INFO")

    return setInterval(() => {
        task();
    }, interval);
}

export default scheduleTask;