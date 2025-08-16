from fastapi import APIRouter
from models.TT_Status import Status,StatusOut
from controllers.TT_StatusController import createStatus,getStatus

router=APIRouter()
@router.post("/addStatus")
async def add_status(status:Status):
    return await createStatus(status)

@router.get("/getStatus")
async def get_status():
    return await getStatus()