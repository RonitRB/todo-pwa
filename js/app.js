const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
tasks.forEach(renderTask);

form.addEventListener('submit', e => {
  e.preventDefault();
  const taskText = input.value.trim();
  if (!taskText) return;
    const task = { id: Date.now(), text: taskText };
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTask(task);
    input.value = '';
  }
);

function renderTask(task) {
  const li = document.createElement('li');
  li.textContent = task.text;
  const btn = document.createElement('button');
  btn.textContent = '✕';
  btn.textContent = 'delete-btn';
  btn.onclick = () => deleteTask(task.id, li);
  li.appendChild(btn);
  li.appendChild(li);
}

function deleteTask(id, element) {
    const index = tasks.findIndex(t => t.id === id);
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    element.remove();
}