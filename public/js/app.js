const API_URL  = '/api/tasks';
const form     = document.getElementById('todo-form');
const input    = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

let tasks = [];

async function loadTasks() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Network response not ok');
    tasks = await res.json();
  } catch (err) {
    tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  }
  tasks.forEach(renderTask);
  updateCounters();
}

async function addTask(newTask) {
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    });
    if (!res.ok) throw new Error('Failed to save remotely');
    return await res.json();
  } catch (err) {
    tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    return newTask;
  }
}

async function removeTask(id) {
  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.error('Failed to delete remotely');
  }
  tasks = tasks.filter(t => t.id !== id);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function toggleComplete(id, isComplete, li) {
  fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: isComplete })
  }).catch(() => {
    console.error('Failed to update remotely');
  });
  
  const task = tasks.find(t => t.id === id);
  task.completed = isComplete;
  localStorage.setItem('tasks', JSON.stringify(tasks));

  li.classList.toggle('completed', isComplete);
  updateCounters();
}

function renderTask(task) {
  const li = document.createElement('li');

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => {
    toggleComplete(task.id, checkbox.checked, li);
  });
  li.appendChild(checkbox);

  const span = document.createElement('span');
  span.textContent = task.text;
  li.appendChild(span);

  const btn = document.createElement('button');
  btn.className = 'delete-btn';
  btn.textContent = '✕';
  btn.addEventListener('click', () => {
    removeTask(task.id);
    li.remove();
    updateCounters();
  });
  li.appendChild(btn);

  if (task.completed) {
    li.classList.add('completed');
  }

  todoList.appendChild(li);
}

function updateCounters() {
  const total = tasks.length;
  const pending = tasks.filter(t => !t.completed).length;
  document.getElementById('total-count').textContent = `Total: ${total}`;
  document.getElementById('pending-count').textContent = `Pending: ${pending}`;
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  const newTask = { id: Date.now(), text, completed: false };
  const saved = await addTask(newTask);
  renderTask(saved);
  input.value = '';
  updateCounters();
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/js/sw.js')
      .then(() => console.log('SW registered'))
      .catch(console.error);
  });
}

loadTasks();