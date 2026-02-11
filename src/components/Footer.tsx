import React from 'react';
import { Todo } from '../types/Todo';

type Status = 'all' | 'active' | 'completed';

type Props = {
  todos: Todo[];
  filterStatus: Status;
  setFilterStatus: (status: Status) => void;
};

export const Footer: React.FC<Props> = ({
  todos,
  filterStatus,
  setFilterStatus,
}) => {
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {activeCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <button
          type="button"
          className={`filter__link ${filterStatus === 'all' ? 'selected' : ''}`}
          data-cy="FilterLinkAll"
          onClick={() => setFilterStatus('all')}
        >
          All
        </button>

        <button
          type="button"
          className={`filter__link ${
            filterStatus === 'active' ? 'selected' : ''
          }`}
          data-cy="FilterLinkActive"
          onClick={() => setFilterStatus('active')}
        >
          Active
        </button>

        <button
          type="button"
          className={`filter__link ${
            filterStatus === 'completed' ? 'selected' : ''
          }`}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilterStatus('completed')}
        >
          Completed
        </button>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={completedCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
