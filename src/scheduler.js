import createLogger from './logger.js';

const logger = createLogger();
logger("scheduler запустился");

function scheduleTask(name, interval, task) {
    return setInterval(() => {
        logger(`${name} сработал`);
        task();
    }, interval);
}

const runningInterval = 10000

scheduleTask("run-task", runningInterval, () => {
    logger("running");
});

export default scheduleTask;