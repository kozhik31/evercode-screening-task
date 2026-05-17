import scheduleTask from "./scheduler.js";
import createLogger from "./logger.js";

const logger = createLogger()
const runningInterval = 10000

scheduleTask("run-task", runningInterval, () => {
    logger("running")
});