const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function saveTodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  list.innerHTML = '';

  if (todos.length === 0) {
    const emptyItem = document.createElement('li');
    emptyItem.textContent = 'No tasks yet. Add one above.';
    emptyItem.style.justifyContent = 'center';
    emptyItem.style.color = '#64748b';
    list.appendChild(emptyItem);
    return;
  }

  todos.forEach((todo) => {
    const item = document.createElement('li');
    item.className = todo.completed ? 'completed' : '';

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
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
  renderTodos();
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  addTodo(input.value);
  input.value = '';
  input.focus();
});

renderTodos();
