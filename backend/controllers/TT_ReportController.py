
from fastapi import HTTPException
from datetime import datetime
from collections import defaultdict
from bson import ObjectId
from config.TT_Db import timetracker_user_collection, timetracker_task_collection, timetracker_status_collection, timetracker_projet_collection, timetracker_projet_module_collection
import pandas as pd
from fastapi.responses import StreamingResponse
from io import BytesIO
import xlsxwriter

async def get_time_per_developer():
    pipeline = [
        {"$unwind": "$assignedDevelopers"},
        {"$group": {
            "_id": "$assignedDevelopers",
            "totalTime": {"$sum": "$timeSpent"}
        }}
    ]
    data = await timetracker_task_collection.aggregate(pipeline).to_list(length=None)
    result = []

    for d in data:
        user = await timetracker_user_collection.find_one({"_id": ObjectId(d["_id"])})
        if user:
            result.append({
                "username": user["username"],
                "totalTime": d["totalTime"]
            })
    return result

async def get_task_status_distribution():
    pipeline = [
        {"$group": {
            "_id": "$statusId",
            "count": {"$sum": 1}
        }}
    ]
    data = await timetracker_task_collection.aggregate(pipeline).to_list(length=None)
    result = []

    for d in data:
        status = await timetracker_status_collection.find_one({"_id": ObjectId(d["_id"])})
        if status:
            result.append({
                "statusName": status["statusName"],
                "count": d["count"]
            })
    return result

async def get_weekly_progress():
    pipeline = [
        {
            "$project": {
                "timeSpent": 1,
                "dayOfWeek": {"$dayOfWeek": {"$toDate": "$_id"}}
            }
        },
        {
            "$group": {
                "_id": "$dayOfWeek",
                "totalTimeSpent": {"$sum": "$timeSpent"}
            }
        }
    ]

    data = await timetracker_task_collection.aggregate(pipeline).to_list(length=None)
    week_map = {1: "Sun", 2: "Mon", 3: "Tue", 4: "Wed", 5: "Thu", 6: "Fri", 7: "Sat"}
    actual = {week_map.get(d["_id"], "Unknown"): d["totalTimeSpent"] for d in data}

    # Sample static planned values (can be made dynamic)
    planned = {day: 8 for day in week_map.values()}

    return {"planned": planned, "actual": actual}


async def generate_excel_report():
    tasks = await timetracker_task_collection.find().to_list(length=None)
    users_data = await timetracker_user_collection.find().to_list(length=None)
    statuses_data = await timetracker_status_collection.find().to_list(length=None)

    users = {str(u['_id']): u['username'] for u in users_data}
    statuses = {str(s['_id']): s['statusName'] for s in statuses_data}
    data = []
    for task in tasks:
        for dev_id in task.get("assignedDevelopers", []):
            data.append({
                "Task Title": task.get("title", ""),
                "Developer": users.get(str(dev_id), "Unknown"),
                "Time Spent (min)": task.get("timeSpent", 0),
                "Status": statuses.get(str(task.get("statusId")), "Unknown"),
                "Created Date": task.get("createdAt", datetime.now()).strftime('%Y-%m-%d')
            })

    df = pd.DataFrame(data)

    output = BytesIO()
    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name='Task Report')
        # writer.save()

    output.seek(0)
    return StreamingResponse(output, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                             headers={"Content-Disposition": f"attachment; filename=task_report_{datetime.now().strftime('%Y%m%d')}.xlsx"})


# Get usernames by user ObjectIds
async def get_usernames(user_ids):
    object_ids = [ObjectId(uid) for uid in user_ids]
    users = await timetracker_user_collection.find({"_id": {"$in": object_ids}}).to_list(length=None)
    return [user.get("username", "Unknown") for user in users]

# Get project title from projectId
async def get_project_title(project_id):
    try:
        project = await timetracker_projet_collection.find_one({"_id": ObjectId(project_id)})
        return project.get("title", "Unknown Project") if project else "Unknown Project"
    except:
        return "Unknown Project"

# Get module name from moduleId
async def get_module_name(module_id):
    try:
        module = await timetracker_projet_module_collection.find_one({"_id": ObjectId(module_id)})
        return module.get("moduleName", "Unknown Module") if module else "Unknown Module"
    except:
        return "Unknown Module"

# Main report generation function
async def generate_task_time_excel_report():
    tasks = await timetracker_task_collection.find().to_list(length=None)

    task_data = []

    for task in tasks:
        developer_ids = task.get("assignedDevelopers", [])
        developer_names = await get_usernames(developer_ids)

        project_name = await get_project_title(task.get("projectId"))
        module_name = await get_module_name(task.get("moduleId"))

        task_data.append({
            "Task Title": task.get("title", "N/A"),
            "Assigned Developers": ", ".join(developer_names) if developer_names else "None",
            "Time Spent (mins)": task.get("totalMinutes", 0),
            "Project": project_name,
            "Module": module_name,
        })

    df = pd.DataFrame(task_data)
    output = BytesIO()

    with pd.ExcelWriter(output, engine='xlsxwriter') as writer:
        df.to_excel(writer, index=False, sheet_name="Task Time Report")

    output.seek(0)
    return StreamingResponse(
        output,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": "attachment; filename=task_time_report.xlsx"}
    )


# Total Time Spent Per Project
async def get_time_spent_per_project_controller(developer_id):
    pipeline = [
        {"$match": {"assignedDevelopers": developer_id}},
        {"$group": {
            "_id": "$projectId",
            "totalTimeSpent": {"$sum": "$timeSpent"}
        }}
    ]
    data = await timetracker_task_collection.aggregate(pipeline).to_list(length=None)
    result = []
    for d in data:
        project = await timetracker_projet_collection.find_one({"_id": ObjectId(d["_id"])});
        result.append({
            "project": project.get("title", "Unknown") if project else "Unknown",
            "timeSpent": d["totalTimeSpent"]
        })
    return result

# Completed vs Pending Tasks
async def get_task_completion_status_controller(developer_id):
    match_stage = {"$match": {"assignedDevelopers": developer_id}}
    group_stage = {"$group": {"_id": "$statusId", "count": {"$sum": 1}}}
    pipeline = [match_stage, group_stage]
    data = await timetracker_task_collection.aggregate(pipeline).to_list(length=None)

    result = {"completed": 0, "pending": 0}
    for d in data:
        status = await timetracker_status_collection.find_one({"_id": ObjectId(d["_id"])});
        if status:
            name = status.get("statusName", "unknown").lower()
            if name == "completed":
                result["completed"] += d["count"]
            elif name == "pending":
                result["pending"] += d["count"]
    return result

# Average Time Per Task
async def get_avg_time_per_task_controller(developer_id):
    match_stage = {"$match": {"assignedDevelopers": developer_id}}
    group_stage = {
        "$group": {
            "_id": None,
            "avgTime": {"$avg": "$timeSpent"}
        }
    }
    pipeline = [match_stage, group_stage]
    data = await timetracker_task_collection.aggregate(pipeline).to_list(length=None)
    if data:
        return {"averageTime": round(data[0]["avgTime"], 2)}
    return {"averageTime": 0}
