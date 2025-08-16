# user_task_id	integer	primary key	
# userId	integer	foreign key	user
# taskId	integer	foreign key	task

from pydantic import BaseModel,validator,Field
from typing import Optional,Dict,Any
from bson import ObjectId

class UserTask(BaseModel):
    userId:str
    taskId:str

class UserTaskOut(UserTask):
    id:str=Field(alias="_id")
    user_id: Optional[Dict[str,Any]] = None
    task_id: Optional[Dict[str,Any]] = None

    @validator('id', pre=True, always=True)
    def convert_obectId(cls,v):
        if isinstance(v,ObjectId):
            return str(v)
        return v
    
    @validator('user_id', pre=True, always=True)
    def convert_userId(cls,v):
        if isinstance(v,Dict) and "_id" in v:
            v["_id"] = str(v["_id"])
        return v
    
    @validator('task_id', pre=True, always=True)
    def convert_taskId(cls,v):
        if isinstance(v,Dict) and "_id" in v:
            v["_id"] = str(v["_id"])
        return v