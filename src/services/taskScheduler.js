class TaskScheduler {
    constructor() {
        this.tasks = []
    }

    async addTask(task, interval) {
        const taskId = setInterval(async () => {
            await task()
            console.log(`Задача с именем ${task.name} выполнена`)
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