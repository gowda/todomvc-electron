import { ipcRenderer as ipc } from "electron";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { MainContainer } from "./gui/main-container";
import { NewTodo } from "./gui/new-todo";
import { Todo } from "./models/todo";

// tslint:disable-next-line:interface-name
interface Data {
  todos: Todo[];
  filter: "active" | "completed" | null;
  activeCount: number;
  totalCount: number;
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded message received");

  ipc.on("electron-sample:on-ready", (event: Event, data: Data) => {
    console.log("event message received:", event);
    console.log("event data received:", data);

    const newTodoContainer = document.querySelector("#new-todo");
    ReactDOM.render(<NewTodo></NewTodo>, newTodoContainer);

    const mainContainer = document.querySelector("#content-main");
    ReactDOM.render(
      <MainContainer {...data}></MainContainer>,
      mainContainer
    );
  });
});
