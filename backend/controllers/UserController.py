from config.database import user_collection
from models.RoleModel import User,UserOut
from bson import ObjectId


async def getAllUser():
    users=await user_collection.find().to_list(length=None)
    return [UserOut(**user) for user in users]

async def addUser(user:User):
    result = await user_collection.insert_one(user.dict())
    return {"Message":"User added successfully"}

async def delUser(userId:str):
    result = await user_collection.delete_one({"_id":ObjectId(userId)})
    return {"Message":"User deleterd successfully"}

async def getUser(userId:str):
    result = await user_collection.find_one({"_id":ObjectId(userId)})
    return UserOut(**result)



# from config.database import user_collection
# from models.RoleModel import User,UserOut
# from bson import ObjectId
# from fastapi.responses import JSONResponse



# async def getAllUser():
#     users=await user_collection.find().to_list(length=None)
#     return [UserOut(**user) for user in users]

# async def addUser(user:User):
#     user.role_id = ObjectId(user.role_id)
#     print("after type cast",user.role_id)
#     result = await user_collection.insert_one(user.dict())
#     # return {"Message":"User added successfully"}
#     return JSONResponse(status_code=201,content={"message":"User created successfully"})


# async def delUser(userId:str):
#     result = await user_collection.delete_one({"_id":ObjectId(userId)})
#     return {"Message":"User deleterd successfully"}

# async def getUser(userId:str):
#     users = await user_collection.find().to_list(length=None)

#     for user in users:
#         # Convert role_id from ObjectId to str before validation
#         if "role_id" in user and isinstance(user["role_id"], ObjectId):
#             user["role_id"] = str(user["role_id"])
#     role = await user_collection.find_one({"_id":ObjectId(userId)})
#     if role:
#             role["_id"] = str(role["_id"])  # Convert role _id to string
#             user["role"] = role
#     return UserOut(**User)

#     # result = await user_collection.find_one({"_id":ObjectId(userId)})
#     # return UserOut(**result)