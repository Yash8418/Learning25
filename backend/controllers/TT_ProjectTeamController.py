from models.TT_ProjectTeam import ProjectTeam,ProjectTeamOut
from bson import ObjectId
from config.TT_Db import timetracker_projet_team_collection,timetracker_user_collection,timetracker_projet_collection
from fastapi import APIRouter,HTTPException
from fastapi.responses import JSONResponse

async def addProjectTeam(project_team:ProjectTeam):
    savedProjectTeam=await timetracker_projet_team_collection.insert_one(project_team.dict())
    return JSONResponse(content={"message":"Project Team added successfully"})

async def getProjectTeam():
    projectTeams = await timetracker_projet_team_collection.find().to_list(length=None)
    print(projectTeams)
    for project in projectTeams:

        # Fetch project details
        if "projectId" in project:
            project_data = await timetracker_projet_collection.find_one({"_id": ObjectId(project["projectId"])})
            if project_data:
                project_data["_id"] = str(project_data["_id"])
                project["project_id"] = project_data
            else:
                project["project_id"] = None

        # Fetch user details
        if "userId" in project:
            user_data = await timetracker_user_collection.find_one({"_id": ObjectId(project["userId"])})
            if user_data:
                user_data["_id"] = str(user_data["_id"])
                project["user_id"] = user_data
            else:
                project["user_id"] = None

    return [ProjectTeamOut(**project) for project in projectTeams]