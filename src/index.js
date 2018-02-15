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

class TodoApp extends React.Component {
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
    const { filter, todos } = this.props;
    return (
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
          todos={this.getVisibleTodos(todos, filter)}
          onClickTodo={id => {
            store.dispatch({
              type: "TOGGLE_TODO",
              id: id
            });
          }}
        />
        <p>
          Show:{" "}
          <FilterLink currentFilter={filter} filter="SHOW_ALL">
            All
          </FilterLink>{" "}
          <FilterLink currentFilter={filter} filter="ACTIVE">
            Active
          </FilterLink>{" "}
          <FilterLink currentFilter={filter} filter="COMPLETED">
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
