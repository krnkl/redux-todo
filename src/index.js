import React from "react";
import { Provider } from "react-redux";
import PropTypes from "prop-types";
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

let nextTodoId = 0;

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

const AddTodo = (props, { store }) => {
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
          store.dispatch({
            type: "ADD_TODO",
            id: nextTodoId++,
            text: input.value
          });
          input.value = "";
          input.focus();
        }}
      >
        Add Todo
      </button>
    </div>
  );
};

AddTodo.contextTypes = {
  store: PropTypes.object
};

const Link = ({ active, children, onLinkClick }) => {
  if (active) {
    return <span>{children}</span>;
  }
  return (
    <a
      href="#"
      onClick={e => {
        e.preventDefault();
        onLinkClick();
      }}
    >
      {children}
    </a>
  );
};

class FilterLink extends React.Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    const { filter, children } = this.props;
    const { store } = this.context;
    const state = store.getState();
    return (
      <Link
        active={state.visibilityFilter === filter}
        onLinkClick={() => {
          store.dispatch({
            type: "SET_VISIBILITY_FILTER",
            filter
          });
        }}
      >
        {children}
      </Link>
    );
  }
}
FilterLink.contextTypes = {
  store: PropTypes.object
};
const Footer = () => (
  <p>
    Show: <FilterLink filter="SHOW_ALL">All</FilterLink>{" "}
    <FilterLink filter="ACTIVE">Active</FilterLink>{" "}
    <FilterLink filter="COMPLETED">Completed</FilterLink>
  </p>
);

class VisisbleTodoList extends React.Component {
  componentDidMount() {
    const { store } = this.context;
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    const { store } = this.context;
    const { todos, visibilityFilter } = store.getState();
    return (
      <TodoList
        todos={getVisibleTodos(todos, visibilityFilter)}
        onClickTodo={id => {
          store.dispatch({
            type: "TOGGLE_TODO",
            id: id
          });
        }}
      />
    );
  }
}
VisisbleTodoList.contextTypes = {
  store: PropTypes.object
};

const getVisibleTodos = (todos, filter) => {
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

const TodoApp = ({ store }) => (
  <div>
    <AddTodo />
    <Footer />
    <VisisbleTodoList />
  </div>
);

ReactDOM.render(
  <Provider store={createStore(todoApp)}>
    <TodoApp />
  </Provider>,
  document.getElementById("root")
);
