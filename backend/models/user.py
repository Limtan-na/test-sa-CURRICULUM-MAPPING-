from database import db
import bcrypt

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.Enum('admin', 'manager', 'user'), nullable=False, default='user')
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    def full_name(self):
        return f'{self.first_name} {self.last_name}'

    @staticmethod
    def validate_password(password, password_hash):
        hash_to_check = password_hash.replace('$2y$', '$2b$', 1)
        try:
            return bcrypt.checkpw(password.encode(), hash_to_check.encode())
        except Exception:
            return False
