from fastapi import APIRouter
from controllers.UserController import *


router= APIRouter()

# router object
@router.get("/user/")
async def get_users():
    return await getAllUser()

@router.post("/users/")
async def add_users(user:User):
    return await addUser(user)

@router.delete("/users/{userId}")
async def del_user(userId:str):
    return await delUser(userId)

@router.get("/users/{userId}")
async def get_user(userId:str):
    return await getUser(userId)



