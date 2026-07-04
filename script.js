const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const historyToggle = document.getElementById('history-toggle');
const historyPanel = document.getElementById('history-panel');
const historyList = document.getElementById('history-list');
const clearHistoryButton = document.getElementById('clear-history');
const taskCount = document.getElementById('task-count');
const clearAllButton = document.getElementById('clear-all-btn');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let deletedTasks = JSON.parse(localStorage.getItem('deletedTasks')) || [];

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function saveDeletedTasks() {
  localStorage.setItem('deletedTasks', JSON.stringify(deletedTasks));
}

function updateTaskCount() {
  const remaining = todos.filter((todo) => !todo.completed).length;
  const completed = todos.filter((todo) => todo.completed).length;
  taskCount.textContent = `${remaining} active • ${completed} done`;
}

function renderTodos() {
  list.innerHTML = '';

  if (todos.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.textContent = 'No tasks yet. Add one above.';
    emptyItem.style.justifyContent = 'center';
    emptyItem.style.color = '#64748b';
    list.appendChild(emptyItem);
    updateTaskCount();
    return;
  }

  todos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = `todo-item ${todo.completed ? 'completed' : ''}`;

    const text = document.createElement('span');
    text.textContent = todo.text;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const toggleButton = document.createElement('button');
    toggleButton.textContent = todo.completed ? 'Undo' : 'Done';
    toggleButton.addEventListener('click', () => toggleTodo(todo.id));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-btn';
    deleteButton.addEventListener('click', () => deleteTodo(todo.id));

    actions.appendChild(toggleButton);
    actions.appendChild(deleteButton);
    item.appendChild(text);
    item.appendChild(actions);
    list.appendChild(item);
  });

  updateTaskCount();
}

function addTodo(text) {
  const trimmedText = text.trim();
  if (!trimmedText) return;

  todos.unshift({
    id: Date.now(),
    text: trimmedText,
    completed: false,
  });

  saveTodos();
  renderTodos();
}

function toggleTodo(id) {
  todos = todos.map((todo) =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );

  saveTodos();
  renderTodos();
}

function deleteTodo(id) {
  const todoToDelete = todos.find((todo) => todo.id === id);
  if (todoToDelete) {
    deletedTasks.unshift({
      id: Date.now(),
      text: todoToDelete.text,
      deletedAt: new Date().toLocaleString(),
    });
  }

  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  saveDeletedTasks();
  renderTodos();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = '';

  if (deletedTasks.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.textContent = 'No deleted tasks yet.';
    emptyItem.className = 'history-empty';
    historyList.appendChild(emptyItem);
    return;
  }

  deletedTasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = 'history-item';

    const text = document.createElement('span');
    text.textContent = task.text;

    const meta = document.createElement('small');
    meta.textContent = task.deletedAt;

    item.appendChild(text);
    item.appendChild(meta);
    historyList.appendChild(item);
  });
}

function clearHistory() {
  deletedTasks = [];
  saveDeletedTasks();
  renderHistory();
}

function clearAllTasks() {
  if (todos.length === 0) return;

  deletedTasks = [
    ...todos.map((todo) => ({
      id: Date.now() + Math.random(),
      text: todo.text,
      deletedAt: new Date().toLocaleString(),
    })),
    ...deletedTasks,
  ];

  todos = [];
  saveTodos();
  saveDeletedTasks();
  renderTodos();
  renderHistory();
}

historyToggle.addEventListener('click', () => {
  historyPanel.classList.toggle('hidden');
});

clearHistoryButton.addEventListener('click', () => {
  clearHistory();
});

clearAllButton.addEventListener('click', () => {
  clearAllTasks();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  addTodo(input.value);
  input.value = '';
  input.focus();
});

renderTodos();
renderHistory();
