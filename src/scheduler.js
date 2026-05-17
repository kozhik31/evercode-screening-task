import createLogger from './logger.js';

const logger = createLogger();
logger("scheduler запустился");

function scheduleTask(name, interval, task) {
    logger(`Задача ${name} запланирована`)

    return setInterval(() => {
        task();
    }, interval);
}

export default scheduleTask;