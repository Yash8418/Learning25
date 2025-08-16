from fastapi import APIRouter, Body, Query
from models.TT_Project import Project,ProjectOut,ProjectPartialUpdate
from controllers.TT_ProjectController import addProject,getAllProjects, getAllProjectsByUserId, getAllProjectsByDeveloperId, partialUpdateProject

router = APIRouter()
@router.post("/addProject/")
async def add_project(project:Project):
    return await addProject(project)

@router.get("/getAllProjects/")
async def get_all_projects():
    return await getAllProjects()

@router.get("/getAllProjectsByUserId/{userId}")
async def get_all_projects_by_userId(userId: str):
    return await getAllProjectsByUserId(userId)

@router.get("/getAllProjectsByDeveloperId/{developerId}")
async def get_all_projects_by_developerId(developerId: str):
    return await getAllProjectsByDeveloperId(developerId)

@router.patch("/partialUpdateProject/{projectId}")
async def partial_update_project(projectId: str, updateData: ProjectPartialUpdate = Body(...)):
    return await partialUpdateProject(projectId, updateData)