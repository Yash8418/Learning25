from pydantic import BaseModel,validator,Field
from typing import Optional,Dict,Any
from bson import ObjectId
from datetime import date 


# project_team_id	integer	primary key
# projectId	integer	foreign key ( project )
# userId	integer	foreign key ( user )

class ProjectTeam(BaseModel):
    projectId:str
    userId:str

class ProjectTeamOut(ProjectTeam):
    id:str=Field(alias="_id")
    project_id: Optional[Dict[str,Any]] = None
    user_id: Optional[Dict[str,Any]] = None

    @validator('id', pre=True, always=True)
    def convert_obectId(cls,v):
        if isinstance(v,ObjectId):
            return str(v)
        return v
    
    @validator('project_id', pre=True, always=True)
    def convert_projectId(cls,v):
        if isinstance(v,Dict) and "_id" in v:
            v["_id"] = str(v["_id"])
        return v
    
    @validator('user_id', pre=True, always=True)
    def convert_userId(cls,v):
        if isinstance(v,Dict) and "_id" in v:
            v["_id"] = str(v["_id"])
        return v