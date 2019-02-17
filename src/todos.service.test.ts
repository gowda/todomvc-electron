// some of the chai assertions are kind of confusing for tslint
// Eg., `expect(undefined).to.be.undefined` looks like a statement which
//      should be assigned to a variable, otherwise of no use.
//
// https://github.com/palantir/tslint/issues/2614
//
// tslint:disable:no-unused-expression
import { expect } from "chai";
import { Todo } from "./models/todo";
import { TodoList } from "./models/todo-list";
import { TodosService } from "./todos.service";

describe("TodosService", () => {
  const testNonExistentId = "todomvc-electron-non-existent-id";
  let testTodosService: TodosService;

  context("initially", () => {
    before((done) => {
      testTodosService = new TodosService();
      done();
    });

    it(".getAll() returns an empty array", (done) => {
      expect(testTodosService.getAll()).to.have.length(0);
      done();
    });

    it(".get(<any-id>) throws error", (done) => {
      expect(() => testTodosService.get(testNonExistentId))
        .to.throw(`No todo with id: ${testNonExistentId}`);
      done();
    });

    it(".update(<any-id>, <any-update>) throws error", (done) => {
      expect(
        () => testTodosService.update(testNonExistentId, {completed: true})
      )
        .to.throw(`No todo with id: ${testNonExistentId}`);

      done();
    });

    it(".create(<any-todo>) returns a new todo", (done) => {
      const testTodoAttr = {
        label: "Test created todo",
        completed: false,
      };

      expect(testTodosService.create(testTodoAttr)).to.have.property("id");
      done();
    });
  });

  context("when a single todo exists", () => {
    const testTodoAttr = {
      label: "Test created todo",
      completed: false,
    };
    let testTodo: Todo;

    before((done) => {
      const testTodoList = new TodoList();
      testTodo = testTodoList.create(testTodoAttr);

      testTodosService = new TodosService(testTodoList);

      done();
    });

    after((done) => {
      testTodosService.deleteAll();
      done();
    });

    it(".getAll() returns existing todo in an array", (done) => {
      expect(testTodosService.getAll()).to.have.length(1);
      done();
    });

    it(".get(id) returns existing todo", (done) => {
      expect(testTodosService.get(testTodo.id)).to.have
        .property("label", testTodo.label);
      done();
    });

    it(".get(<non-existing-id>) throws error", (done) => {
      expect(() => testTodosService.get(testNonExistentId))
        .to.throw(`No todo with id: ${testNonExistentId}`);
      done();
    });

    it(".update(id, <>) returns updated todo", (done) => {
      const label = "Updated test todo label";
      expect(testTodosService.update(testTodo.id, {label}))
        .to.have.property("label").equal(label);
      done();
    });

    it(".update(<non-existing-id>, <>) returns undefined", (done) => {
      const label = "Updated test todo label";
      expect(() => testTodosService.update(testNonExistentId, {label}))
        .to.throw(`No todo with id: ${testNonExistentId}`);

      done();
    });

    it(".create(<>) returns a new todo", (done) => {
      const newTodoAttr = {
        label: "Test created todo",
        completed: false,
      };

      expect(testTodosService.create(newTodoAttr)).to.have.property("id");
      done();
    });
  });

  context("when multiple todo items exist", () => {
    const testTodoAttrsList = [
      {
        label: "Test created todo - 1",
        completed: false,
      },
      {
        label: "Test created todo - 2",
        completed: false,
      },
      {
        label: "Test created todo - 3",
        completed: false,
      },
      {
        label: "Test created todo - 4",
        completed: false,
      },
      {
        label: "Test created todo - 5",
        completed: false,
      },
      {
        label: "Test created todo - 6",
        completed: false,
      },
    ];
    const testTodos: Todo[] = [];

    before((done) => {
      const testTodoList = new TodoList();
      testTodoAttrsList.forEach((todoAttrs) => {
        const todo = testTodoList.create(todoAttrs);
        testTodos.push(todo);
      });

      testTodosService = new TodosService(testTodoList);

      done();
    });

    after((done) => {
      testTodosService.deleteAll();
      done();
    });

    it(".getAll() returns all todos in an array", (done) => {
      const todosFromService = testTodosService.getAll();
      expect(todosFromService).to.have.length(testTodoAttrsList.length);
      done();
    });

    it(".get(id) returns existing todo", (done) => {
      const testTodo = testTodos[0];

      expect(testTodosService.get(testTodo.id)).to.equal(testTodo);
      done();
    });

    it(".get(<non-existing-id>) throws error", (done) => {
      expect(() => testTodosService.get(testNonExistentId))
        .to.throw(`No todo with id: ${testNonExistentId}`);
      done();
    });

    it(".update(id, <>) returns updated todo", (done) => {
      const testTodo = testTodos[0];
      const label = "Updated test todo label";
      expect(testTodosService.update(testTodo.id, {label}))
        .to.have.property("label").equal(label);
      done();
    });

    it(".update(<non-existing-id>, <>) returns undefined", (done) => {
      const label = "Updated test todo label";
      expect(() => testTodosService.update(testNonExistentId, {label}))
        .to.throw(`No todo with id: ${testNonExistentId}`);

      done();
    });

    it(".create(<>) returns a new todo", (done) => {
      const newTodoAttr = {
        label: "Test created todo",
        completed: false,
      };

      expect(testTodosService.create(newTodoAttr)).to.have.property("id");
      done();
    });
  });
});
