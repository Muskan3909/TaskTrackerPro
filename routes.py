from flask import render_template, request, jsonify, redirect, url_for, flash
from app import app, db
from models import Task
from datetime import datetime
import logging

@app.route('/')
def index():
    """Main page displaying all tasks"""
    return render_template('index.html')

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    """API endpoint to get all tasks with optional filtering and sorting"""
    try:
        # Get filter parameters
        entity_filter = request.args.get('entity', '')
        task_type_filter = request.args.get('task_type', '')
        contact_filter = request.args.get('contact', '')
        status_filter = request.args.get('status', '')
        date_filter = request.args.get('date', '')
        
        # Get sorting parameters
        sort_by = request.args.get('sort_by', 'date_created')
        sort_order = request.args.get('sort_order', 'desc')
        
        # Start with base query
        query = Task.query
        
        # Apply filters
        if entity_filter:
            query = query.filter(Task.entity_name.ilike(f'%{entity_filter}%'))
        if task_type_filter:
            query = query.filter(Task.task_type.ilike(f'%{task_type_filter}%'))
        if contact_filter:
            query = query.filter(Task.contact_person.ilike(f'%{contact_filter}%'))
        if status_filter:
            query = query.filter(Task.status == status_filter)
        if date_filter:
            try:
                filter_date = datetime.strptime(date_filter, '%Y-%m-%d').date()
                query = query.filter(db.func.date(Task.date_created) == filter_date)
            except ValueError:
                pass
        
        # Apply sorting
        if hasattr(Task, sort_by):
            if sort_order == 'desc':
                query = query.order_by(getattr(Task, sort_by).desc())
            else:
                query = query.order_by(getattr(Task, sort_by))
        
        tasks = query.all()
        return jsonify([task.to_dict() for task in tasks])
    except Exception as e:
        logging.error(f"Error getting tasks: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks', methods=['POST'])
def create_task():
    """API endpoint to create a new task"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['entity_name', 'task_type', 'task_time', 'contact_person']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Parse task_time
        try:
            task_time = datetime.strptime(data['task_time'], '%Y-%m-%dT%H:%M')
        except ValueError:
            return jsonify({'error': 'Invalid task_time format'}), 400
        
        # Create new task
        task = Task(
            entity_name=data['entity_name'],
            task_type=data['task_type'],
            task_time=task_time,
            contact_person=data['contact_person'],
            note=data.get('note', ''),
            status='open'  # Default status
        )
        
        db.session.add(task)
        db.session.commit()
        
        return jsonify(task.to_dict()), 201
    except Exception as e:
        logging.error(f"Error creating task: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    """API endpoint to update an existing task"""
    try:
        task = Task.query.get_or_404(task_id)
        data = request.get_json()
        
        # Update fields if provided
        if 'entity_name' in data:
            task.entity_name = data['entity_name']
        if 'task_type' in data:
            task.task_type = data['task_type']
        if 'task_time' in data:
            try:
                task.task_time = datetime.strptime(data['task_time'], '%Y-%m-%dT%H:%M')
            except ValueError:
                return jsonify({'error': 'Invalid task_time format'}), 400
        if 'contact_person' in data:
            task.contact_person = data['contact_person']
        if 'note' in data:
            task.note = data['note']
        if 'status' in data:
            if data['status'] not in ['open', 'closed']:
                return jsonify({'error': 'Status must be open or closed'}), 400
            task.status = data['status']
        
        db.session.commit()
        return jsonify(task.to_dict())
    except Exception as e:
        logging.error(f"Error updating task: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    """API endpoint to delete a task"""
    try:
        task = Task.query.get_or_404(task_id)
        db.session.delete(task)
        db.session.commit()
        return jsonify({'message': 'Task deleted successfully'})
    except Exception as e:
        logging.error(f"Error deleting task: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:task_id>/status', methods=['PATCH'])
def update_task_status(task_id):
    """API endpoint to update task status"""
    try:
        task = Task.query.get_or_404(task_id)
        data = request.get_json()
        
        if 'status' not in data:
            return jsonify({'error': 'Status is required'}), 400
        
        if data['status'] not in ['open', 'closed']:
            return jsonify({'error': 'Status must be open or closed'}), 400
        
        task.status = data['status']
        db.session.commit()
        
        return jsonify(task.to_dict())
    except Exception as e:
        logging.error(f"Error updating task status: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/filters')
def get_filter_options():
    """API endpoint to get filter options"""
    try:
        # Get distinct values for filters
        entities = db.session.query(Task.entity_name).distinct().all()
        task_types = db.session.query(Task.task_type).distinct().all()
        contacts = db.session.query(Task.contact_person).distinct().all()
        
        return jsonify({
            'entities': [e[0] for e in entities],
            'task_types': [t[0] for t in task_types],
            'contacts': [c[0] for c in contacts],
            'statuses': ['open', 'closed']
        })
    except Exception as e:
        logging.error(f"Error getting filter options: {str(e)}")
        return jsonify({'error': str(e)}), 500
