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

const AddTodo = () => {
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
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
    const props = this.props;
    const state = store.getState();
    return (
      <Link
        active={state.visibilityFilter === props.filter}
        onLinkClick={() => {
          store.dispatch({
            type: "SET_VISIBILITY_FILTER",
            filter: props.filter
          });
        }}
      >
        {props.children}
      </Link>
    );
  }
}

const Footer = () => (
  <p>
    Show: <FilterLink filter="SHOW_ALL">All</FilterLink>{" "}
    <FilterLink filter="ACTIVE">Active</FilterLink>{" "}
    <FilterLink filter="COMPLETED">Completed</FilterLink>
  </p>
);

class VisisbleTodoList extends React.Component {
  componentDidMount() {
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  render() {
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

const TodoApp = () => (
  <div>
    <AddTodo />
    <Footer />
    <VisisbleTodoList />
  </div>
);

ReactDOM.render(<TodoApp />, document.getElementById("root"));
