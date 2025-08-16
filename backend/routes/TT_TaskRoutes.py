from fastapi import APIRouter
from models.TT_TaskModel import Task,TaskOut, TaskUpdate
from controllers.TT_TaskController import addTask,getTask, getAllTasksByDeveloperId, startTask, stopTask, completeTask, updateTask

router=APIRouter()
@router.post("/addTask")
async def add_task(task:Task):
    return await addTask(task)
@router.get("/getTask")
async def get_task():
    return await getTask()
@router.get("/getAllTasksByDeveloperId/{developerId}")
async def get_all_tasks_by_developerId(developerId: str):
    return await getAllTasksByDeveloperId(developerId)
@router.put("/startTask/{taskId}")
async def start_task(taskId: str):
    return await startTask(taskId)

@router.put("/stopTask/{taskId}")
async def stop_task(taskId: str):
    return await stopTask(taskId)

@router.put("/completeTask/{taskId}")
async def complete_task(taskId: str):
    return await completeTask(taskId)

@router.patch("/updateTask/{taskId}")
async def update_task(taskId: str, task: TaskUpdate):
    return await updateTask(taskId, task)