from database import db

class Course(db.Model):
    __tablename__ = 'courses'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    program_id = db.Column(db.Integer, db.ForeignKey('programs.id'), nullable=False)
    code = db.Column(db.String(20), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    credits = db.Column(db.Integer, nullable=False, default=3)
    year_level = db.Column(db.Integer, nullable=False, default=1)
    semester = db.Column(db.Integer, nullable=False, default=1)
    description = db.Column(db.Text)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    __table_args__ = (db.UniqueConstraint('program_id', 'code', name='unique_course_in_program'),)

    mappings = db.relationship('Mapping', backref='course', lazy='dynamic')
