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

const FilterLink = ({ children, currentFilter, filter, onFilterClick }) => {
  if (filter === currentFilter) {
    return <span>{children}</span>;
  }
  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        onFilterClick(filter);
      }}
    >
      {children}
    </a>
  );
};

const Todo = ({ text, completed, onClickTodo }) => (
  <li
    onClick={onClickTodo}
    style={{
      textDecoration: completed ? "line-through" : "none"
    }}
  >
    {text}
  </li>
);

const TodoList = ({ todos, onClickTodo }) => (
  <ul>
    {todos.map(todo => (
      <Todo key={todo.id} {...todo} onClickTodo={() => onClickTodo(todo.id)} />
    ))}
  </ul>
);

const AddTodo = ({ onAddClick }) => {
  let input = "";
  return (
    <div>
      <input
        ref={node => {
          input = node;
        }}
      />
      <button
        onClick={() => {
          onAddClick(input.value);
          input.value = "";
        }}
      >
        Add Todo
      </button>
    </div>
  );
};

const Footer = ({ currentFilter, onFilterClick }) => (
  <p>
    Show:{" "}
    <FilterLink
      currentFilter={currentFilter}
      onFilterClick={onFilterClick}
      filter="SHOW_ALL"
    >
      All
    </FilterLink>{" "}
    <FilterLink
      currentFilter={currentFilter}
      onFilterClick={onFilterClick}
      filter="ACTIVE"
    >
      Active
    </FilterLink>{" "}
    <FilterLink
      currentFilter={currentFilter}
      onFilterClick={onFilterClick}
      filter="COMPLETED"
    >
      Completed
    </FilterLink>
  </p>
);

const getVisibleTodos = (todos, filter) => {
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

const TodoApp = ({ filter, todos }) => (
  <div>
    <AddTodo
      onAddClick={text => {
        store.dispatch({
          type: "ADD_TODO",
          id: nextTodoId++,
          text: text
        });
      }}
    />
    <TodoList
      todos={getVisibleTodos(todos, filter)}
      onClickTodo={id => {
        store.dispatch({
          type: "TOGGLE_TODO",
          id: id
        });
      }}
    />
    <Footer
      currentFilter={filter}
      onFilterClick={filter => {
        store.dispatch({
          type: "SET_VISIBILITY_FILTER",
          filter: filter
        });
      }}
    />
  </div>
);

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
