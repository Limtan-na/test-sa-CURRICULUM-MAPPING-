import os
from dotenv import load_dotenv

load_dotenv()

APP_NAME = 'CQI Monitoring System'
APP_URL = os.getenv('APP_URL', 'http://localhost:5000')
SECRET_KEY = os.getenv('SECRET_KEY', 'change-this-in-production')
SESSION_LIFETIME = 120

DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
DB_PORT = os.getenv('DB_PORT', '3306')
DB_NAME = os.getenv('DB_NAME', 'cqi_monitoring_system')
DB_USER = os.getenv('DB_USER', 'root')
DB_PASS = os.getenv('DB_PASS', '')
SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}?charset=utf8mb4'
