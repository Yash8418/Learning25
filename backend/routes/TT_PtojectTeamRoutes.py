from fastapi import APIRouter
from models.TT_ProjectTeam import ProjectTeam,ProjectTeamOut
from controllers.TT_ProjectTeamController import addProjectTeam,getProjectTeam

router=APIRouter()  
@router.post("/addProjectTeam")
async def add_project_team(project_team:ProjectTeam):
    return await addProjectTeam(project_team)
@router.get("/getProjectTeam")
async def get_project_team():
    return await getProjectTeam()
