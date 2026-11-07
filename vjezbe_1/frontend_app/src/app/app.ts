import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task, TaskService } from './task.service';

@Component({
  imports: [FormsModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly api = inject(TaskService);

  protected readonly title = 'Popis zadataka';
  protected newText = '';

  protected readonly tasks = signal<Task[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly remaining = computed(() => this.tasks().filter((t) => !t.done).length);

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set('');
    this.api.getAll().subscribe({
      next: (list) => {
        this.tasks.set(list);
        this.loading.set(false);
      },
      error: () => this.fail('Ne mogu dohvatiti zadatke s poslužitelja.'),
    });
  }

  protected add(): void {
    const text = this.newText.trim();
    if (!text) return;
    this.api.create(text).subscribe({
      next: (task) => {
        this.tasks.update((list) => [...list, task]);
        this.newText = '';
        this.error.set('');
      },
      error: () => this.fail('Dodavanje nije uspjelo.'),
    });
  }

  protected toggle(task: Task): void {
    this.api.update(task.id, { done: !task.done }).subscribe({
      next: (updated) =>
        this.tasks.update((list) => list.map((t) => (t.id === updated.id ? updated : t))),
      error: () => this.fail('Izmjena nije uspjela.'),
    });
  }

  protected remove(id: number): void {
    this.api.remove(id).subscribe({
      next: () => this.tasks.update((list) => list.filter((t) => t.id !== id)),
      error: () => this.fail('Brisanje nije uspjelo.'),
    });
  }

  private fail(message: string): void {
    this.loading.set(false);
    this.error.set(message);
  }
}
