import { ipcRenderer as ipc } from "electron";
import * as React from "react";

export class NewTodo extends React.Component {
  private newTodoInput: HTMLInputElement | null = null;

  public componentDidMount() {
    if (this.newTodoInput) {
      this.newTodoInput.focus();
    }
  }

  public render() {
    return (
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        ref={(input) => { this.newTodoInput = input; }}
        onKeyPress={(event) => this.onKeyPress(event)}
        onKeyDown={(event) => this.onKeyDown(event)}
        onBlur={(_) => this.onBlur()}>
      </input>
    );
  }

  private hasValue() {
    return this.newTodoInput &&
      this.newTodoInput.value &&
      this.newTodoInput.value.trim().length !== 0;
  }

  private isSubmit(event: React.KeyboardEvent<HTMLInputElement>) {
    return event.key === "Enter";
  }

  private isDiscard(event: React.KeyboardEvent<HTMLInputElement>) {
    return event.key === "Escape";
  }

  private onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (this.newTodoInput && this.isDiscard(event)) {
      console.log(`Discarding *${this.newTodoInput.value.trim()}*`);
      this.newTodoInput.value = "";
    }
  }

  private onKeyPress(event: React.KeyboardEvent<HTMLInputElement>) {
    if (this.newTodoInput && this.hasValue()) {
      if (this.isSubmit(event)) {
        console.log(`Saving *${this.newTodoInput.value.trim()}*`);
        ipc.send("electron-sample:on-create", this.newTodoInput.value.trim());
        this.newTodoInput.value = "";
      }
    }
  }

  private onBlur() {
    if (this.newTodoInput && this.hasValue()) {
      ipc.send("electron-sample:on-create", this.newTodoInput.value.trim());
      this.newTodoInput.value = "";
    }
  }
}
