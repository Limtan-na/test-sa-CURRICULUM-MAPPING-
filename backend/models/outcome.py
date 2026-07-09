from database import db

class Outcome(db.Model):
    __tablename__ = 'outcomes'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type = db.Column(db.Enum('peo', 'po', 'clo'), nullable=False)
    code = db.Column(db.String(20), nullable=False)
    description = db.Column(db.Text, nullable=False)
    program_id = db.Column(db.Integer, db.ForeignKey('programs.id'), nullable=True)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    created_at = db.Column(db.DateTime, server_default=db.func.current_timestamp())
    updated_at = db.Column(db.DateTime, server_default=db.func.current_timestamp(), onupdate=db.func.current_timestamp())

    __table_args__ = (db.UniqueConstraint('type', 'code', 'program_id', name='unique_outcome_code'),)

    mappings = db.relationship('Mapping', backref='outcome', lazy='dynamic')
