from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy

bcrypt = Bcrypt()
db = SQLAlchemy()

class User (db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    streak = db.relationship('Streak', backref='user', lazy=True)

    def to_dict(self):
        return {"id": self.id, "username": self.username}

    def set_password(self, password):
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    
class Streak(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    date = db.Column(db.Date, default=db.func.current_date())
    last_action_date = db.Column(db.Date)
    current_streak = db.Column(db.Integer, default=0)
    freezes = db.Column(db.Integer, default=0)
    difficulty = db.Column(db.Integer, default=1)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'date': self.date.isoformat() if self.date else None,
            'last_action_date': self.last_action_date.isoformat() if self.last_action_date else None,
            'current_streak': self.current_streak,
            'freezes': self.freezes
        }
