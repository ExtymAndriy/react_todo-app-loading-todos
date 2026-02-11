import React from 'react';
import { Todo as TodoType } from '../types/Todo';

type Props = {
  todo: TodoType;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
};

export const Todo: React.FC<Props> = ({ todo, onDelete, onToggle }) => {
  const checkboxId = `todo-status-${todo.id}`;

  return (
    <div data-cy="Todo" className={todo.completed ? 'todo completed' : 'todo'}>
      <label className="todo__status-label" htmlFor={checkboxId}>
        <input
          id={checkboxId}
          type="checkbox"
          className="todo__status"
          data-cy="TodoStatus"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <span className="visually-hidden">Toggle status</span>
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>
    </div>
  );
};
