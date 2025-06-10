import os
import logging
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy.orm import DeclarativeBase
from werkzeug.middleware.proxy_fix import ProxyFix
from dotenv import load_dotenv

# Configure logging for debugging
logging.basicConfig(level=logging.DEBUG)

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

# Create the app
app = Flask(__name__)

app.secret_key = os.environ.get("SESSION_SECRET", "dev-secret-key-change-in-production")
app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)

# Configure the database
load_dotenv()  # Load environment variables from .env file
database_url = os.environ.get("DATABASE_URL")
if not database_url:
    database_url = "postgresql://task_management_db_innj_user:9xZP7RmnKUOP0mUXa7vcFSw0sfVQreMq@dpg-d145mhnfte5s73e0jo60-a.oregon-postgres.render.com/task_management_db_innj"

# Log the database URL for debugging
logging.debug(f"Database URL: {database_url}")

# Set SQLAlchemy configuration
app.config["SQLALCHEMY_DATABASE_URI"] = database_url
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}

# Initialize the app with the extension
db.init_app(app)

# Enable CORS for Angular frontend
CORS(app, origins=['http://localhost:4200'])

with app.app_context():
    # Import models to ensure tables are created
    import models
    db.create_all()

# Import routes
import routes
