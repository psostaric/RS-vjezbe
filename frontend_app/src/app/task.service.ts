import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from './api.config';

export interface Task {
  id: number;
  text: string;
  done: boolean;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/api/tasks`;

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(this.url);
  }
  create(text: string): Observable<Task> {
    return this.http.post<Task>(this.url, { text });
  }
  update(id: number, changes: Partial<Pick<Task, 'text' | 'done'>>): Observable<Task> {
    return this.http.put<Task>(`${this.url}/${id}`, changes);
  }
  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
