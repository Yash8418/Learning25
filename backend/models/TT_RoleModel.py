from pydantic import BaseModel,validator,Field
from typing import Optional,Dict,Any
from bson import ObjectId

class UserSignup(BaseModel):
    username:str
    password:str
    email:str
    role:str
    
class UserOut(UserSignup):
        id:str = Field(alias="_id") 
        # role:Optional[str] = None
        # email:Optional[str] = None
        # password:Optional[str] = None

        @validator("id",pre=True,always=True)
        def convert_userId(cls,v):
            if isinstance(v,ObjectId):
                return str(v)
            return v
        

class UserLogin(BaseModel):
    username_or_email:str
    password:str

    