import { CommonModule } from '@angular/common';
import { Component, computed, effect, OnInit, signal } from '@angular/core';
import { FilterType, TodoModel } from '../../models/todo';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.css'
})
export class TodoComponent implements OnInit {
  todoList = signal<TodoModel[]>([
    {
      id: 1,
      title: 'Aprender Angular',
      completed: false,
      editing: false
    },
    {
      id: 2,
      title: 'Aprender React',
      completed: false,
      editing: false
    },
    {
      id: 3,
      title: 'aprender Vue',
      completed: false,
      editing: false
    },
    {
      id: 4,
      title: 'Aprender Svelte',
      completed: false,
      editing: false
    }
  ]);
  
  filter = signal<FilterType>('all');
  
  todoListFiltered = computed(() => {
    const filter = this.filter();
    const todos = this.todoList();
    
    switch (filter) {
      case 'completed':
        return todos.filter(todo => todo.completed);
        case 'active':
          return todos.filter(todo => !todo.completed);
          default:
            return todos;
    }
  });
  
  newTodo = new FormControl('',
    { validators: [Validators.required, Validators.minLength(2)] }
  );
  
  showError = false;

  constructor() { 
    // console.log('constructor');
    // el efecto se lanza cada vez que cambia el valor de la señal todoList y al inicio
    effect(() => {
      // console.log('efecto');
      localStorage.setItem('todos', JSON.stringify(this.todoList()));
    });
   }
  
  ngOnInit(): void {
    // console.log('ngOnInit');
    const storage = localStorage.getItem('todos');
    if (storage) {
      this.todoList.set(JSON.parse(storage));
    }
  }

  changeFilter(filterString: FilterType) {
    this.filter.set(filterString);
  }
  
  addTodo() {
    const newTodoTitle = this.newTodo.value?.trim();

    if (this.newTodo.valid && newTodoTitle) {
      this.todoList.update((prev_todos: TodoModel[]) => {
        return [
          ...prev_todos,
          {
            id: prev_todos.length + 1,
            title: newTodoTitle,
            completed: false,
            editing: false
          }
        ];
      });
      this.newTodo.reset();
      this.showError = false;
    } else {
      this.newTodo.reset();
      this.showError = true;
    }
  }

  toggleTodo(todoId: number) {
    this.todoList.update((prev_todos) => prev_todos.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          completed: !todo.completed
        };
      }
      return todo;
    }));
  }

  removeTodo(todoId: number) {

    Swal.fire({
      title: "¿Tarea completada?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Eliminada!",
          text: "Una tarea menos!.",
          icon: "success"
        });
        this.todoList.update((prev_todos) => prev_todos.filter(todo => todo.id !== todoId));
      }
    });

  }

  editTodoTitle(todoId: number) {
    this.todoList.update((prev_todos) => prev_todos.map(todo => {
      
      if (todo.id === todoId) {
        return {
          ...todo,
          editing: true
        };
      } else{
        return {
          ...todo,
          editing: false
        };
      }
    }));
  }

  saveTodoTitle(todoId: number, event: Event){
    // console.log({event});
    const title = (event.target as HTMLInputElement).value;
    this.todoList.update((prev_todos) => prev_todos.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          title: title,
          editing: false
        };
      }
      return todo;
    }));
  }

}
