from fastapi import APIRouter
from models.TT_UserTask import UserTask,UserTaskOut
from controllers.TT_UserTaskController import addUserTask,getUserTask

router=APIRouter()
@router.post("/addUserTask")
async def add_user_task(user_task:UserTask):
    return await addUserTask(user_task)
@router.get("/getUserTask")
async def get_user_task():
    return await getUserTask()