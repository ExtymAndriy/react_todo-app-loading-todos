import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import * as todosServers from '../src/utils/fetchClient';
import { Footer } from './components/Footer';

type Status = 'all' | 'active' | 'completed';

interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
  loading?: boolean;
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Status>('all');
  const [loading, setLoading] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (errorMessage) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const id = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      timeoutRef.current = id;
    }
  }, [errorMessage]);

  useEffect(() => {
    setLoading(true);
    setErrorMessage(null);

    getTodos()
      .then(data => {
        setTodos(data);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  function filterTodos(status: Status) {
    if (status === 'active') {
      return todos.filter(todo => !todo.completed);
    } else if (status === 'completed') {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  }

  const visibleTodos = filterTodos(filterStatus);

  const deleteTodo = (postId: number) => {
    const currentTodos = [...todos];

    todosServers.client.delete(`/todos/${postId}`).catch(error => {
      setTodos(currentTodos);
      setErrorMessage('Unable to delete a todo');
      throw error;
    });

    setTodos(currentPosts => currentPosts.filter(post => post.id !== postId));
  };

  function handleCheckedId(id: number) {
    setTodos(prevTodos =>
      prevTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  }

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  function handleSubmitForm(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (inputValue.trim().length < 1) {
      setErrorMessage('Title should not be empty');
      return;
    }

    const todo = {
      userId: USER_ID,
      title: inputValue,
      completed: false,
    };

    todosServers.client
      .post('/todos', todo)
      .then(newPost => {
        setTodos(currentTodos => [...currentTodos, newPost as Todo]);
        setErrorMessage(null);
        setInputValue('');
      })
      .catch(err => {
        setErrorMessage('Unable to add todo');
        throw err;
      });
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={handleSubmitForm}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={handleInput}
            />
          </form>
        </header>

        {loading && <div data-cy="TodoLoader" className="loader is-active" />}

        {!loading && todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <div
                data-cy="Todo"
                className={todo.completed ? 'todo completed' : 'todo'}
                key={todo.id}
              >
                <label className="todo__status-label">
                  <input
                    type="checkbox"
                    className="todo__status"
                    data-cy="TodoStatus"
                    checked={todo.completed}
                    onChange={() => handleCheckedId(todo.id)}
                    aria-label="Toggle todo status"
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {todo.title}
                </span>

                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => deleteTodo(todo.id)}
                >
                  ×
                </button>

                <div
                  data-cy="TodoLoader"
                  className={
                    todo.loading ? 'modal overlay is-active' : 'modal overlay'
                  }
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}
          </section>
        )}

        {!loading && todos.length > 0 && (
          <Footer
            todos={todos}
            setFilterStatus={setFilterStatus}
            filterStatus={filterStatus}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={
          !errorMessage
            ? 'notification is-danger is-light has-text-weight-normal hidden'
            : 'notification is-danger is-light has-text-weight-normal'
        }
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </div>
  );
};
