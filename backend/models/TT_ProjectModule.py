from pydantic import BaseModel,validator,Field
from typing import Optional,Dict,Any,List
from bson import ObjectId
from datetime import datetime

# moduleId	integer	primary key	
# projectId	integer	foreign key 	project
# moduleName	varchar	not null	
# description	varchar		
# estimatedHours			
# status 			
# startDate			

class ProjectModule(BaseModel):
    projectId:str
    moduleName:str
    description:str
    estimatedHours:int
    # status:str
    startDate:datetime
    assignedDevelopers:List[str]

class ProjectModuleOut(ProjectModule):
    id:str=Field(alias="_id")
    project_id: Optional[Dict[str,Any]] = None
    dev_id:Optional[List[Dict[str,Any]]]=None
    

    @validator('id', pre=True, always=True)
    def convert_objectId(cls,v):
        if isinstance(v,ObjectId):
            return str(v)
        return v
    
    @validator('project_id', pre=True, always=True)
    def convert_projectId(cls,v):
        if isinstance(v,Dict) and "_id" in v:
            v["_id"] = str(v["_id"])
        return v
    
    @validator("dev_id", pre=True, always=True)
    def convert_assignedDevelopers(cls, v):
        if isinstance(v, list):  # Ensure it is a list of developer objects
            for dev in v:
                if isinstance(dev, Dict) and "_id" in dev:
                    dev["_id"] = str(dev["_id"])  # Convert ObjectId to string
        return v
    

class ProjectModulePartialUpdate(BaseModel):
    projectId:Optional[str]=None
    moduleName:Optional[str]=None
    description:Optional[str]=None
    estimatedHours:Optional[int]=None
    # status:str
    startDate:Optional[datetime]=None
    assignedDevelopers:Optional[List[str]]=None