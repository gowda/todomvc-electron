import { Todo } from "./todo";
import { TodoAttrs } from "./todo-attrs";

export class TodoList {
  private todos: Todo[];
  private idCounter: number = 0;

  constructor(todos?: Todo[]) {
    if (todos) {
      this.todos = todos;
    } else {
      this.todos = [];
    }
  }

  public getAll(): Todo[] {
    return this.todos;
  }

  public get(id: string): Todo {
    const todo = this.todos.find((todoItem) => todoItem.id === id);

    if (!todo) {
      throw new Error(`No todo with id: ${id}`);
    }

    return todo;
  }

  public create(todoAttrs: TodoAttrs): Todo {
    const todo = {
      label: todoAttrs.label as string,
      completed: todoAttrs.completed || false,
      id: this.nextID(),
    };

    this.todos.push(todo);

    return todo;
  }

  public update(id: string, todoAttrs: TodoAttrs): Todo {
    const todo = this.get(id);

    if (todoAttrs.completed !== null || todoAttrs.completed !== undefined) {
      todo.completed = todoAttrs.completed as boolean;
    }

    if (todoAttrs.label) {
      todo.label = todoAttrs.label;
    }

    return todo;
  }

  public delete(id: string) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  public deleteAll() {
    this.todos = [];
  }

  private nextID(): string {
    return `todomvc-electron-${this.idCounter++}`;
  }
}
