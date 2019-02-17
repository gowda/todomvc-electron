import { app as electron, BrowserWindow, ipcMain as ipc } from "electron";
import { Todo } from "./models/todo";
import { TodoListFilter, TodosService } from "./todos.service";

export class Application {
  private todosService: TodosService;
  private filter: TodoListFilter = null;

  constructor(todosService?: TodosService) {
    if (todosService) {
      this.todosService = todosService;
    } else {
      this.todosService = new TodosService();
    }
  }

  public run() {
    electron.on("ready", () => this.createWindow());
    electron.on("window-all-closed", () => this.quit());
  }

  public quit() {
    electron.quit();
  }

  private loadContent(window: BrowserWindow) {
    console.log("Loading content...");
    window.loadURL(`file:///Users/gowda/js/electron-sample/src/main.html`);
    console.log("DONE");

    // FIXME: why not?
    // window.loadFile("src/main.html");
  }

  private loadTodos(window: BrowserWindow) {
    // Not the most efficient implementation
    const todos = this.todosService.filter(this.filter);
    const allTodos = this.todosService.getAll();

    window.webContents.send("electron-sample:on-ready", {
      todos,
      filter: this.filter,
      activeCount: allTodos.filter((t) => !t.completed).length,
      totalCount: allTodos.length,
    });
  }

  private createWindow() {
    const window = new BrowserWindow({width: 1600, height: 800});

    window.on("close", () => this.quit());
    window.webContents.on("dom-ready", () => {
      console.log("dom-ready event received");

      this.loadTodos(window);

      ipc.on("electron-sample:on-create", (_: any, label: string) => {
        console.log("Need to create a new todo with label:", label);
        this.todosService.create({label, completed: false});

        this.loadTodos(window);
      });

      ipc.on("electron-sample:on-update", (_: any, todo: Todo) => {
        console.log("Updating todo:", todo);
        this.todosService.update(todo.id, todo);

        this.loadTodos(window);
      });

      ipc.on("electron-sample:on-delete", (_: any, id: string) => {
        console.log("Deleting todo:", id);
        this.todosService.delete(id);

        this.loadTodos(window);
      });

      ipc.on("electron-sample:on-filter",
        (_: any, filter: TodoListFilter) => {
          this.filter = filter;
          this.loadTodos(window);
      });

      ipc.on("electron-sample:on-clear-completed", (_: any) => {
        this.todosService.clearCompleted();

        this.loadTodos(window);
      });

      ipc.on("electron-sample:on-mark-all-as-complete", (_: any) => {
        this.todosService.markAllAsCompleted();

        this.loadTodos(window);
      });
    });

    this.loadContent(window);

    // window.webContents.openDevTools();
  }
}
