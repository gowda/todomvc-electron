import { ipcRenderer as ipc } from "electron";
import * as React from "react";
import { Todo } from "../models/todo";
import { TodoItem } from "./todo";

// tslint:disable-next-line:interface-name
interface Props {
  todos: Todo[];
  filter: "active" | "completed" | null;
}

export class TodoList extends React.Component<Props> {
  public render() {
    const { todos } = this.props;
    return (
      <section className={`main ${ todos.length === 0 ? "invisible" : ""}`}>
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          onClick={() => this.handleMarkAllAsComplete()}>
        </input>
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
        { todos.map((todo) => <TodoItem {...todo} key={todo.id}></TodoItem>)}
      </ul>
    </section>
    );
  }

  private handleMarkAllAsComplete() {
    ipc.send("electron-sample:on-mark-all-as-complete");
  }
}
