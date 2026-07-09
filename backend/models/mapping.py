from database import db

class Mapping(db.Model):
    __tablename__ = 'mappings'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    course_id = db.Column(db.Integer, db.ForeignKey('courses.id'), nullable=False)
    outcome_id = db.Column(db.Integer, db.ForeignKey('outcomes.id'), nullable=False)
    coverage_level = db.Column(db.Enum('I', 'E', 'D'), nullable=False, default='I')
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())

    __table_args__ = (db.UniqueConstraint('course_id', 'outcome_id', name='unique_mapping'),)
