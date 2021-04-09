import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import 'bulma/css/bulma.css';
import { connect } from 'react-redux';
import { addTodo, toggleTodo, deleteTodo, fetchTodos } from './actions/todos';

const Todo = ({ todo, id, onDelete, onToggle }) => (
  <div className="box todo-item level is-mobile">
    <div className="level-left">
      <label className={`level-item todo-description ${todo.done && 'completed'}`}>
        <input
          className="checkbox"
          type="checkbox"
          onChange={() => {
            onToggle(id);
          }}
        />
        <span>{todo.description}</span>
      </label>
    </div>
    <div className="level-right">
      <p
        className="delete level-item"
        onClick={() => {
          onDelete(id);
        }}
      >
        Delete
      </p>
    </div>
  </div>
);

Todo.propTypes = {
  todo: PropTypes.shape({
    done: PropTypes.bool,
    description: PropTypes.string,
  }),
  id: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,
};

const Todos = ({ fetchTodos, addTodo, toggleTodo, deleteTodo, todos, isLoading, isSaving, error } = {}) => {
  const [newTodo, setNewTodo] = useState('');
  const total = todos.length;
  const complete = todos.filter((todo) => todo.done).length;
  const incomplete = todos.filter((todo) => !todo.done).length;

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const add = (event) => {
    event.preventDefault(); // Prevent form from reloading page

    if (newTodo) {
      const todo = { description: newTodo, done: false };
      addTodo(todo);
      setNewTodo('');
    }
  };

  return (
    <section className="section full-column">
      <h1 className="title white">Todos</h1>
      <div className="error">{error}</div>

      <form className="form" onSubmit={add}>
        <div className="field has-addons" style={{ justifyContent: 'center' }}>
          <div className="control">
            <input
              className="input"
              value={newTodo}
              placeholder="New todo"
              onChange={(e) => setNewTodo(e.target.value)}
            />
          </div>

          <div className="control">
            <button
              className={`button is-success ${(isLoading || isSaving) && 'is-loading'}`}
              disabled={isLoading || isSaving}
            >
              Add
            </button>
          </div>
        </div>
      </form>

      <div className=" container todo-list">
        {todos.map((todo) => (
          <Todo
            // eslint-disable-next-line no-underscore-dangle
            key={todo._id}
            // eslint-disable-next-line no-underscore-dangle
            id={todo._id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
          />
        ))}
        <div className="white">
          Total: {total} , Complete: {complete} , Incomplete: {incomplete}
        </div>
      </div>
    </section>
  );
};

const mapStateToProps = (state) => ({
  todos: state.todos.items,
  isLoading: state.todos.loading,
  isSaving: state.todos.saving,
  error: state.todos.error,
});

const mapDispatchToProps = {
  addTodo,
  toggleTodo,
  deleteTodo,
  fetchTodos,
};

export default connect(mapStateToProps, mapDispatchToProps)(Todos);
