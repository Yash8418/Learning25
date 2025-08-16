from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL="mongodb://localhost:27017"
DATABASE_NAME="admin"


client=AsyncIOMotorClient(MONGO_URL)
db=client[DATABASE_NAME]

user_collection=db["users"]

product_collection=db["products"]