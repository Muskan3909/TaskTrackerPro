# Task Management System

A comprehensive full-stack web application for managing tasks with CRUD operations, filtering, sorting, and modal-based interactions.

## Features

### Core Functionality
- **Create Tasks**: Add new tasks with entity name, task type, scheduled time, contact person, and optional notes
- **Edit Tasks**: Modify existing tasks with full attribute editing capabilities
- **Delete Tasks**: Remove tasks with confirmation dialogs
- **Status Management**: Toggle tasks between "open" and "closed" states
- **Task Assignment**: Assign tasks to team members (contact persons)

### Advanced Features
- **Filtering**: Filter tasks by entity name, task type, contact person, status, and creation date
- **Sorting**: Sort tasks by any column in ascending or descending order
- **Modal Interface**: Clean popup modals for task creation and editing
- **Real-time Updates**: Dynamic table updates without page refreshes
- **Responsive Design**: Mobile-friendly interface using Bootstrap
- **Form Validation**: Client-side and server-side validation

## Technology Stack

### Backend
- **Flask**: Python 3.6+ web framework
- **Flask-SQLAlchemy**: Database ORM
- **Flask-CORS**: Cross-Origin Resource Sharing support
- **PostgreSQL**: Production database (SQLite for development)
- **Gunicorn**: WSGI HTTP Server

### Frontend
- **Angular 19**: Modern TypeScript framework
- **Bootstrap 5**: CSS framework with Replit dark theme
- **Angular Reactive Forms**: Form handling and validation
- **HttpClient**: RESTful API communication
- **Font Awesome**: Icon library

### Development Tools
- **Angular CLI**: Project scaffolding and build tools
- **TypeScript**: Type-safe JavaScript
- **RxJS**: Reactive programming library

## Project Structure

```
├── backend/
│   ├── app.py              # Flask application factory
│   ├── main.py             # Application entry point
│   ├── models.py           # Database models
│   ├── routes.py           # API endpoints
│   └── requirements files
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── task-list/    # Main task display component
│   │   │   │   └── task-form/    # Task creation/editing form
│   │   │   ├── models/
│   │   │   │   └── task.model.ts # TypeScript interfaces
│   │   │   ├── services/
│   │   │   │   └── task.service.ts # HTTP service layer
│   │   │   └── app.component.ts
│   │   ├── index.html
│   │   └── styles.css
│   ├── angular.json
│   └── package.json
└── README.md
```

## Installation and Setup

### Prerequisites
- **Python 3.6+** with pip
- **Node.js 18+** with npm
- **Angular CLI** (installed globally)

### Development Setup

#### 1. Backend Setup (Flask)

**Install Python dependencies:**
```bash
pip install flask flask-sqlalchemy flask-cors gunicorn psycopg2-binary
```

**Set environment variables:**
```bash
export SESSION_SECRET="your-secret-key-here"
export DATABASE_URL="postgresql://..."  # or use SQLite for development
```

**Start the Flask backend:**
```bash
python main.py
# or with Gunicorn:
gunicorn --bind 0.0.0.0:5000 --reload main:app
```

Backend will be available at `http://localhost:5000`

#### 2. Frontend Setup (Angular)

**Navigate to frontend directory:**
```bash
cd frontend
```

**Install Angular dependencies:**
```bash
npm install
```

**Start the Angular development server:**
```bash
npm start
# or
ng serve --host 0.0.0.0 --port 4200
```

Frontend will be available at `http://localhost:4200`

### Running Both Services

For development, run both services simultaneously:

**Terminal 1 (Backend):**
```bash
gunicorn --bind 0.0.0.0:5000 --reload main:app
```

**Terminal 2 (Frontend):**
```bash
cd frontend && npm start
```

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### GET /api/tasks
Retrieve all tasks with optional filtering and sorting.

**Query Parameters:**
- `entity`: Filter by entity name (partial match)
- `task_type`: Filter by task type (partial match)
- `contact`: Filter by contact person (partial match)
- `status`: Filter by status (`open` or `closed`)
- `date`: Filter by creation date (YYYY-MM-DD format)
- `sort_by`: Sort column (`date_created`, `entity_name`, `task_type`, `task_time`, `contact_person`, `status`)
- `sort_order`: Sort direction (`asc` or `desc`)

#### POST /api/tasks
Create a new task.

**Request Body:**
```json
{
    "entity_name": "Customer ABC",
    "task_type": "Follow-up Call",
    "task_time": "2024-01-15T14:30",
    "contact_person": "John Doe",
    "note": "Optional task note"
}
```

#### PUT /api/tasks/{id}
Update an existing task.

**Request Body:** Same as POST with optional fields

#### DELETE /api/tasks/{id}
Delete a task by ID.

#### PATCH /api/tasks/{id}/status
Update task status only.

**Request Body:**
```json
{
    "status": "closed"
}
```

#### GET /api/filters
Get available filter options.

## Angular Architecture

### Components

#### TaskListComponent
- Main dashboard component
- Displays tasks in a responsive table
- Handles filtering and sorting
- Manages modal interactions

#### TaskFormComponent
- Reusable form for creating/editing tasks
- Reactive forms with validation
- Emits events to parent component

### Services

#### TaskService
- Handles all HTTP communication with Flask API
- Provides methods for CRUD operations
- Uses Angular HttpClient with RxJS Observables

### Models

#### Task Interface
```typescript
interface Task {
  id?: number;
  date_created?: string;
  entity_name: string;
  task_type: string;
  task_time: string;
  contact_person: string;
  note?: string;
  status: 'open' | 'closed';
}
```

## Deployment

### Production Build

#### Angular Frontend
```bash
cd frontend
ng build --prod
```

#### Flask Backend
Configure with environment variables:
```bash
export FLASK_ENV=production
export DATABASE_URL="postgresql://..."
```

### Hosting Options

**Recommended Platforms:**
- **Backend**: Heroku, Railway, Render, AWS Elastic Beanstalk
- **Frontend**: Netlify, Vercel, AWS S3 + CloudFront
- **Full-Stack**: Railway, Heroku (with buildpacks), Docker containers

### Environment Variables

**Required for Production:**
- `SESSION_SECRET`: Flask session secret key
- `DATABASE_URL`: PostgreSQL connection string
- `FLASK_ENV`: Set to `production`

## Development Notes

### CORS Configuration
Flask backend is configured with CORS to allow requests from `http://localhost:4200` during development.

### Database Models
The Task model includes all required fields with proper validation and relationships.

### Form Validation
Both client-side (Angular) and server-side (Flask) validation ensure data integrity.

### Error Handling
Comprehensive error handling on both frontend and backend with user-friendly messages.

## AI Tool Usage

This project was developed with assistance from AI tools for:
- **Code Generation**: Component scaffolding and boilerplate code
- **Architecture Planning**: Project structure and technology decisions
- **Documentation**: README and code comments
- **Debugging**: Issue resolution and optimization suggestions

The core business logic, component interactions, and architectural decisions were human-guided with AI assistance for implementation efficiency.
