from app import db
from datetime import datetime
from sqlalchemy import String, DateTime, Text, Boolean, Integer

class Task(db.Model):
    
    id = db.Column(Integer, primary_key=True)
    date_created = db.Column(DateTime, nullable=False, default=datetime.utcnow)
    entity_name = db.Column(String(120), nullable=False)
    task_type = db.Column(String(80), nullable=False)
    task_time = db.Column(DateTime, nullable=False)
    contact_person = db.Column(String(120), nullable=False)
    note = db.Column(Text, nullable=True)
    status = db.Column(String(20), nullable=False, default='open')
    
    def __repr__(self):
        return f'<Task {self.id}: {self.entity_name} - {self.task_type}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'date_created': self.date_created.strftime('%Y-%m-%d %H:%M'),
            'entity_name': self.entity_name,
            'task_type': self.task_type,
            'task_time': self.task_time.strftime('%Y-%m-%d %H:%M'),
            'contact_person': self.contact_person,
            'note': self.note or '',
            'status': self.status
        }
