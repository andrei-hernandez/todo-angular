import { Component, computed, effect, inject, Injector, signal } from '@angular/core';

import { Task } from '../../models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [
    ReactiveFormsModule
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasksSignal = signal<Task[]>([]);
  tasksFilter = signal<'all' | 'pending' | 'completed'>('all');
  selectedTask = signal<number | null>(null);
  tasksByFilter = computed(() => {
    const filter = this.tasksFilter();
    const tasks = this.tasksSignal();

    if (filter === 'all') {
      return tasks;
    }

    if (filter === 'completed') {
      return tasks.filter(task => task.completed);
    }

    if (filter === 'pending') {
      return tasks.filter(task => !task.completed);
    }

    return tasks;
  })

  newTaskControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern(/.*\S.*/)
    ]
  });

  injector = inject(Injector);

  ngOnInit() {
    const tasks = localStorage.getItem('tasks');

    if(tasks) {
      const tasksParsed = JSON.parse(tasks);
      this.tasksSignal.set(tasksParsed);
    }

    this.trackTasks();
  }

  trackTasks() {
    effect(() => {
      const tasks = this.tasksSignal();
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }, { injector: this.injector });
  }


  handleAddTask() {
    if(this.newTaskControl.invalid) {
      return;
    }

    const value = this.newTaskControl.value.trim();
    this.addTask(value);
    this.newTaskControl.reset();
  }

  addTask(title: string) {
    const newTask =  {
      id: Date.now(),
      title,
      completed: false
    }

    this.tasksSignal.update(tasks => [...tasks, newTask]);
  }

  handleToggleCompletedTask(taskIndex: number) {
    this.tasksSignal.update(tasks => tasks.map((task, index) => {
      if (index === taskIndex) {
        return {
          ...task,
          completed: !task.completed
        }
      }

      return task;
    }));
  }

  handleRemoveTask(taskIndex: number) {
    this.tasksSignal.update((tasks) => tasks.filter((_, index) => index !== taskIndex));
  }

  handleSelectTask(taskIndex: number) {
    this.selectedTask.set(taskIndex);
  }

  handleUpdateTask(event: Event) {
    if(this.selectedTask() === null && event.target === null) {
     this.selectedTask.set(null);
      return;
    }

    const newTitle = (event.target as HTMLInputElement).value.trim();

    this.tasksSignal.update(tasks => tasks.map((task, index) => {
      if(index === this.selectedTask()) {
        return {
          ...task,
          title: newTitle
        }
      }

      return task;
    }));

    this.selectedTask.set(null);
  }

  handleUpdateFilter(filter: 'all' | 'pending' | 'completed') {
    this.tasksFilter.set(filter);
  }
}
