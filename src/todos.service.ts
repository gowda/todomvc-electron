import { Todo } from "./models/todo";
import { TodoAttrs } from "./models/todo-attrs";
import { TodoList } from "./models/todo-list";

export type TodoListFilter = "active" | "completed" | null;

export class TodosService {
  private todoList: TodoList;

  constructor(todoList?: TodoList) {
    if (todoList) {
      this.todoList = todoList;
    } else {
      this.todoList = new TodoList();
    }
  }

  public getAll(): Todo[] {
    return this.todoList.getAll();
  }

  public get(id: string): Todo {
    return this.todoList.get(id);
  }

  public create(todoAttrs: TodoAttrs): Todo {
    return this.todoList.create(todoAttrs);
  }

  public update(id: string, todoAttrs: TodoAttrs): Todo {
    return this.todoList.update(id, todoAttrs);
  }

  public delete(id: string) {
    return this.todoList.delete(id);
  }

  public deleteAll() {
    return this.todoList.deleteAll();
  }

  public filter(filter: TodoListFilter) {
    let filterFn: (t: Todo) => boolean;

    switch (filter) {
      case "active":
        filterFn = (t: Todo) => !t.completed;
        break;
      case "completed":
        filterFn = (t: Todo) => t.completed;
        break;
      default:
        filterFn = (_: Todo) => true;
        break;
    }

    return this.todoList.getAll().filter(filterFn);
  }

  public clearCompleted() {
    const completedTodos = this.filter("completed");

    completedTodos.forEach((todo: Todo) => {
      this.todoList.delete(todo.id);
    });
  }

  public markAllAsCompleted() {
    const todos = this.getAll();

    todos.forEach((todo: Todo) => {
      this.todoList.update(todo.id, {completed: true});
    });
  }
}
