# TaskTrackerPro

A comprehensive full-stack web application for managing tasks with CRUD operations, filtering, sorting, and modal-based interactions.

## 🚀 Live Demo

- **Frontend**: [Coming Soon]
- **Backend API**: https://tasktrackerpro-backend.onrender.com/

## ✨ Features

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

## 🛠️ Tech Stack

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
- **Angular CLI**: Project scaffolding and build tools
- **TypeScript**: Type-safe JavaScript
- **RxJS**: Reactive programming library

## 📁 Project Structure

```
TaskTrackerPro/
├── backend/
│   ├── app.py                # Flask application factory
│   ├── main.py              # Application entry point
│   ├── models.py            # Database models
│   ├── routes.py            # API endpoints
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── task-list/      # Main task display component
│   │   │   │   └── task-form/      # Task creation/editing form
│   │   │   ├── models/
│   │   │   │   └── task.model.ts   # TypeScript interfaces
│   │   │   ├── services/
│   │   │   │   └── task.service.ts # HTTP service layer
│   │   │   └── app.component.ts
│   │   ├── index.html
│   │   └── styles.css
│   ├── angular.json
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Python 3.6+ with pip
- Node.js 18+ with npm
- Angular CLI (installed globally): `npm install -g @angular/cli`

### Backend Setup

1. **Install Python dependencies:**
   ```bash
   pip install flask flask-sqlalchemy flask-cors gunicorn psycopg2-binary
   ```

2. **Set environment variables:**
   ```bash
   export SESSION_SECRET="task-mgmt-secret-2024-secure"
   export DATABASE_URL="postgresql://task_management_db_innj_user:9xZP7RmnKUOP0mUXa7vcFSw0sfVQreMq@dpg-d145mhnfte5s73e0jo60-a.oregon-postgres.render.com/task_management_db_innj"
   ```

3. **Start the Flask backend:**
   ```bash
   python main.py
   # or with Gunicorn:
   gunicorn --bind 0.0.0.0:5000 --reload main:app
   ```

Backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Angular dependencies:**
   ```bash
   npm install
   ```

3. **Start the Angular development server:**
   ```bash
   npm start
   # or
   ng serve --host 0.0.0.0 --port 4200
   ```

Frontend will be available at `http://localhost:4200`

### Development Mode

For development, run both services simultaneously:

**Terminal 1 (Backend):**
```bash
gunicorn --bind 0.0.0.0:5000 --reload main:app
```

**Terminal 2 (Frontend):**
```bash
cd frontend && npm start
```

## 📚 API Documentation

### Base URL
```
https://tasktrackerpro-backend.onrender.com/api
```

### Endpoints

#### GET `/api/tasks`
Retrieve all tasks with optional filtering and sorting.

**Query Parameters:**
- `entity`: Filter by entity name (partial match)
- `task_type`: Filter by task type (partial match)
- `contact`: Filter by contact person (partial match)
- `status`: Filter by status (`open` or `closed`)
- `date`: Filter by creation date (YYYY-MM-DD format)
- `sort_by`: Sort column (`date_created`, `entity_name`, `task_type`, `task_time`, `contact_person`, `status`)
- `sort_order`: Sort direction (`asc` or `desc`)

#### POST `/api/tasks`
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

#### PUT `/api/tasks/<id>`
Update an existing task.

**Request Body:** Same as POST with optional fields

#### DELETE `/api/tasks/<id>`
Delete a task by ID.

#### PATCH `/api/tasks/<id>/status`
Update task status only.

**Request Body:**
```json
{
  "status": "closed"
}
```

#### GET `/api/filter-options`
Get available filter options.

## 🏗️ Architecture

### Frontend Components

#### TaskListComponent
- Main dashboard component
- Displays tasks in a responsive table
- Handles filtering and sorting
- Manages modal interactions

#### TaskFormComponent
- Reusable form for creating/editing tasks
- Reactive forms with validation
- Emits events to parent component

#### TaskService
- Handles all HTTP communication with Flask API
- Provides methods for CRUD operations
- Uses Angular HttpClient with RxJS Observables

### Data Models

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

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
ng build --prod
```

### Backend Deployment
Configure with environment variables:
```bash
export FLASK_ENV=production
export DATABASE_URL="postgresql://task_management_db_innj_user:9xZP7RmnKUOP0mUXa7vcFSw0sfVQreMq@dpg-d145mhnfte5s73e0jo60-a.oregon-postgres.render.com/task_management_db_innj"
export SESSION_SECRET="task-mgmt-secret-2024-secure"
```

### Recommended Platforms
- **Backend**: Heroku, Railway, Render, AWS Elastic Beanstalk
- **Frontend**: Netlify, Vercel, AWS S3 + CloudFront
- **Full-Stack**: Railway, Heroku (with buildpacks), Docker containers

### Environment Variables (Production)
- `SESSION_SECRET`: `task-mgmt-secret-2024-secure`
- `DATABASE_URL`: `postgresql://task_management_db_innj_user:9xZP7RmnKUOP0mUXa7vcFSw0sfVQreMq@dpg-d145mhnfte5s73e0jo60-a.oregon-postgres.render.com/task_management_db_innj`
- `FLASK_ENV`: Set to `production`

## 🔧 Key Features Implementation

### CORS Configuration
Flask backend is configured with CORS to allow requests from `http://localhost:4200` during development.

### Database Models
The Task model includes all required fields with proper validation and relationships.

### Validation
Both client-side (Angular) and server-side (Flask) validation ensure data integrity.

### Error Handling
Comprehensive error handling on both frontend and backend with user-friendly messages.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

**Muskan** - [GitHub Profile](https://github.com/Muskan3909)
