
from models.TT_Status import Status,StatusOut
from config.TT_Db import timetracker_status_collection
from bson import ObjectId
from fastapi.responses import JSONResponse



async def createStatus(status:Status):
    savedStatus=await timetracker_status_collection.insert_one(status.dict())
    return JSONResponse(content={"message":"Status added successfully"})

async def getStatus():
    result=await timetracker_status_collection.find().to_list(length=None)
    # print(result)
    return [StatusOut(**status) for status in result]
