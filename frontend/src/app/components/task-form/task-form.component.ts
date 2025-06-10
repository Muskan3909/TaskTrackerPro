import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent implements OnInit {
  @Input() task: Task | null = null;
  @Input() isEdit = false;
  @Output() taskSubmit = new EventEmitter<Task>();
  @Output() cancel = new EventEmitter<void>();

  taskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      entity_name: ['', Validators.required],
      task_type: ['', Validators.required],
      task_time: ['', Validators.required],
      contact_person: ['', Validators.required],
      note: [''],
      status: ['open']
    });
  }

  ngOnInit() {
    if (this.task) {
      this.taskForm.patchValue({
        entity_name: this.task.entity_name,
        task_type: this.task.task_type,
        task_time: this.formatDateTimeForInput(this.task.task_time),
        contact_person: this.task.contact_person,
        note: this.task.note || '',
        status: this.task.status
      });
    }
  }

  onSubmit() {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const task: Task = {
        ...formValue,
        id: this.task?.id
      };
      this.taskSubmit.emit(task);
    }
  }

  onCancel() {
    this.cancel.emit();
  }

  private formatDateTimeForInput(dateTime: string): string {
    if (!dateTime) return '';
    // Convert from "YYYY-MM-DD HH:MM" to "YYYY-MM-DDTHH:MM"
    return dateTime.replace(' ', 'T');
  }
}
