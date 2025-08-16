from models.TT_TaskModel import Task,TaskOut,TaskUpdate
from bson import ObjectId
from config.TT_Db import timetracker_task_collection,timetracker_projet_module_collection,timetracker_projet_collection,timetracker_status_collection, timetracker_user_collection
from fastapi import APIRouter,HTTPException
from fastapi.responses import JSONResponse
from datetime import datetime

def format_seconds_to_hhmmss(seconds: int) -> str:
    hours = seconds // 3600
    minutes = (seconds % 3600) % 60 // 60
    secs = seconds % 60
    return f"{hours:02}:{minutes:02}:{secs:02}"

async def addTask(task:Task):
    savedTask=await timetracker_task_collection.insert_one(task.dict())
    return JSONResponse(content={"message":"Task added successfully"})

async def getTask():
    tasks = await timetracker_task_collection.find().to_list(length=None)
    for task in tasks:

        # Fetch module details
        if "moduleId" in task:
            module_data = await timetracker_projet_module_collection.find_one({"_id": ObjectId(task["moduleId"])})
            if module_data:
                module_data["_id"] = str(module_data["_id"])
                task["module_id"] = module_data
            else:
                task["module_id"] = None

        # Fetch task details
        if "taskId" in task:
            task_data = await timetracker_projet_collection.find_one({"_id": ObjectId(task["taskId"])})
            # print(task_data)
            if task_data:
                task_data["_id"] = str(task_data["_id"])
                task["task_id"] = task_data
            else:
                task["task_id"] = None

        # Fetch status details
        if "statusId" in task:
            status_data = await timetracker_status_collection.find_one({"_id": ObjectId(task["statusId"])})
            if status_data:
                status_data["_id"] = str(status_data["_id"])
                task["status_id"] = status_data
            else:
                task["status_id"] = None
        if "projectId" in task:
            task_data = await timetracker_projet_collection.find_one({"_id": ObjectId(task["projectId"])})
            if task_data:
                task_data["_id"] = str(task_data["_id"])
                task["project_id"] = task_data
            else:
                task["project_id"] = None
        else:
            task["project_id"] = None
        if "assignedDevelopers" in task and isinstance(task["assignedDevelopers"], list):
            developer_list = []
            for dev_id in task["assignedDevelopers"]:
                dev_data = await timetracker_user_collection.find_one({"_id": ObjectId(dev_id)})
                if dev_data:
                    dev_data["_id"] = str(dev_data["_id"])
                    developer_list.append(dev_data)
            task["dev_id"] = developer_list
                # Format timeSpent
        if "timeSpent" in task:
            task["formattedTimeSpent"] = format_seconds_to_hhmmss(task["timeSpent"])

        # Format totalMinutes (convert minutes to seconds)
        if "totalMinutes" in task:
            task["formattedExpectedTime"] = format_seconds_to_hhmmss(task["totalMinutes"] * 60)

    return [TaskOut(**task) for task in tasks]

async def getAllTasksByDeveloperId(developerId: str):
    try:
        # Fetch only tasks where assignedDevelopers contains the developerId
        tasks = await timetracker_task_collection.find({
            "assignedDevelopers": developerId
        }).to_list(None)
        # print(tasks)

        # Process tasks to include additional details
        for task in tasks:
            if "moduleId" in task:
                module_data = await timetracker_projet_module_collection.find_one({"_id": ObjectId(task["moduleId"])})
                if module_data:
                    module_data["_id"] = str(module_data["_id"])
                    task["module_id"] = module_data
                else:
                    task["module_id"] = None

            if "taskId" in task:
                task_data = await timetracker_projet_collection.find_one({"_id": ObjectId(task["taskId"])})
                if task_data:
                    task_data["_id"] = str(task_data["_id"])
                    task["task_id"] = task_data
                else:
                    task["task_id"] = None
            if "projectId" in task:
                task_data = await timetracker_projet_collection.find_one({"_id": ObjectId(task["projectId"])})
                if task_data:
                    task_data["_id"] = str(task_data["_id"])
                    task["project_id"] = task_data
                else:
                    task["project_id"] = None
            else:
                task["project_id"] = None
            if "statusId" in task:
                status_data = await timetracker_status_collection.find_one({"_id": ObjectId(task["statusId"])})
                if status_data:
                    status_data["_id"] = str(status_data["_id"])
                    task["status_id"] = status_data
                else:
                    task["status_id"] = None

            if "assignedDevelopers" in task and isinstance(task["assignedDevelopers"], list):
                developer_list = []
                for dev_id in task["assignedDevelopers"]:
                    dev_data = await timetracker_user_collection.find_one({"_id": ObjectId(dev_id)})
                    if dev_data:
                        dev_data["_id"] = str(dev_data["_id"])
                        developer_list.append(dev_data)
                task["dev_id"] = developer_list
            
            # Add formatted time string
            # if "timeSpent" in task:
            #     task["formattedTimeSpent"] = format_seconds_to_hhmmss(task["timeSpent"])
            # else:
            #     task["formattedTimeSpent"] = "00:00:00"

           
        # Convert MongoDB results into Pydantic models
        return [TaskOut(**task) for task in tasks]

    except Exception as e:
        print(f"Error fetching tasks: {e}")
        return []


