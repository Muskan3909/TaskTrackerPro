import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import { Task, TaskFilters } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  imports: [CommonModule, FormsModule, TaskFormComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  currentTask: Task | null = null;
  isEditMode = false;
  showTaskForm = false;
  
  filters: TaskFilters = {
    sort_by: 'date_created',
    sort_order: 'desc'
  };

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks(this.filters).subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.filteredTasks = tasks;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        alert('Error loading tasks. Please make sure the backend server is running.');
      }
    });
  }

  applyFilters() {
    this.loadTasks();
  }

  clearFilters() {
    this.filters = {
      sort_by: 'date_created',
      sort_order: 'desc'
    };
    this.loadTasks();
  }

  openCreateModal() {
    this.currentTask = null;
    this.isEditMode = false;
    this.showTaskForm = true;
  }

  openEditModal(task: Task) {
    this.currentTask = { ...task };
    this.isEditMode = true;
    this.showTaskForm = true;
  }

  onTaskSubmit(task: Task) {
    if (this.isEditMode && task.id) {
      this.taskService.updateTask(task.id, task).subscribe({
        next: () => {
          this.showTaskForm = false;
          this.loadTasks();
          alert('Task updated successfully');
        },
        error: (error) => {
          console.error('Error updating task:', error);
          alert('Error updating task');
        }
      });
    } else {
      this.taskService.createTask(task).subscribe({
        next: () => {
          this.showTaskForm = false;
          this.loadTasks();
          alert('Task created successfully');
        },
        error: (error) => {
          console.error('Error creating task:', error);
          alert('Error creating task');
        }
      });
    }
  }

  onCancel() {
    this.showTaskForm = false;
    this.currentTask = null;
  }

  toggleTaskStatus(task: Task) {
    const newStatus = task.status === 'open' ? 'closed' : 'open';
    if (task.id) {
      this.taskService.updateTaskStatus(task.id, newStatus).subscribe({
        next: () => {
          this.loadTasks();
          alert(`Task status updated to ${newStatus}`);
        },
        error: (error) => {
          console.error('Error updating status:', error);
          alert('Error updating task status');
        }
      });
    }
  }

  deleteTask(task: Task) {
    if (confirm(`Are you sure you want to delete the task for ${task.entity_name}?`)) {
      if (task.id) {
        this.taskService.deleteTask(task.id).subscribe({
          next: () => {
            this.loadTasks();
            alert('Task deleted successfully');
          },
          error: (error) => {
            console.error('Error deleting task:', error);
            alert('Error deleting task');
          }
        });
      }
    }
  }

  formatDateTime(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  showNote(note: string) {
    if (note) {
      alert('Note: ' + note);
    }
  }
}
