import { useState, useEffect } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/tasks`).then(r => r.json()),
      fetch(`${API_URL}/health`).then(r => r.json()),
    ]).then(([tasks, health]) => {
      setTasks(tasks);
      setHealth(health);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const addTask = async () => {
    if (!input.trim()) return;
    const res = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: input }),
    });
    const task = await res.json();
    setTasks(prev => [...prev, task]);
    setInput('');
  };

  const toggleTask = (id) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, done: !t.done } : t)
    );
  };

  return (
    <div className="app">
      <header className="header">
        <div className="logo">⚡ DevOps CI/CD</div>
        <div className={`health-badge ${health?.status === 'ok' ? 'ok' : 'fail'}`}>
          {health ? `API ${health.status.toUpperCase()}` : 'Connecting...'}
        </div>
      </header>

      <main className="main">
        <h1>CI/CD Task Tracker</h1>
        <p className="subtitle">React + Express · Docker · GitHub Actions</p>

        <div className="add-task">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addTask()}
            placeholder="Add a new task..."
          />
          <button onClick={addTask}>Add</button>
        </div>

        {loading ? (
          <div className="loading">Loading from API...</div>
        ) : (
          <ul className="task-list">
            {tasks.map(task => (
              <li
                key={task.id}
                className={`task-item ${task.done ? 'done' : ''}`}
                onClick={() => toggleTask(task.id)}
              >
                <span className="check">{task.done ? '✓' : '○'}</span>
                {task.title}
              </li>
            ))}
          </ul>
        )}

        <div className="pipeline">
          <h2>Pipeline Stages</h2>
          <div className="stages">
            {['Code Push', 'Build', 'Test', 'Docker Build', 'Push to GHCR', 'Deploy'].map((s, i) => (
              <div className="stage" key={i}>
                <div className="stage-dot" />
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
