# taskId	integer	primary key	
# moduleId	integer	foreign key	module
# projectId	integer	foreign key	project
# title			
# priority	varcahr		
# description	varchar	not null	
# statusId	integer	foreign key	status 
# totalMinutes	integer		

from pydantic import BaseModel,validator,Field
from typing import Optional,Dict,Any,List
from bson import ObjectId
from datetime import datetime

class Task(BaseModel):
    moduleId:str
    projectId:str
    title:str
    priority:str
    description:str
    statusId:str
    totalMinutes:int
    assignedDevelopers:List[str]
    startTime: Optional[datetime] = None  # Start Time
    timeSpent: Optional[int] = 0  # Total Time Spent (minutes)
    

class TaskOut(Task):
    id:str=Field(alias="_id")
    module_id: Optional[Dict[str,Any]] = None
    project_id: Optional[Dict[str,Any]] = None
    status_id: Optional[Dict[str,Any]] = None
    dev_id:Optional[List[Dict[str,Any]]]=None

    @validator('id', pre=True, always=True)
    def convert_task_id(cls,v):
        if isinstance(v,ObjectId):
            return str(v)
        return v

    @validator('module_id', pre=True, always=True)
    def convert_module_id(cls,v):
        if isinstance(v,Dict) and "_id" in v:
            v["_id"] = str(v["_id"])
        return v
    
    @validator('project_id', pre=True, always=True)
    def convert_project_id(cls,v):
        if isinstance(v,Dict) and "_id" in v:
            v["_id"] = str(v["_id"])
        return v    
    
    @validator('status_id', pre=True, always=True)
    def convert_status_id(cls,v):
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
    

class TaskUpdate(BaseModel):
    moduleId:Optional[str]=None
    projectId:Optional[str]=None
    title:Optional[str]=None
    priority:Optional[str]=None
    description:Optional[str]=None
    statusId:Optional[str]=None
    totalMinutes:Optional[int]=None
    assignedDevelopers:Optional[List[str]]=None
    startTime: Optional[datetime] = None  # Start Time
    timeSpent: Optional[int] = 0  # Total Time Spent (minutes)
    