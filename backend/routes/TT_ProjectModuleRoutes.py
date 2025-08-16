from fastapi import APIRouter, Body, Query
from models.TT_ProjectModule import ProjectModule,ProjectModuleOut,ProjectModulePartialUpdate
from controllers.TT_ProjectModuleContoller import addProjectModule,getProjectModule,getProjectModuleByProjectId,partiallyUpadateModule

router=APIRouter()
@router.post("/addProjectModule")
async def add_project_module(project_module:ProjectModule):
    return await addProjectModule(project_module)
@router.get("/getProjectModule")
async def get_project_module():
    return await getProjectModule()
@router.get("/getProjectModule/{projectId}")
async def get_project_module_by_projectId(projectId:str):
    return await getProjectModuleByProjectId(projectId=projectId)
@router.patch("/partialUpdateProjectModule/{projecModuletId}")
async def partial_update_project(projecModuletId: str, updateData: ProjectModulePartialUpdate = Body(...)):
    return await partiallyUpadateModule(projecModuletId, updateData)