# async def startTask(taskId: str):
#     task = await timetracker_task_collection.find_one({"_id": ObjectId(taskId)})
#     if not task:
#         return JSONResponse(content={"message": "Task not found"}, status_code=404)

#     if "startTime" not in task or not task["startTime"]:  # If task hasn't started before
#         task["startTime"] = datetime.utcnow()  # Store start time

#     # Update status to "running"
#     running_status = await timetracker_status_collection.find_one({"statusName": "running"})
#     if not running_status:
#         return JSONResponse(content={"message": "Status not found"}, status_code=500)

#     await timetracker_task_collection.update_one(
#         {"_id": ObjectId(taskId)},
#         {"$set": {"statusId": str(running_status["_id"]), "startTime": task["startTime"]}}
#     )
#     return JSONResponse(content={"message": "Task started successfully"})

async def startTask(taskId: str):
    task = await timetracker_task_collection.find_one({"_id": ObjectId(taskId)})
    
    if not task:
        return JSONResponse(content={"message": "Task not found"}, status_code=404)

    # Check if task is already running
    if "startTime" in task and task["startTime"]:
        return JSONResponse(content={"message": "Task is already running"}, status_code=400)

    # Get the "running" status
    running_status = await timetracker_status_collection.find_one({"statusName": "running"})
    if not running_status:
        return JSONResponse(content={"message": "Running status not found"}, status_code=500)

    # Update task with start time and status
    await timetracker_task_collection.update_one(
        {"_id": ObjectId(taskId)},
        {
            "$set": {
                "startTime": datetime.utcnow().isoformat(),  # Store startTime in ISO format
                "statusId": str(running_status["_id"])
            }
        }
    )

    return JSONResponse(content={"message": "Task started successfully", "startTime": datetime.utcnow().isoformat()})



# Stop Task
# async def stopTask(taskId: str):
#     task = await timetracker_task_collection.find_one({"_id": ObjectId(taskId)})
#     if not task or "startTime" not in task or not task["startTime"]:
#         return JSONResponse(content={"message": "Task not started yet"}, status_code=400)

#     elapsed_time = (datetime.utcnow() - task["startTime"]).total_seconds() / 60  # Minutes
#     total_time_spent = task.get("timeSpent", 0) + int(elapsed_time)

#     await timetracker_task_collection.update_one(
#         {"_id": ObjectId(taskId)},
#         {"$set": {"timeSpent": total_time_spent}, "$unset": {"startTime": ""}}
#     )
#     return JSONResponse(content={"message": "Task stopped successfully", "totalTimeSpent": total_time_spent})

async def stopTask(taskId: str):
    task = await timetracker_task_collection.find_one({"_id": ObjectId(taskId)})
    
    if not task:
        return JSONResponse(content={"message": "Task not found"}, status_code=404)

    if "startTime" not in task or not task["startTime"]:
        return JSONResponse(content={"message": "Task has not been started yet"}, status_code=400)

    try:
        # Convert startTime from string to datetime
        start_time = datetime.fromisoformat(task["startTime"])
        elapsed_time = (datetime.utcnow() - start_time).total_seconds() / 60  # Convert to minutes

        # Get the "pending" status
        pending_status = await timetracker_status_collection.find_one({"statusName": "pending"})
        if not pending_status:
            return JSONResponse(content={"message": "Pending status not found"}, status_code=500)


        elapsed_seconds = int((datetime.utcnow() - start_time).total_seconds())
        # Update task: Set status to pending, update timeSpent, and clear startTime
        await timetracker_task_collection.update_one(
            {"_id": ObjectId(taskId)},
            {
                "$set": {
                    "statusId": str(pending_status["_id"]),
                    "timeSpent": task.get("timeSpent", 0) + elapsed_seconds,  # Add elapsed time
                },
                "$unset": {"startTime": ""}  # Remove startTime
            }
        )

        return JSONResponse(content={"message": "Task stopped successfully", "timeSpent": round(elapsed_time, 2)})

    except ValueError as e:
        return JSONResponse(content={"message": f"Invalid startTime format: {str(e)}"}, status_code=500)



# Complete Task
async def completeTask(taskId: str):
    task = await timetracker_task_collection.find_one({"_id": ObjectId(taskId)})
    if not task:
        return JSONResponse(content={"message": "Task not found"}, status_code=404)

    completed_status = await timetracker_status_collection.find_one({"statusName": "completed"})
    if not completed_status:
        return JSONResponse(content={"message": "Status not found"}, status_code=500)

    await timetracker_task_collection.update_one(
        {"_id": ObjectId(taskId)},
        {"$set": {"statusId": str(completed_status["_id"])}}
    )
    return JSONResponse(content={"message": "Task completed successfully"})

async def updateTask(taskId:str,task:TaskUpdate):
    result=await timetracker_task_collection.update_one({"_id":ObjectId(taskId)},{"$set":task.dict(exclude_unset=True)})
    if result.modified_count==0:
        return JSONResponse(content={"message":"Task not found"},status_code=404)
    return JSONResponse(content={"message":"Task updated successfully"})