import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'todo-angular';
  welcome = 'Welcome to Angular course';
  tasks = [
    'Install ng CLI',
    'Create new project',
    'Create Component',
    'Create service'
  ];
}
