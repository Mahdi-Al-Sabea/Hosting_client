import React, { useState } from 'react';

export default function TodoList({ todos, onAdd, onUpdate, onDelete, onLogout }) {
  const [title, setTitle] = useState('');

  const handleAdd = e => {
    e.preventDefault();
    if (title) {
      onAdd(title);
      setTitle('');
    }
  };

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2>Todo List</h2>
        <button onClick={onLogout}>Logout</button>
      </div>
      <form onSubmit={handleAdd} className="todo-form">
        <input placeholder="New todo" value={title} onChange={e => setTitle(e.target.value)} />
        <button type="submit">Add</button>
      </form>
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo._id} className="todo-item">
            <input type="checkbox" checked={todo.completed} onChange={() => onUpdate(todo._id, !todo.completed, todo.title)} />
            <input value={todo.title} onChange={e => onUpdate(todo._id, todo.completed, e.target.value)} />
            <button onClick={() => onDelete(todo._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
