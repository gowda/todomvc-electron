import * as React from "react";
import { Todo } from "../models/todo";
import { ListFooter } from "./footer";
import { TodoList } from "./todo-list";

// tslint:disable-next-line:interface-name
interface Props {
  todos: Todo[];
  filter: "active" | "completed" | null;
  activeCount: number;
  totalCount: number;
}

export const MainContainer = (props: Props) => {
  return (
    <div>
      <TodoList todos={props.todos} filter={props.filter}></TodoList>
      <ListFooter {...props}></ListFooter>
    </div>
  );
};
