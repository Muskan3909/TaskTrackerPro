// Global variables
let currentEditId = null;
let currentDeleteId = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Filter inputs
    ['entityFilter', 'taskTypeFilter', 'contactFilter', 'statusFilter', 'dateFilter', 'sortBy', 'sortOrder'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', debounce(loadTasks, 300));
            element.addEventListener('change', loadTasks);
        }
    });

    // Form submission
    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
        taskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveTask();
        });
    }
}

// Debounce function for input events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Load tasks with current filters and sorting
async function loadTasks() {
    try {
        showLoading(true);
        
        const params = new URLSearchParams();
        
        // Add filters
        const entityFilter = document.getElementById('entityFilter').value;
        const taskTypeFilter = document.getElementById('taskTypeFilter').value;
        const contactFilter = document.getElementById('contactFilter').value;
        const statusFilter = document.getElementById('statusFilter').value;
        const dateFilter = document.getElementById('dateFilter').value;
        const sortBy = document.getElementById('sortBy').value;
        const sortOrder = document.getElementById('sortOrder').value;
        
        if (entityFilter) params.append('entity', entityFilter);
        if (taskTypeFilter) params.append('task_type', taskTypeFilter);
        if (contactFilter) params.append('contact', contactFilter);
        if (statusFilter) params.append('status', statusFilter);
        if (dateFilter) params.append('date', dateFilter);
        if (sortBy) params.append('sort_by', sortBy);
        if (sortOrder) params.append('sort_order', sortOrder);
        
        const response = await fetch(`${API_CONFIG.getBaseUrl()}/tasks?${params}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const tasks = await response.json();
        renderTasks(tasks);
        
    } catch (error) {
        console.error('Error loading tasks:', error);
        showAlert('Error loading tasks: ' + error.message, 'danger');
    } finally {
        showLoading(false);
    }
}

// Render tasks in the table
function renderTasks(tasks) {
    const tbody = document.getElementById('tasksTableBody');
    const emptyState = document.getElementById('emptyState');
    const taskCount = document.getElementById('taskCount');
    
    // Update task count
    taskCount.textContent = `${tasks.length} task${tasks.length !== 1 ? 's' : ''}`;
    
    if (tasks.length === 0) {
        tbody.innerHTML = '';
        emptyState.classList.remove('d-none');
        return;
    }
    
    emptyState.classList.add('d-none');
    
    // Clear existing content
    tbody.innerHTML = '';
    
    // Create rows using DOM manipulation for security
    tasks.forEach(task => {
        const row = document.createElement('tr');
        
        // Date created
        const dateCell = document.createElement('td');
        dateCell.textContent = formatDateTime(task.date_created);
        row.appendChild(dateCell);
        
        // Entity name
        const entityCell = document.createElement('td');
        entityCell.textContent = task.entity_name || '';
        row.appendChild(entityCell);
        
        // Task type
        const typeCell = document.createElement('td');
        typeCell.textContent = task.task_type || '';
        row.appendChild(typeCell);
        
        // Task time
        const timeCell = document.createElement('td');
        timeCell.textContent = formatDateTime(task.task_time);
        row.appendChild(timeCell);
        
        // Contact person
        const contactCell = document.createElement('td');
        contactCell.textContent = task.contact_person || '';
        row.appendChild(contactCell);
        
        // Status badge
        const statusCell = document.createElement('td');
        const statusBadge = document.createElement('span');
        statusBadge.className = `badge ${task.status === 'open' ? 'bg-success' : 'bg-secondary'}`;
        
        const statusIcon = document.createElement('i');
        statusIcon.className = `fas ${task.status === 'open' ? 'fa-circle-play' : 'fa-circle-check'} me-1`;
        statusBadge.appendChild(statusIcon);
        
        const statusText = document.createTextNode(
            task.status && task.status.charAt(0).toUpperCase() + task.status.slice(1)
        );
        statusBadge.appendChild(statusText);
        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);
        
        // Actions cell
        const actionsCell = document.createElement('td');
        const btnGroup = document.createElement('div');
        btnGroup.className = 'btn-group btn-group-sm';
        btnGroup.setAttribute('role', 'group');
        
        // Edit button
        const editBtn = document.createElement('button');
        editBtn.type = 'button';
        editBtn.className = 'btn btn-outline-primary';
        editBtn.title = 'Edit Task';
        editBtn.addEventListener('click', () => openEditModal(task.id));
        
        const editIcon = document.createElement('i');
        editIcon.className = 'fas fa-edit';
        editBtn.appendChild(editIcon);
        btnGroup.appendChild(editBtn);
        
        // Status toggle button
        const statusBtn = document.createElement('button');
        statusBtn.type = 'button';
        statusBtn.className = `btn btn-outline-${task.status === 'open' ? 'warning' : 'success'}`;
        statusBtn.title = task.status === 'open' ? 'Mark as Closed' : 'Mark as Open';
        statusBtn.addEventListener('click', () => {
            const newStatus = task.status === 'open' ? 'closed' : 'open';
            toggleTaskStatus(task.id, newStatus);
        });
        
        const statusBtnIcon = document.createElement('i');
        statusBtnIcon.className = `fas fa-${task.status === 'open' ? 'check-circle' : 'undo'}`;
        statusBtn.appendChild(statusBtnIcon);
        btnGroup.appendChild(statusBtn);
        
        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn btn-outline-danger';
        deleteBtn.title = 'Delete Task';
        deleteBtn.addEventListener('click', () => openDeleteModal(task.id, task.entity_name));
        
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fas fa-trash';
        deleteBtn.appendChild(deleteIcon);
        btnGroup.appendChild(deleteBtn);
        
        actionsCell.appendChild(btnGroup);
        
        // Note button (if task has note)
        if (task.note) {
            const noteBtn = document.createElement('button');
            noteBtn.type = 'button';
            noteBtn.className = 'btn btn-sm btn-outline-info ms-1';
            noteBtn.title = 'View Note';
            noteBtn.addEventListener('click', () => showNote(task.note));
            
            const noteIcon = document.createElement('i');
            noteIcon.className = 'fas fa-sticky-note';
            noteBtn.appendChild(noteIcon);
            actionsCell.appendChild(noteBtn);
        }
        
        row.appendChild(actionsCell);
        tbody.appendChild(row);
    });
}

// Open create modal
function openCreateModal() {
    document.getElementById('taskModalTitle').textContent = 'Create New Task';
    document.getElementById('taskForm').reset();
    document.getElementById('taskId').value = '';
    document.getElementById('statusField').style.display = 'none';
    currentEditId = null;
}

// Open edit modal
async function openEditModal(taskId) {
    try {
        const response = await fetch(`/api/tasks`);
        const tasks = await response.json();
        const task = tasks.find(t => t.id === taskId);
        
        if (!task) {
            showAlert('Task not found', 'danger');
            return;
        }
        
        document.getElementById('taskModalTitle').textContent = 'Edit Task';
        document.getElementById('taskId').value = task.id;
        document.getElementById('entityName').value = task.entity_name;
        document.getElementById('taskType').value = task.task_type;
        document.getElementById('taskTime').value = task.task_time.replace(' ', 'T');
        document.getElementById('contactPerson').value = task.contact_person;
        document.getElementById('taskNote').value = task.note || '';
        document.getElementById('taskStatus').value = task.status;
        document.getElementById('statusField').style.display = 'block';
        
        currentEditId = taskId;
        
        const modal = new bootstrap.Modal(document.getElementById('taskModal'));
        modal.show();
        
    } catch (error) {
        console.error('Error loading task for edit:', error);
        showAlert('Error loading task details', 'danger');
    }
}

// Save task (create or update)
async function saveTask() {
    try {
        const taskId = document.getElementById('taskId').value;
        const isEdit = taskId !== '';
        
        const formData = {
            entity_name: document.getElementById('entityName').value,
            task_type: document.getElementById('taskType').value,
            task_time: document.getElementById('taskTime').value,
            contact_person: document.getElementById('contactPerson').value,
            note: document.getElementById('taskNote').value
        };
        
        if (isEdit) {
            formData.status = document.getElementById('taskStatus').value;
        }
        
        // Validate required fields
        if (!formData.entity_name || !formData.task_type || !formData.task_time || !formData.contact_person) {
            showAlert('Please fill in all required fields', 'danger');
            return;
        }
        
        const url = isEdit ? `/api/tasks/${taskId}` : '/api/tasks';
        const method = isEdit ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to save task');
        }
        
        // Close modal and reload tasks
        const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
        modal.hide();
        
        showAlert(`Task ${isEdit ? 'updated' : 'created'} successfully`, 'success');
        loadTasks();
        
    } catch (error) {
        console.error('Error saving task:', error);
        showAlert('Error saving task: ' + error.message, 'danger');
    }
}

// Toggle task status
async function toggleTaskStatus(taskId, newStatus) {
    try {
        const response = await fetch(`/api/tasks/${taskId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to update status');
        }
        
        showAlert(`Task status updated to ${newStatus}`, 'success');
        loadTasks();
        
    } catch (error) {
        console.error('Error updating task status:', error);
        showAlert('Error updating task status: ' + error.message, 'danger');
    }
}

// Open delete modal
function openDeleteModal(taskId, taskName) {
    currentDeleteId = taskId;
    document.getElementById('deleteTaskName').textContent = taskName;
    
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
}

// Confirm delete
async function confirmDelete() {
    if (!currentDeleteId) return;
    
    try {
        const response = await fetch(`/api/tasks/${currentDeleteId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to delete task');
        }
        
        // Close modal and reload tasks
        const modal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
        modal.hide();
        
        showAlert('Task deleted successfully', 'success');
        loadTasks();
        currentDeleteId = null;
        
    } catch (error) {
        console.error('Error deleting task:', error);
        showAlert('Error deleting task: ' + error.message, 'danger');
    }
}

// Show task note in alert
function showNote(note) {
    if (note) {
        alert('Note: ' + note);
    }
}

// Clear all filters
function clearFilters() {
    document.getElementById('entityFilter').value = '';
    document.getElementById('taskTypeFilter').value = '';
    document.getElementById('contactFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('dateFilter').value = '';
    document.getElementById('sortBy').value = 'date_created';
    document.getElementById('sortOrder').value = 'desc';
    loadTasks();
}

// Refresh tasks
function refreshTasks() {
    loadTasks();
}

// Show loading spinner
function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (show) {
        spinner.classList.remove('d-none');
    } else {
        spinner.classList.add('d-none');
    }
}

// Show alert message
function showAlert(message, type = 'info') {
    // Create alert element
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    
    // Safely add message text
    alertDiv.textContent = message;
    
    // Create and add close button
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'btn-close';
    closeBtn.setAttribute('data-bs-dismiss', 'alert');
    alertDiv.appendChild(closeBtn);
    
    // Insert at top of container
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Utility function to escape HTML
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

// Utility function to format datetime
function formatDateTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
}
