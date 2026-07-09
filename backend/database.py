from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()

def check_db_connection(app):
    with app.app_context():
        try:
            db.session.execute(text('SELECT 1'))
            return True
        except Exception:
            return False
