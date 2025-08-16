from pydantic import BaseModel,Field,validator
from bson import ObjectId
from typing import Optional,Dict,Any
import bcrypt

# Request
class User(BaseModel):
    name:str
    firstname:str
    lasttname:str
    age:int
    status:bool
    email:str
    password:str
    # role_id:str

    @validator("password",pre=True,always=True)
    def decrypt_password(cls,v):
        if v is None:
            return v
        return bcrypt.hashpw(v.encode('utf-8'),bcrypt.gensalt())

# Output
class UserOut(User):
    id: str=Field(alias='_id')
    role:Optional[Dict[str,Any]]=None
    email:Optional[str]=None
    password:Optional[str]=None
    name:Optional[str]=None

    @validator('id',pre=True,always=True)
    def convert_objectId(cls,v): # check if cls and v is same
        if isinstance(v,ObjectId):
            return str(v)
        return v
    
    @validator("role",pre=True,always=True)
    def convert_role(cls,v):
        if isinstance(v,dict) and "_id" in v:
            v["_id"]=str(v["_id"])
        return v
    