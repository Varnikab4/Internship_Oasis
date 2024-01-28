let todos = [];

window.addEventListener('load', () => {
    todos = JSON.parse(localStorage.getItem('todos')) || [];
    const nameInput = document.querySelector('#name');
    const newTodoForm = document.querySelector('#new-todo-form');
    const todoList = document.querySelector('#todo-list');
    const showAllButton = document.getElementById('show-all');
    const showCompletedButton = document.getElementById('show-completed');
    const showPendingButton = document.getElementById('show-pending');

    const username = localStorage.getItem('username') || '';
    nameInput.value = username;

    nameInput.addEventListener('change', e => {
        localStorage.setItem('username', e.target.value);
    });

    newTodoForm.addEventListener('submit', e => {
        e.preventDefault();

        const todo = {
            content: e.target.elements.content.value,
            category: e.target.elements.category.value,
            done: false,
            createdAt: new Date().getTime(),
        };

        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));

        DisplayTodos();
        e.target.reset();
    });

    showAllButton.addEventListener('click', () => {
        DisplayTodos();
    });

    showCompletedButton.addEventListener('click', () => {
        const completedTodos = todos.filter(todo => todo.done);
        DisplayFilteredTodos(completedTodos);
    });

    showPendingButton.addEventListener('click', () => {
        const pendingTodos = todos.filter(todo => !todo.done);
        DisplayFilteredTodos(pendingTodos);
    });

    DisplayTodos();
});

function DisplayTodos() {
    const todoList = document.querySelector('#todo-list');
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const todoItem = createTodoItemElement(todo);
        todoList.appendChild(todoItem);

        setTodoItemEventListeners(todoItem, todo);
    });
}

function DisplayFilteredTodos(filteredTodos) {
    const todoList = document.querySelector('#todo-list');
    todoList.innerHTML = '';

    filteredTodos.forEach(todo => {
        const todoItem = createTodoItemElement(todo);
        todoList.appendChild(todoItem);

        setTodoItemEventListeners(todoItem, todo);
    });
}

function createTodoItemElement(todo) {
    const todoItem = document.createElement('div');
    todoItem.classList.add('todo-item');

    const label = document.createElement('label');
    const input = document.createElement('input');
    const span = document.createElement('span');
    const content = document.createElement('div');
    const actions = document.createElement('div');
    const edit = document.createElement('button');
    const deleteButton = document.createElement('button');

    input.type = 'checkbox';
    input.checked = todo.done;
    span.classList.add('bubble');

    if (todo.category == 'personal') {
        span.classList.add('personal');
    } else {
        span.classList.add('business');
    }

    content.classList.add('todo-content');
    actions.classList.add('actions');
    edit.classList.add('edit');
    deleteButton.classList.add('delete');

    content.innerHTML = `<input type="text" value="${todo.content}" readonly>`;
    edit.innerHTML = 'Edit';
    deleteButton.innerHTML = 'Delete';

    label.appendChild(input);
    label.appendChild(span);
    actions.appendChild(edit);
    actions.appendChild(deleteButton);
    todoItem.appendChild(label);
    todoItem.appendChild(content);
    todoItem.appendChild(actions);

    if (todo.done) {
        todoItem.classList.add('done');
    }

    return todoItem;
}

function setTodoItemEventListeners(todoItem, todo) {
    const input = todoItem.querySelector('input');
    const edit = todoItem.querySelector('.edit');
    const deleteButton = todoItem.querySelector('.delete');

    input.addEventListener('click', e => {
        todo.done = e.target.checked;
        localStorage.setItem('todos', JSON.stringify(todos));

        if (todo.done) {
            todoItem.classList.add('done');
        } else {
            todoItem.classList.remove('done');
        }
    });

    edit.addEventListener('click', e => {
        const input = todoItem.querySelector('.todo-content input');
        input.removeAttribute('readonly');
        input.focus();
        input.addEventListener('blur', e => {
            input.setAttribute('readonly', true);
            todo.content = e.target.value;
            localStorage.setItem('todos', JSON.stringify(todos));
            DisplayTodos();
        });
    });

    deleteButton.addEventListener('click', e => {
        todos = todos.filter(t => t !== todo);
        localStorage.setItem('todos', JSON.stringify(todos));
        DisplayTodos();
    });
}
