class TaskScheduler {
    constructor() {
        this.tasks = []
    }

    async addTask(task, interval) {
        const taskId = setInterval(async () => {

            try {
                await task()
                console.log(`Задача с именем ${task.name} выполнена`)
            } catch (error) {
                console.log("Ошибка в фоновом обновлении :", error.message, error.statusCode)
            }
        }, interval)

        this.tasks.push(taskId)
    }

    async clearTasks() {
        for (const taskId of this.tasks) {
            clearInterval(taskId)
        }
    }
}

export default TaskScheduler