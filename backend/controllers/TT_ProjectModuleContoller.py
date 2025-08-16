# moduleId	integer	primary key	
# projectId	integer	foreign key 	project
# moduleName	varchar	not null	
# description	varchar		
# estimatedHours			
# status 			
# startDate	



from models.TT_ProjectModule import ProjectModule,ProjectModuleOut,ProjectModulePartialUpdate
from bson import ObjectId
from config.TT_Db import timetracker_projet_module_collection,timetracker_projet_collection,timetracker_user_collection
from fastapi import APIRouter,HTTPException,Query
from fastapi.responses import JSONResponse


async def addProjectModule(project_module:ProjectModule):
    savedProjectModule=await timetracker_projet_module_collection.insert_one(project_module.dict())
    return JSONResponse(content={"message":"Project Module added successfully"})

async def getProjectModule():
    projectModules = await timetracker_projet_module_collection.find().to_list(length=None)

    for project in projectModules:
        # Fetch project details
        if "projectId" in project:
            project_data = await timetracker_projet_collection.find_one({"_id": ObjectId(project["projectId"])})
            project["project_id"] = project_data if project_data else None

        # Fetch assigned developers
        if "assignedDevelopers" in project and isinstance(project["assignedDevelopers"], list):
            developer_list = []
            for dev_id in project["assignedDevelopers"]:
                dev_data = await timetracker_user_collection.find_one({"_id": ObjectId(dev_id)})
                if dev_data:
                    developer_list.append({
                        "_id": str(dev_data["_id"]),
                        "username": dev_data.get("username", "Unknown Developer")
                    })
            project["dev_id"] = developer_list  # Ensure it's correctly assigned

    return [ProjectModuleOut(**project) for project in projectModules]


async def getProjectModuleByProjectId(projectId: str = Query(None)):
    filter_query = {}
    if projectId:
        filter_query["projectId"] = projectId  # Filter by selected project ID

    projectModules = await timetracker_projet_module_collection.find(filter_query).to_list(length=None)
    
    for project in projectModules:
        if "projectId" in project:
            project_data = await timetracker_projet_collection.find_one({"_id": ObjectId(project["projectId"])})
            if project_data:
                project_data["_id"] = str(project_data["_id"])
                project["project_id"] = project_data
            else:
                project["project_id"] = None

    return [ProjectModuleOut(**project) for project in projectModules]

async def partiallyUpadateModule(projecModuletId: str, projectModule: ProjectModulePartialUpdate):
    if not ObjectId.is_valid(projecModuletId):
        raise HTTPException(status_code=400, detail="Invalid module ID format")
    
    result = await timetracker_projet_module_collection.update_one(
        {"_id": ObjectId(projecModuletId)},
        {"$set": projectModule.dict(exclude_unset=True)}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Project Module not found")
    return JSONResponse(content={"message": "Project Module updated successfully"})