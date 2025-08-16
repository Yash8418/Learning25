from models.TT_Project import Project,ProjectOut,ProjectPartialUpdate
from bson import ObjectId
from fastapi import APIRouter,HTTPException
from fastapi.responses import JSONResponse
from config.TT_Db import timetracker_projet_collection, timetracker_user_collection
from motor.motor_asyncio import AsyncIOMotorCollection
import json


async def addProject(project:Project):
    savedProject = await timetracker_projet_collection.insert_one(project.dict())
    return JSONResponse(content={"Message":"Project added successfully"},status_code=201)

async def getAllProjects():
    projects = await timetracker_projet_collection.find().to_list(None)

    for project in projects:
        if "userId" in project:
            user_data = await timetracker_user_collection.find_one({"_id": ObjectId(project["userId"])})
            if user_data:
                user_data["_id"] = str(user_data["_id"])
                project["user_id"] = user_data
            else:
                project["user_id"] = None

        if "assignedDevelopers" in project and isinstance(project["assignedDevelopers"], list):
            developer_list = []
            for dev_id in project["assignedDevelopers"]:
                dev_data = await timetracker_user_collection.find_one({"_id": ObjectId(dev_id)})
                if dev_data:
                    dev_data["_id"] = str(dev_data["_id"])
                    developer_list.append(dev_data)
            project["dev_id"] = developer_list


    return [ProjectOut(**project) for project in projects]

async def getAllProjectsByUserId(userId: str):
    try:
        projects = await timetracker_projet_collection.find({
            "$or": [
                {"userId": userId},  # 🔹 Projects created by this user
                {"assignedDevelopers": {"$elemMatch": {"id": userId}}}  # 🔹 Projects assigned to this user
            ]
        }).to_list(None)
        # print("befor for loop...",projects)
        for project in projects:
            if "userId" in project:
                user_data = await timetracker_user_collection.find_one({"_id": ObjectId(project["userId"])})
                if user_data:
                    user_data["_id"] = str(user_data["_id"])
                    project["user_id"] = user_data
                else:
                    project["user_id"] = None

            if "assignedDevelopers" in project and isinstance(project["assignedDevelopers"], list):
                developer_list = []
                for dev_id in project["assignedDevelopers"]:
                    dev_data = await timetracker_user_collection.find_one({"_id": ObjectId(dev_id)})
                    if dev_data:
                        dev_data["_id"] = str(dev_data["_id"])
                        developer_list.append(dev_data)
                project["dev_id"] = developer_list
            # Convert MongoDB results into Pydantic models
            # print("after for loop...",projects)
        return [ProjectOut(**project) for project in projects]

    except Exception as e:
        print(f"Error fetching projects: {e}")
        return []
    
async def getAllProjectsByDeveloperId(developerId: str):
    try:
        # Direct match with developerId in the assignedDevelopers array
        projects = await timetracker_projet_collection.find({"assignedDevelopers": developerId}).to_list(None)
        
        # Process projects to include user and developer details
        for project in projects:
            if "userId" in project:
                user_data = await timetracker_user_collection.find_one({"_id": ObjectId(project["userId"])})
                if user_data:
                    user_data["_id"] = str(user_data["_id"])
                    project["user_id"] = user_data
                else:
                    project["user_id"] = None

            if "assignedDevelopers" in project and isinstance(project["assignedDevelopers"], list):
                developer_list = []
                for dev_id in project["assignedDevelopers"]:
                    dev_data = await timetracker_user_collection.find_one({"_id": ObjectId(dev_id)})
                    if dev_data:
                        dev_data["_id"] = str(dev_data["_id"])
                        developer_list.append(dev_data)
                project["dev_id"] = developer_list

        # Convert MongoDB results into Pydantic models
        return [ProjectOut(**project) for project in projects]
    
    except Exception as e:
        print(f"Error fetching projects: {e}")
        return []
    

async def partialUpdateProject(projectId: str, updateData: ProjectPartialUpdate):
    update_fields = updateData.dict(exclude_unset=True)
    print("update_fields",update_fields)
    if not update_fields:
        raise HTTPException(status_code=400, detail="No fields provided to update")

    result = await timetracker_projet_collection.update_one(
        {"_id": ObjectId(projectId)},
        {"$set": update_fields}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")

    return JSONResponse(content={"message": "Project updated successfully"}, status_code=200)