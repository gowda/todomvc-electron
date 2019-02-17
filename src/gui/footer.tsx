import { ipcRenderer as ipc } from "electron";
import * as React from "react";
import { Todo } from "../models/todo";

// tslint:disable-next-line:interface-name
interface Props {
  todos: Todo[];
  filter: "active" | "completed" | null;
  activeCount: number;
  totalCount: number;
}

// tslint:disable-next-line:interface-name
interface State {
  filter: "active" | "completed" | null;
}

export class ListFooter extends React.Component<Props, State> {
  public props: Props;
  public state: State = {filter: null};

  constructor(props: Props) {
    super(props);

    this.props = props;
    this.state.filter = props.filter;
  }

  public componentDidUpdate() {
    if (this.state.filter !== this.props.filter) {
      this.setState({filter: this.props.filter});
    } else {
      console.log("ListFooter#componentDidUpdate()#state:", this.state);
      console.log("ListFooter#componentDidUpdate()#props:", this.props);
    }
  }

  public render() {
    console.log("ListFooter#state:", this.state);
    console.log("ListFooter#props:", this.props);
    const { totalCount, activeCount } = this.props;
    const classes = `footer ${totalCount === 0 ? "invisible" : ""}`;

    return (
      <footer className={classes}>
        <span className="todo-count">
          <strong>{activeCount}</strong> items left
        </span>
        <ul className="filters">
          <li>
            <button
              className={this.state.filter === null ? "selected" : ""}
              onClick={() => this.handleFilter()}>
              All
            </button>
          </li>
          <li>
            <button
              className={this.state.filter === "active" ? "selected" : ""}
              onClick={() => this.handleFilter("active")}>
              Active
            </button>
          </li>
          <li>
            <button
              className={this.state.filter === "completed" ? "selected" : ""}
              onClick={() => this.handleFilter("completed")}>
              Completed
            </button>
          </li>
        </ul>
        <button
          className="clear-completed"
          onClick={() => this.handleClearCompleted()}>
          Clear completed
        </button>
      </footer>
    );
  }

  private handleFilter(name: "active" | "completed" | null = null) {
    ipc.send("electron-sample:on-filter", name);
  }

  private handleClearCompleted() {
    ipc.send("electron-sample:on-clear-completed");
  }
}
