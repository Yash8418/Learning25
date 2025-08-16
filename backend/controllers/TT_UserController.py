from models.TT_RoleModel import UserSignup,UserLogin,UserOut
from config.TT_Db import timetracker_user_collection
from bson import ObjectId

async def addUser(user:UserSignup):
    result = await timetracker_user_collection.insert_one(user.dict())
    return {"Message":"User added successfully"}

# async def getUser(username:str,password:str):
#     result = await timetracker_user_collection.find_one({"username":username,"password":password})
#     print("result.....",result)
#     if result is None:
#         return {"Message":"User NOT found"}
#     return {"Message":"User FOUND successfully"}

async def getUser(request: UserLogin):
    # username = request.username
    # password = request.password
    result = await timetracker_user_collection.find_one({"email": request.username_or_email})
    result["_id"] = str(result["_id"])
    # print("result.....", result)
    # print("result.....id....", result["_id"])
    # print("result.....role....", result.get("role"))
    if result is None:
        return {"Message": "User NOT found"}

    # Check if password matches
    stored_password = result.get("password")
    if stored_password != request.password:
        return {"Message": "Invalid password"}

    return {
        "Message": "User FOUND successfully",
        "role":(UserOut(**result)) # Return role
        
    }

async def getAllUser():
    users = await timetracker_user_collection.find().to_list()
    # print(users)
    return [UserOut(**user) for user in users]