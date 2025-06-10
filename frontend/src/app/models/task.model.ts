export interface Task {
  id?: number;
  date_created?: string;
  entity_name: string;
  task_type: string;
  task_time: string;
  contact_person: string;
  note?: string;
  status: 'open' | 'closed';
}

export interface TaskFilters {
  entity?: string;
  task_type?: string;
  contact?: string;
  status?: string;
  date?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}