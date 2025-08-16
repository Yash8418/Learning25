from pydantic import BaseModel,validator,Field
from typing import Optional,Dict,Any,List
from bson import ObjectId
from datetime import datetime


class Project(BaseModel):
    # projectId	integer	primary key
    # title	varchar	not null
    # description	varchar	
    # technology	varchar	
    # estimatedHours	integer	
    # startDate	date	
    # completionDate	date	

    title:str
    description:str
    technology:str
    estimatedHours:int
    startDate:datetime
    completionDate:datetime
    assignedDevelopers:List[str]
    userId:str
class ProjectOut(Project):
    projectId:str=Field(alias="_id")
    user_id:Optional[Dict[str,Any]]=None
    dev_id:Optional[List[Dict[str,Any]]]=None

    @validator('projectId', pre=True, always=True)
    def convert_obectId(cls,v):
        if isinstance(v,ObjectId):
            return str(v)
        return v
    
    @validator("dev_id", pre=True, always=True)
    def convert_assignedDevelopers(cls, v):
        if isinstance(v, list):  # Ensure it is a list of developer objects
            for dev in v:
                if isinstance(dev, Dict) and "_id" in dev:
                    dev["_id"] = str(dev["_id"])  # Convert ObjectId to string
        return v
    
    @validator("user_id",pre=True,always=True)
    def convert_userId(cls,v):
        if isinstance(v,Dict) and "_id" in v:
            v["_id"]=str(v["_id"])
        return v
    
class ProjectPartialUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    technology: Optional[str] = None
    estimatedHours: Optional[int] = None
    startDate: Optional[datetime] = None
    completionDate: Optional[datetime] = None
    assignedDevelopers: Optional[List[str]] = None
    userId: Optional[str] = None