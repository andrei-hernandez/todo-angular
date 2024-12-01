import { Component, signal } from '@angular/core';
import { NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-labs',
  imports: [
    NgForOf,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    ReactiveFormsModule
  ],
  templateUrl: './labs.component.html',
  styleUrl: './labs.component.css'
})
export class LabsComponent {
  welcome = 'Welcome to Angular course';
  tasks = [
    'Install ng CLI',
    'Create new project',
    'Create Component',
    'Create service'
  ];
  name =  signal('Andrei');
  age = 22;
  isButtonDisabled = false;
  tasksSignal = signal([
    'Install ng CLI',
    'Create new project',
    'Create Component',
    'Create service'
  ])
  person = {
    name: 'Andrei',
    age: 22,
    avatar: 'https://angular.io/assets/images/logos/angular/angular.png'
  }
  personSignal = signal({
    name: 'Juan',
    age: 22,
    avatar: 'https://angular.io/assets/images/logos/angular/angular.png'
  });

  colorCtrl = new FormControl();
  widthCtrl = new FormControl();
  nameCtrl = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(3)
    ]
  });

  handleClick() {
    alert('Hello from Angular');
  }

  inputHandler(event: Event) {
    console.info(event);
  }

  keydownHandler(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    console.info(input.value);
  }

  changeName(event: Event) {
    const newName = (event.target as HTMLInputElement).value;
    this.name.set(newName);
  }

  changeAge(event: Event) {
    const newAge = (event.target as HTMLInputElement).value;
    this.personSignal.update(person => ({
      ...person,
      age: parseInt(newAge)
    }));
  }
}
