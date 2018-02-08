import React from "react";
import ReactDOM from "react-dom";
import { createStore, combineReducers } from "redux";
import { todos, visibilityFilter } from "./todo";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
};
const todoApp = combineReducers({
  todos,
  visibilityFilter
});

const store = createStore(todoApp);

let nextTodoId = 0;

const FilterLink = ({ children, currentFilter, filter }) => {
  if (filter === currentFilter) {
    return <span>{children}</span>;
  }
  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        store.dispatch({
          type: "SET_VISIBILITY_FILTER",
          filter: filter
        });
      }}
    >
      {children}
    </a>
  );
};

class TodoApp extends React.Component {
  listTodos = allTodos =>
    allTodos.map(todo => (
      <li
        onClick={() => {
          store.dispatch({
            type: "TOGGLE_TODO",
            id: todo.id
          });
        }}
        key={todo.id}
        style={{
          textDecoration: todo.completed ? "line-through" : "none"
        }}
      >
        {todo.text}
      </li>
    ));

  getVisibleTodos = (todos, filter) => {
    console.log("get visible", filter);
    switch (filter) {
      case "SHOW_ALL":
        return todos;
      case "ACTIVE":
        return todos.filter(t => !t.completed);
      case "COMPLETED":
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  };
  render() {
    return (
      <div>
        <input
          ref={node => {
            this.input = node;
          }}
        />
        <button
          onClick={() => {
            let newTodo = {
              type: "ADD_TODO",
              text: this.input.value,
              id: nextTodoId++
            };
            store.dispatch(newTodo);
            this.input.value = "";
          }}
        >
          Add Todo
        </button>
        <ul>
          {this.listTodos(
            this.getVisibleTodos(this.props.todos, this.props.filter)
          )}
        </ul>
        <p>
          Show:{" "}
          <FilterLink currentFilter={this.props.filter} filter="SHOW_ALL">
            All
          </FilterLink>{" "}
          <FilterLink currentFilter={this.props.filter} filter="ACTIVE">
            Active
          </FilterLink>{" "}
          <FilterLink currentFilter={this.props.filter} filter="COMPLETED">
            Completed
          </FilterLink>
        </p>
      </div>
    );
  }
}

const render = () => {
  ReactDOM.render(
    <TodoApp
      filter={store.getState().visibilityFilter}
      todos={store.getState().todos}
    />,
    document.getElementById("root")
  );
};

store.subscribe(render);
render();
