from pydantic import BaseModel
from typing import Optional
from fastapi import UploadFile, File

class Product(BaseModel):
    name: Optional[str]
    price: Optional[float]
    category_id: Optional[str]
    sub_category_id: Optional[str]
    image_url: Optional[str] = None
    vendor_id: Optional[str]
  
    class Config:
        arbitrary_types_allowed = True

# Separate model for file uploads since FastAPI handles these differently
class ProductCreate(BaseModel):
    name: str
    price: float
    category_id: str
    sub_category_id: str
    vendor_id: str