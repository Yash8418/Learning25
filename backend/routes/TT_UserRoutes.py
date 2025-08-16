from fastapi import APIRouter
from controllers.TT_UserController import *

router= APIRouter()

# TimeTracker Routes
@router.post("/register/")
async def register_user(user:UserSignup):
    return await addUser(user)

@router.post("/login/")
async def login_user(user: UserLogin):
    return await getUser(user)
    # return {"username": user.username, "role": timetracker_user_collection[user.username]["role"]}

@router.get("/getAllUser/")
async def get_all_user():
    return await getAllUser()

# @app.post("/login")
# async def login(user: LoginRequest):
#     if user.username in users_db and users_db[user.username]["password"] == user.password:
#         return {"username": user.username, "role": users_db[user.username]["role"]}
#     raise HTTPException(status_code=401, detail="Invalid credentials")