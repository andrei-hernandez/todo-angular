import { Component, signal } from '@angular/core';
import { NgForOf } from '@angular/common';
import { Task } from '../../models/task.model';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  tasksSignal = signal<Task[]>([
    {
      id: Date.now(),
      title: 'Install ng CLI',
      completed: false
    },
    {
      id: Date.now(),
      title: 'Create new project',
      completed: false
    },
    {
      id: Date.now(),
      title: 'Create Component',
      completed: false
    },
    {
      id: Date.now(),
      title: 'Create service',
      completed: false
    }
  ]);
  tasksFilter = signal('all');
  selectedTask = signal<number | null>(null);

  newTaskControl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern(/.*\S.*/)
    ]
  });


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

  handleUpdateFilter(filter: string) {
    this.tasksFilter.set(filter);
  }
}
