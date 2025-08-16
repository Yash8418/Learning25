
from fastapi import APIRouter, UploadFile, File, Form
from models.ProductModel import Product, ProductCreate
from controllers import ProductController

router = APIRouter()

@router.post("/create_product")
async def create_product(product: Product):
    return await ProductController.create_product(product)

@router.post("/create_product_file")
async def create_product_with_file(
    name: str = Form(...),
    price: float = Form(...),
    category_id: str = Form(...),
    sub_category_id: str = Form(...),
    vendor_id: str = Form(...),
    file: UploadFile = File(...)
):
    return await ProductController.create_Product_withFile(
        name, price, category_id, sub_category_id, vendor_id, file
    )
