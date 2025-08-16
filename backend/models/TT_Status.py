
from pydantic import BaseModel,validator,Field
from typing import Optional,Dict,Any
from bson import ObjectId

# statusId	integer	primary key	
# statusName	varchar	not null , unique	

class Status(BaseModel):
    statusName:str

class StatusOut(Status):
    statusId:str = Field(alias="_id")
    statusName:str

    @validator("statusId",pre=True,always=True)
    def convert_status_id(cls,v):
        if isinstance(v,ObjectId):
            return str(v)
        return v
