import { ipcRenderer as ipc } from "electron";
import * as React from "react";

// tslint:disable-next-line:interface-name
export interface Props {
  id: string;
  label: string;
  onBlur?: () => void;
}

export class EditTodo extends React.Component<Props> {
  public props: Props = {id: "", label: ""};
  private editTodoInput: HTMLInputElement | null = null;

  constructor(props: Props) {
    super(props);

    this.props = props;
  }

  public componentDidUpdate() {
    if (this.editTodoInput) {
      this.editTodoInput.value = this.props.label;
    }
  }

  public componentDidMount() {
    if (this.editTodoInput) {
      this.editTodoInput.value = this.props.label;
    }
  }

  public render() {
    return (
      <input
        className="edit"
        ref={(input) => { this.editTodoInput = input; }}
        onKeyPress={(event) => this.onKeyPress(event)}
        onKeyDown={(event) => this.onKeyDown(event)}
        onBlur={(event) => this.onBlur(event)}>
      </input>
    );
  }

  private hasValue() {
    return this.editTodoInput &&
      this.editTodoInput.value &&
      this.editTodoInput.value.trim().length !== 0;
  }

  private isSubmit(event: React.KeyboardEvent<HTMLInputElement>) {
    return event.key === "Enter";
  }

  private isDiscard(event: React.KeyboardEvent<HTMLInputElement>) {
    return event.key === "Escape";
  }

  private onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (this.editTodoInput && this.isDiscard(event)) {
      console.log(`Discarding *${this.editTodoInput.value.trim()}*`);
      if (this.props.onBlur) {
        this.props.onBlur();
      }
    }
  }

  private onKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (this.editTodoInput && this.hasValue() && this.isSubmit(event)) {
      console.log(`Saving *${this.editTodoInput.value.trim()}*`);
      ipc.send("electron-sample:on-update", {
        id: this.props.id,
        label: this.editTodoInput.value.trim(),
      });

      if (this.props.onBlur) {
        this.props.onBlur();
      }
    }
  }

  private onBlur(event: React.FocusEvent<HTMLInputElement>) {
    if (this.editTodoInput && this.hasValue()) {
      ipc.send("electron-sample:on-update", {
        id: this.props.id,
        label: this.editTodoInput.value.trim(),
      });
    }

    if (this.props.onBlur) {
      console.log(`Discarding changes: ${event.target.value}`);
      this.props.onBlur();
    }
  }
}
