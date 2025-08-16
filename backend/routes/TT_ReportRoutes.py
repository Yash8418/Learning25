from fastapi import APIRouter, Query, HTTPException
from controllers.TT_ReportController import get_time_per_developer, get_task_status_distribution, get_weekly_progress, generate_excel_report, generate_task_time_excel_report, get_time_spent_per_project_controller, get_task_completion_status_controller, get_avg_time_per_task_controller

router = APIRouter()

@router.get("/report/developer-time")
async def time_per_developer():
    return await get_time_per_developer()

@router.get("/report/task-status")
async def task_status_dist():
    return await get_task_status_distribution()

@router.get("/report/weekly-progress")
async def weekly():
    return await get_weekly_progress()

@router.get("/generate-report")
async def download_report():
    return await generate_excel_report()

@router.get("/report/task-time-report")
async def download_task_time_report():
    return await generate_task_time_excel_report()

@router.get("/report/dev-total-time-per-project/{developer_id}")
async def dev_total_time_per_project(developer_id: str):
    return await get_time_spent_per_project_controller(developer_id)

@router.get("/report/dev-task-status/{developer_id}")
async def dev_task_status(developer_id: str ):
    return await get_task_completion_status_controller(developer_id)

@router.get("/report/dev-avg-time-task/{developer_id}")
async def dev_avg_time_task(developer_id: str ):
    return await get_avg_time_per_task_controller(developer_id)
