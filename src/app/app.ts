import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Task {
  id: number;
  text: string;
  done: boolean;
}

@Component({
  imports: [FormsModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = 'Popis zadataka';
  protected newText = '';
  private nextId = 1;

  protected readonly tasks = signal<Task[]>([]);
  protected readonly remaining = computed(() => this.tasks().filter((t) => !t.done).length);

  protected add(): void {
    const text = this.newText.trim();
    if (!text) return;
    this.tasks.update((list) => [...list, { id: this.nextId++, text, done: false }]);
    this.newText = '';
  }

  protected toggle(id: number): void {
    this.tasks.update((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  protected remove(id: number): void {
    this.tasks.update((list) => list.filter((t) => t.id !== id));
  }
}
