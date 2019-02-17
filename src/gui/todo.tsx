import { ipcRenderer as ipc } from "electron";
import * as React from "react";
import { EditTodo } from "./edit-todo";

// tslint:disable-next-line:interface-name
interface Props {
  id: string;
  label: string;
  completed: boolean;
}

// tslint:disable-next-line:interface-name
interface State {
  editMode: boolean;
  completed: boolean;
}

export class TodoItem extends React.Component<Props, State> {
  public props: Props = {id: "", label: "", completed: false};
  public state: State = {editMode: false, completed: false};

  constructor(props: Props) {
    super(props);

    this.props = props;

    this.state.completed = this.props.completed;
  }

  public componentDidUpdate() {
    if (this.state.completed !== this.props.completed) {
      this.setState({completed: this.props.completed});
    }
  }

  public render() {
    const { id, label, completed } = this.props;
    let liClassNames = "";
    if (completed) {
      liClassNames = `${liClassNames} completed`;
    }

    if (this.state.editMode) {
      liClassNames = `${liClassNames} editing`;
    }
    return (
      <li className={liClassNames} id={id}>
        <div
          className={`view ${this.state.editMode ? "invisible" : ""}`}
          onDoubleClick={(event) => this.onDoubleClick(event)}>
          <input
            className="toggle"
            type="checkbox"
            onChange={() => this.onToggleCompleted()}
            checked={this.state.completed}>
          </input>
          <label>{label}</label>
          <button className="destroy" onClick={() => this.onDestroy()}>
          </button>
        </div>
        <EditTodo id={id} label={label} onBlur={() => this.onBlur()}></EditTodo>
      </li>
    );
  }

  private onDoubleClick(_: React.MouseEvent<HTMLDivElement>) {
    this.setState({editMode: true});
  }

  private onBlur() {
    this.setState({editMode: false});
  }

  private onToggleCompleted() {
    ipc.send("electron-sample:on-update", {
        id: this.props.id,
        completed: !this.props.completed,
    });
  }

  private onDestroy() {
    ipc.send("electron-sample:on-delete", this.props.id);
  }
}
