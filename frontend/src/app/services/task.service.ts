import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskFilters } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) { }

  getTasks(filters?: TaskFilters): Observable<Task[]> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.entity) params = params.set('entity', filters.entity);
      if (filters.task_type) params = params.set('task_type', filters.task_type);
      if (filters.contact) params = params.set('contact', filters.contact);
      if (filters.status) params = params.set('status', filters.status);
      if (filters.date) params = params.set('date', filters.date);
      if (filters.sort_by) params = params.set('sort_by', filters.sort_by);
      if (filters.sort_order) params = params.set('sort_order', filters.sort_order);
    }

    return this.http.get<Task[]>(`${this.baseUrl}/tasks`, { params });
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(`${this.baseUrl}/tasks`, task);
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/tasks/${id}`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/tasks/${id}`);
  }

  updateTaskStatus(id: number, status: string): Observable<Task> {
    return this.http.patch<Task>(`${this.baseUrl}/tasks/${id}/status`, { status });
  }

  getFilterOptions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/filters`);
  }
}
